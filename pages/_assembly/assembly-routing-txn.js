// ===== 消息路由与事务协同配置 =====
// 依赖：assembly-global-state.js (CANVAS_STATE.connections), assembly-data-model.js (NODE_TYPES)

var ROUTING_CONFIG = {
  // { connectionId: { routingType, qos, retryCount, timeout, protocol, serialization, txnStrategy, compensationDesc } }
};

var DEFAULT_ROUTING = {
  routingType: 'sync',
  qos: 'at-least-once',
  retryCount: 3,
  timeout: 30000,
  protocol: 'http',
  serialization: 'json',
  txnStrategy: 'none',
  compensationDesc: ''
};

function refreshRoutingPanel() {
  var panel = document.getElementById('routingConfigPanel');
  if (!panel) return;
  var connections = getAllCanvasConnections();
  if (!connections || connections.length === 0) {
    panel.innerHTML = '<div class="text-center py-8" style="color:var(--text-tertiary)">'
      + '<i class="fa-solid fa-route text-3xl mb-2" style="color:var(--border-subtle)"></i>'
      + '<div class="text-xs">暂无连接</div>'
      + '<div class="text-[10px] mt-1">请先在编排tab中建立画布节点之间的连线</div></div>';
    return;
  }
  var h = '<div class="p-3 text-[10px]" style="color:var(--text-tertiary)">配置每条连接的消息路由和事务策略</div>';
  for (var i = 0; i < connections.length; i++) {
    var c = connections[i];
    var cfg = ROUTING_CONFIG[c.id] || JSON.parse(JSON.stringify(DEFAULT_ROUTING));
    var srcName = getNodeLabel(c.from) || c.from;
    var tgtName = getNodeLabel(c.to) || c.to;
    h += '<div class="mx-3 mb-3 p-3 rounded border" style="border-color:var(--border-default);background:var(--surface-base)">';
    h += '<div class="flex items-center gap-2 mb-3">'
      + '<span class="text-xs font-medium" style="color:var(--brand)">' + srcName + '</span>'
      + '<i class="fa-solid fa-arrow-right text-[10px]" style="color:var(--text-tertiary)"></i>'
      + '<span class="text-xs font-medium" style="color:var(--brand)">' + tgtName + '</span>'
      + '</div>';
    h += '<div class="text-[9px] mb-2" style="color:var(--text-tertiary)">连接ID: ' + c.id + '</div>';

    // 消息路由设置
    h += '<div class="text-[10px] font-semibold mb-2" style="color:var(--text-secondary)"><i class="fa-solid fa-route mr-1"></i>消息路由</div>';

    // 路由类型
    h += '<div class="flex items-center gap-2 mb-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">路由类型</label>'
      + '<select class="filter-select" style="flex:1;font-size:10px;padding:3px 6px" id="routingType_' + c.id + '" onchange="saveRoutingConfig(\'' + c.id + '\')">'
      + '<option value="sync" ' + (cfg.routingType === 'sync' ? 'selected' : '') + '>同步调用</option>'
      + '<option value="async" ' + (cfg.routingType === 'async' ? 'selected' : '') + '>异步消息</option>'
      + '<option value="event" ' + (cfg.routingType === 'event' ? 'selected' : '') + '>事件驱动</option>'
      + '<option value="stream" ' + (cfg.routingType === 'stream' ? 'selected' : '') + '>流式处理</option>'
      + '</select></div>';

    // 通信协议
    h += '<div class="flex items-center gap-2 mb-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">通信协议</label>'
      + '<select class="filter-select" style="flex:1;font-size:10px;padding:3px 6px" id="protocol_' + c.id + '" onchange="saveRoutingConfig(\'' + c.id + '\')">'
      + '<option value="http" ' + (cfg.protocol === 'http' ? 'selected' : '') + '>HTTP/REST</option>'
      + '<option value="grpc" ' + (cfg.protocol === 'grpc' ? 'selected' : '') + '>gRPC</option>'
      + '<option value="mqtt" ' + (cfg.protocol === 'mqtt' ? 'selected' : '') + '>MQTT</option>'
      + '<option value="kafka" ' + (cfg.protocol === 'kafka' ? 'selected' : '') + '>Kafka</option>'
      + '<option value="rabbitmq" ' + (cfg.protocol === 'rabbitmq' ? 'selected' : '') + '>RabbitMQ</option>'
      + '</select></div>';

    // QoS 等级
    h += '<div class="flex items-center gap-2 mb-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">QoS</label>'
      + '<select class="filter-select" style="flex:1;font-size:10px;padding:3px 6px" id="qos_' + c.id + '" onchange="saveRoutingConfig(\'' + c.id + '\')">'
      + '<option value="at-most-once" ' + (cfg.qos === 'at-most-once' ? 'selected' : '') + '>至多一次</option>'
      + '<option value="at-least-once" ' + (cfg.qos === 'at-least-once' ? 'selected' : '') + '>至少一次</option>'
      + '<option value="exactly-once" ' + (cfg.qos === 'exactly-once' ? 'selected' : '') + '>精确一次</option>'
      + '</select></div>';

    // 超时与重试
    h += '<div class="flex items-center gap-2 mb-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">超时(ms)</label>'
      + '<input type="number" class="input" style="flex:1;font-size:10px;padding:3px 6px" id="timeout_' + c.id + '" value="' + cfg.timeout + '" onchange="saveRoutingConfig(\'' + c.id + '\')">'
      + '</div>';
    h += '<div class="flex items-center gap-2 mb-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">重试次数</label>'
      + '<input type="number" class="input" style="flex:1;font-size:10px;padding:3px 6px" id="retryCount_' + c.id + '" value="' + cfg.retryCount + '" min="0" max="10" onchange="saveRoutingConfig(\'' + c.id + '\')">'
      + '</div>';

    // 序列化
    h += '<div class="flex items-center gap-2 mb-3">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">序列化</label>'
      + '<select class="filter-select" style="flex:1;font-size:10px;padding:3px 6px" id="serialization_' + c.id + '" onchange="saveRoutingConfig(\'' + c.id + '\')">'
      + '<option value="json" ' + (cfg.serialization === 'json' ? 'selected' : '') + '>JSON</option>'
      + '<option value="protobuf" ' + (cfg.serialization === 'protobuf' ? 'selected' : '') + '>Protobuf</option>'
      + '<option value="avro" ' + (cfg.serialization === 'avro' ? 'selected' : '') + '>Avro</option>'
      + '<option value="msgpack" ' + (cfg.serialization === 'msgpack' ? 'selected' : '') + '>MsgPack</option>'
      + '</select></div>';

    // 事务策略（仅同步/异步支持事务）
    h += '<div class="text-[10px] font-semibold mb-2" style="color:var(--text-secondary);border-top:1px solid var(--border-subtle);padding-top:8px"><i class="fa-solid fa-shield mr-1"></i>分布式事务策略</div>';
    h += '<div class="flex items-center gap-2 mb-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">策略</label>'
      + '<select class="filter-select" style="flex:1;font-size:10px;padding:3px 6px" id="txnStrategy_' + c.id + '" onchange="onTxnStrategyChange(\'' + c.id + '\')">'
      + '<option value="none" ' + (cfg.txnStrategy === 'none' ? 'selected' : '') + '>无</option>'
      + '<option value="saga" ' + (cfg.txnStrategy === 'saga' ? 'selected' : '') + '>Saga 编排模式</option>'
      + '<option value="tcc" ' + (cfg.txnStrategy === 'tcc' ? 'selected' : '') + '>TCC 补偿模式</option>'
      + '<option value="2pc" ' + (cfg.txnStrategy === '2pc' ? 'selected' : '') + '>2PC 两阶段提交</option>'
      + '</select></div>';
    var showComp = (cfg.txnStrategy === 'saga' || cfg.txnStrategy === 'tcc');
    h += '<div id="txnCompDiv_' + c.id + '" style="display:' + (showComp ? 'block' : 'none') + '">'
      + '<div class="flex items-center gap-2">'
      + '<label class="text-[10px] w-16" style="color:var(--text-tertiary)">补偿描述</label>'
      + '<textarea class="input" style="flex:1;font-size:10px;padding:3px 6px;min-height:40px;resize:none" id="compensationDesc_' + c.id + '" placeholder="描述失败时的回滚/补偿操作..." onchange="saveRoutingConfig(\'' + c.id + '\')">' + cfg.compensationDesc + '</textarea>'
      + '</div></div>';

    h += '</div>';
  }
  h += '<div class="p-3"><div class="text-[9px]" style="color:var(--text-tertiary)">'
    + '<i class="fa-solid fa-circle-info mr-1"></i>路由配置将在检测tab中验证一致性</div></div>';
  panel.innerHTML = h;
}

function saveRoutingConfig(connId) {
  if (!ROUTING_CONFIG[connId]) ROUTING_CONFIG[connId] = JSON.parse(JSON.stringify(DEFAULT_ROUTING));
  var cfg = ROUTING_CONFIG[connId];
  cfg.routingType = getElVal('routingType_' + connId, 'sync');
  cfg.protocol = getElVal('protocol_' + connId, 'http');
  cfg.qos = getElVal('qos_' + connId, 'at-least-once');
  cfg.timeout = parseInt(getElVal('timeout_' + connId, '30000')) || 30000;
  cfg.retryCount = parseInt(getElVal('retryCount_' + connId, '3')) || 3;
  cfg.serialization = getElVal('serialization_' + connId, 'json');
  cfg.txnStrategy = getElVal('txnStrategy_' + connId, 'none');
  cfg.compensationDesc = getElVal('compensationDesc_' + connId, '');
}

function onTxnStrategyChange(connId) {
  saveRoutingConfig(connId);
  var val = document.getElementById('txnStrategy_' + connId).value;
  var div = document.getElementById('txnCompDiv_' + connId);
  if (div) div.style.display = (val === 'saga' || val === 'tcc') ? 'block' : 'none';
}

function getElVal(id, fallback) {
  var el = document.getElementById(id);
  return el ? el.value : fallback;
}

function getNodeLabel(nodeId) {
  // canvas 节点用 data-node-id（无 id 属性），名称在 header 的 span 中
  var canvasNode = document.querySelector('[data-node-id="' + nodeId + '"]');
  if (canvasNode) {
    var nameEl = canvasNode.querySelector('.rounded-t-lg span');
    if (nameEl) return nameEl.textContent;
  }
  var wfNode = window.workflowNodes ? window.workflowNodes.find(function(n) { return n.id === nodeId; }) : null;
  return wfNode ? (wfNode.name || wfNode.label || nodeId) : nodeId;
}

function getAllCanvasConnections() {
  if (typeof nodeConnections !== 'undefined' && nodeConnections) {
    return nodeConnections;
  }
  return [];
}

// 从编排节点的路由按钮跳转到路由 tab 并定位到该节点的连接
function goToRoutingForNode(nodeId){
  var conns=getAllCanvasConnections().filter(function(c){return c.from===nodeId||c.to===nodeId;});
  if(conns.length===0){
    toast('该节点暂无连接','info');
    return;
  }
  switchLeftTab('routing');
  setTimeout(function(){
    var firstId=conns[0].id;
    var el=document.getElementById('routingType_'+firstId);
    if(el){
      var section=el.closest('.mx-3');
      if(section){
        section.scrollIntoView({behavior:'smooth',block:'center'});
        section.style.outline='2px solid var(--brand)';
        section.style.outlineOffset='2px';
        setTimeout(function(){section.style.outline='';},2000);
      }
    }
  },100);
}
