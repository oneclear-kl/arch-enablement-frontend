// =============================================================================
// 模块 2: assembly-utils.js
// 来源: assembly.html
// 行号范围:
//   - 2769-2795: undo, redo, testService, previewService, saveNodeConfig,
//                testNode, showPublishModal, closePublishModal, confirmPublish, toast
//   - 660-686  : handleDragStart, handleDragEnd, handleDragOver, handleDrop
//   - 688      : currentUser
//   - 3899-3906: window.testButtons
// =============================================================================

// ===== 行 2769-2795 =====
function undo(){console.log('撤销')}
function redo(){console.log('重做')}
function testService(){console.log('test')}
function previewService(){console.log('preview')}
function saveNodeConfig(){alert('配置已保存')}
function testNode(){alert('测试组件...')}
function showPublishModal(){Scaffold.navigateTo('publish.html');}
function closePublishModal(){}
function confirmPublish(){}

// 跳转到预览发布页，携带画布状态
function goToPublish(){
  manualSaveCanvas();
  var params = {};
  if(typeof selectedDemand !== 'undefined' && selectedDemand){
    params.demandId = selectedDemand.id;
    params.demandTitle = selectedDemand.title;
  }
  if(typeof workflowNodes !== 'undefined'){
    params.nodeCount = workflowNodes.length;
    params.nodeNames = workflowNodes.map(function(n){return n.name;}).join(',');
  }
  Scaffold.navigateTo('publish.html', params);
}

// ===== Toast 提示组件 =====
function toast(t,type){
  var i={success:'fa-check-circle',info:'fa-info-circle',warning:'fa-exclamation-circle',error:'fa-circle-xmark'};
  var e=document.getElementById('toast');
  if(!e)return;
  
  // 移除所有类型样式
  e.classList.remove('toast-success','toast-info','toast-warning','toast-error');
  // 添加对应类型样式
  e.classList.add('toast-'+(type||'info'));
  
  e.querySelector('i').className='fa-solid '+(i[type]||i.info);
  document.getElementById('toastText').textContent=t;
  
  e.classList.add('show');
  setTimeout(function(){e.classList.remove('show');},2500);
}

// ===== 行 660-686 =====
function handleDragStart(e){e.dataTransfer.setData('type',e.target.dataset.type);e.dataTransfer.setData('name',e.target.dataset.name);e.target.style.opacity='0.5'}
function handleDragEnd(e){e.target.style.opacity='1'}
function handleDragOver(e){
  e.preventDefault();
  e.dataTransfer.dropEffect='copy';
}
function handleDrop(e){
  var nodeId=e.dataTransfer.getData('nodeId');
  var componentId=e.dataTransfer.getData('componentId');
  var name=e.dataTransfer.getData('name');
  var type=e.dataTransfer.getData('type');
  var icon=e.dataTransfer.getData('icon');
  var color=e.dataTransfer.getData('color');

  if(!name && !type && !nodeId) return;

  var canvas=document.getElementById('canvas');
  var canvasRect=canvas.getBoundingClientRect();
  var logicalX=(e.clientX-canvasRect.left)/canvasZoom-canvasPanX/canvasZoom-80;
  var logicalY=(e.clientY-canvasRect.top)/canvasZoom-canvasPanY/canvasZoom-40;

  if(nodeId){
    addNodeToCanvasWithDetail(type,name,color,icon,nodeId,logicalX,logicalY);
  }else{
    addNodeToCanvas(type,name,logicalX,logicalY);
  }
}

// ===== 行 688 =====
// 当前登录用户（实际项目中从登录态获取）
var currentUser='张架构';

// ===== 行 3899-3906 =====
window.testButtons=function(){
  console.log('测试按钮功能');
  console.log('selectedComponentsTemp:', selectedComponentsTemp);
  console.log('tempSaveList:', tempSaveList);
  console.log('workflowNodes:', workflowNodes);
  console.log('selectedDemand:', selectedDemand);
  alert('调试信息已输出到控制台，请按 F12 查看');
};
