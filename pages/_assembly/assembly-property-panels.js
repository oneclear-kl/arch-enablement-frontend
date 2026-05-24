// ===== 规则配置属性限定功能 =====
function renderRuleConfigPanel(node){
  var content=document.getElementById('canvasNodeConfigContent');
  document.getElementById('canvasNodeTitle').textContent='规则配置';
  document.getElementById('canvasNodeSubtitle').textContent=node.name;
  
  var html='';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">规则类型</div>';
  html+='<select class="input w-full" id="ruleType" onchange="onRuleTypeChange(this.value)">';
  html+='<option value="threshold">阈值限定</option>';
  html+='<option value="range">范围限定</option>';
  html+='<option value="formula">公式限定</option>';
  html+='</select></div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">限定目标</div>';
  
  // 获取组件已配置的数据项
  var targetDataItems=[];
  for(var i=0;i<workflowNodes.length;i++){
    var wNode=workflowNodes[i];
    if(wNode.type==='component'&&wNode.dataBindings){
      for(var hotspotId in wNode.dataBindings){
        targetDataItems=targetDataItems.concat(wNode.dataBindings[hotspotId].map(function(item){
          return Object.assign({},item,{componentName:wNode.name});
        }));
      }
    }
  }
  
  if(targetDataItems.length===0){
    html+='<div class="text-center py-4" style="color:var(--text-tertiary)">';
    html+='<i class="fa-solid fa-circle-info text-2xl mb-2"></i>';
    html+='<div class="text-xs">请先配置组件数据项</div>';
    html+='</div>';
  }else{
    html+='<select class="input w-full" id="ruleTarget">';
    for(var j=0;j<targetDataItems.length;j++){
      var item=targetDataItems[j];
      html+='<option value="'+item.code+'">'+item.name+' ('+item.componentName+')</option>';
    }
    html+='</select>';
  }
  html+='</div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">限定条件</div>';
  html+='<div class="flex gap-2 mb-2">';
  html+='<select class="input flex-1" id="ruleOperator">';
  html+='<option value=">">大于</option>';
  html+='<option value="<">小于</option>';
  html+='<option value=">=">大于等于</option>';
  html+='<option value="<=">小于等于</option>';
  html+='<option value="=">等于</option>';
  html+='</select>';
  html+='<input type="number" class="input flex-1" id="ruleValue" placeholder="阈值">';
  html+='</div>';
  html+='<button class="btn btn-outline btn-sm w-full" onclick="addRuleCondition()"><i class="fa-solid fa-plus mr-1"></i>添加条件</button>';
  html+='</div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">已配置条件</div>';
  html+='<div id="ruleConditionsList" class="space-y-2">';
  html+='</div></div>';
  
  html+='<div class="flex gap-2">';
  html+='<button class="flex-1 btn btn-primary btn-sm" onclick="saveRuleConfig(\''+node.id+'\')"><i class="fa-solid fa-check mr-1"></i>保存规则</button>';
  html+='</div>';
  
  content.innerHTML=html;
}

function onRuleTypeChange(type){
  console.log('规则类型变更:',type);
}

function addRuleCondition(){
  var operator=document.getElementById('ruleOperator').value;
  var value=document.getElementById('ruleValue').value;
  
  if(!value){
    toast('请输入阈值','warning');
    return;
  }
  
  var list=document.getElementById('ruleConditionsList');
  var html='<div class="data-item-config">';
  html+='<div class="flex items-center justify-between">';
  html+='<div class="text-xs">';
  html+='<span style="color:var(--brand);font-weight:600">'+operator+'</span> ';
  html+='<span>'+value+'</span>';
  html+='</div>';
  html+='<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100" style="color:var(--danger)" onclick="this.parentElement.parentElement.remove()"><i class="fa-solid fa-trash text-xs"></i></button>';
  html+='</div></div>';
  
  list.innerHTML+=html;
  document.getElementById('ruleValue').value='';
}

function saveRuleConfig(nodeId){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  var ruleType=document.getElementById('ruleType').value;
  var ruleTarget=document.getElementById('ruleTarget').value;
  
  // 收集所有条件
  var conditions=[];
  var conditionEls=document.getElementById('ruleConditionsList').querySelectorAll('.data-item-config');
  for(var i=0;i<conditionEls.length;i++){
    var text=conditionEls[i].textContent;
    conditions.push(text);
  }
  
  if(!node.ruleConfig)node.ruleConfig={};
  node.ruleConfig={
    type:ruleType,
    target:ruleTarget,
    conditions:conditions
  };
  
  toast('规则已保存','success');
  triggerAutoSave();
}

// ===== 数据服务数据项展示功能 =====
function renderDataServicePanel(node){
  var content=document.getElementById('canvasNodeConfigContent');
  document.getElementById('canvasNodeTitle').textContent='数据服务';
  document.getElementById('canvasNodeSubtitle').textContent=node.name;
  
  var html='';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">服务信息</div>';
  html+='<div class="p-3 rounded border" style="background:var(--surface-subtle);border-color:var(--border-default)">';
  html+='<div class="text-sm">服务名称：'+node.name+'</div>';
  html+='<div class="text-xs mt-1" style="color:var(--text-tertiary)">类型：'+node.category+'</div>';
  html+='</div></div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">包含数据项</div>';
  
  // 显示该数据服务包含的所有数据项
  var serviceItems=DATA_ITEM_LIBRARY.slice(0,5);
  
  for(var i=0;i<serviceItems.length;i++){
    var item=serviceItems[i];
    var typeIcon=item.type==='number'?'fa-hashtag':item.type==='percent'?'fa-percent':'fa-tag';
    var typeColor=item.type==='number'?'var(--brand)':item.type==='percent'?'var(--success)':'var(--warning)';
    
    html+='<div class="data-item-config">';
    html+='<div class="flex items-start gap-2">';
    html+='<i class="fa-solid '+typeIcon+' text-sm mt-0.5" style="color:'+typeColor+'"></i>';
    html+='<div class="flex-1">';
    html+='<div class="text-xs font-medium">'+item.name+'</div>';
    html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+item.code+'</div>';
    html+='<div class="text-[10px] mt-1" style="color:var(--text-secondary)">单位：'+item.unit+' | 来源：'+item.source+'</div>';
    html+='</div>';
    html+='<div class="text-[10px] px-2 py-1 rounded" style="background:var(--brand);color:var(--text-inverse)">输出</div>';
    html+='</div></div>';
  }
  
  html+='</div>';
  
  html+='<div class="flex gap-2">';
  html+='<button class="flex-1 btn btn-primary btn-sm" onclick="manageDataServiceItems(\''+node.id+'\')"><i class="fa-solid fa-gear mr-1"></i>管理数据项</button>';
  html+='</div>';
  
  content.innerHTML=html;
}

function manageDataServiceItems(nodeId){
  toast('打开数据服务管理界面','info');
  // 实际项目中需要实现数据服务项的管理界面
}

// ===== 模型服务输入输出配置 =====
function renderModelServicePanel(node){
  var content=document.getElementById('canvasNodeConfigContent');
  document.getElementById('canvasNodeTitle').textContent='模型服务';
  document.getElementById('canvasNodeSubtitle').textContent=node.name;
  
  var html='';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">模型信息</div>';
  html+='<div class="p-3 rounded border" style="background:var(--surface-subtle);border-color:var(--border-default)">';
  html+='<div class="text-sm">模型名称：'+node.name+'</div>';
  html+='<div class="text-xs mt-1" style="color:var(--text-tertiary)">类型：'+node.category+'</div>';
  html+='</div></div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">输入配置</div>';
  
  // 获取组件已配置的数据项作为可用输入
  var availableInputs=[];
  for(var i=0;i<workflowNodes.length;i++){
    var wNode=workflowNodes[i];
    if(wNode.type==='component'&&wNode.dataBindings){
      for(var hotspotId in wNode.dataBindings){
        availableInputs=availableInputs.concat(wNode.dataBindings[hotspotId]);
      }
    }
  }
  
  if(availableInputs.length===0){
    html+='<div class="text-center py-3" style="color:var(--text-tertiary)">';
    html+='<i class="fa-solid fa-circle-info text-xl mb-1"></i>';
    html+='<div class="text-xs">请先配置组件数据项</div>';
    html+='</div>';
  }else{
    html+='<div class="space-y-2">';
    for(var j=0;j<Math.min(3,availableInputs.length);j++){
      var input=availableInputs[j];
      html+='<div class="data-item-config">';
      html+='<div class="flex items-center justify-between">';
      html+='<div class="text-xs">';
      html+='<span style="color:var(--brand);font-weight:600">输入 '+ (j+1) +': </span>';
      html+='<span>'+input.name+'</span>';
      html+='</div>';
      html+='<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100" style="color:var(--danger)" onclick="removeModelInput(\''+node.id+'\','+j+')"><i class="fa-solid fa-trash text-xs"></i></button>';
      html+='</div></div>';
    }
    html+='</div>';
  }
  
  html+='<button class="btn btn-outline btn-sm w-full mt-2" onclick="addModelInput(\''+node.id+'\')"><i class="fa-solid fa-plus mr-1"></i>添加输入</button>';
  html+='</div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">输出配置</div>';
  html+='<div class="p-3 rounded border" style="background:var(--success-subtle);border-color:var(--success)">';
  html+='<div class="text-xs">';
  html+='<div class="font-medium" style="color:var(--success)">预测结果</div>';
  html+='<div style="color:var(--text-tertiary)">model.output.prediction</div>';
  html+='<div class="mt-1">类型：数值型 | 单位：无</div>';
  html+='</div></div>';
  html+='</div>';
  
  html+='<div class="flex gap-2">';
  html+='<button class="flex-1 btn btn-primary btn-sm" onclick="saveModelConfig(\''+node.id+'\')"><i class="fa-solid fa-check mr-1"></i>保存配置</button>';
  html+='</div>';
  
  content.innerHTML=html;
}

function addModelInput(nodeId){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  openDataItemSelector(function(selectedItems){
    if(!node.modelConfig)node.modelConfig={inputs:[]};
    if(!node.modelConfig.inputs)node.modelConfig.inputs=[];
    
    for(var i=0;i<selectedItems.length;i++){
      node.modelConfig.inputs.push(selectedItems[i]);
    }
    
    renderModelServicePanel(node);
    toast('已添加输入数据项','success');
    triggerAutoSave();
  },node.modelConfig&&node.modelConfig.inputs?node.modelConfig.inputs:[]);
}

function removeModelInput(nodeId,index){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node||!node.modelConfig||!node.modelConfig.inputs)return;
  
  node.modelConfig.inputs.splice(index,1);
  renderModelServicePanel(node);
  toast('已移除输入','success');
  triggerAutoSave();
}

function saveModelConfig(nodeId){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  toast('模型配置已保存','success');
  triggerAutoSave();
}
