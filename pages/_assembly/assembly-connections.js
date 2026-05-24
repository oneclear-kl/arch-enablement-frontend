// ===== 关联关系管理 =====
var isDrawingConnection=false; // 是否正在绘制连线
var drawingSourceNode=null; // 绘制连线的源节点
var drawingSourcePort=null; // 绘制连线的源端口
var tempLine=null; // 临时绘制中的线

// 取消关联模式
function cancelConnectionMode(){
  isCreatingConnection=false;
  isDrawingConnection=false;
  connectionSourceNode=null;
  drawingSourceNode=null;
  drawingSourcePort=null;
  if(tempLine){
    tempLine.remove();
    tempLine=null;
  }
  document.querySelectorAll('.connection-port').forEach(function(port){
    port.remove();
  });
  toast('已取消连接模式','info');
}

// 设置端口事件
function setupPortEvents(port,nodeId,portType){
  port.onmousedown=function(e){
    e.stopPropagation();
    startDrawingConnection(e,nodeId,portType,port);
  };
}

// 开始绘制连线
function startDrawingConnection(e,nodeId,portType,port){
  if(portType!=='output'){
    toast('请从输出端口开始连接','warning');
    return;
  }
  
  isDrawingConnection=true;
  drawingSourceNode=nodeId;
  drawingSourcePort=port;
  port.classList.add('dragging');
  
  // 获取源节点在 canvas 坐标系中的位置
  var canvas=document.getElementById('canvas');
  var sourceNode=document.querySelector('.canvas-node[data-node-id="'+nodeId+'"]');
  var startX=(parseInt(sourceNode.style.left)||0)+sourceNode.offsetWidth;
  var startY=(parseInt(sourceNode.style.top)||0)+sourceNode.offsetHeight/2;
  
  // 创建临时 SVG（放入 #canvas，坐标系与节点一致）
  var tempSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  tempSvg.setAttribute('id','temp-conn-svg');
  tempSvg.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:3;overflow:visible';
  tempLine=document.createElementNS('http://www.w3.org/2000/svg','path');
  tempLine.setAttribute('fill','none');
  tempLine.setAttribute('stroke','var(--amber)');
  tempLine.setAttribute('stroke-width','2');
  tempLine.setAttribute('stroke-dasharray','6,4');
  tempSvg.appendChild(tempLine);
  canvas.appendChild(tempSvg);
  
  // canvas 的 BoundingRect 用于鼠标坐标转换（需除以 zoom）
  var canvasRect=canvas.getBoundingClientRect();
  
  // 鼠标移动事件
  function onMouseMove(moveEvent){
    if(!isDrawingConnection)return;
    // 将鼠标屏幕坐标转换为 canvas 逻辑坐标
    var mouseX=(moveEvent.clientX-canvasRect.left)/canvasZoom;
    var mouseY=(moveEvent.clientY-canvasRect.top)/canvasZoom;
    var deltaX=Math.max(60,Math.abs(mouseX-startX)*0.45);
    var d='M '+startX+' '+startY+' C '+(startX+deltaX)+' '+startY+','+(mouseX-deltaX)+' '+mouseY+','+mouseX+' '+mouseY;
    tempLine.setAttribute('d',d);
  }
  
  // 鼠标松开事件
  function onMouseUp(upEvent){
    isDrawingConnection=false;
    port.classList.remove('dragging');
    // 移除临时线
    var ts=document.getElementById('temp-conn-svg');
    if(ts)ts.remove();
    tempLine=null;
    
    // 检查是否释放在目标端口上
    var targetPort=upEvent.target;
    if(targetPort&&targetPort.classList.contains('connection-port')&&targetPort.dataset.portType==='input'){
      var targetNodeId=targetPort.dataset.nodeId;
      if(targetNodeId&&targetNodeId!==nodeId){
        createConnection(nodeId,targetNodeId);
      }
    }
    
    // 移除事件监听
    document.removeEventListener('mousemove',onMouseMove);
    document.removeEventListener('mouseup',onMouseUp);
  }
  
  document.addEventListener('mousemove',onMouseMove);
  document.addEventListener('mouseup',onMouseUp);
}

// 确保 SVG 层存在
function ensureSvgLayer(){
  var canvas=document.getElementById('canvas');
  if(!canvas)return;
  
  var svgLayer=document.getElementById('connectionSvgLayer');
  if(!svgLayer){
    svgLayer=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgLayer.id='connectionSvgLayer';
    svgLayer.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1';
    canvas.insertBefore(svgLayer,canvas.firstChild);
    
    // 添加双击事件监听
    svgLayer.addEventListener('dblclick',function(e){
      if(e.target.tagName==='path'){
        var line=e.target;
        var connectionId=line.dataset.connectionId;
        if(connectionId){
          showConnectionConfig(connectionId);
        }
      }
    });
  }
}

// 创建关联（统一走 addConnection）
function createConnection(sourceId,targetId){
  addConnection(sourceId,targetId);
}

// 显示连接配置
function showConnectionConfig(connectionId){
  var conn=nodeConnections.find(function(c){return c.id===connectionId;});
  if(!conn){
    toast('连接不存在','error');
    return;
  }
  
  var sourceNode=workflowNodes.find(function(n){return n.id===conn.source;});
  var targetNode=workflowNodes.find(function(n){return n.id===conn.target;});
  
  if(!sourceNode||!targetNode)return;
  
  // 显示在右侧配置栏
  document.getElementById('workflowConfigPanel').style.display='none';
  document.getElementById('canvasNodePanel').style.display='flex';
  document.getElementById('canvasNodeTitle').textContent='连接配置';
  document.getElementById('canvasNodeSubtitle').textContent=sourceNode.name+' → '+targetNode.name;
  
  var content=document.getElementById('canvasNodeConfigContent');
  var html='';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">连接信息</div>';
  html+='<div class="p-3 rounded border" style="background:var(--surface-subtle);border-color:var(--border-default)">';
  html+='<div class="text-sm"><span style="color:var(--text-tertiary)">连接 ID：</span><span style="color:var(--text-primary)">'+conn.id+'</span></div>';
  html+='<div class="text-sm mt-1"><span style="color:var(--text-tertiary)">源节点：</span><span style="color:var(--brand)">'+sourceNode.name+'</span></div>';
  html+='<div class="text-sm mt-1"><span style="color:var(--text-tertiary)">目标节点：</span><span style="color:var(--brand)">'+targetNode.name+'</span></div>';
  html+='</div></div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">数据映射配置</div>';
  html+='<div class="text-xs mb-2" style="color:var(--text-tertiary)">配置源节点到目标节点的数据字段映射</div>';
  html+='<button class="btn btn-primary btn-sm w-full mb-2" onclick="addDataMapping(\''+conn.id+'\')"><i class="fa-solid fa-plus mr-1"></i>添加映射</button>';
  html+='<div id="connectionMappings"></div>';
  html+='</div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">连接方向</div>';
  html+='<select class="input w-full" onchange="updateConnectionDirection(\''+conn.id+'\',this.value)">';
  html+='<option value="output-input"'+(conn.sourcePortType==='output'&&conn.targetPortType==='input'?' selected':'')+' >输出 → 输入</option>';
  html+='<option value="input-output"'+(conn.sourcePortType==='input'&&conn.targetPortType==='output'?' selected':'')+' >输入 → 输出</option>';
  html+='</select></div>';
  
  html+='<div class="flex gap-2 pt-2 border-t" style="border-color:var(--border-default)">';
  html+='<button class="flex-1 btn btn-danger btn-sm" onclick="deleteConnection(\''+conn.id+'\')"><i class="fa-solid fa-trash"></i> 删除连接</button>';
  html+='</div>';
  
  content.innerHTML=html;
  renderConnectionMappings(conn);
}

// 删除关联
function removeConnection(connectionId){
  nodeConnections=nodeConnections.filter(function(c){return c.id!==connectionId;});
  renderConnections();
  toast('关联已删除','success');
  triggerAutoSave();
}

// 更新连接方向
function updateConnectionDirection(connectionId,direction){
  var conn=nodeConnections.find(function(c){return c.id===connectionId;});
  if(!conn)return;
  
  if(direction==='output-input'){
    conn.sourcePortType='output';
    conn.targetPortType='input';
  }else{
    conn.sourcePortType='input';
    conn.targetPortType='output';
  }
  
  renderConnections();
  triggerAutoSave();
  toast('连接方向已更新','success');
}

// 渲染连接映射
function renderConnectionMappings(conn){
  var container=document.getElementById('connectionMappings');
  if(!container)return;
  
  if(!conn.mappings||conn.mappings.length===0){
    container.innerHTML='<div class="text-center py-4" style="color:var(--text-tertiary)"><div class="text-xs">暂无映射配置</div></div>';
    return;
  }
  
  var html='';
  for(var i=0;i<conn.mappings.length;i++){
    var m=conn.mappings[i];
    html+='<div class="p-2 mb-2 rounded border" style="background:var(--surface-base);border-color:var(--border-default)">';
    html+='<div class="flex items-center justify-between">';
    html+='<div class="text-xs"><span style="color:var(--text-secondary)">'+m.sourceField+'</span> → <span style="color:var(--brand)">'+m.targetField+'</span></div>';
    html+='<button class="w-5 h-5 flex items-center justify-center rounded hover:bg-red-100" style="color:var(--danger)" onclick="removeMapping(\''+conn.id+'\','+i+')"><i class="fa-solid fa-trash text-xs"></i></button>';
    html+='</div></div>';
  }
  container.innerHTML=html;
}

// 添加数据映射
function addDataMapping(connectionId){
  var conn=nodeConnections.find(function(c){return c.id===connectionId;});
  if(!conn)return;
  
  if(!conn.mappings)conn.mappings=[];
  
  // 模拟添加映射（实际应该打开弹窗选择字段）
  conn.mappings.push({
    sourceField:'source_data',
    targetField:'target_data'
  });
  
  renderConnectionMappings(conn);
  triggerAutoSave();
  toast('已添加映射（示例）','success');
}

// 移除映射
function removeMapping(connectionId,index){
  var conn=nodeConnections.find(function(c){return c.id===connectionId;});
  if(!conn||!conn.mappings)return;
  
  conn.mappings.splice(index,1);
  renderConnectionMappings(conn);
  triggerAutoSave();
  toast('映射已删除','success');
}

// ===== 画布连线功能 =====
var connectionMode=false;        // 是否处于连线模式
var connectionStartNodeId=null;  // 连线起始节点 ID
var isDrawingLine=false;         // 是否正在绘制连线（重命名避免冲突）

// 切换连线模式
function toggleConnectionMode(nodeId){
  connectionMode=!connectionMode;
  connectionStartNodeId=connectionMode?nodeId:null;
  
  // 更新所有节点的连线端口显示
  var allNodes=document.querySelectorAll('.canvas-node');
  for(var i=0;i<allNodes.length;i++){
    var node=allNodes[i];
    var existingPorts=node.querySelectorAll('.connection-port');
    
    if(connectionMode){
      // 添加输入输出端口
      if(existingPorts.length===0){
        var outputPort=document.createElement('div');
        outputPort.className='connection-port output-port';
        outputPort.setAttribute('data-node-id',node.getAttribute('data-node-id'));
        outputPort.setAttribute('data-port-type','output');
        outputPort.onmousedown=function(e){
          e.stopPropagation();
          e.preventDefault();
          startConnection(e);
        };
        node.appendChild(outputPort);
        
        var inputPort=document.createElement('div');
        inputPort.className='connection-port input-port';
        inputPort.setAttribute('data-node-id',node.getAttribute('data-node-id'));
        inputPort.setAttribute('data-port-type','input');
        inputPort.onmouseup=function(e){
          e.stopPropagation();
          e.preventDefault();
          endConnection(e);
        };
        inputPort.onclick=function(e){
          e.stopPropagation();
          e.preventDefault();
        };
        node.appendChild(inputPort);
      }
      // 高亮起始节点
      if(node.getAttribute('data-node-id')===connectionStartNodeId){
        node.style.boxShadow='0 0 0 3px var(--amber)';
      }
    }else{
      // 移除所有端口
      for(var j=0;j<existingPorts.length;j++){
        existingPorts[j].parentNode.removeChild(existingPorts[j]);
      }
      node.style.boxShadow='';
    }
  }
  
  // 更新提示
  if(connectionMode){
    toast('连线模式已开启：从蓝色输出点拖到蓝色输入点，右键取消','info');
  }else{
    toast('连线模式已关闭','info');
    connectionStartNodeId=null;
  }
  // 同步工具栏按钮激活状态
  var btn=document.getElementById('connectModeBtn');
  if(btn) btn.classList.toggle('active',connectionMode);
}

// 开始连线
function startConnection(e){
  e.stopPropagation();
  e.preventDefault();
  
  isDrawingConnection=true;
  var startPort=e.target;
  var startNodeId=startPort.getAttribute('data-node-id');
  connectionStartNodeId=startNodeId;
  
  // 创建临时连线 SVG（添加到 canvas 而不是 container）
  var canvas=document.getElementById('canvas');
  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('id','temp-connection-line');
  svg.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:59';
  
  var line=document.createElementNS('http://www.w3.org/2000/svg','path');
  line.setAttribute('stroke','var(--amber)');
  line.setAttribute('stroke-width','3');
  line.setAttribute('fill','none');
  line.setAttribute('stroke-dasharray','5,5');
  svg.appendChild(line);
  
  canvas.appendChild(svg);
  tempLine=line;
  
  // 拖动时更新连线
  document.addEventListener('mousemove',drawConnection);
  document.addEventListener('mouseup',cancelConnection);
  
  console.log('[startConnection] 开始连线，节点 ID:',startNodeId);
}

// 绘制连线（拖动中）— 智能选择起点端口
function drawConnection(e){
  if(!isDrawingConnection||!tempLine)return;
  e.preventDefault();

  var canvas=document.getElementById('canvas');
  var startNode=document.querySelector('.canvas-node[data-node-id="'+connectionStartNodeId+'"]');
  if(!startNode)return;

  // 获取节点相对于 canvas 的位置
  var nodeLeft=parseInt(startNode.style.left)||0;
  var nodeTop=parseInt(startNode.style.top)||0;
  var nodeWidth=startNode.offsetWidth;
  var nodeHeight=startNode.offsetHeight;
  var cx=nodeLeft+nodeWidth/2, cy=nodeTop+nodeHeight/2;

  // 终点：鼠标位置（相对于 canvas）
  var canvasRect=canvas.getBoundingClientRect();
  var mouseX=(e.clientX-canvasRect.left)/canvasZoom;
  var mouseY=(e.clientY-canvasRect.top)/canvasZoom;

  // 根据鼠标方向选择最近的起点端口
  var dx=mouseX-cx, dy=mouseY-cy;
  var startX, startY, cp1x, cp1y;
  var tension=Math.max(40, Math.min(150, Math.sqrt(dx*dx+dy*dy)*0.4));

  if(Math.abs(dx)>=Math.abs(dy)){
    if(dx>=0){
      // 鼠标在右 → 从右侧出发
      startX=nodeLeft+nodeWidth; startY=cy;
      cp1x=startX+tension; cp1y=startY;
    }else{
      // 鼠标在左 → 从左侧出发
      startX=nodeLeft; startY=cy;
      cp1x=startX-tension; cp1y=startY;
    }
  }else{
    if(dy>=0){
      // 鼠标在下 → 从底部出发
      startX=cx; startY=nodeTop+nodeHeight;
      cp1x=startX; cp1y=startY+tension;
    }else{
      // 鼠标在上 → 从顶部出发
      startX=cx; startY=nodeTop;
      cp1x=startX; cp1y=startY-tension;
    }
  }

  // 绘制贝塞尔曲线（终点控制点反方向）
  var endX=mouseX, endY=mouseY;
  var cp2x=endX-cp1x+startX, cp2y=endY-cp1y+startY;

  tempLine.setAttribute('d','M '+startX+' '+startY+' C '+cp1x+' '+cp1y+', '+cp2x+' '+cp2y+', '+endX+' '+endY);
}

// 取消连线
function cancelConnection(){
  isDrawingConnection=false;
  if(tempLine){
    var svg=tempLine.parentNode;
    if(svg)svg.parentNode.removeChild(svg);
    tempLine=null;
  }
  document.removeEventListener('mousemove',drawConnection);
  document.removeEventListener('mouseup',cancelConnection);
}

// 结束连线（连接到目标节点）
function endConnection(e){
  if(!isDrawingConnection)return;
  e.stopPropagation();
  e.preventDefault();
  
  var endPort=e.target;
  var endNodeId=endPort.getAttribute('data-node-id');
  
  // 先取消连线状态（防止 cancelConnection 重复执行）
  var fromId=connectionStartNodeId;
  cancelConnection();
  
  // 不能连接到自己
  if(!endNodeId||endNodeId===fromId)return;
  
  // 添加连接并渲染
  addConnection(fromId,endNodeId);
}

// 添加连接
function addConnection(fromNodeId,toNodeId){
  // 检查是否已存在
  for(var i=0;i<nodeConnections.length;i++){
    var conn=nodeConnections[i];
    if(conn.from===fromNodeId&&conn.to===toNodeId){
      toast('连接已存在','info');
      return;
    }
  }
  
  // 添加新连接
  nodeConnections.push({
    id:'CONN-'+String(nodeConnections.length+1).padStart(3,'0'),
    from:fromNodeId,
    to:toNodeId
  });
  
  // 重新渲染连线
  renderConnections();
  
  // 保存状态
  triggerAutoSave();
  
  toast('连接已创建','success');
}

// ===== 智能连线辅助函数 =====
function getBestPorts(fromNode, toNode, connId) {
  var x1 = parseInt(fromNode.style.left) || 0;
  var y1 = parseInt(fromNode.style.top) || 0;
  var w1 = fromNode.offsetWidth;
  var h1 = fromNode.offsetHeight;
  var x2 = parseInt(toNode.style.left) || 0;
  var y2 = parseInt(toNode.style.top) || 0;
  var w2 = toNode.offsetWidth;
  var h2 = toNode.offsetHeight;

  var cx1 = x1 + w1 / 2, cy1 = y1 + h1 / 2;
  var cx2 = x2 + w2 / 2, cy2 = y2 + h2 / 2;

  // 默认方向：从上到下布局统一 bottom→top
  var srcDir = 'bottom', tgtDir = 'top';

  // 同层节点（Y坐标差小于50px），改用水平连线避免回头
  var dy = cy2 - cy1;
  if (Math.abs(dy) < 50) {
    var dx = cx2 - cx1;
    if (dx >= 0) { srcDir = 'right'; tgtDir = 'left'; }
    else { srcDir = 'left'; tgtDir = 'right'; }
  }

  // 计算同一方向上相同端口的多连接偏移
  var srcOffset = getPortOffset(connId, true, srcDir);
  var tgtOffset = getPortOffset(connId, false, tgtDir);

  // 根据方向计算偏移后的端点
  var sp = getPortPoint(x1, y1, w1, h1, srcDir, srcOffset);
  var tp = getPortPoint(x2, y2, w2, h2, tgtDir, tgtOffset);

  return { sx: sp.x, sy: sp.y, tx: tp.x, ty: tp.y, srcDir: srcDir, tgtDir: tgtDir };
}

// 获取同一端口方向上的多连接偏移量
function getPortOffset(connId, isSource, direction) {
  var myConn = null;
  var myId = '';
  for (var i = 0; i < nodeConnections.length; i++) {
    if (nodeConnections[i].id === connId) { myConn = nodeConnections[i]; break; }
  }
  if (!myConn) return 0;
  myId = isSource ? (myConn.from || myConn.source) : (myConn.to || myConn.target);

  var count = 0, myIndex = 0;
  for (var i = 0; i < nodeConnections.length; i++) {
    var c = nodeConnections[i];
    var cId = isSource ? (c.from || c.source) : (c.to || c.target);
    // 同一节点、同方向的连线才参与偏移计算
    if (cId === myId) {
      if (c.id === connId) myIndex = count;
      count++;
    }
  }

  if (count <= 1) return 0;
  // 每条线偏移 16px
  return (myIndex - (count - 1) / 2) * 16;
}

// 根据端口方向和偏移量计算实际端点坐标
function getPortPoint(x, y, w, h, dir, offset) {
  switch (dir) {
    case 'top':    return { x: x + w / 2 + offset, y: y };
    case 'bottom': return { x: x + w / 2 + offset, y: y + h };
    case 'left':   return { x: x, y: y + h / 2 + offset };
    case 'right':  return { x: x + w, y: y + h / 2 + offset };
    default:       return { x: x + w, y: y + h / 2 + offset };
  }
}

// 根据源/目标方向生成正交折线路径（Manhattan routing）
function buildSmartPath(sx, sy, tx, ty, srcDir, tgtDir, obstacles, fromId, toId) {
  var srcD = srcDir || 'bottom';
  var tgtD = tgtDir || 'top';
  var GAP = 18; // 节点与线的间距

  // ===== 正交路径生成（带障碍物规避） =====
  function makePath(pts){
    if(pts.length<2)return '';
    var d='M '+pts[0].x+' '+pts[0].y;
    for(var i=1;i<pts.length;i++) d+=' L '+pts[i].x+' '+pts[i].y;
    return d;
  }

  // 基本正交路径（无规避）
  function basePath(){
    if(Math.abs(sx-tx)<5)
      return makePath([{x:sx,y:sy},{x:tx,y:ty}]);

    var exitLen=20, entryLen=20;
    var ex=sx, ey=sy, rx=tx, ry=ty;
    switch(srcD){
      case 'bottom':ey=sy+exitLen;break;
      case 'top':   ey=sy-exitLen;break;
      case 'right': ex=sx+exitLen;break;
      case 'left':  ex=sx-exitLen;break;
    }
    switch(tgtD){
      case 'top':    ry=ty-entryLen;break;
      case 'bottom': ry=ty+entryLen;break;
      case 'left':   rx=tx-entryLen;break;
      case 'right':  rx=tx+entryLen;break;
    }

    var midY=(ey+ry)/2;
    if(srcD==='bottom'&&tgtD==='top'||srcD==='bottom'&&tgtD==='bottom'||srcD==='top'&&tgtD==='top'||srcD==='top'&&tgtD==='bottom'){
      // 垂直走向：先竖再横再竖
      return makePath([{x:sx,y:sy},{x:sx,y:midY},{x:tx,y:midY},{x:tx,y:ty}]);
    }
    // 水平走向
    var midX=(ex+rx)/2;
    return makePath([{x:sx,y:sy},{x:ex,y:ey},{x:midX,y:ey},{x:midX,y:ry},{x:rx,y:ry},{x:tx,y:ty}]);
  }

  // ===== 障碍物检测与规避 =====
  function isPointInRect(px,py,r){
    return px>=r.left&&px<=r.left+r.width&&py>=r.top&&py<=r.top+r.height;
  }

  function rectIntersectHLine(y,x1,x2,rect){
    if(y<rect.top||y>rect.top+rect.height)return false;
    var minX=Math.min(x1,x2),maxX=Math.max(x1,x2);
    return maxX>rect.left&&minX<rect.left+rect.width;
  }

  // 收集中间障碍物（排除源和目标节点）
  var blockers=[];
  if(obstacles&&obstacles.length){
    for(var i=0;i<obstacles.length;i++){
      var o=obstacles[i];
      if(o.id!==fromId&&o.id!==toId) blockers.push(o);
    }
  }
  if(blockers.length===0)return basePath();

  // 生成垂直走向路径并检查水平段是否被阻挡
  var exitLen=20, entryLen=20;
  var ex=sx, ey=sy, rx=tx, ry=ty;
  switch(srcD){
    case 'bottom':ey=sy+exitLen;break;
    case 'top':   ey=sy-exitLen;break;
    case 'right': ex=sx+exitLen;break;
    case 'left':  ex=sx-exitLen;break;
  }
  switch(tgtD){
    case 'top':    ry=ty-entryLen;break;
    case 'bottom': ry=ty+entryLen;break;
    case 'left':   rx=tx-entryLen;break;
    case 'right':  rx=tx+entryLen;break;
  }

  // 尝试多级避障：先尝试在障碍物上方绕行，不行再试下方
  var midY=(ey+ry)/2;
  var blocked=false;

  // 检查基本水平段是否被阻挡
  for(var i=0;i<blockers.length;i++){
    if(rectIntersectHLine(midY,sx,tx,blockers[i])){blocked=true;break;}
  }

  if(!blocked)return basePath();

  // ===== 避障路由：寻找绕过所有障碍物的 Y 通道 =====
  // 收集所有障碍物的上边和下边作为候选 Y
  var candidates=[];
  for(var i=0;i<blockers.length;i++){
    candidates.push(blockers[i].top-GAP);
    candidates.push(blockers[i].top+blockers[i].height+GAP);
  }

  // 从上到下排序
  candidates.sort(function(a,b){return a-b;});

  // 尝试每个候选 Y，找第一个可用的
  var viaY=null;
  var minY=Math.min(sy,ty)-60;
  var maxY=Math.max(sy,ty)+60;
  for(var ci=0;ci<candidates.length;ci++){
    var cy=candidates[ci];
    if(cy<minY||cy>maxY)continue;
    // 检查在这个 Y 做水平线是否能避开所有障碍物
    var ok=true;
    for(var bi=0;bi<blockers.length;bi++){
      if(rectIntersectHLine(cy,sx,tx,blockers[bi])){ok=false;break;}
    }
    if(ok){viaY=cy;break;}
  }

  // 如果都没找到，用默认 midY 但添加绕行点
  if(viaY===null){
    // 用 midY，但每个障碍物前后加绕行点
    var pts=[{x:sx,y:sy},{x:sx,y:midY}];
    // 按 X 排序障碍物
    var sortedBlockers=[].concat(blockers);
    sortedBlockers.sort(function(a,b){return (a.left+a.width/2)-(b.left+b.width/2);});
    var curX=Math.min(sx,tx);
    for(var si=0;si<sortedBlockers.length;si++){
      var blk=sortedBlockers[si];
      var blkLeft=blk.left, blkRight=blk.left+blk.width;
      // 如果水平线段经过这个障碍物
      if(isPointInRect((blkLeft+blkRight)/2,midY,blk)){
        // 在障碍物左侧上方绕行
        var detourY=blk.top-GAP;
        pts.push({x:sx>tx?blkRight+GAP:blkLeft-GAP,y:midY});
        pts.push({x:sx>tx?blkRight+GAP:blkLeft-GAP,y:detourY});
        pts.push({x:sx>tx?blkLeft-GAP:blkRight+GAP,y:detourY});
        pts.push({x:sx>tx?blkLeft-GAP:blkRight+GAP,y:midY});
      }
    }
    pts.push({x:tx,y:midY},{x:tx,y:ty});
    return makePath(pts);
  }

  return makePath([{x:sx,y:sy},{x:sx,y:viaY},{x:tx,y:viaY},{x:tx,y:ty}]);
}

// ===== 渲染所有连接线 =====
function renderConnections(){
  var canvas=document.getElementById('canvas');
  if(!canvas)return;

  // 移除旧的连线 SVG
  var oldSvg=document.getElementById('connections-svg');
  if(oldSvg)oldSvg.parentNode.removeChild(oldSvg);

  if(nodeConnections.length===0)return;

  // 创建 SVG 容器，追加到 #canvas 内
  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('id','connections-svg');
  svg.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:20;overflow:visible';

  // 添加箭头标记定义
  var defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
  defs.innerHTML=
    '<marker id="conn-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--brand)" opacity="0.9"/></marker>';
  svg.appendChild(defs);

  // 绘制每条连线
  // 收集所有画布节点作为障碍物（排除源和目标）
  var allCanvasNodes=document.querySelectorAll('.canvas-node');
  var obstacles=[];
  for(var oi=0;oi<allCanvasNodes.length;oi++){
    var n=allCanvasNodes[oi];
    obstacles.push({
      id:n.getAttribute('data-node-id'),
      left:parseInt(n.style.left)||0,
      top:parseInt(n.style.top)||0,
      width:n.offsetWidth||256,
      height:n.offsetHeight||80
    });
  }

  for(var i=0;i<nodeConnections.length;i++){
    var conn=nodeConnections[i];
    var fromId=conn.from||conn.source;
    var toId=conn.to||conn.target;
    var fromNode=document.querySelector('.canvas-node[data-node-id="'+fromId+'"]');
    var toNode=document.querySelector('.canvas-node[data-node-id="'+toId+'"]');

    if(!fromNode||!toNode)continue;

    var ports = getBestPorts(fromNode, toNode, conn.id);
    var d = buildSmartPath(ports.sx, ports.sy, ports.tx, ports.ty, ports.srcDir, ports.tgtDir, obstacles, fromId, toId);

    var path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('class','connection-line');
    path.setAttribute('d', d);
    path.setAttribute('stroke','var(--brand)');
    path.setAttribute('stroke-width','2');
    path.setAttribute('fill','none');
    path.setAttribute('stroke-opacity','0.85');
    path.setAttribute('marker-end','url(#conn-arrow)');
    path.setAttribute('data-connection-id',conn.id);
    path.style.pointerEvents='stroke';
    path.style.cursor='pointer';
    path.style.strokeLinecap='round';

    // 加粗透明点击辅助线（6px，方便点击但不会明显遮挡）  
    var hitPath=document.createElementNS('http://www.w3.org/2000/svg','path');
    hitPath.setAttribute('d', d);
    hitPath.setAttribute('stroke','transparent');
    hitPath.setAttribute('stroke-width','8');
    hitPath.setAttribute('fill','none');
    hitPath.setAttribute('data-connection-id',conn.id);
    hitPath.style.pointerEvents='stroke';
    hitPath.style.cursor='pointer';

    (function(p,hp){
      p.addEventListener('mouseenter',function(){
        if(p.getAttribute('stroke')!=='var(--amber)')
          p.setAttribute('stroke','var(--amber)');
        p.setAttribute('stroke-width','3');
      });
      p.addEventListener('mouseleave',function(){
        if(!p.classList.contains('selected')){
          p.setAttribute('stroke','var(--brand)');
          p.setAttribute('stroke-width','2');
        }
      });
      hp.addEventListener('click',function(e){
        // 清除之前选中的线
        document.querySelectorAll('.connection-line.selected').forEach(function(h){
          h.classList.remove('selected');
          h.setAttribute('stroke','var(--brand)');
          h.setAttribute('stroke-width','2');
        });
        // 标记当前为选中
        p.classList.add('selected');
        p.setAttribute('stroke','var(--amber)');
        p.setAttribute('stroke-width','3.5');

        if(e.ctrlKey||e.metaKey){
          deleteConnection(p.getAttribute('data-connection-id'));
        }else{
          var connId=p.getAttribute('data-connection-id');
          switchLeftTab('routing');
          setTimeout(function(){
            var el=document.getElementById('routingType_'+connId);
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
      });
    })(path,hitPath);

    svg.appendChild(hitPath);
    svg.appendChild(path);
  }

  canvas.insertBefore(svg, canvas.firstChild);

  // 点击画布空白区取消选中连线
  setTimeout(function(){
    if(window._connCanvasClick) canvas.removeEventListener('click',window._connCanvasClick);
    window._connCanvasClick=function(e){
      if(e.target===canvas||e.target.id==='canvas'||e.target.classList.contains('canvas-grab')){
        document.querySelectorAll('.connection-line.selected').forEach(function(h){
          h.classList.remove('selected');
          h.setAttribute('stroke','var(--brand)');
          h.setAttribute('stroke-width','2');
        });
      }
    };
    canvas.addEventListener('click',window._connCanvasClick,{passive:true});
  },0);
}

// 删除连接
function deleteConnection(connectionId){
  var index=-1;
  for(var i=0;i<nodeConnections.length;i++){
    if(nodeConnections[i].id===connectionId){
      index=i;
      break;
    }
  }
  
  if(index===-1)return;
  
  var conn=nodeConnections.splice(index,1)[0];
  renderConnections();
  triggerAutoSave();
  
  toast('已删除连接','success');
}

// 批量删除所有连接
function clearAllConnections(){
  nodeConnections=[];
  renderConnections();
  triggerAutoSave();
}

// 初始化连线功能
function initConnectionFeature(){
  // 右键关闭连线模式
  document.addEventListener('contextmenu',function(e){
    if(connectionMode){
      e.preventDefault();
      toggleConnectionMode(null);
    }
  });
}
