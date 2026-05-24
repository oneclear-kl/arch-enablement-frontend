// ===== 画布缩放和拖动 =====
var canvasZoom=1;
var canvasPanX=0;
var canvasPanY=0;
var isPanning=false;
var panStartX=0;
var panStartY=0;
var panStartPanX=0;
var panStartPanY=0;

function updateCanvasTransform(){
  var canvas=document.getElementById('canvas');
  if(!canvas)return;
  canvas.style.transform='translate('+canvasPanX+'px,'+canvasPanY+'px) scale('+canvasZoom+')';
  var zoomEl=document.getElementById('zoomLevel');
  if(zoomEl)zoomEl.textContent=Math.round(canvasZoom*100)+'%';
}

function zoomCanvas(delta){
  var newZoom=Math.max(0.2,Math.min(3,canvasZoom+delta));
  if(newZoom===canvasZoom)return;
  
  var container=document.getElementById('canvasContainer');
  if(!container)return;
  
  var rect=container.getBoundingClientRect();
  var centerX=rect.width/2;
  var centerY=rect.height/2;
  
  var scaleRatio=newZoom/canvasZoom;
  canvasPanX=centerX-(centerX-canvasPanX)*scaleRatio;
  canvasPanY=centerY-(centerY-canvasPanY)*scaleRatio;
  canvasZoom=newZoom;
  
  updateCanvasTransform();
}

function resetCanvasView(){
  canvasZoom=1;
  canvasPanX=0;
  canvasPanY=0;
  updateCanvasTransform();
  toast('视图已重置','info');
}

function initCanvasPan(){
  var container=document.getElementById('canvasContainer');
  var canvas=document.getElementById('canvas');
  if(!container||!canvas)return;
  
  // 鼠标滚轮缩放
  container.addEventListener('wheel',function(e){
    if(!canvasUnlocked)return;
    e.preventDefault();
    
    var delta=e.deltaY>0?-0.08:0.08;
    var newZoom=Math.max(0.2,Math.min(3,canvasZoom+delta));
    if(newZoom===canvasZoom)return;
    
    var rect=container.getBoundingClientRect();
    var mouseX=e.clientX-rect.left;
    var mouseY=e.clientY-rect.top;
    
    var scaleRatio=newZoom/canvasZoom;
    canvasPanX=mouseX-(mouseX-canvasPanX)*scaleRatio;
    canvasPanY=mouseY-(mouseY-canvasPanY)*scaleRatio;
    canvasZoom=newZoom;
    
    updateCanvasTransform();
  },{passive:false});
  
  // 左键：在空白区域拖动画布，在节点上拖动节点（节点事件会冒泡前被拦截）
  container.addEventListener('mousedown',function(e){
    if(!canvasUnlocked)return;
    // 左键且点击的是空白区域（不是节点）→ 拖动画布
    if(e.button===0 && !e.target.closest('.canvas-node')){
      e.preventDefault();
      isPanning=true;
      panStartX=e.clientX;
      panStartY=e.clientY;
      panStartPanX=canvasPanX;
      panStartPanY=canvasPanY;
      container.classList.add('canvas-panning');
      container.classList.remove('canvas-grab');
    }
    // 中键或右键 → 拖动画布
    if(e.button===1||e.button===2){
      e.preventDefault();
      isPanning=true;
      panStartX=e.clientX;
      panStartY=e.clientY;
      panStartPanX=canvasPanX;
      panStartPanY=canvasPanY;
      container.classList.add('canvas-panning');
      container.classList.remove('canvas-grab');
    }
  });
  
  document.addEventListener('mousemove',function(e){
    if(!isPanning)return;
    e.preventDefault();
    
    var dx=e.clientX-panStartX;
    var dy=e.clientY-panStartY;
    
    canvasPanX=panStartPanX+dx;
    canvasPanY=panStartPanY+dy;
    
    updateCanvasTransform();
  });
  
  document.addEventListener('mouseup',function(e){
    if(!isPanning)return;
    isPanning=false;
    
    var container=document.getElementById('canvasContainer');
    if(container){
      container.classList.remove('canvas-panning');
      container.classList.add('canvas-grab');
    }
  });
  
  container.addEventListener('contextmenu',function(e){
    if(canvasUnlocked)e.preventDefault();
  });
}
