// ===== 页面加载时恢复自动保存的状态 =====
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(function(){
    // 页面加载时恢复需求选择状态和工作流配置
    var activeId=localStorage.getItem(AUTOSAVE_KEY);
    if(activeId){
      var saved=localStorage.getItem(getDemandSaveKey(activeId));
      if(saved){
        try{
          var state=JSON.parse(saved);
          if(state&&state.selectedDemand){
            // 关键修复：如果用户已经主动选择了其他需求，不要覆盖
            if(selectedDemand && selectedDemand.id!==state.selectedDemand.id){
              console.log('[页面恢复] 检测到用户已主动选择需求 '+selectedDemand.id+'，跳过恢复 '+state.selectedDemand.id);
              return;
            }
            selectedDemand=state.selectedDemand;
            var nameEl=document.getElementById('selectedDemandName');
            var displayEl=document.getElementById('selectedDemandDisplay');
            if(nameEl)nameEl.textContent=selectedDemand.id+' '+selectedDemand.title;
            if(displayEl)displayEl.classList.remove('hidden');
            document.getElementById('workflowHint').textContent='已选择：'+selectedDemand.title;
            
            // ✅ 加载该需求的工作流配置和画布状态
            loadDemandState(activeId);
            
            console.log('[页面恢复] 已恢复需求 '+activeId+' 的完整状态');
          }
        }catch(e){
          console.error('[页面恢复] 解析保存状态失败:',e);
        }
      }
    }
  },300);
});

// 启动连线功能
initConnectionFeature();

// 初始化画布拖动（空白区域平移）
initCanvasPan();

// 初始化节点拖动（事件委托）
initNodeDragging();

// ===== 全局拖放事件 =====
document.addEventListener('dragover',function(e){
  var container=document.getElementById('canvasContainer');
  if(!container)return;
  var rect=container.getBoundingClientRect();
  var inCanvas=e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom;
  if(inCanvas&&canvasUnlocked){
    e.preventDefault();
    e.dataTransfer.dropEffect='copy';
  }
},{passive:false});

document.addEventListener('drop',function(e){
  var container=document.getElementById('canvasContainer');
  if(!container)return;
  var rect=container.getBoundingClientRect();
  var inCanvas=e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom;
  if(inCanvas&&canvasUnlocked){
    e.preventDefault();
    e.stopPropagation();
    try{
      handleDrop(e);
    }catch(err){
      console.error('handleDrop error:',err);
    }
  }
},{passive:false});
