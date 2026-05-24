// ===== 模块 6: 画布节点 =====
// 来源: assembly.html 行 2529-2665 + 行 2746-2775

// ===== 画布节点（带详情展示）=====
// 添加节点到画布（带指定位置）

function addNodeToCanvasWithPosition(type,name,color,icon,nodeId,x,y){
  var canvas=document.getElementById('canvas');
  var node=document.createElement('div');
  node.className='canvas-node selected';
  node.style.left=x+'px';
  node.style.top=y+'px';
  // 添加 data-node-id 属性
  node.setAttribute('data-node-id',nodeId);
  
  var detailContent=getComponentDetailContent(name,color,icon);
  node.innerHTML=buildNodeHTML(name,color,icon,nodeId,detailContent);
  canvas.appendChild(node);
  initNodePorts(node,nodeId);
  selectedNode=node;
  // 查找 workflowNodes 中对应的节点以绑定数据
  var wfNode=workflowNodes.find(function(n){return n.id===nodeId;});
  if(wfNode){
    node.dataBindings=wfNode.dataBindings;
    node.formulaConfig=wfNode.formulaConfig;
  }
  
  // 渲染热区
  var comp=COMPONENT_LIBRARY.find(function(c){return c.name===name;});
  if(comp&&comp.id){
    setTimeout(function(){
      renderNodeHotspots(nodeId,comp.id);
    },200);
  }
}

function addNodeToCanvasWithDetail(type,name,color,icon,passedNodeId,dropX,dropY){
  var canvas=document.getElementById('canvas');
  var node=document.createElement('div');
  node.className='canvas-node selected';
  var x=dropX!=null?dropX:(100+Math.random()*200);
  var y=dropY!=null?dropY:(100+Math.random()*100);
  node.style.left=x+'px';node.style.top=y+'px';

  // 获取源节点信息
  var sourceNodeId=passedNodeId;
  var componentId='';
  if(sourceNodeId){
    var wfMatch=workflowNodes.find(function(n){return n.id===sourceNodeId;});
    if(wfMatch) componentId=wfMatch.componentId||'';
  }
  if(!sourceNodeId&&window._lastDragNodeId){
    sourceNodeId=window._lastDragNodeId;
    var wfMatch=workflowNodes.find(function(n){return n.id===sourceNodeId;});
    if(wfMatch) componentId=wfMatch.componentId||'';
    window._lastDragNodeId=null;
  }

  // 每次拖放到画布都生成唯一 ID，避免重复拖放同组件时 ID 冲突
  var canvasNodeId='canvas-'+Date.now()+'-'+Math.random().toString(36).substr(2,5);

  // 添加属性
  node.setAttribute('data-node-id',canvasNodeId);
  node.setAttribute('data-source-node-id',sourceNodeId||'');

  var detailContent=getComponentDetailContent(name,color,icon);
  node.innerHTML=buildNodeHTML(name,color,icon,canvasNodeId,detailContent);
  canvas.appendChild(node);
  initNodePorts(node,canvasNodeId);

  // 记录到 canvasNodes 列表（独立于左侧 workflowNodes）
  if(!window._canvasNodes) window._canvasNodes=[];
  window._canvasNodes.push({id:canvasNodeId,sourceId:sourceNodeId,name:name,type:type,icon:icon,color:color,componentId:componentId});

  selectedNode=node;
}

function getComponentDetailContent(name,color,icon){
  if(name.indexOf('柱状图')!==-1){
    return '<div class="space-y-2"><div class="h-32 flex items-end justify-around" style="background:var(--surface-subtle);border-radius:4px;padding:8px">'+
      '<div style="width:30px;height:60%;background:var(--brand);border-radius:2px 2px 0 0"></div>'+
      '<div style="width:30px;height:80%;background:var(--success);border-radius:2px 2px 0 0"></div>'+
      '<div style="width:30px;height:45%;background:var(--warning);border-radius:2px 2px 0 0"></div>'+
      '<div style="width:30px;height:90%;background:oklch(55% 0.22 315);border-radius:2px 2px 0 0"></div></div>'+
      '<div class="text-[10px]" style="color:var(--text-tertiary);text-align:center">产量统计（日/周/月）</div></div>';
  }else if(name.indexOf('平衡图')!==-1){
    return '<div class="space-y-2"><div class="flex items-center justify-around" style="background:var(--surface-subtle);border-radius:4px;padding:12px">'+
      '<div class="text-center"><div class="text-[10px]" style="color:var(--text-tertiary)">节点 A</div><div class="text-xs font-semibold" style="color:var(--brand)">2.5 MPa</div></div>'+
      '<div class="flex-1 mx-4 border-t-2 border-dashed" style="border-color:var(--text-tertiary);position:relative">'+
      '<div class="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px]" style="color:var(--success)">平衡</div></div>'+
      '<div class="text-center"><div class="text-[10px]" style="color:var(--text-tertiary)">节点 B</div><div class="text-xs font-semibold" style="color:var(--brand)">2.4 MPa</div></div></div>'+
      '<div class="text-[10px]" style="color:var(--text-tertiary);text-align:center">管网压力平衡状态</div></div>';
  }else if(name.indexOf('监控')!==-1){
    return '<div class="grid grid-cols-3 gap-2 mb-2">'+
      '<div class="p-2 rounded text-center text-xs" style="background:var(--brand-subtle)"><div class="text-[10px]" style="color:var(--text-tertiary)">今日产量</div><div class="font-semibold" style="color:var(--brand)">1,234 吨</div></div>'+
      '<div class="p-2 rounded text-center text-xs" style="background:var(--success-subtle)"><div class="text-[10px]" style="color:var(--text-tertiary)">设备运行</div><div class="font-semibold" style="color:var(--success)">98.5%</div></div>'+
      '<div class="p-2 rounded text-center text-xs" style="background:var(--warning-subtle)"><div class="text-[10px]" style="color:var(--text-tertiary)">告警数量</div><div class="font-semibold" style="color:var(--warning)">3 个</div></div></div>';
  }else if(name.indexOf('告警')!==-1){
    return '<div class="space-y-2"><div class="flex items-center gap-2 p-2 rounded" style="background:var(--danger-subtle);border:1px solid var(--danger)">'+
      '<i class="fa-solid fa-triangle-exclamation text-sm" style="color:var(--danger)"></i>'+
      '<div class="text-xs"><div class="font-medium" style="color:var(--danger)">压力超限</div><div class="text-[10px]" style="color:var(--text-tertiary)">3 分钟前</div></div></div>'+
      '<div class="flex items-center gap-2 p-2 rounded" style="background:var(--warning-subtle);border:1px solid var(--warning)">'+
      '<i class="fa-solid fa-circle-exclamation text-sm" style="color:var(--warning)"></i>'+
      '<div class="text-xs"><div class="font-medium" style="color:var(--warning)">温度异常</div><div class="text-[10px]" style="color:var(--text-tertiary)">15 分钟前</div></div></div></div>';
  }else{
    return '<div class="text-center py-4" style="color:var(--text-tertiary)"><i class="fa-solid '+icon+' text-2xl mb-2" style="color:'+color+'"></i>'+
      '<div class="text-xs">'+name+'</div><div class="text-[10px] mt-1">拖入画布自动展示</div></div>';
  }
}

// ===== 统一节点 HTML 构建函数 =====
function buildNodeHTML(name,color,icon,nodeId,detailContent){
  return '<div class="node-delete-btn" onclick="event.stopPropagation();removeWorkflowNodeFromCanvas(\''+nodeId+'\')"><i class="fa-solid fa-xmark" style="font-size:9px"></i></div>'+
    '<div class="node-border w-64 bg-white rounded-lg shadow-lg overflow-visible" style="border:1.5px solid '+color+'">'+
    '<div class="px-3 py-2 flex items-center gap-2 rounded-t-lg" style="background:'+color+';cursor:move">'+
    '<i class="fa-solid '+icon+' text-white text-xs opacity-90"></i>'+
    '<span class="text-white text-xs font-medium flex-1 truncate">'+name+'</span>'+
    '</div>'+
    '<div class="p-3">'+detailContent+'</div>'+
    '</div>'+
    '<div class="connection-port input-port" data-node-id="'+nodeId+'" data-port-type="input" title="输入端口"></div>'+
    '<div class="connection-port output-port" data-node-id="'+nodeId+'" data-port-type="output" title="输出端口"></div>';
}

// 为节点注册连接端口事件（在节点添加到 DOM 后调用）
function initNodePorts(node,nodeId){
  var inputPort=node.querySelector('.connection-port.input-port');
  var outputPort=node.querySelector('.connection-port.output-port');
  if(inputPort) setupPortEvents(inputPort,nodeId,'input');
  if(outputPort) setupPortEvents(outputPort,nodeId,'output');
}

// 从画布移除节点（带确认）
function removeWorkflowNodeFromCanvas(canvasNodeId){
  // 只删除画布上的 DOM 节点和相关连线，不影响左侧 workflowNodes 模板
  var canvasNode=document.querySelector('[data-node-id="'+canvasNodeId+'"]');
  if(canvasNode) canvasNode.remove();
  // 从 canvasNodes 列表中移除
  if(window._canvasNodes){
    window._canvasNodes=window._canvasNodes.filter(function(n){return n.id!==canvasNodeId;});
  }
  // 移除相关连线
  nodeConnections=nodeConnections.filter(function(c){return c.from!==canvasNodeId&&c.to!==canvasNodeId;});
  renderConnections();
  toast('节点已删除','info');
}

// ===== 简版画布节点函数 (行 2746-2775) =====

function addNodeToCanvas(type,name,x,y){
  const canvas=document.getElementById('canvas');
  const node=document.createElement('div');
  node.className='canvas-node selected';
  node.style.left=x+'px';node.style.top=y+'px';
  const color=type==='component'?'var(--brand)':type==='data'?'var(--success)':'oklch(55% 0.22 315)';
  const nodeId='node-'+Date.now();
  node.setAttribute('data-node-id',nodeId);
  const detailContent='<div class="text-center py-4" style="color:var(--text-tertiary)"><i class="fa-solid fa-cube text-2xl mb-2" style="color:'+color+'"></i><div class="text-xs">'+name+'</div></div>';
  node.innerHTML=buildNodeHTML(name,color,'fa-cube',nodeId,detailContent);
  canvas.appendChild(node);
  initNodePorts(node,nodeId);
  selectedNode=node;
  // 将节点加入 workflowNodes 以支持属性面板显示和状态持久化
  workflowNodes.push({
    id:nodeId, type:type, name:name, color:color, icon:'fa-cube',
    canvasX:x, canvasY:y, config:{}, dataBindings:[], formulaConfig:{}
  });
  triggerAutoSave();
}

function showNodeConfig(){alert('打开节点详细配置');}
function toast(t,type){var i={success:'fa-check-circle',info:'fa-info-circle',warning:'fa-exclamation-circle'};var e=document.getElementById('toast');if(!e)return;e.className='toast toast-'+(type||'info')+' show';e.querySelector('i').className='fa-solid '+(i[type]||i.info);document.getElementById('toastText').textContent=t;setTimeout(function(){e.classList.remove('show');},2500);}
function undo(){console.log('撤销')}
function redo(){console.log('重做')}
function testService(){alert('开始测试服务...')}
function previewService(){alert('打开预览')}
function saveNodeConfig(){alert('配置已保存')}
function testNode(){alert('测试组件...')}
function showPublishModal(){document.getElementById('publishModal').classList.remove('hidden');document.getElementById('publishModal').classList.add('flex')}
function closePublishModal(){document.getElementById('publishModal').classList.add('hidden');document.getElementById('publishModal').classList.remove('flex')}
function confirmPublish(){alert('发布成功！需求状态已更新为已上线');clearCanvasState();closePublishModal()}
