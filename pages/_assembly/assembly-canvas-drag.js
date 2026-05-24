// ===== 节点拖动（使用事件委托）=====
var isDraggingNode=false;
var dragNode=null;
var dragStartX=0;
var dragStartY=0;
var dragStartLeft=0;
var dragStartTop=0;

function initNodeDragging(){
  var canvas=document.getElementById('canvas');
  if(!canvas)return;
  
  canvas.addEventListener('mousedown',function(e){
    if(!canvasUnlocked)return;
    if(connectionMode)return; // 连线模式不处理拖动
    
    // 找到最近的 .canvas-node 祖先
    var node=e.target.closest('.canvas-node');
    if(!node)return; // 点击的是空白区域，不处理（画布平移会处理）
    
    // 如果点击的是按钮，不拖动节点（让按钮自己处理）
    if(e.target.tagName==='BUTTON'||e.target.closest('button'))return;
    
    e.stopPropagation();
    e.preventDefault();
    
    dragNode=node;
    dragStartX=e.clientX;
    dragStartY=e.clientY;
    dragStartLeft=parseInt(node.style.left)||0;
    dragStartTop=parseInt(node.style.top)||0;
    isDraggingNode=true;
    
    // 选中节点：高亮边框 + 更新右侧面板
    document.querySelectorAll('.canvas-node').forEach(function(n){
      var b=n.querySelector('.node-border');
      if(b) b.style.borderColor='var(--border-default)';
      n.classList.remove('selected');
    });
    var nb=node.querySelector('.node-border');
    if(nb) nb.style.borderColor='var(--brand)';
    node.classList.add('selected');
    selectedNode=node;
    
    // 显示节点属性到右侧面板
    var nodeId=node.getAttribute('data-node-id');
    var wfNode=workflowNodes.find(function(n){return n.id===nodeId;});
    if(wfNode) selectWorkflowNode(nodeId);
  });
  
  document.addEventListener('mousemove',function(e){
    if(!isDraggingNode||!dragNode)return;
    e.preventDefault();
    var dx=(e.clientX-dragStartX)/canvasZoom;
    var dy=(e.clientY-dragStartY)/canvasZoom;
    dragNode.style.left=(dragStartLeft+dx)+'px';
    dragNode.style.top=(dragStartTop+dy)+'px';
  });
  
  document.addEventListener('mouseup',function(e){
    if(!isDraggingNode)return;
    var node=dragNode;
    isDraggingNode=false;
    dragNode=null;
    if(nodeConnections.length>0) renderConnections();
    triggerAutoSave();
  });
}

function handleNodeMouseDown(e){
  // 保留旧函数名兼容，实际已废弃，事件委托处理所有拖动
}
function handleNodeTitleMouseDown(e){
  // 保留旧函数名兼容，实际已废弃，事件委托处理所有拖动
}
