// ===== 数据项配置相关函数 =====
var currentDataSource='library'; // 当前数据源
var selectedDataItems=[]; // 当前选中的数据项
var currentDataItemCallback=null; // 数据项选择回调函数

// 打开数据项选择器
function openDataItemSelector(callback,selectedItems=[]){
  currentDataItemCallback=callback;
  selectedDataItems=[...selectedItems];
  document.getElementById('dataItemSelectorModal').classList.remove('hidden');
  document.getElementById('dataItemSelectorModal').classList.add('flex');
  selectDataSource('library',document.querySelector('[data-source="library"]'));
  updateSelectedDataItemCount();
}

// 关闭数据项选择器
function closeDataItemSelector(){
  document.getElementById('dataItemSelectorModal').classList.add('hidden');
  document.getElementById('dataItemSelectorModal').classList.remove('flex');
  selectedDataItems=[];
  currentDataItemCallback=null;
}

// 选择数据源
function selectDataSource(source,el){
  currentDataSource=source;
  document.querySelectorAll('[data-source]').forEach(item=>{
    item.classList.remove('active');
    item.style.borderLeftColor='transparent';
    item.style.background='transparent';
  });
  el.classList.add('active');
  el.style.borderLeftColor='var(--brand)';
  el.style.background='var(--surface-base)';
  searchDataItems('');
}

// 搜索数据项
function searchDataItems(keyword){
  var list=document.getElementById('dataItemList');
  var items=[];
  
  if(currentDataSource==='library'){
    items=DATA_ITEM_LIBRARY.filter(function(item){
      if(!keyword)return true;
      return item.name.indexOf(keyword)!==-1||item.code.indexOf(keyword)!==-1||item.category.indexOf(keyword)!==-1;
    });
  }else if(currentDataSource==='workflow'){
    // 从工作流中的数据服务获取数据项
    items=[];
    for(var i=0;i<workflowNodes.length;i++){
      var node=workflowNodes[i];
      if(node.type==='data'){
        // 模拟数据服务包含的数据项
        var serviceItems=DATA_ITEM_LIBRARY.slice(0,4).map(function(item){
          return Object.assign({},item,{serviceName:node.name});
        });
        items=items.concat(serviceItems);
      }
    }
    if(keyword){
      items=items.filter(function(item){
        return item.name.indexOf(keyword)!==-1||item.code.indexOf(keyword)!==-1;
      });
    }
  }
  
  if(items.length===0){
    list.innerHTML='<div class="text-center py-8" style="color:var(--text-tertiary)"><i class="fa-solid fa-inbox text-2xl mb-2"></i><div class="text-xs">暂无数据项</div></div>';
    return;
  }
  
  var html='';
  for(var i=0;i<items.length;i++){
    var item=items[i];
    var isSelected=selectedDataItems.some(function(si){return si.id===item.id;});
    var typeIcon=item.type==='number'?'fa-hashtag':item.type==='percent'?'fa-percent':'fa-tag';
    var typeColor=item.type==='number'?'var(--brand)':item.type==='percent'?'var(--success)':'var(--warning)';
    
    html+='<div class="data-item-option'+(isSelected?' selected':'')+'" onclick="toggleDataItem(\''+item.id+'\',this)">';
    html+='<div class="flex items-start justify-between">';
    html+='<div class="flex items-start gap-2 flex-1">';
    html+='<i class="fa-solid '+typeIcon+' text-sm mt-0.5" style="color:'+typeColor+'"></i>';
    html+='<div class="flex-1">';
    html+='<div class="text-xs font-medium">'+item.name+'</div>';
    html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+item.code+'</div>';
    if(item.serviceName){
      html+='<div class="text-[10px] mt-1" style="color:var(--brand)"><i class="fa-solid fa-network-wired"></i> '+item.serviceName+'</div>';
    }
    html+='</div></div>';
    html+='<div class="text-[10px] px-2 py-1 rounded" style="background:var(--surface-subtle);color:var(--text-secondary)">'+item.unit+'</div>';
    html+='</div></div>';
  }
  list.innerHTML=html;
}

// 切换数据项选择状态
function toggleDataItem(itemId,el){
  var item=DATA_ITEM_LIBRARY.find(function(i){return i.id===itemId;});
  if(!item){
    // 如果是工作流数据服务的数据项
    item=selectedDataItems.find(function(i){return i.id===itemId;});
  }
  if(!item)return;
  
  var index=selectedDataItems.findIndex(function(i){return i.id===itemId;});
  if(index>=0){
    selectedDataItems.splice(index,1);
    el.classList.remove('selected');
  }else{
    selectedDataItems.push(item);
    el.classList.add('selected');
  }
  updateSelectedDataItemCount();
}

// 更新已选数据项数量
function updateSelectedDataItemCount(){
  var countEl=document.getElementById('selectedDataItemCount');
  var confirmBtn=document.getElementById('confirmDataItemBtn');
  if(countEl)countEl.textContent=selectedDataItems.length;
  if(confirmBtn)confirmBtn.disabled=(selectedDataItems.length===0);
}

// 确认选择数据项
function confirmDataItemSelection(){
  if(currentDataItemCallback){
    currentDataItemCallback(selectedDataItems);
  }
  closeDataItemSelector();
  toast('已选择 '+selectedDataItems.length+' 个数据项','success');
}

// ===== 画布组件可视化配置相关函数 =====

// 定义组件类型对应的热区配置
var componentHotspotConfig={
  'C005':{  // 产量柱状图
    hotspots:[
      {id:'xAxis',label:'X 轴',icon:'fa-arrows-left-right',x:60,y:140,width:120,height:30},
      {id:'yAxis',label:'Y 轴',icon:'fa-arrows-up-down',x:20,y:60,width:30,height:80},
      {id:'data',label:'数据源',icon:'fa-database',x:60,y:60,width:120,height:80}
    ]
  },
  'C004':{  // 管网压力平衡图
    hotspots:[
      {id:'nodeA',label:'节点 A',icon:'fa-circle',x:40,y:80,width:60,height:60},
      {id:'nodeB',label:'节点 B',icon:'fa-circle',x:140,y:80,width:60,height:60},
      {id:'balance',label:'平衡状态',icon:'fa-scale-balanced',x:90,y:20,width:60,height:40}
    ]
  },
  'C002':{  // 生产数据监控
    hotspots:[
      {id:'production',label:'产量数据',icon:'fa-chart-line',x:20,y:40,width:70,height:50},
      {id:'device',label:'设备数据',icon:'fa-industry',x:110,y:40,width:70,height:50},
      {id:'alarm',label:'告警数据',icon:'fa-triangle-exclamation',x:65,y:100,width:70,height:50}
    ]
  }
};

// 渲染画布节点热区
function renderNodeHotspots(nodeId,componentId){
  console.log('renderNodeHotspots 被调用:', nodeId, componentId);
  
  // 尝试多种方式查找节点
  var node=document.querySelector('.canvas-node[data-node-id="'+nodeId+'"]');
  
  if(!node){
    console.error('找不到节点:', nodeId);
    // 尝试查找所有 canvas-node
    var allNodes=document.querySelectorAll('.canvas-node');
    console.log('所有画布节点:', allNodes.length);
    for(var i=0;i<allNodes.length;i++){
      console.log('节点 '+i+':', allNodes[i].getAttribute('data-node-id'));
    }
    return;
  }
  
  console.log('找到节点:', node);
  
  // 清除旧的热区
  var oldHotspots=node.querySelectorAll('.canvas-node-hotspot');
  console.log('清除旧热区数量:', oldHotspots.length);
  for(var i=0;i<oldHotspots.length;i++){
    oldHotspots[i].parentNode.removeChild(oldHotspots[i]);
  }
  
  // 获取热区配置
  var config=componentHotspotConfig[componentId];
  if(!config){
    console.error('找不到热区配置:', componentId);
    return;
  }
  
  console.log('热区配置:', config);
  
  // 渲染热区
  for(var i=0;i<config.hotspots.length;i++){
    var hs=config.hotspots[i];
    var hotspot=document.createElement('div');
    hotspot.className='canvas-node-hotspot';
    hotspot.dataset.hotspotId=hs.id;
    hotspot.dataset.hotspotLabel=hs.label;
    hotspot.style.left=hs.x+'px';
    hotspot.style.top=hs.y+'px';
    hotspot.style.width=hs.width+'px';
    hotspot.style.height=hs.height+'px';
    hotspot.title=hs.label;
    hotspot.onclick=function(e){
      e.stopPropagation();
      selectHotspot(nodeId,this.dataset.hotspotId,this.dataset.hotspotLabel);
    };
    node.appendChild(hotspot);
    console.log('添加热区:', hs.label, hotspot);
  }
  
  console.log('热区渲染完成');
}

// 手动重新渲染热区（调试用）
function refreshHotspots(){
  for(var i=0;i<workflowNodes.length;i++){
    var node=workflowNodes[i];
    if(node.componentId){
      renderNodeHotspots(node.id,node.componentId);
    }
  }
  toast('热区已刷新','success');
}

// 选择热区
function selectHotspot(nodeId,hotspotId,hotspotLabel){
  // 清除其他选中状态
  document.querySelectorAll('.canvas-node-hotspot').forEach(function(hs){
    hs.classList.remove('selected');
  });
  
  // 选中当前热区
  var hotspot=document.querySelector('.canvas-node-hotspot[data-hotspot-id="'+hotspotId+'"]');
  if(hotspot){
    hotspot.classList.add('selected');
  }
  
  selectedHotspot={
    nodeId:nodeId,
    hotspotId:hotspotId,
    hotspotLabel:hotspotLabel
  };
  
  // 打开数据项配置
  openHotspotDataItemConfig(nodeId,hotspotId,hotspotLabel);
}

// 打开热区数据项配置
function openHotspotDataItemConfig(nodeId,hotspotId,hotspotLabel){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  // 更新属性面板标题
  document.getElementById('canvasNodeTitle').textContent='数据项绑定';
  document.getElementById('canvasNodeSubtitle').textContent=node.name+' - '+hotspotLabel;
  
  // 生成配置内容
  var content=document.getElementById('canvasNodeConfigContent');
  var html='';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">绑定位置</div>';
  html+='<div class="p-3 rounded border" style="background:var(--surface-subtle);border-color:var(--border-default)">';
  html+='<div class="text-sm"><i class="fa-solid fa-location-dot" style="color:var(--brand)"></i> '+hotspotLabel+'</div>';
  html+='<div class="text-xs mt-1" style="color:var(--text-tertiary)">组件：'+node.name+'</div>';
  html+='</div></div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">数据项配置</div>';
  
  // 获取已绑定的数据项
  var boundItems=node.dataBindings&&node.dataBindings[hotspotId]?node.dataBindings[hotspotId]:[];
  
  if(boundItems.length>0){
    html+='<div class="space-y-2">';
    for(var i=0;i<boundItems.length;i++){
      var item=boundItems[i];
      html+='<div class="data-item-config">';
      html+='<div class="flex items-start justify-between">';
      html+='<div class="flex-1">';
      html+='<div class="text-xs font-medium">'+item.name+'</div>';
      html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+item.code+'</div>';
      html+='</div>';
      html+='<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100" style="color:var(--danger)" onclick="removeDataBinding(\''+nodeId+'\',\''+hotspotId+'\','+i+')"><i class="fa-solid fa-trash text-xs"></i></button>';
      html+='</div></div>';
    }
    html+='</div>';
  }else{
    html+='<div class="text-center py-4" style="color:var(--text-tertiary)">';
    html+='<i class="fa-solid fa-circle-info text-2xl mb-2"></i>';
    html+='<div class="text-xs">暂无绑定数据项</div>';
    html+='</div>';
  }
  
  html+='</div>';
  
  html+='<div class="flex gap-2">';
  html+='<button class="flex-1 btn btn-primary btn-sm" onclick="addDataBinding(\''+nodeId+'\',\''+hotspotId+'\')"><i class="fa-solid fa-plus mr-1"></i>添加数据项</button>';
  html+='<button class="flex-1 btn btn-outline btn-sm" onclick="configureFormula(\''+nodeId+'\',\''+hotspotId+'\')"><i class="fa-solid fa-calculator mr-1"></i>配置公式</button>';
  html+='</div>';
  
  content.innerHTML=html;
}

// 添加数据绑定
function addDataBinding(nodeId,hotspotId){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  var currentBindings=node.dataBindings&&node.dataBindings[hotspotId]?node.dataBindings[hotspotId]:[];
  
  openDataItemSelector(function(selectedItems){
    if(!node.dataBindings)node.dataBindings={};
    if(!node.dataBindings[hotspotId])node.dataBindings[hotspotId]=[];
    
    for(var i=0;i<selectedItems.length;i++){
      node.dataBindings[hotspotId].push(selectedItems[i]);
    }
    
    openHotspotDataItemConfig(nodeId,hotspotId,selectedHotspot.hotspotLabel);
    renderNodeHotspots(nodeId,node.componentId);
    toast('已添加 '+selectedItems.length+' 个数据项','success');
    triggerAutoSave();
  },currentBindings);
}

// 移除数据绑定
function removeDataBinding(nodeId,hotspotId,index){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node||!node.dataBindings||!node.dataBindings[hotspotId])return;
  
  node.dataBindings[hotspotId].splice(index,1);
  openHotspotDataItemConfig(nodeId,hotspotId,selectedHotspot.hotspotLabel);
  renderNodeHotspots(nodeId,node.componentId);
  toast('已移除数据项','success');
  triggerAutoSave();
}

// 配置计算公式
function configureFormula(nodeId,hotspotId){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  var currentFormula=node.formulaConfig&&node.formulaConfig[hotspotId]?node.formulaConfig[hotspotId]:'';
  
  // 打开公式配置器
  var content=document.getElementById('canvasNodeConfigContent');
  var html='';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">计算公式配置</div>';
  html+='<div class="text-xs" style="color:var(--text-tertiary)">配置数据项的计算方式</div>';
  html+='</div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">公式编辑器</div>';
  html+='<div class="formula-editor" id="formulaEditor" contenteditable="true">';
  html+=currentFormula||'{{数据项}} + {{数据项}}';
  html+='</div>';
  html+='<div class="text-[10px] mt-1" style="color:var(--text-tertiary)">使用 {{}} 包裹数据项 ID</div>';
  html+='</div>';
  
  html+='<div class="mb-4">';
  html+='<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">可用数据项</div>';
  html+='<div class="data-item-selector">';
  
  // 显示工作流中的数据服务数据项
  var dataServiceItems=[];
  for(var i=0;i<workflowNodes.length;i++){
    var wNode=workflowNodes[i];
    if(wNode.type==='data'){
      dataServiceItems=dataServiceItems.concat(DATA_ITEM_LIBRARY.slice(0,3).map(function(item){
        return Object.assign({},item,{serviceName:wNode.name});
      }));
    }
  }
  
  if(dataServiceItems.length===0){
    html+='<div class="text-center py-4" style="color:var(--text-tertiary)">';
    html+='<i class="fa-solid fa-circle-info text-2xl mb-2"></i>';
    html+='<div class="text-xs">请先添加数据服务节点</div>';
    html+='</div>';
  }else{
    for(var j=0;j<dataServiceItems.length;j++){
      var item=dataServiceItems[j];
      html+='<div class="data-item-option" onclick="insertDataItemToFormula(\''+item.code+'\')" title="点击插入到公式">';
      html+='<div class="text-xs font-medium">'+item.name+'</div>';
      html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+item.code+'</div>';
      if(item.serviceName){
        html+='<div class="text-[10px] mt-1" style="color:var(--brand)"><i class="fa-solid fa-network-wired"></i> '+item.serviceName+'</div>';
      }
      html+='</div>';
    }
  }
  
  html+='</div></div>';
  
  html+='<div class="flex gap-2">';
  html+='<button class="flex-1 btn btn-primary btn-sm" onclick="saveFormula(\''+nodeId+'\',\''+hotspotId+'\')"><i class="fa-solid fa-check mr-1"></i>保存公式</button>';
  html+='<button class="flex-1 btn btn-outline btn-sm" onclick="openHotspotDataItemConfig(\''+nodeId+'\',\''+hotspotId+'\',\''+selectedHotspot.hotspotLabel+'\')"><i class="fa-solid fa-arrow-left mr-1"></i>返回</button>';
  html+='</div>';
  
  content.innerHTML=html;
}

// 插入数据项到公式
function insertDataItemToFormula(itemCode){
  var editor=document.getElementById('formulaEditor');
  if(editor){
    editor.innerHTML+=' {{'+itemCode+'}}';
  }
}

// 保存公式
function saveFormula(nodeId,hotspotId){
  var editor=document.getElementById('formulaEditor');
  if(!editor)return;
  
  var formula=editor.innerHTML;
  
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  
  if(!node.formulaConfig)node.formulaConfig={};
  node.formulaConfig[hotspotId]=formula;
  
  toast('公式已保存','success');
  openHotspotDataItemConfig(nodeId,hotspotId,selectedHotspot.hotspotLabel);
  triggerAutoSave();
}
