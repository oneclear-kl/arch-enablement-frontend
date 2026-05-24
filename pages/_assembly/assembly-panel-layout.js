// ===== 面板宽度调节和折叠功能 =====
var isResizing=false;
var currentResizePanel=null;
var resizeStartX=0;
var resizeStartWidth=0;

// 开始调节宽度
function startResize(e,panelType){
  isResizing=true;
  currentResizePanel=panelType;
  resizeStartX=e.clientX;
  
  var panelId=panelType==='workflow'?'workflowPanel':'propertyPanel';
  var panel=document.getElementById(panelId);
  resizeStartWidth=panel.offsetWidth;
  
  document.addEventListener('mousemove',resize);
  document.addEventListener('mouseup',stopResize);
  
  e.preventDefault();
  e.stopPropagation();
}

// 调节宽度
function resize(e){
  if(!isResizing)return;

  var deltaX=e.clientX-resizeStartX;

  if(currentResizePanel==='workflow'){
    var panel=document.getElementById('workflowPanel');
    var iconBar=document.getElementById('collapsedIconBar');
    var icon=document.getElementById('workflowToggleIcon');

    // 如果当前是图标栏模式（面板隐藏），拖动向右展开
    if(panel.style.display==='none'&&iconBar&&iconBar.style.display==='flex'){
      if(deltaX>20){
        // 拖动超过 20px，切换回面板模式
        iconBar.style.display='none';
        panel.style.display='flex';
        panel.style.overflow='';
        panel.style.width='288px';
        icon.className='fa-solid fa-chevron-left text-xs';
        // 更新起始值，支持继续拖拽调宽
        resizeStartX=e.clientX;
        resizeStartWidth=288;
      }
      return;
    }

    // 正常面板模式
    var newWidth=resizeStartWidth+deltaX;

    if(newWidth<=52){
      // 拖到图标栏宽度以下，切换为图标栏模式
      renderCollapsedIconBar();
      panel.style.display='none';
      if(iconBar)iconBar.style.display='flex';
      icon.className='fa-solid fa-chevron-right text-xs';
    }else if(newWidth<=600){
      panel.style.width=newWidth+'px';
      // 宽度小于 100 时隐藏面板内的文字内容（只留图标）
      var headTitle=panel.querySelector('.p-3.border-b .text-xs.font-semibold');
      var importBtn=document.getElementById('importFlowBtn');
      var hint=document.getElementById('workflowHint');
      var nodeList=document.getElementById('workflowNodeList');
      if(headTitle)headTitle.style.display=newWidth<100?'none':'';
      if(importBtn)importBtn.style.display=newWidth<100?'none':'';
      if(hint)hint.parentElement.style.display=newWidth<100?'none':'';
      if(nodeList){
        // 宽度在 52~100 之间时，节点列表只显示图标
        var items=nodeList.querySelectorAll('.workflow-node-item');
        for(var i=0;i<items.length;i++){
          var info=items[i].querySelector('.flex-1');
          var grip=items[i].querySelector('.fa-grip-lines');
          if(info)info.style.display=newWidth<120?'none':'';
          if(grip)grip.style.display=newWidth<120?'none':'';
          var iconDiv=items[i].querySelector('.w-9');
          if(iconDiv)iconDiv.style.margin=newWidth<120?'0 auto':'';
        }
      }
    }
  }else if(currentResizePanel==='property'){
    var panel=document.getElementById('propertyPanel');
    var propBar=document.getElementById('collapsedPropertyBar');
    var propIcon=document.getElementById('propertyToggleIcon');
    var newWidth=resizeStartWidth-deltaX;

    // 如果当前是图标栏模式（面板隐藏），拖动向左展开
    if(panel.style.display==='none'&&propBar&&propBar.style.display==='flex'){
      if(deltaX<-20){
        propBar.style.display='none';
        panel.style.display='flex';
        panel.style.overflow='';
        panel.style.width='320px';
        propIcon.className='fa-solid fa-chevron-right text-xs';
        resizeStartX=e.clientX;
        resizeStartWidth=320;
      }
      return;
    }

    if(newWidth<=52){
      // 拖到图标栏宽度以下，切换为图标栏模式
      renderCollapsedPropertyBar();
      panel.style.display='none';
      if(propBar)propBar.style.display='flex';
      propIcon.className='fa-solid fa-chevron-left text-xs';
    }else if(newWidth<=600){
      panel.style.width=newWidth+'px';
      // 宽度较小时隐藏面板内文字
      var propTitle=document.getElementById('propertyPanelTitle');
      if(propTitle)propTitle.style.display=newWidth<80?'none':'';
      var wfCfgPanel=document.getElementById('workflowConfigPanel');
      var cvNodePanel=document.getElementById('canvasNodePanel');
      // 隐藏子面板的头部标题文字
      var subTitles=panel.querySelectorAll('#workflowConfigPanel .text-xs.font-semibold, #canvasNodePanel .text-xs.font-semibold, #workflowConfigPanel .text-\\[10px\\], #canvasNodePanel .text-\\[10px\\]');
      for(var k=0;k<subTitles.length;k++){
        subTitles[k].style.display=newWidth<100?'none':'';
      }
    }
  }

  e.preventDefault();
}

// 停止调节
function stopResize(){
  if(currentResizePanel==='workflow'){
    var panel=document.getElementById('workflowPanel');
    if(panel.style.display!=='none'){
      var w=panel.offsetWidth;
      if(w>=120){
        var headTitle=panel.querySelector('.p-3.border-b .text-xs.font-semibold');
        var importBtn=document.getElementById('importFlowBtn');
        var hint=document.getElementById('workflowHint');
        var nodeList=document.getElementById('workflowNodeList');
        if(headTitle)headTitle.style.display='';
        if(importBtn)importBtn.style.display='';
        if(hint)hint.parentElement.style.display='';
        if(nodeList){
          var items=nodeList.querySelectorAll('.workflow-node-item');
          for(var i=0;i<items.length;i++){
            var info=items[i].querySelector('.flex-1');
            var grip=items[i].querySelector('.fa-grip-lines');
            if(info)info.style.display='';
            if(grip)grip.style.display='';
            var iconDiv=items[i].querySelector('.w-9');
            if(iconDiv)iconDiv.style.margin='';
          }
        }
      }
    }
  }else if(currentResizePanel==='property'){
    var panel=document.getElementById('propertyPanel');
    if(panel.style.display!=='none'){
      var w=panel.offsetWidth;
      if(w>=100){
        var propTitle=document.getElementById('propertyPanelTitle');
        if(propTitle)propTitle.style.display='';
        var subTitles=panel.querySelectorAll('#workflowConfigPanel .text-xs.font-semibold, #canvasNodePanel .text-xs.font-semibold, #workflowConfigPanel .text-\\[10px\\], #canvasNodePanel .text-\\[10px\\]');
        for(var k=0;k<subTitles.length;k++){
          subTitles[k].style.display='';
        }
      }
    }
  }
  isResizing=false;
  currentResizePanel=null;
  document.removeEventListener('mousemove',resize);
  document.removeEventListener('mouseup',stopResize);
}

// 折叠/展开面板
function togglePanel(panelType){
  var panelId=panelType==='workflow'?'workflowPanel':'propertyPanel';
  var iconId=panelType==='workflow'?'workflowToggleIcon':'propertyToggleIcon';
  var panel=document.getElementById(panelId);
  var icon=document.getElementById(iconId);

  if(panelType==='workflow'){
    var iconBar=document.getElementById('collapsedIconBar');
    // 判断当前是否处于折叠态：面板隐藏且图标栏显示
    var isCollapsed=panel.style.display==='none'&&iconBar&&iconBar.style.display==='flex';

    if(isCollapsed){
      // 展开：隐藏图标栏，显示面板
      iconBar.style.display='none';
      panel.style.display='flex';
      panel.style.overflow='';
      panel.style.width='288px';
      icon.className='fa-solid fa-chevron-left text-xs';
    }else{
      // 折叠：隐藏面板，渲染并显示图标栏
      renderCollapsedIconBar();
      panel.style.display='none';
      if(iconBar)iconBar.style.display='flex';
      icon.className='fa-solid fa-chevron-right text-xs';
    }
  }else{
    // 属性面板：与左侧面板逻辑一致
    var propBar=document.getElementById('collapsedPropertyBar');
    var isCollapsed=panel.style.display==='none'&&propBar&&propBar.style.display==='flex';

    if(isCollapsed){
      // 展开：隐藏图标栏，显示面板
      propBar.style.display='none';
      panel.style.display='flex';
      panel.style.overflow='';
      panel.style.width='320px';
      icon.className='fa-solid fa-chevron-right text-xs';
    }else{
      // 折叠：隐藏面板，渲染并显示图标栏
      renderCollapsedPropertyBar();
      panel.style.display='none';
      if(propBar)propBar.style.display='flex';
      icon.className='fa-solid fa-chevron-left text-xs';
    }
  }
}

// 渲染收缩态图标栏中的节点图标
function renderCollapsedIconBar(){
  var container=document.getElementById('collapsedIconList');
  if(!container)return;
  if(workflowNodes.length===0){
    container.innerHTML='<div class="text-center py-4" style="color:var(--border-default)"><i class="fa-solid fa-diagram-project text-lg"></i></div>';
    return;
  }
  var html='';
  for(var i=0;i<workflowNodes.length;i++){
    var n=workflowNodes[i];
    var cat=n.category||'';
    html+='<div class="collapsed-icon-item" draggable="true" ondragstart="handleWorkflowNodeDragStart(event,\''+n.id+'\')" onclick="selectWorkflowNode(\''+n.id+'\')" data-name="'+n.name+'" data-category="'+cat+'" data-side="left">';
    html+='<div class="w-9 h-9 rounded flex items-center justify-center" style="background:'+n.color+'20"><i class="fa-solid '+n.icon+' text-sm" style="color:'+n.color+'"></i></div>';
    html+='</div>';
  }
  container.innerHTML=html;
  // 绑定 tooltip 事件
  bindCollapsedTooltip(container,'left');
}

// 渲染右侧属性面板收缩态图标栏
function renderCollapsedPropertyBar(){
  var container=document.getElementById('collapsedPropertyIconList');
  if(!container)return;
  var currentNode=workflowNodes.find(function(n){return n.id===currentWorkflowNodeId;});
  if(!currentNode){
    container.innerHTML='<div class="text-center py-4" style="color:var(--border-default)"><i class="fa-solid fa-sliders text-lg"></i></div>';
    return;
  }
  var cat=currentNode.category||'';
  var html='';
  html+='<div class="collapsed-icon-item" onclick="togglePanel(\'property\')" data-name="'+currentNode.name+'" data-category="'+cat+'" data-side="right">';
  html+='<div class="w-9 h-9 rounded flex items-center justify-center" style="background:'+currentNode.color+'20"><i class="fa-solid '+currentNode.icon+' text-sm" style="color:'+currentNode.color+'"></i></div>';
  html+='</div>';
  container.innerHTML=html;
  bindCollapsedTooltip(container,'right');
}

// 绑定收缩态图标的 tooltip 事件
function bindCollapsedTooltip(container,side){
  var tooltip=document.getElementById('globalTooltip');
  if(!tooltip)return;
  var items=container.querySelectorAll('.collapsed-icon-item');
  for(var i=0;i<items.length;i++){
    (function(item){
      item.addEventListener('mouseenter',function(e){
        var name=item.getAttribute('data-name')||'';
        var cat=item.getAttribute('data-category')||'';
        document.getElementById('globalTooltipName').textContent=name;
        var catEl=document.getElementById('globalTooltipCategory');
        catEl.textContent=cat;
        catEl.style.display=cat?'':'none';
        // 设置箭头方向
        tooltip.className='collapsed-icon-tooltip '+(side==='left'?'arrow-left':'arrow-right')+' visible';
        // 计算位置
        var rect=item.getBoundingClientRect();
        if(side==='left'){
          tooltip.style.left=(rect.right+10)+'px';
        }else{
          tooltip.style.left='';
          tooltip.style.right=(window.innerWidth-rect.left+10)+'px';
        }
        tooltip.style.top=(rect.top+rect.height/2)+'px';
        tooltip.style.transform='translateY(-50%)';
      });
      item.addEventListener('mouseleave',function(){
        tooltip.classList.remove('visible');
      });
    })(items[i]);
  }
}

// ===== 左侧面板 Tab 切换 =====
var CURRENT_LEFT_TAB='orchestrate';
function switchLeftTab(tab){
  CURRENT_LEFT_TAB=tab;
  // 切换 tab 样式
  var tabs=['orchestrate','routing','detection'];
  tabs.forEach(function(t){
    var btn=document.getElementById('tab'+t.charAt(0).toUpperCase()+t.slice(1));
    var content=document.getElementById('tabContent'+t.charAt(0).toUpperCase()+t.slice(1));
    if(t===tab){
      btn.style.color='var(--brand)';
      btn.style.borderBottomColor='var(--brand)';
      btn.style.borderBottomWidth='2px';
      btn.style.background='var(--surface-base)';
      btn.style.fontWeight='600';
      content.style.display='flex';
    }else{
      btn.style.color='var(--text-tertiary)';
      btn.style.borderBottomColor='transparent';
      btn.style.borderBottomWidth='2px';
      btn.style.background='transparent';
      btn.style.fontWeight='400';
      content.style.display='none';
    }
  });
  // 切换时刷新
  if(tab==='routing')refreshRoutingPanel();
  if(tab==='detection'&&document.getElementById('detectionResultPanel').querySelector('.detection-issue-item')){}
}
