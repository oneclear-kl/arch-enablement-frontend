// ===== 跨域协同链路冲突检测 =====

var DETECTION_CACHE = null; // { issues: [], timestamp: number }

function runConflictDetection() {
  var panel = document.getElementById('detectionResultPanel');
  if (!panel) return;

  var issues = [];
  var connections = getAllCanvasConnections();
  var nodes = getCanvasNodes();

  // ---------- 1. 循环依赖检测 (DFS) ----------
  if (connections.length > 0) {
    var adj = {};
    connections.forEach(function(c) {
      if (!adj[c.from]) adj[c.from] = [];
      adj[c.from].push(c.to);
    });
    var allNodeIds = {};
    connections.forEach(function(c) { allNodeIds[c.from] = true; allNodeIds[c.to] = true; });
    var visited = {}, recStack = {}, cycleFound = false;
    function dfsCycle(v, path) {
      if (recStack[v]) {
        cycleFound = true;
        var cyclePath = path.concat(v);
        // 找到循环的起始点
        var startIdx = cyclePath.indexOf(v);
        var cycle = startIdx >= 0 ? cyclePath.slice(startIdx) : [v];
        issues.push({
          severity: 'error',
          type: '循环依赖',
          desc: '检测到循环依赖：' + cycle.join(' → ') + ' → ' + v,
          affected: cycle,
          fix: '请移除或调整连接，打破循环路径'
        });
        return;
      }
      if (visited[v]) return;
      visited[v] = true;
      recStack[v] = true;
      var neighbors = adj[v] || [];
      for (var i = 0; i < neighbors.length; i++) {
        dfsCycle(neighbors[i], path.concat(v));
      }
      recStack[v] = false;
    }
    for (var n in allNodeIds) {
      if (!visited[n]) dfsCycle(n, []);
    }
  }

  // ---------- 2. 协议不一致检测 ----------
  var connProtocols = {};
  connections.forEach(function(c) {
    var cfg = ROUTING_CONFIG[c.id] || DEFAULT_ROUTING;
    connProtocols[c.id] = cfg;
  });
  // 按节点分组检查同一节点的出入连接协议是否一致
  var nodeProtocols = {};
  connections.forEach(function(c) {
    if (!nodeProtocols[c.from]) nodeProtocols[c.from] = [];
    nodeProtocols[c.from].push({ connId: c.id, proto: (ROUTING_CONFIG[c.id] || DEFAULT_ROUTING).protocol, side: 'out' });
    if (!nodeProtocols[c.to]) nodeProtocols[c.to] = [];
    nodeProtocols[c.to].push({ connId: c.id, proto: (ROUTING_CONFIG[c.id] || DEFAULT_ROUTING).protocol, side: 'in' });
  });
  for (var nodeId in nodeProtocols) {
    var protos = nodeProtocols[nodeId];
    if (protos.length > 1) {
      var uniqueProtos = {};
      protos.forEach(function(p) { uniqueProtos[p.proto] = true; });
      var protoKeys = Object.keys(uniqueProtos);
      if (protoKeys.length > 1) {
        var nodeName = getNodeLabel(nodeId) || nodeId;
        issues.push({
          severity: 'warning',
          type: '协议不一致',
          desc: '节点 "' + nodeName + '" 的出入连接使用不同协议：' + protoKeys.join(' / '),
          affected: protos.map(function(p) { return p.connId; }),
          fix: '建议统一使用相同的通信协议，或添加协议转换网关'
        });
      }
    }
  }

  // ---------- 3. 路由类型与协议不匹配检测 ----------
  connections.forEach(function(c) {
    var cfg = ROUTING_CONFIG[c.id] || DEFAULT_ROUTING;
    // 异步路由 + HTTP 协议
    if ((cfg.routingType === 'async' || cfg.routingType === 'event') &&
        (cfg.protocol === 'http' || cfg.protocol === 'grpc')) {
      var srcName = getNodeLabel(c.from) || c.from;
      var tgtName = getNodeLabel(c.to) || c.to;
      issues.push({
        severity: 'warning',
        type: '路由/协议不匹配',
        desc: srcName + ' → ' + tgtName + '：路由类型"异步/事件"建议使用 MQTT/Kafka 而非 ' + cfg.protocol.toUpperCase(),
        affected: [c.id],
        fix: '将通信协议改为 MQTT 或 Kafka，或将路由类型改为同步'
      });
    }
    // 事务策略 + 无补偿描述
    if ((cfg.txnStrategy === 'saga' || cfg.txnStrategy === 'tcc') && !cfg.compensationDesc.trim()) {
      issues.push({
        severity: 'warning',
        type: '事务补偿缺失',
        desc: '连接 ' + c.id + ' 使用 "' + cfg.txnStrategy.toUpperCase() + '" 事务策略，但未配置补偿描述',
        affected: [c.id],
        fix: '请填写失败时的回滚/补偿操作描述'
      });
    }
    // QoS 精确一次 + 非异步
    if (cfg.qos === 'exactly-once' && cfg.routingType !== 'async' && cfg.routingType !== 'event') {
      issues.push({
        severity: 'info',
        type: 'QoS 建议',
        desc: '连接 ' + c.id + ' 启用"精确一次"QoS，建议使用异步消息（MQTT/Kafka）以获得原生支持',
        affected: [c.id],
        fix: '将路由类型改为异步/事件，或降低 QoS 等级'
      });
    }
  });

  // ---------- 4. 孤立节点检测 ----------
  var connectedNodes = {};
  connections.forEach(function(c) {
    connectedNodes[c.from] = true;
    connectedNodes[c.to] = true;
  });
  if (nodes && nodes.length) {
    nodes.forEach(function(n) {
      if (!connectedNodes[n.id]) {
        var nName = getNodeLabel(n.id) || n.id;
        issues.push({
          severity: 'info',
          type: '孤立节点',
          desc: '节点 "' + nName + '" 未与任何节点建立连接',
          affected: [n.id],
          fix: '请为该节点建立输入或输出连接'
        });
      }
    });
  }

  // ---------- 5. 未配置路由的连接 ----------
  connections.forEach(function(c) {
    if (!ROUTING_CONFIG[c.id]) {
      var srcName = getNodeLabel(c.from) || c.from;
      var tgtName = getNodeLabel(c.to) || c.to;
      issues.push({
        severity: 'info',
        type: '路由未配置',
        desc: srcName + ' → ' + tgtName + ' 尚未配置路由参数，将使用默认值',
        affected: [c.id],
        fix: '切换到「路由」tab 为该连接配置消息路由和事务策略'
      });
    }
  });

  // ---------- 渲染结果 ----------
  DETECTION_CACHE = { issues: issues, timestamp: Date.now() };
  renderDetectionResults(panel, issues);
  highlightCanvasIssues(issues);
  toast('检测完成，发现 ' + issues.length + ' 个问题', issues.length > 0 ? 'warning' : 'success');
}

function renderDetectionResults(panel, issues) {
  if (issues.length === 0) {
    panel.innerHTML = '<div class="text-center py-12">'
      + '<div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style="background:var(--success-subtle)">'
      + '<i class="fa-solid fa-check text-2xl" style="color:var(--success)"></i></div>'
      + '<div class="text-sm font-medium" style="color:var(--success)">全部通过</div>'
      + '<div class="text-xs mt-1" style="color:var(--text-tertiary)">未检测到链路冲突或配置问题</div></div>';
    return;
  }

  var h = '';
  // 摘要统计
  var errCount = 0, warnCount = 0, infoCount = 0;
  issues.forEach(function(iss) {
    if (iss.severity === 'error') errCount++;
    else if (iss.severity === 'warning') warnCount++;
    else infoCount++;
  });
  h += '<div class="p-3 border-b flex items-center gap-3 text-xs" style="border-color:var(--border-default);background:var(--surface-subtle)">';
  if (errCount > 0) h += '<span style="color:var(--danger)"><strong>' + errCount + '</strong> 个错误</span>';
  if (warnCount > 0) h += '<span style="color:var(--warning)"><strong>' + warnCount + '</strong> 个警告</span>';
  if (infoCount > 0) h += '<span style="color:var(--info)"><strong>' + infoCount + '</strong> 个提示</span>';
  h += '<span class="ml-auto text-[10px]" style="color:var(--text-tertiary)">' + new Date().toTimeString().slice(0, 5) + '</span>';
  h += '</div>';

  // 按严重性排序：error > warning > info
  var sorted = [].concat(issues);
  sorted.sort(function(a, b) {
    var order = { error: 0, warning: 1, info: 2 };
    return (order[a.severity] || 0) - (order[b.severity] || 0);
  });

  sorted.forEach(function(iss, idx) {
    var colorMap = { error: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
    var iconMap = { error: 'fa-circle-exclamation', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    var bgMap = { error: 'var(--danger-subtle)', warning: 'var(--warning-subtle)', info: 'var(--info-subtle)' };
    var color = colorMap[iss.severity] || 'var(--text-tertiary)';
    var icon = iconMap[iss.severity] || 'fa-circle-info';
    h += '<div class="detection-issue-item p-3 border-b flex items-start gap-3 cursor-pointer transition-all hover:bg-gray-50" style="border-color:var(--border-subtle)" onclick="highlightIssueConnections(' + idx + ')" data-issue-idx="' + idx + '">'
      + '<div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style="background:' + bgMap[iss.severity] + ';color:' + color + '">'
      + '<i class="fa-solid ' + icon + '" style="font-size:10px"></i></div>'
      + '<div class="flex-1 min-w-0">'
      + '<div class="text-xs font-medium" style="color:' + color + '">[' + iss.type + ']</div>'
      + '<div class="text-[11px] mt-1" style="color:var(--text-primary)">' + iss.desc + '</div>'
      + '<div class="text-[10px] mt-1 p-2 rounded" style="background:var(--surface-subtle);color:var(--text-secondary)"><i class="fa-solid fa-lightbulb mr-1" style="color:var(--amber)"></i>' + iss.fix + '</div>'
      + '</div></div>';
  });
  panel.innerHTML = h;
}

function highlightIssueConnections(idx) {
  if (!DETECTION_CACHE || !DETECTION_CACHE.issues[idx]) return;
  var iss = DETECTION_CACHE.issues[idx];
  // 清除之前的高亮
  document.querySelectorAll('.connection-line').forEach(function(l) {
    l.setAttribute('stroke', '#8A95A6');
    l.setAttribute('stroke-width', '2');
  });
  document.querySelectorAll('.canvas-node').forEach(function(n) {
    n.querySelector('.node-border') && n.querySelector('.node-border').style.setProperty('border-color', 'var(--border-default)', '');
  });
  // 高亮受影响的连接
  if (iss.affected) {
    iss.affected.forEach(function(affId) {
      // 如果是连接ID
      var connEl = document.querySelector('[data-connection-id="' + affId + '"]');
      if (connEl) {
        connEl.setAttribute('stroke', 'var(--danger)');
        connEl.setAttribute('stroke-width', '3');
      }
      // 如果是节点ID
      var nodeEl = document.getElementById('canvasNode_' + affId);
      if (nodeEl) {
        var border = nodeEl.querySelector('.node-border');
        if (border) border.style.borderColor = 'var(--danger)';
      }
    });
  }
  // 滚动到受影响区域的第一个元素
  if (iss.affected && iss.affected.length > 0) {
    var firstEl = document.getElementById('canvasNode_' + iss.affected[0]);
    if (firstEl) firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  toast('已高亮受影响元素', 'info');
}

function getCanvasNodes() {
  if (typeof workflowNodes !== 'undefined' && workflowNodes) {
    return workflowNodes;
  }
  return [];
}

function highlightCanvasIssues(issues) {
  // 重置所有高亮
  document.querySelectorAll('.connection-line').forEach(function(l) {
    l.setAttribute('stroke', '#8A95A6');
    l.setAttribute('stroke-width', '2');
  });
  // 高亮严重错误
  var highlighted = {};
  issues.forEach(function(iss) {
    if (iss.severity !== 'error') return;
    if (iss.affected) {
      iss.affected.forEach(function(affId) {
        if (highlighted[affId]) return;
        highlighted[affId] = true;
        var connEl = document.querySelector('[data-connection-id="' + affId + '"]');
        if (connEl) {
          connEl.setAttribute('stroke', 'var(--danger)');
          connEl.setAttribute('stroke-width', '3');
        }
      });
    }
  });
}
