// ===== 模块 4: 自动保存 =====
// 来源: assembly.html 行 595-597（变量） + 行 1147-1391（函数）

// 变量定义 (行 595-597)
const AUTOSAVE_KEY='assembly_canvas_autosave';
let autoSaveTimer=null;
let lastSaveTime=null;

// ===== 自动保存相关函数 (行 1147-1391) =====

function getDemandSaveKey(demandId){
  return 'assembly_demand_'+demandId;
}

function saveCanvasState(){
  if(!selectedDemand)return;
  
  // ✅ 保存前同步画布节点位置到 workflowNodes
  var canvasNodes=document.querySelectorAll('.canvas-node');
  for(var i=0;i<canvasNodes.length;i++){
    var canvasNode=canvasNodes[i];
    var nodeId=canvasNode.getAttribute('data-node-id');
    if(nodeId){
      var workflowNode=workflowNodes.find(function(n){return n.id===nodeId;});
      if(workflowNode){
        // 保存节点位置
        workflowNode.canvasX=parseInt(canvasNode.style.left)||0;
        workflowNode.canvasY=parseInt(canvasNode.style.top)||0;
        // 保存节点数据绑定
        if(canvasNode.dataBindings){
          workflowNode.dataBindings=canvasNode.dataBindings;
        }
        // 保存节点公式配置
        if(canvasNode.formulaConfig){
          workflowNode.formulaConfig=canvasNode.formulaConfig;
        }
      }
    }
  }
  
  const state={
    selectedDemand:selectedDemand,
    workflowNodes:workflowNodes,
    canvasUnlocked:canvasUnlocked,
    nodeConnections:nodeConnections,
    canvasZoom:canvasZoom,
    canvasPanX:canvasPanX,
    canvasPanY:canvasPanY,
    timestamp:new Date().toISOString()
  };
  try{
    // 按需求 ID 分别保存，支持多需求切换
    localStorage.setItem(getDemandSaveKey(selectedDemand.id),JSON.stringify(state));
    // 同时保存当前活跃需求 ID
    localStorage.setItem(AUTOSAVE_KEY,selectedDemand.id);
    lastSaveTime=new Date();
    updateSaveStatus('已保存');
    console.log('画布状态已保存', state);
  }catch(e){
    console.error('自动保存失败:',e);
    updateSaveStatus('保存失败',true);
  }
}

function loadCanvasState(){
  try{
    const activeId=localStorage.getItem(AUTOSAVE_KEY);
    if(!activeId)return false;
    const saved=localStorage.getItem(getDemandSaveKey(activeId));
    if(!saved)return false;
    const state=JSON.parse(saved);
    if(!state||!state.selectedDemand)return false;
    
    // 恢复状态前先清空
    nodeConnections=[];
    selectedDemand=state.selectedDemand;
    workflowNodes=state.workflowNodes||[];
    canvasUnlocked=state.canvasUnlocked||false;
    canvasZoom=state.canvasZoom||1;
    canvasPanX=state.canvasPanX||0;
    canvasPanY=state.canvasPanY||0;
    
    // 恢复UI
    if(selectedDemand){
      var nameEl=document.getElementById('selectedDemandName');
      var displayEl=document.getElementById('selectedDemandDisplay');
      if(nameEl)nameEl.textContent=selectedDemand.id+' '+selectedDemand.title;
      if(displayEl)displayEl.classList.remove('hidden');
      document.getElementById('workflowHint').textContent='已选择：'+selectedDemand.title;
    }
    
    renderWorkflowNodeList();
    updateDemandStatusDisplay();
    
    if(canvasUnlocked){
      document.getElementById('canvasMask').style.display='none';
    }
    
    lastSaveTime=new Date(state.timestamp);
    updateSaveStatus('已恢复 '+formatTime(lastSaveTime));
    return true;
  }catch(e){
    console.error('恢复画布状态失败:',e);
    return false;
  }
}

function loadDemandState(demandId){
  try{
    // 无论有无保存数据，先清空当前状态
    workflowNodes=[];
    nodeConnections=[];
    currentWorkflowNodeId=null;
    canvasUnlocked=false;
    clearCanvasNodes();
    // 清除画布上的连线 SVG
    var oldSvg=document.getElementById('connections-svg');
    if(oldSvg)oldSvg.parentNode.removeChild(oldSvg);
    document.getElementById('canvasMask').style.display='flex';
    document.getElementById('workflowConfigPanel').style.display='none';
    document.getElementById('canvasNodePanel').style.display='flex';
    
    const saved=localStorage.getItem(getDemandSaveKey(demandId));
    if(!saved){
      // 没有保存过这个需求，显示空状态
      renderWorkflowNodeList();
      updateDemandStatusDisplay();
      return false;
    }
    const state=JSON.parse(saved);
    if(!state){
      renderWorkflowNodeList();
      updateDemandStatusDisplay();
      return false;
    }
    
    // 恢复该需求的工作流节点和画布状态
    workflowNodes=state.workflowNodes||[];
    canvasUnlocked=state.canvasUnlocked||false;
    nodeConnections=state.nodeConnections||[];
    canvasZoom=state.canvasZoom||1;
    canvasPanX=state.canvasPanX||0;
    canvasPanY=state.canvasPanY||0;
    
    renderWorkflowNodeList();
    updateDemandStatusDisplay();
    
    // ✅ 如果有工作流节点，自动解锁画布
    if(workflowNodes.length>0){
      canvasUnlocked=true;
      document.getElementById('canvasMask').style.display='none';
      
      // 重新渲染画布上的节点（使用保存的位置）
      for(var i=0;i<workflowNodes.length;i++){
        var n=workflowNodes[i];
        // 使用保存的位置，如果没有则随机生成
        var x=n.canvasX||(100+Math.random()*200);
        var y=n.canvasY||(100+Math.random()*100);
        addNodeToCanvasWithPosition(n.type,n.name,n.color,n.icon,n.id,x,y);
      }
      
      // 渲染关联线
      if(nodeConnections.length>0){
        setTimeout(function(){
          renderConnections();
        },300);
      }
      
      // 应用画布缩放和拖动位置
      setTimeout(function(){
        updateCanvasTransform();
      },100);
    }
    
    if(workflowNodes.length>0){
      updateSaveStatus('已加载该需求配置');
    }
    return true;
  }catch(e){
    console.error('加载需求状态失败:',e);
    return false;
  }
}

function triggerAutoSave(){
  if(autoSaveTimer)clearTimeout(autoSaveTimer);
  updateSaveStatus('保存中...');
  autoSaveTimer=setTimeout(function(){
    saveCanvasState();
  },500);
}

function updateSaveStatus(text,isError){
  const statusEl=document.getElementById('saveStatus');
  if(statusEl){
    statusEl.textContent=text;
    statusEl.style.color=isError?'var(--danger)':'var(--success)';
  }
}

function formatTime(date){
  if(!date)return'';
  const now=new Date();
  const diff=Math.floor((now-date)/1000);
  if(diff<60)return'刚刚';
  if(diff<3600)return Math.floor(diff/60)+'分钟前';
  if(diff<86400)return Math.floor(diff/3600)+'小时前';
  return Math.floor(diff/86400)+'天前';
}

function clearCanvasState(){
  localStorage.removeItem(AUTOSAVE_KEY);
  if(selectedDemand){
    localStorage.removeItem(getDemandSaveKey(selectedDemand.id));
  }
  updateSaveStatus('');
}

function clearCanvasNodes(){
  var canvas=document.getElementById('canvas');
  if(canvas){
    var nodes=canvas.querySelectorAll('.canvas-node');
    for(var i=0;i<nodes.length;i++){
      nodes[i].parentNode.removeChild(nodes[i]);
    }
  }
  selectedNode=null;
}

function manualSaveCanvas(){
  saveCanvasState();
  Scaffold.markStepCompleted('assembly');
  toast('画布已手动保存','success');
}

// 更新需求配置状态显示
function updateDemandStatusDisplay(){
  var statusEl=document.getElementById('selectedDemandStatus');
  if(!statusEl)return;
  if(!selectedDemand){
    statusEl.textContent='';
    statusEl.style.display='none';
    return;
  }
  var nodeCount=workflowNodes.length;
  var configuredCount=workflowNodes.filter(function(n){return n.config&&Object.keys(n.config).length>0;}).length;
  if(nodeCount===0){
    statusEl.textContent='未配置';
    statusEl.style.background='var(--danger-subtle)';
    statusEl.style.color='var(--danger)';
  }else if(configuredCount<nodeCount){
    statusEl.textContent='配置中 ('+configuredCount+'/'+nodeCount+')';
    statusEl.style.background='var(--warning-subtle)';
    statusEl.style.color='var(--warning)';
  }else{
    statusEl.textContent='已配置 ('+nodeCount+'节点)';
    statusEl.style.background='var(--success-subtle)';
    statusEl.style.color='var(--success)';
  }
  statusEl.style.display='inline-block';
}
