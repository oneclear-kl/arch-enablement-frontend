// ===== 发布申请相关函数 =====
function showPublishApplication(){
  if(!selectedDemand){
    toast('请先选择需求','error');
    return;
  }
  
  if(workflowNodes.length===0){
    toast('请先配置工作流节点','warning');
    return;
  }
  
  // 填充发布申请信息
  document.getElementById('publishServiceName').textContent=selectedDemand.title;
  document.getElementById('publishComponentCount').textContent=workflowNodes.length;
  document.getElementById('publishDemandInfo').textContent=selectedDemand.id+' '+selectedDemand.title;
  
  document.getElementById('publishApplicationModal').classList.remove('hidden');
  document.getElementById('publishApplicationModal').classList.add('flex');
}

function closePublishApplicationModal(){
  document.getElementById('publishApplicationModal').classList.add('hidden');
  document.getElementById('publishApplicationModal').classList.remove('flex');
}

function submitPublishApplication(){
  var description=document.getElementById('publishDescription').value;
  var env=document.querySelector('input[name="publishEnv"]:checked').value;
  
  if(!description){
    toast('请输入申请说明','warning');
    return;
  }
  
  // 模拟提交发布申请
  console.log('提交发布申请',{
    demandId:selectedDemand.id,
    demandTitle:selectedDemand.title,
    componentCount:workflowNodes.length,
    description:description,
    environment:env,
    submitTime:new Date().toISOString()
  });
  
  // 模拟提交成功
  toast('发布申请已提交','success');
  closePublishApplicationModal();
  
  // 这里应该调用后端 API 提交申请，并更新状态
  // 实际项目中需要实现与发布管理模块的对接
  setTimeout(function(){
    alert('发布申请已提交至发布管理模块\n\n申请信息：\n- 服务名称：'+selectedDemand.title+'\n- 组件数量：'+workflowNodes.length+' 个\n- 发布环境：'+(env==='test'?'测试环境':'生产环境')+'\n- 申请说明：'+description);
  },500);
}

// 修改原有的发布函数
function showPublishModal(){
  showPublishApplication();
}

function closePublishModal(){
  closePublishApplicationModal();
}

function confirmPublish(){
  submitPublishApplication();
}

// ===== 全局测试函数（调试用）=====
window.testButtons=function(){
  console.log('测试按钮功能');
  console.log('selectedComponentsTemp:', selectedComponentsTemp);
  console.log('tempSaveList:', tempSaveList);
  console.log('workflowNodes:', workflowNodes);
  console.log('selectedDemand:', selectedDemand);
  alert('调试信息已输出到控制台，请按 F12 查看');
};
