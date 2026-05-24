// ===== 模块 5: 工作流节点管理 =====
// 来源: assembly.html 行 1395-2523

// ===== 工作流节点管理 =====
// 导入业务流程
function importBusinessFlow(){
  console.log('[importBusinessFlow] 函数被调用');
  console.log('[importBusinessFlow] selectedDemand:', selectedDemand);
  
  if(!selectedDemand){
    toast('请先在顶部搜索框选择需求','warning');
    // 自动聚焦搜索框，引导用户操作
    var searchInput = document.getElementById('demandSearchInput');
    if(searchInput) searchInput.focus();
    return;
  }
  
  console.log('[importBusinessFlow] 创建文件输入框');
  
  // 创建文件选择对话框
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e){
    console.log('[importBusinessFlow] 文件选择变化:', e.target.files);
    var file = e.target.files[0];
    if(!file){
      console.log('[importBusinessFlow] 没有选择文件');
      return;
    }
    
    console.log('[importBusinessFlow] 开始读取文件:', file.name);
    
    var reader = new FileReader();
    reader.onload = function(e){
      try{
        var flowData = JSON.parse(e.target.result);
        console.log('导入的业务流程:', flowData);
        
        // 验证流程数据
        if(!flowData.flowId || !flowData.nodes){
          alert('流程文件格式不正确');
          return;
        }
        
        // 进入组件匹配页面
        showComponentMatching(flowData);
      }catch(err){
        alert('流程文件解析失败：'+err.message);
      }
    };
    reader.readAsText(file);
  };
  console.log('[importBusinessFlow] 触发文件选择对话框');
  input.click();
}

// 一键导入测试样例数据（跳过组件匹配，直接生成工作流节点）
function importTestFlowData(){
  if(!selectedDemand){
    toast('请先在顶部搜索框选择需求','warning');
    var searchInput=document.getElementById('demandSearchInput');
    if(searchInput) searchInput.focus();
    return;
  }

  var testData={
    flowId:'FLOW-OIL-PROD-001',flowName:'油井生产数据采集与智能分析',
    nodes:[
      // ===== Layer1: 井场采集层 (5个传感器节点, 不同协议/频率) =====
      {nodeId:'FN-001',nodeName:'抽油机载荷监测',nodeType:'采集',componentId:'C001',type:'业务组件',icon:'fa-oil-well',color:'var(--brand)',category:'油气生产经营',
        config:{'油井编号':'CY-PE-0152','采油方式':'游梁式抽油机','采集协议':'Modbus TCP','采集频率':'1 秒','数据源':'RTU 远传','冲程(m)': 3.6,'冲次(次/min)': 4.5,'载荷上限(kN)':120,'载荷下限(kN)':20,'超时阈值(ms)':2000,'断线重连次数':5,'数据压缩':'LZ4'}},
      {nodeId:'FN-002',nodeName:'井口压力监测',nodeType:'采集',componentId:'C007',type:'业务组件',icon:'fa-gauge',color:'var(--brand)',category:'油气生产经营',
        config:{'传感器型号':'Rosemount 3051S','通信协议':'HART','采样频率':'100ms','量程上限(MPa)':25,'量程下限(MPa)':0,'精度等级':'0.075级','油压(MPa)':1.85,'套压(MPa)':0.92,'井口回压(MPa)':0.45,'异常过滤':'3σ 检测'}},
      {nodeId:'FN-003',nodeName:'电参综合采集',nodeType:'采集',componentId:'C015',type:'业务组件',icon:'fa-bolt',color:'var(--brand)',category:'油气新能源',
        config:{'采集设备':'多功能电表','采样频率':'1 秒','CT 变比':200,'PT 变比':10000,'通信协议':'Modbus RTU','A相电流(A)':68.5,'B相电流(A)':65.2,'C相电流(A)':67.8,'线电压(V)':11400,'有功功率(kW)':1250,'功率因数':0.78,'谐波分析':'2~31 次','相序':'正序'}},
      {nodeId:'FN-004',nodeName:'温度场监测',nodeType:'采集',componentId:'C014',type:'业务组件',icon:'fa-thermometer-half',color:'var(--brand)',category:'油气新能源',
        config:{'传感器型号':'PT100 A 级','测温原理':'PT100','采集频率':'5 秒','测温范围(℃)':'-40~150','接线方式':'三线制','井口温度(℃)':72.5,'管线温度(℃)':65.8,'环境温度(℃)':28.3,'电机温度(℃)':85.0,'轴承温度(℃)':62.1,'报警阈值(℃)':95}},
      {nodeId:'FN-005',nodeName:'产液量计量',nodeType:'采集',componentId:'C001',type:'业务组件',icon:'fa-water',color:'var(--brand)',category:'油气生产经营',
        config:{'计量方式':'翻斗计量','仪表型号':'LFX-1000','通信协议':'RS485 Modbus','采样频率':'1 分钟','日产液量(t)':35.6,'日产油量(t)':22.4,'日产水量(t)':13.2,'含水率(%)':37.1,'气油比(m³/t)':45,'计量精度':'0.2级'}},
      // ===== Layer2: 边缘汇聚层 =====
      {nodeId:'FN-006',nodeName:'RTU 数据汇聚网关',nodeType:'汇聚',componentId:'C001',type:'业务组件',icon:'fa-server',color:'var(--brand)',category:'油气生产经营',
        config:{'设备型号':'R2000 RTU','上行协议':'MQTT v5','下行接口':'RS485/HART/Modbus','数据缓存(capacity)':'72h','断线续传':'启用','时钟同步':'NTP','采集周期':'5 秒','上行频率':'30 秒','边缘计算':'载荷循环特征提取'}},
      // ===== Layer3: 平台处理层 =====
      {nodeId:'FN-007',nodeName:'数据清洗与质量校验',nodeType:'处理',componentId:'C016',type:'数据组件',icon:'fa-filter',color:'var(--success)',category:'数据服务',
        config:{'清洗策略':'组合策略','缺失值处理':'线性插值','质量阈值(%)':90,'滑动窗口大小':5,'是否去重':'是','单位换算':'自动检测','越限标记':'启用','异常值处理':'3σ 剔除','数据完整率(%)':99.5}},
      {nodeId:'FN-008',nodeName:'时序数据存储(TSDB)',nodeType:'存储',componentId:'C022',type:'数据组件',icon:'fa-database',color:'var(--success)',category:'数据服务',
        config:{'存储引擎':'TDengine','数据保留天数':730,'压缩算法':'ZSTD','写入模式':'批量写入(1s)','分表策略':'按设备+时间','超表(SuperTable)名':'st_well_prod_monitor','副本数':1,'缓存(GB)':32}},
      // ===== Layer4: 分析处理层（并行分支） =====
      {nodeId:'FN-009',nodeName:'产液量动态分析',nodeType:'分析',componentId:'C017',type:'数据组件',icon:'fa-chart-line',color:'var(--success)',category:'数据服务',
        config:{'分析方法':'基于时序预测','预测步长':'24 小时','检泵周期(days)':420,'产液趋势':'递减','递减率(%)/月':2.8,'含水率趋势':'上升','载荷利用率(%)':72,'泵效(%)':68.5,'功图分析':'正常'}},
      {nodeId:'FN-010',nodeName:'抽油机工况诊断',nodeType:'模型',componentId:'C019',type:'模型组件',icon:'fa-brain',color:'oklch(55% 0.22 315)',category:'分析决策',
        config:{'模型算法':'CNN-LSTM','预测窗口':'72h','诊断类型':'抽油泵工况, 杆柱受力, 电机状态, 皮带磨损','置信度阈值(%)':85,'训练样本数':80000,'模型精度(%)':94.2,'推理延迟要求(ms)':100,'部署方式':'云端推理','输入特征':'载荷时序,电参,温度','特征维度':12}},
      {nodeId:'FN-011',nodeName:'皮带磨损预测',nodeType:'模型',componentId:'C018',type:'模型组件',icon:'fa-heartbeat',color:'oklch(55% 0.22 315)',category:'分析决策',
        config:{'模型算法':'XGBoost','输入特征':'振动RMS,电流波动,皮带温度,运行天数','评分方法':'加权综合评判','正常阈值(分)':85,'注意阈值(分)':65,'异常阈值(分)':45,'剩余寿命预测':'启','模型更新策略':'在线增量','推理方式':'边缘推理'}},
      // ===== Layer5: 告警与业务应用层 =====
      {nodeId:'FN-012',nodeName:'多级预警通知',nodeType:'告警',componentId:'C021',type:'规则组件',icon:'fa-envelope',color:'var(--warning)',category:'炼化新材料',
        config:{'通知渠道':'企业微信,短信,邮件,语音电话','预警规则':'泵效<60% → 一级告警, 载荷异常波动>30% → 二级告警, 温度>90℃ → 紧急, 预测故障概率>85% → 预警','通知对象':'采油班长, 设备主管, 生产调度','冷却时间(分钟)':15,'消息模板':'详细版（含趋势图）','附件生成':'趋势截图','告警分级':'一级/二级/三级'}},
      {nodeId:'FN-013',nodeName:'维保工单闭环',nodeType:'业务',componentId:'C009',type:'业务组件',icon:'fa-clipboard-check',color:'var(--brand)',category:'油气新能源',
        config:{'工单来源':'自动生成','优先级规则':'紧急告警→紧急(2h), 一级预警→高(8h), 二级预警→中(24h), 三级→低(72h)','派单策略':'技能匹配+就近派单','SLA 时效(h)':2,'工单流转节点':'待派单→已派单→执行中→待验收→已完成→评估归档','关联系统':'EAM 系统','照片/附件':'必填','完工确认':'现场拍照+电子签名','巡检周期(days)':7}}
    ],
    edges:[
      // Layer1→Layer2: 5个采集节点汇聚到RTU
      {from:'FN-001',to:'FN-006'},{from:'FN-002',to:'FN-006'},{from:'FN-003',to:'FN-006'},{from:'FN-004',to:'FN-006'},{from:'FN-005',to:'FN-006'},
      // Layer2→Layer3: RTU→清洗→存储（串行）
      {from:'FN-006',to:'FN-007'},{from:'FN-007',to:'FN-008'},
      // Layer3→Layer4: 存储分叉到3条并行分析链路
      {from:'FN-008',to:'FN-009'},{from:'FN-008',to:'FN-010'},{from:'FN-008',to:'FN-011'},
      // Layer4→Layer5: 3条分析链路汇聚到预警
      {from:'FN-009',to:'FN-012'},{from:'FN-010',to:'FN-012'},{from:'FN-011',to:'FN-012'},
      // Layer5→Layer6: 预警→工单
      {from:'FN-012',to:'FN-013'}
    ]
  };

  window.currentFlowData=testData;

  // 直接生成工作流节点（跳过组件匹配）
  workflowNodes=testData.nodes.map(function(node,index){
    var component=componentLibrary.find(function(c){return c.id===node.componentId;});
    return {
      id:'WFN-'+String(index+1).padStart(3,'0'),
      flowNodeId:node.nodeId,
      flowId:testData.flowId,
      componentId:node.componentId,
      name:node.nodeName,
      type:node.type||'业务组件',
      icon:node.icon||(component?component.icon:'fa-cube'),
      color:node.color||(component?component.color:'var(--brand)'),
      category:node.category||(component?component.category:'业务组件'),
      config:node.config||{},
      demandId:selectedDemand.id
    };
  });

  renderWorkflowNodeList();
  updateDemandStatusDisplay();

  // 解锁画布并自动装配
  canvasUnlocked=true;
  document.getElementById('canvasMask').style.display='none';
  clearCanvasNodes();

  // 工业级拓扑布局：
  //   Layer1: 5个采集节点（载荷/压力/电参/温度/产液量）
  //   Layer2: RTU 数据汇聚（居中）
  //   Layer3: 数据清洗（居中）
  //   Layer4: 时序存储（居中）
  //   Layer5: 产液分析(左) / 工况诊断(中) / 皮带预测(右) — 并行3分支
  //   Layer6: 多级预警（居中，接收3条输入）
  //   Layer7: 维保工单（居中）
  var NODE_W = 256;
  var LAYER_GAP = 280;
  var LAYER1_Y = 60;
  var CENTER_X = 40 + 2 * (NODE_W + 30); // 616
  var LEFT_X = 40 + 1 * (NODE_W + 30);    // 326
  var RIGHT_X = 40 + 3 * (NODE_W + 30);   // 898
  var FAR_LEFT = 40;
  var layoutMap = {
    // Layer1: 5个采集节点
    'WFN-001': [FAR_LEFT,                          LAYER1_Y],
    'WFN-002': [FAR_LEFT + 1 * (NODE_W + 30),      LAYER1_Y],
    'WFN-003': [FAR_LEFT + 2 * (NODE_W + 30),      LAYER1_Y],
    'WFN-004': [FAR_LEFT + 3 * (NODE_W + 30),      LAYER1_Y],
    'WFN-005': [FAR_LEFT + 4 * (NODE_W + 30),      LAYER1_Y],
    // Layer2: RTU 汇聚
    'WFN-006': [CENTER_X,                           LAYER1_Y + LAYER_GAP],
    // Layer3: 数据清洗
    'WFN-007': [CENTER_X,                           LAYER1_Y + 2 * LAYER_GAP],
    // Layer4: 时序存储
    'WFN-008': [CENTER_X,                           LAYER1_Y + 3 * LAYER_GAP],
    // Layer5: 并行3路分析
    'WFN-009': [LEFT_X,                             LAYER1_Y + 4 * LAYER_GAP],
    'WFN-010': [CENTER_X,                           LAYER1_Y + 4 * LAYER_GAP],
    'WFN-011': [RIGHT_X,                            LAYER1_Y + 4 * LAYER_GAP],
    // Layer6: 多级预警（居中接收3路输入）
    'WFN-012': [CENTER_X,                           LAYER1_Y + 5 * LAYER_GAP],
    // Layer7: 维保工单
    'WFN-013': [CENTER_X,                           LAYER1_Y + 6 * LAYER_GAP]
  };

  workflowNodes.forEach(function(n){
    var pos=layoutMap[n.id]||[100,200];
    addNodeToCanvasWithPosition(n.type,n.name,n.color,n.icon,n.id,pos[0],pos[1]);
  });

  // 绘制连线
  if(window._canvasNodes) window._canvasNodes=[];
  testData.edges.forEach(function(edge){
    var fromNode=workflowNodes.find(function(n){return n.flowNodeId===edge.from;});
    var toNode=workflowNodes.find(function(n){return n.flowNodeId===edge.to;});
    if(fromNode&&toNode){
      addConnection(fromNode.id,toNode.id);
    }
  });

  triggerAutoSave();
  toast('已导入 '+workflowNodes.length+' 个节点（油井生产数据采集与智能分析）','success');
}

// 显示组件匹配页面
function showComponentMatching(flowData){
  // 创建模态框
  var modal = document.createElement('div');
  modal.id = 'componentMatchingModal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-45 flex items-center justify-center';
  modal.style.zIndex = '3000';
  
  var html = '<div class="bg-white rounded-lg w-[1000px] max-h-[85vh] overflow-hidden flex flex-col">';
  
  // 标题
  html += '<div class="px-6 py-4 border-b flex items-center justify-between" style="border-color:var(--border-default)">';
  html += '<div>';
  html += '<h3 class="text-lg font-semibold">组件匹配 - '+flowData.flowName+'</h3>';
  html += '<div class="text-xs" style="color:var(--text-tertiary)">为每个流程节点选择合适的组件</div>';
  html += '</div>';
  html += '<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100" onclick="closeComponentMatching()">';
  html += '<i class="fa-solid fa-xmark"></i></button>';
  html += '</div>';
  
  // 节点列表
  html += '<div class="flex-1 overflow-y-auto p-6" style="background:var(--surface-subtle)">';
  flowData.nodes.forEach(function(node, index){
    // 判断是否为网关节点
    var isGateway = node.nodeType && node.nodeType.indexOf('gateway') >= 0;
    
    html += '<div class="mb-4 p-4 bg-white border rounded-lg" style="border-color:var(--border-default)">';
    html += '<div class="flex items-start gap-3">';
    
    // 序号和图标
    if(isGateway){
      html += '<div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background:var(--warning);color:var(--text-inverse);font-weight:600"><i class="fa-solid fa-code-branch text-xs"></i></div>';
    }else{
      html += '<div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style="background:var(--brand);color:var(--text-inverse);font-weight:600">'+(index+1)+'</div>';
    }
    
    // 节点信息
    html += '<div class="flex-1">';
    html += '<div class="font-semibold mb-2">'+node.nodeName+' <span class="text-xs font-normal" style="color:var(--text-tertiary)">('+node.nodeType+')</span>';
    if(isGateway){
      html += '<span class="text-xs" style="color:var(--warning);margin-left:8px"><i class="fa-solid fa-code-branch"></i> 网关节点</span>';
    }
    html += '</div>';
    
    // 功能要求
    if(!isGateway){
      html += '<div class="text-xs mb-2" style="color:var(--text-secondary)">';
      html += '<b>功能：</b>'+(node.requirements?node.requirements.function:'无')+'<br>';
      if(node.requirements && node.requirements.performance){
        html += '<b>性能：</b>'+node.requirements.performance+'<br>';
      }
      html += '<b>输入：</b>'+(node.inputs?node.inputs.map(function(i){return i.name}).join('、'):'无')+'<br>';
      html += '<b>输出：</b>'+(node.outputs?node.outputs.map(function(o){return o.name}).join('、'):'无');
      html += '</div>';
    }
    
    // 网关节点特殊处理
    if(isGateway){
      html += '<div class="gateway-config-section mt-2 p-3" style="background:var(--amber-subtle);border:1px solid var(--warning);border-radius:4px">';
      html += '<div class="text-xs font-semibold mb-2" style="color:var(--warning)"><i class="fa-solid fa-code-branch mr-1"></i>分支条件配置</div>';
      if(node.conditions && node.conditions.length>0){
        node.conditions.forEach(function(cond, idx){
          html += '<div class="mb-2 text-xs">';
          html += '<span style="color:var(--text-secondary)">分支'+(idx+1)+'：</span>';
          html += '<input type="text" class="input" value="'+cond.expression+'" style="width:300px;display:inline-block" />';
          html += '<span style="color:var(--text-secondary);margin:0 8px">→</span>';
          html += '<span style="color:var(--text-primary)">'+cond.nextNode+'</span>';
          html += '</div>';
        });
      }else{
        html += '<div class="text-xs" style="color:var(--text-tertiary)">无分支条件（直接复制业务流程结构）</div>';
      }
      html += '<div class="text-xs mt-2" style="color:var(--text-tertiary)"><i class="fa-solid fa-circle-info mr-1"></i>网关节点不需要关联组件，将直接复制到技术流程</div>';
      html += '</div>';
    }else{
      // 普通节点：支持多组件、数据映射、失败处理
      
      // 1. 多组件配置
      html += '<div class="mt-2">';
      html += '<div class="flex items-center justify-between mb-1">';
      html += '<label class="text-xs font-medium" style="color:var(--text-secondary)">关联组件（支持多个）</label>';
      html += '<div class="flex gap-2">';
      html += '<button class="btn btn-outline btn-sm" onclick="addSequentialComponent(this)" style="font-size:11px;padding:2px 8px"><i class="fa-solid fa-arrow-right mr-1"></i>添加串行</button>';
      html += '<button class="btn btn-outline btn-sm" onclick="addParallelComponent(this)" style="font-size:11px;padding:2px 8px"><i class="fa-solid fa-arrows-left-right mr-1"></i>添加并行</button>';
      html += '</div>';
      html += '</div>';
      
      // 组件序列列表
      html += '<div class="component-sequence-list" data-node-id="'+node.nodeId+'">';
      html += '<div class="component-sequence-item" data-sequence="1" data-parallel-group="">';
      html += '<div class="flex items-center gap-2 mb-2">';
      html += '<span class="text-xs font-semibold" style="color:var(--brand)">串行 1</span>';
      html += '<select class="input component-match-select" style="flex:1" data-node-id="'+node.nodeId+'" data-node-name="'+node.nodeName+'" data-sequence="1" data-parallel-group="" onchange="onComponentSelect(this)">';
      html += '<option value="">请选择组件...</option>';
      var matchedComponents = matchComponentsForNode(node);
      matchedComponents.forEach(function(c){
        html += '<option value="'+c.id+'" data-match="'+c.matchScore+'">'+c.name+' ['+c.category+'] - 匹配度'+c.matchScore+'%</option>';
      });
      html += '</select>';
      html += '<button class="btn btn-outline btn-sm" onclick="removeSequence(this)" style="width:28px;height:28px;padding:0">×</button>';
      html += '</div>';
      html += '<div class="component-match-result"></div>';
      html += '</div>';
      html += '</div>';
      
      // 2. 数据映射配置
      html += '<div class="mt-3 p-3" style="background:var(--surface-subtle);border-radius:4px">';
      html += '<div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)"><i class="fa-solid fa-arrow-right-arrow-left mr-1"></i>数据转换映射</div>';
      if(node.outputs && node.outputs.length>0){
        node.outputs.forEach(function(output, idx){
          html += '<div class="flex items-center gap-2 mb-2 text-xs">';
          html += '<span style="color:var(--text-tertiary);width:80px">业务数据：</span>';
          html += '<span style="color:var(--text-primary)">'+output.code+'</span>';
          html += '<span style="color:var(--text-tertiary)">→</span>';
          html += '<select class="input" style="width:150px"><option value="">选择组件输入</option></select>';
          html += '<input type="text" class="input" placeholder="转换表达式：${business.amount * 100}" style="flex:1" />';
          html += '</div>';
        });
      }else{
        html += '<div class="text-xs" style="color:var(--text-tertiary)">该节点无输出数据</div>';
      }
      html += '</div>';
      
      // 3. 失败处理配置
      html += '<div class="mt-3">';
      html += '<label class="text-xs font-medium block mb-1" style="color:var(--text-secondary)">失败处理策略</label>';
      html += '<select class="input" onchange="toggleCompensationConfig(this)">';
      html += '<option value="none">不处理（默认）</option>';
      html += '<option value="retry">重试</option>';
      html += '<option value="compensate">补偿</option>';
      html += '<option value="fallback">降级</option>';
      html += '</select>';
      
      // 补偿配置（默认隐藏）
      html += '<div class="compensation-config mt-2 p-2" style="background:var(--danger-subtle);border:1px solid var(--danger);border-radius:4px;display:none">';
      html += '<div class="text-xs font-semibold mb-2" style="color:var(--danger)"><i class="fa-solid fa-triangle-exclamation mr-1"></i>补偿组件配置</div>';
      html += '<label class="text-xs block mb-1" style="color:var(--text-secondary)">补偿组件</label>';
      html += '<select class="input w-full compensation-component-select">';
      html += '<option value="">请选择补偿组件...</option>';
      // 这里可以过滤出补偿类组件
      html += '<option>数据采集回滚</option>';
      html += '<option>告警通知</option>';
      html += '</select>';
      html += '</div>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';
  
  // 底部按钮
  html += '<div class="px-6 py-4 border-t flex justify-end gap-2" style="border-color:var(--border-default)">';
  html += '<button class="btn btn-outline" onclick="closeComponentMatching()">取消</button>';
  html += '<button class="btn btn-primary" id="confirmAssemblyBtn" data-flow-id="'+flowData.flowId+'">';
  html += '<i class="fa-solid fa-check mr-1"></i>确认并装配';
  html += '</button>';
  html += '</div>';
  html += '</div>';
  
  modal.innerHTML = html;
  document.body.appendChild(modal);
  
  // 保存 flowData 到全局变量
  window.currentFlowData = flowData;
  
  // 绑定确认按钮事件
  document.getElementById('confirmAssemblyBtn').addEventListener('click', function(){
    var flowId = this.getAttribute('data-flow-id');
    console.log('[confirmAssemblyBtn click] flowId:', flowId);
    confirmAssembly(flowId);
  });
}

// 智能匹配组件
function matchComponentsForNode(node){
  var keywords = [];
  if(node.requirements && node.requirements.function){
    keywords = node.requirements.function.split(/[,,]/);
  }
  if(node.nodeName){
    keywords.push(node.nodeName);
  }
  
  // 使用全局组件库变量
  var lib = (typeof componentLibrary !== 'undefined') ? componentLibrary : window.componentLibrary;
  if(!lib || lib.length === 0){
    console.warn('[matchComponentsForNode] 组件库为空');
    return [];
  }
  
  var matched = lib.filter(function(c){
    var score = 0;
    keywords.forEach(function(k){
      if(!k) return;
      k = k.trim();
      if(c.name.indexOf(k)>=0) score += 30;
      if(c.desc && c.desc.indexOf(k)>=0) score += 20;
      if(c.category && c.category.indexOf(k)>=0) score += 10;
    });
    
    // 检查输入输出匹配
    if(node.inputs && node.inputs.length>0){
      var inputMatch = node.inputs.some(function(i){
        return c.dataItems && c.dataItems.some(function(d){
          return d.code && d.code.indexOf(i.code)>=0;
        });
      });
      if(inputMatch) score += 30;
    }
    
    return score >= 30; // 匹配度≥30% 才推荐
  }).map(function(c){
    // 计算匹配度
    var score = 0;
    keywords.forEach(function(k){
      if(!k) return;
      k = k.trim();
      if(c.name.indexOf(k)>=0) score += 30;
      if(c.desc && c.desc.indexOf(k)>=0) score += 20;
    });
    if(node.inputs && node.inputs.length>0){
      var inputMatch = node.inputs.some(function(i){
        return c.dataItems && c.dataItems.some(function(d){
          return d.code && d.code.indexOf(i.code)>=0;
        });
      });
      if(inputMatch) score += 30;
    }
    return {id:c.id, name:c.name, category:c.category, matchScore:Math.min(score,100), original:c};
  });
  
  return matched.sort(function(a,b){return b.matchScore-a.matchScore;});
}

// 组件选择变化
function onComponentSelect(select){
  var resultDiv = select.parentElement.querySelector('.component-match-result');
  if (!resultDiv) return; // 如果元素不存在，直接返回
  
  var selectedOption = select.options[select.selectedIndex];
  var matchScore = selectedOption.getAttribute('data-match');
  
  if(select.value){
    resultDiv.innerHTML = '<div class="text-xs" style="color:var(--success)"><i class="fa-solid fa-check-circle"></i> 已选择，匹配度'+matchScore+'%</div>';
  }else{
    resultDiv.innerHTML = '';
  }
}

// 添加串行组件
function addSequentialComponent(btn){
  var sequenceList = btn.closest('.mb-4').querySelector('.component-sequence-list');
  var sequenceItems = sequenceList.querySelectorAll('.component-sequence-item');
  var newSequenceNum = sequenceItems.length + 1;
  
  var newItem = document.createElement('div');
  newItem.className = 'component-sequence-item';
  newItem.setAttribute('data-sequence', newSequenceNum);
  newItem.setAttribute('data-parallel-group', '');
  newItem.innerHTML = '<div class="flex items-center gap-2 mb-2">'+
    '<span class="text-xs font-semibold" style="color:var(--brand)">串行'+newSequenceNum+'</span>'+
    '<select class="input component-match-select" style="flex:1" data-node-id="'+btn.closest('.mb-4').querySelector('[data-node-id]').getAttribute('data-node-id')+'" data-sequence="'+newSequenceNum+'" data-parallel-group="" onchange="onComponentSelect(this)">'+
    '<option value="">请选择组件...</option>'+
    '</select>'+
    '<button class="btn btn-outline btn-sm" onclick="removeSequence(this)" style="width:28px;height:28px;padding:0">×</button>'+
    '</div>'+
    '<div class="component-match-result"></div>';
  
  sequenceList.appendChild(newItem);
}

// 添加并行组件
function addParallelComponent(btn){
  var sequenceList = btn.closest('.mb-4').querySelector('.component-sequence-list');
  var sequenceItems = sequenceList.querySelectorAll('.component-sequence-item');
  var newSequenceNum = sequenceItems.length + 1;
  var parallelGroupId = 'PG-' + Date.now();
  
  var newItem = document.createElement('div');
  newItem.className = 'component-sequence-item';
  newItem.setAttribute('data-sequence', newSequenceNum);
  newItem.setAttribute('data-parallel-group', parallelGroupId);
  newItem.innerHTML = '<div class="flex items-center gap-2 mb-2">'+
    '<span class="text-xs font-semibold" style="color:oklch(55% 0.22 315)"><i class="fa-solid fa-arrows-left-right mr-1"></i>并行</span>'+
    '<select class="input component-match-select" style="flex:1" data-node-id="'+btn.closest('.mb-4').querySelector('[data-node-id]').getAttribute('data-node-id')+'" data-sequence="'+newSequenceNum+'" data-parallel-group="'+parallelGroupId+'" onchange="onComponentSelect(this)">'+
    '<option value="">请选择组件...</option>'+
    '</select>'+
    '<button class="btn btn-outline btn-sm" onclick="removeSequence(this)" style="width:28px;height:28px;padding:0">×</button>'+
    '</div>'+
    '<div class="component-match-result"></div>';
  
  sequenceList.appendChild(newItem);
}

// 删除组件序列
function removeSequence(btn){
  var sequenceList = btn.closest('.component-sequence-list');
  var items = sequenceList.querySelectorAll('.component-sequence-item');
  if(items.length <= 1){
    alert('至少保留一个组件');
    return;
  }
  btn.closest('.component-sequence-item').remove();
  
  // 重新编号
  items = sequenceList.querySelectorAll('.component-sequence-item');
  items.forEach(function(item, index){
    item.setAttribute('data-sequence', index+1);
    var seqSpan = item.querySelector('.text-xs.font-semibold');
    if(seqSpan){
      var parallelGroup = item.getAttribute('data-parallel-group');
      if(parallelGroup){
        seqSpan.innerHTML = '<i class="fa-solid fa-arrows-left-right mr-1"></i>并行';
        seqSpan.style.color = 'oklch(55% 0.22 315)';
      }else{
        seqSpan.innerHTML = '串行'+(index+1);
        seqSpan.style.color = 'var(--brand)';
      }
    }
  });
}

// 切换补偿配置显示
function toggleCompensationConfig(select){
  var compensationConfig = select.parentElement.querySelector('.compensation-config');
  if(select.value === 'compensate'){
    compensationConfig.style.display = 'block';
  }else{
    compensationConfig.style.display = 'none';
  }
}

// 关闭组件匹配
function closeComponentMatching(){
  var modal = document.getElementById('componentMatchingModal');
  if(modal){
    modal.remove();
  }
  window.currentFlowData = null;
}

// 确认并装配
function confirmAssembly(flowId){
  console.log('[confirmAssembly] 开始执行，flowId:', flowId);
  
  var selects = document.querySelectorAll('.component-match-select');
  var nodeComponentMap = {};
  var allSelected = true;
  
  console.log('[confirmAssembly] selects count:', selects.length);
  console.log('[confirmAssembly] currentFlowData:', window.currentFlowData);
  
  if(!window.currentFlowData){
    alert('流程数据丢失，请重新导入');
    return;
  }
  
  selects.forEach(function(sel){
    var nodeId = sel.getAttribute('data-node-id');
    var nodeName = sel.getAttribute('data-node-name');
    var componentId = sel.value;
    
    if(!componentId){
      allSelected = false;
      var resultDiv = sel.parentElement.querySelector('.component-match-result');
      if (resultDiv) {
        resultDiv.innerHTML = 
          '<div class="text-xs" style="color:var(--danger)"><i class="fa-solid fa-circle-exclamation"></i> 请为该节点选择组件</div>';
      }
    }else{
      nodeComponentMap[nodeId] = {componentId:componentId, nodeName:nodeName};
    }
  });
  
  if(!allSelected){
    alert('请为所有流程节点选择组件');
    return;
  }
  
  // 生成工作流节点
  var flowData = window.currentFlowData;
  workflowNodes = flowData.nodes.map(function(node, index){
    var nc = nodeComponentMap[node.nodeId];
    
    // 如果该节点没有选择组件，跳过
    if (!nc) {
      console.warn('[confirmAssembly] 节点未选择组件:', node.nodeId, node.nodeName);
      return null;
    }
    
    var component = componentLibrary.find(function(c){return c.id===nc.componentId;});
    
    return {
      id: 'WFN-'+String(index+1).padStart(3,'0'),
      flowNodeId: node.nodeId,
      flowId: flowId,
      componentId: nc.componentId,
      name: nc.nodeName,
      type: component?component.type:'业务组件',
      icon: component?component.icon:'fa-cube',
      color: component?component.color:'var(--brand)',
      category: component?component.category:'业务组件',
      config: {},
      demandId: selectedDemand.id
    };
  }).filter(function(node){return node !== null;}); // 过滤掉 null 值
  
  // 渲染工作流节点列表
  renderWorkflowNodeList();
  
  // 自动装配到画布（横向排列）
  canvasUnlocked = true;
  document.getElementById('canvasMask').style.display = 'none';
  clearCanvasNodes();
  
  workflowNodes.forEach(function(n, index){
    var component = componentLibrary.find(function(c){return c.id===n.componentId;});
    var x = 80 + index * 320;
    var y = 120;
    // 正确的参数顺序：type, name, color, icon, nodeId, x, y
    addNodeToCanvasWithPosition(
      n.type || '业务组件',  // type
      n.name || '未命名节点',  // name
      component ? component.color : 'var(--brand)',  // color
      component ? component.icon : 'fa-cube',  // icon
      n.id,  // nodeId
      x,  // x
      y   // y
    );
  });
  
  // 关闭弹窗
  closeComponentMatching();
  
  // 保存
  triggerAutoSave();
  
  toast('已导入'+workflowNodes.length+'个节点，装配完成','success');
}

function openWorkflowNodeModal(){
  if(!selectedDemand){alert('请先选择需求');return;}
  document.getElementById('workflowNodeModal').classList.remove('hidden');
  document.getElementById('workflowNodeModal').classList.add('flex');
  
  // 默认选中第一个节点类型（组件）
  selectedNodeType='component';
  selectedComponent=null;
  
  // 激活第一个节点类型按钮
  document.querySelectorAll('.node-type-item').forEach(item=>item.classList.remove('active'));
  var firstNodeTypeItem=document.querySelector('[data-type="component"]');
  if(firstNodeTypeItem){
    firstNodeTypeItem.classList.add('active');
    firstNodeTypeItem.style.borderLeftColor='var(--brand)';
    firstNodeTypeItem.style.background='var(--surface-base)';
  }
  
  // 渲染组件列表
  renderComponentSelectList('component','');
  updateSelectedComponentList();
  updateTempSaveCount();
}

function closeWorkflowNodeModal(){
  document.getElementById('workflowNodeModal').classList.add('hidden');
  document.getElementById('workflowNodeModal').classList.remove('flex');
}

function toggleMultiSelect(){
  var checkbox=document.getElementById('multiSelectCheckbox');
  isMultiSelectMode=checkbox.checked;
  if(!isMultiSelectMode){
    selectedComponentsTemp=[];
    updateSelectedComponentList();
  }
}

function selectNodeType(type,el){
  selectedNodeType=type;
  document.querySelectorAll('.node-type-item').forEach(item=>item.classList.remove('active'));
  el.classList.add('active');
  renderComponentSelectList(type,document.getElementById('componentSearchInput').value);
}

function renderComponentSelectList(type,keyword){
  var list=document.getElementById('componentSelectList');
  if(!type){list.innerHTML='<div class="text-center py-8" style="color:var(--text-tertiary)"><div class="text-xs">请先选择节点类型</div></div>';return;}
  var filtered=COMPONENT_LIBRARY.filter(function(c){
    if((c.componentType||c.type)!==type)return false;
    if(keyword&&c.name.indexOf(keyword)===-1)return false;
    return true;
  });
  filtered.sort(function(a,b){return b.relevance-a.relevance;});
  if(filtered.length===0){
    list.innerHTML='<div class="text-center py-8" style="color:var(--text-tertiary)"><div class="text-xs">暂无匹配组件</div></div>';
    return;
  }
  var html='';
  for(var i=0;i<filtered.length;i++){
    var c=filtered[i];
    var relClass=c.relevance>=85?'high':'';
    var relText=c.relevance>=85?'高相关':'相关';
    var isSelected=selectedComponentsTemp.some(function(sc){return sc.componentId===c.id;});
    html+='<div class="component-select-item'+(isSelected?' selected':'')+'" onclick="selectComponent(\''+c.id+'\',this)">';
    html+='<div class="w-10 h-10 rounded flex items-center justify-center flex-shrink-0" style="background:'+c.color+'20">';
    html+='<i class="fa-solid '+c.icon+' text-lg" style="color:'+c.color+'"></i></div>';
    html+='<div class="flex-1">';
    html+='<div class="flex items-center gap-2">';
    html+='<div class="text-xs font-medium">'+c.name+'</div>';
    html+='<span class="relevance-badge '+relClass+'">'+relText+'</span>';
    if(isSelected){
      html+='<span class="text-[10px] px-1.5 py-0.5 rounded" style="background:var(--brand);color:var(--text-inverse)"><i class="fa-solid fa-check"></i> 已选</span>';
    }
    html+='</div>';
    html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+c.category+'</div>';
    html+='</div>';
    html+='</div>';
  }
  list.innerHTML=html;
}

function searchComponents(keyword){
  if(selectedNodeType){
    renderComponentSelectList(selectedNodeType,keyword);
  }
}

function selectComponent(id,el){
  var comp=COMPONENT_LIBRARY.find(function(c){return c.id===id;});
  if(!comp)return;
  
  var index=selectedComponentsTemp.findIndex(function(sc){return sc.componentId===id;});
  
  if(index>=0){
    selectedComponentsTemp.splice(index,1);
  }else{
    if(isMultiSelectMode){
      selectedComponentsTemp.push({
        componentId:comp.id,
        name:comp.name,
        type:comp.type,
        icon:comp.icon,
        color:comp.color,
        category:comp.category,
        config:{}
      });
    }else{
      selectedComponentsTemp=[{
        componentId:comp.id,
        name:comp.name,
        type:comp.type,
        icon:comp.icon,
        color:comp.color,
        category:comp.category,
        config:{}
      }];
    }
  }
  
  renderComponentSelectList(selectedNodeType,document.getElementById('componentSearchInput').value);
  updateSelectedComponentList();
  updateTempSaveCount();  // 添加这行，更新按钮状态
}

function updateSelectedComponentList(){
  var list=document.getElementById('selectedComponentList');
  var countEl=document.getElementById('selectedCount');
  
  if(selectedComponentsTemp.length===0){
    countEl.textContent='0 个';
    list.innerHTML='<div class="text-center py-8" style="color:var(--text-tertiary)"><i class="fa-solid fa-shopping-cart text-2xl mb-2" style="color:var(--border-subtle)"></i><div class="text-xs">暂无已选组件</div><div class="text-[10px] mt-1">从左侧选择组件添加</div></div>';
    return;
  }
  
  countEl.textContent=selectedComponentsTemp.length+' 个';
  var html='';
  for(var i=0;i<selectedComponentsTemp.length;i++){
    var sc=selectedComponentsTemp[i];
    var hasConfig=Object.keys(sc.config).length>0;
    html+='<div class="p-3 mb-2 rounded border" style="background:var(--surface-base);border-color:var(--border-default)">';
    html+='<div class="flex items-start justify-between">';
    html+='<div class="flex items-center gap-2 flex-1">';
    html+='<div class="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style="background:'+sc.color+'20">';
    html+='<i class="fa-solid '+sc.icon+' text-sm" style="color:'+sc.color+'"></i></div>';
    html+='<div class="flex-1 min-w-0">';
    html+='<div class="text-xs font-medium truncate">'+sc.name+'</div>';
    html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+sc.category+'</div>';
    html+='</div></div>';
    html+='<div class="flex items-center gap-1">';
    if(hasConfig){
      html+='<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-green-100" style="color:var(--success)" title="已配置" onclick="event.stopPropagation();editTempComponent('+i+')"><i class="fa-solid fa-check text-xs"></i></button>';
    }else{
      html+='<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-blue-100" style="color:var(--brand)" title="配置" onclick="event.stopPropagation();configureTempComponent('+i+')"><i class="fa-solid fa-gear text-xs"></i></button>';
    }
    html+='<button class="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100" style="color:var(--danger)" title="移除" onclick="event.stopPropagation();removeTempComponent('+i+')"><i class="fa-solid fa-trash text-xs"></i></button>';
    html+='</div></div></div>';
  }
  list.innerHTML=html;
}

function configureTempComponent(index){
  var sc=selectedComponentsTemp[index];
  if(!sc)return;
  currentConfigComponent={index:index,config:{...sc.config}};
  var comp=COMPONENT_LIBRARY.find(function(c){return c.id===sc.componentId;});
  if(!comp)return;
  
  var content=document.getElementById('componentConfigContent');
  var html='<div class="mb-4"><div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">组件信息</div>';
  html+='<div class="flex items-center gap-3 p-3 rounded" style="background:var(--surface-subtle)">';
  html+='<div class="w-10 h-10 rounded flex items-center justify-center" style="background:'+comp.color+'20">';
  html+='<i class="fa-solid '+comp.icon+' text-lg" style="color:'+comp.color+'"></i></div>';
  html+='<div><div class="text-sm font-medium">'+comp.name+'</div><div class="text-xs" style="color:var(--text-tertiary)">'+comp.category+'</div></div></div></div>';
  
  if(comp.config&&comp.config.fields&&comp.config.fields.length>0){
    html+='<div class="mb-4"><div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">配置参数</div>';
    for(var i=0;i<comp.config.fields.length;i++){
      var f=comp.config.fields[i];
      var value=sc.config[f.name]||'';
      html+='<div class="mb-3"><label class="text-xs block mb-1 font-medium" style="color:var(--text-secondary)">'+f.name+'</label>';
      if(f.type==='select'){
        html+='<select class="input w-full" id="config_field_'+i+'">';
        for(var j=0;j<f.options.length;j++){
          var selected=f.options[j]===value?'selected':'';
          html+='<option '+selected+'>'+f.options[j]+'</option>';
        }
        html+='</select>';
      }else if(f.type==='number'){
        html+='<input type="number" class="input w-full" id="config_field_'+i+'" value="'+value+'">';
      }else{
        html+='<input type="text" class="input w-full" id="config_field_'+i+'" value="'+value+'">';
      }
      html+='</div>';
    }
    html+='</div>';
  }else{
    html+='<div class="text-center py-8" style="color:var(--text-tertiary)"><i class="fa-solid fa-circle-info text-2xl mb-2"></i><div class="text-xs">该组件无需配置参数</div></div>';
  }
  
  content.innerHTML=html;
  document.getElementById('componentConfigModal').classList.remove('hidden');
  document.getElementById('componentConfigModal').classList.add('flex');
}

function editTempComponent(index){
  configureTempComponent(index);
}

function confirmComponentConfig(){
  if(!currentConfigComponent)return;
  var sc=selectedComponentsTemp[currentConfigComponent.index];
  if(!sc)return;
  
  var comp=COMPONENT_LIBRARY.find(function(c){return c.id===sc.componentId;});
  if(comp&&comp.config&&comp.config.fields){
    for(var i=0;i<comp.config.fields.length;i++){
      var f=comp.config.fields[i];
      var input=document.getElementById('config_field_'+i);
      if(input){
        currentConfigComponent.config[f.name]=input.value;
      }
    }
  }
  
  sc.config=currentConfigComponent.config;
  updateSelectedComponentList();
  closeComponentConfigModal();
  toast('配置已暂存','success');
}

function closeComponentConfigModal(){
  document.getElementById('componentConfigModal').classList.add('hidden');
  document.getElementById('componentConfigModal').classList.remove('flex');
  currentConfigComponent=null;
}

function removeTempComponent(index){
  selectedComponentsTemp.splice(index,1);
  renderComponentSelectList(selectedNodeType,document.getElementById('componentSearchInput').value);
  updateSelectedComponentList();
  updateTempSaveCount();
}

function clearTempSave(){
  console.log('clearTempSave called');
  console.log('selectedComponentsTemp:', selectedComponentsTemp);
  console.log('tempSaveList:', tempSaveList);
  
  if(!confirm('确定清空所有暂存的配置吗？')){
    console.log('用户取消操作');
    return;
  }
  
  try{
    selectedComponentsTemp=[];
    tempSaveList=[];
    renderComponentSelectList(selectedNodeType,document.getElementById('componentSearchInput').value);
    updateSelectedComponentList();
    updateTempSaveCount();
    console.log('清空成功');
  }catch(e){
    console.error('清空暂存失败:',e);
    alert('清空暂存失败：'+e.message);
  }
}

function updateTempSaveCount(){
  console.log('updateTempSaveCount called');
  console.log('selectedComponentsTemp.length:', selectedComponentsTemp.length);
  console.log('tempSaveList.length:', tempSaveList.length);
  
  var countEl=document.getElementById('tempSaveCount');
  var clearBtn=document.getElementById('clearTempBtn');
  var saveBtn=document.getElementById('saveAllBtn');
  var totalCount=selectedComponentsTemp.length+tempSaveList.length;
  
  console.log('DOM elements:', {countEl, clearBtn, saveBtn});
  
  if(countEl){
    countEl.textContent=totalCount;
  }else{
    console.error('tempSaveCount element not found');
  }
  
  if(clearBtn){
    clearBtn.disabled=(totalCount===0);
    console.log('clearBtn.disabled:', clearBtn.disabled);
  }else{
    console.error('clearTempBtn element not found');
  }
  
  if(saveBtn){
    saveBtn.disabled=(selectedComponentsTemp.length===0);
    console.log('saveBtn.disabled:', saveBtn.disabled);
  }else{
    console.error('saveAllBtn element not found');
  }
}

function saveAllTempSave(){
  console.log('=== saveAllTempSave 开始执行 ===');
  console.log('selectedComponentsTemp:', selectedComponentsTemp);
  console.log('selectedDemand:', selectedDemand);
  
  if(!selectedDemand){
    console.error('未选择需求');
    toast('请先选择需求','error');
    return;
  }
  
  if(selectedComponentsTemp.length===0){
    console.warn('未选择组件');
    toast('请先选择组件','warning');
    return;
  }
  
  try{
    console.log('开始保存', selectedComponentsTemp.length, '个组件');
    
    for(var i=0;i<selectedComponentsTemp.length;i++){
      var sc=selectedComponentsTemp[i];
      var nodeId='WFN-'+String(workflowNodes.length+1).padStart(3,'0');
      workflowNodes.push({
        id:nodeId,nodeId:nodeId,componentId:sc.componentId,name:sc.name,type:sc.type,icon:sc.icon,color:sc.color,
        category:sc.category,config:sc.config,demandId:selectedDemand.id
      });
      console.log('添加节点:', nodeId, sc.name);
    }
    
    tempSaveList=tempSaveList.concat(selectedComponentsTemp);
    selectedComponentsTemp=[];
    
    console.log('工作流节点总数:', workflowNodes.length);
    
    renderWorkflowNodeList();
    updateDemandStatusDisplay();
    renderComponentSelectList(selectedNodeType,document.getElementById('componentSearchInput').value);
    updateSelectedComponentList();
    updateTempSaveCount();
    
    var count=workflowNodes.length;
    toast('已保存 '+count+' 个节点配置','success');
    triggerAutoSave();
    
    // ✅ 保存成功后自动解锁画布
    if(workflowNodes.length>0 && !canvasUnlocked){
      canvasUnlocked=true;
      document.getElementById('canvasMask').style.display='none';
      console.log('画布已解锁');
    }
    
    // 保存成功后自动关闭弹窗
    closeWorkflowNodeModal();
    
    console.log('=== saveAllTempSave 执行完成 ===');
  }catch(e){
    console.error('保存配置失败:',e);
    console.error('错误堆栈:',e.stack);
    toast('保存失败：'+e.message,'error');
  }
}

function renderWorkflowNodeList(){
  var list=document.getElementById('workflowNodeList');
  if(workflowNodes.length===0){
    list.innerHTML='<div class="text-center py-8" style="color:var(--text-tertiary)"><i class="fa-solid fa-diagram-project text-3xl mb-2" style="color:var(--border-subtle)"></i><div class="text-xs">暂无工作流节点</div><div class="text-[10px] mt-1">选择需求后添加节点</div></div>';
    return;
  }
  var html='';
  for(var i=0;i<workflowNodes.length;i++){
    var n=workflowNodes[i];
    var isSelected=currentWorkflowNodeId===n.id;
    html+='<div class="workflow-node-item'+(isSelected?' selected':'')+'" style="cursor:grab" draggable="true" ondragstart="handleWorkflowNodeDragStart(event,\''+n.id+'\')" onclick="selectWorkflowNode(\''+n.id+'\')">';
    html+='<div class="flex items-center gap-3">';
    html+='<div class="w-9 h-9 rounded flex items-center justify-center flex-shrink-0" style="background:'+n.color+'20">';
    html+='<i class="fa-solid '+n.icon+' text-sm" style="color:'+n.color+'"></i></div>';
    html+='<div class="flex-1">';
    html+='<div class="text-xs font-medium">'+n.name+'</div>';
    html+='<div class="text-[10px]" style="color:var(--text-tertiary)">'+n.category+'</div>';
    html+='</div>';
    html+='<div class="flex items-center gap-1">';
    html+='<button class="w-6 h-6 rounded flex items-center justify-center" style="color:var(--brand)" title="查看路由配置" onmouseenter="this.style.background=\'var(--brand-subtle)\'" onmouseleave="this.style.background=\'transparent\'" onclick="event.stopPropagation();goToRoutingForNode(\''+n.id+'\')"><i class="fa-solid fa-route text-[11px]"></i></button>';
    html+='<i class="fa-solid fa-grip-lines text-xs" style="color:var(--text-tertiary)"></i>';
    html+='</div></div></div>';
  }
  list.innerHTML=html;
  // 如果图标栏当前可见，同步更新
  var iconBar=document.getElementById('collapsedIconBar');
  if(iconBar&&iconBar.style.display==='flex'){
    renderCollapsedIconBar();
  }
  // 如果面板宽度小于 120，隐藏节点文字只留图标
  var panel=document.getElementById('workflowPanel');
  if(panel&&panel.style.display!=='none'&&panel.offsetWidth<120){
    var items=list.querySelectorAll('.workflow-node-item');
    for(var j=0;j<items.length;j++){
      var info=items[j].querySelector('.flex-1');
      var grip=items[j].querySelector('.fa-grip-lines');
      if(info)info.style.display='none';
      if(grip)grip.style.display='none';
      var iconDiv=items[j].querySelector('.w-9');
      if(iconDiv)iconDiv.style.margin='0 auto';
    }
  }
}

function selectWorkflowNode(nodeId){
  currentWorkflowNodeId=nodeId;
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;
  renderWorkflowNodeList();
  
  // 根据节点类型显示不同的属性面板
  if(node.type==='rule'){
    // 规则配置节点
    document.getElementById('workflowConfigPanel').style.display='none';
    document.getElementById('canvasNodePanel').style.display='flex';
    renderRuleConfigPanel(node);
  }else if(node.type==='data'){
    // 数据服务节点
    document.getElementById('workflowConfigPanel').style.display='none';
    document.getElementById('canvasNodePanel').style.display='flex';
    renderDataServicePanel(node);
  }else if(node.type==='model'){
    // 模型服务节点
    document.getElementById('workflowConfigPanel').style.display='none';
    document.getElementById('canvasNodePanel').style.display='flex';
    renderModelServicePanel(node);
  }else{
    // 组件节点（原有逻辑）
    document.getElementById('canvasNodePanel').style.display='none';
    document.getElementById('workflowConfigPanel').style.display='flex';
    document.getElementById('currentNodeInfo').textContent=node.name+' - '+node.category;
    renderWorkflowConfigContent(node);
  }
}

function renderWorkflowConfigContent(node){
  var comp=node.componentId?COMPONENT_LIBRARY.find(function(c){return c.id===node.componentId;}):null;
  var content=document.getElementById('workflowConfigContent');
  var html='';
  // 始终显示基本信息
  html+='<div class="mb-4"><div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">基本信息</div>';
  html+='<div class="form-group"><label class="text-xs block mb-1">节点名称</label><input type="text" class="input w-full" value="'+node.name+'" onchange="updateNodeName(\''+node.id+'\',this.value)"></div>';
  html+='<div class="form-group"><label class="text-xs block mb-1">节点类型</label><input type="text" class="input w-full" value="'+(node.category||node.type||'业务组件')+'" disabled></div>';
  html+='</div>';
  if(comp&&comp.config&&comp.config.fields&&comp.config.fields.length>0){
    html+='<div class="mb-4"><div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">配置参数</div>';
    for(var i=0;i<comp.config.fields.length;i++){
      var f=comp.config.fields[i];
      html+='<div class="form-group mb-3"><label class="text-xs block mb-1">'+f.name+'</label>';
      if(f.type==='select'){
        html+='<select class="input w-full" onchange="updateNodeConfig(\''+node.id+'\',\''+f.name+'\',this.value)">';
        for(var j=0;j<f.options.length;j++){html+='<option>'+f.options[j]+'</option>';}
        html+='</select>';
      }else if(f.type==='number'){
        html+='<input type="number" class="input w-full" onchange="updateNodeConfig(\''+node.id+'\',\''+f.name+'\',this.value)">';
      }else{
        html+='<input type="text" class="input w-full" onchange="updateNodeConfig(\''+node.id+'\',\''+f.name+'\',this.value)">';
      }
      html+='</div>';
    }
    html+='</div>';
  }
  html+='<div class="mb-4"><div class="text-xs font-semibold mb-2" style="color:var(--text-secondary)">数据映射</div>';
  html+='<div class="text-xs" style="color:var(--text-tertiary)">配置输入输出数据字段</div>';
  html+='<button class="btn btn-outline btn-sm w-full mt-2" onclick="showDataMapping(\''+node.id+'\')"><i class="fa-solid fa-arrow-right-arrow-left mr-1"></i>配置数据映射</button></div>';
  html+='<div class="flex gap-2 pt-2 border-t" style="border-color:var(--border-default)">';
  html+='<button class="flex-1 btn btn-outline btn-sm" onclick="removeWorkflowNode(\''+node.id+'\')"><i class="fa-solid fa-trash"></i> 删除节点</button>';
  html+='</div>';
  content.innerHTML=html;
}

function updateNodeName(nodeId,newName){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(node){node.name=newName;renderWorkflowNodeList();triggerAutoSave();}
}

function updateNodeConfig(nodeId,field,value){
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(node){if(!node.config)node.config={};node.config[field]=value;triggerAutoSave();}
}

function completeWorkflowConfig(){
  // 画布已经自动解锁，这个函数保留作为提示
  if(!currentWorkflowNodeId)return;
  toast('画布已解锁，可以拖动节点到画布中配置','info');
}

function removeWorkflowNode(nodeId){
  if(!confirm('确定删除该工作流节点？'))return;
  // 从左侧工作流列表移除
  workflowNodes=workflowNodes.filter(function(n){return n.id!==nodeId;});
  // 从画布移除 DOM 节点
  var canvasNode=document.querySelector('[data-node-id="'+nodeId+'"]');
  if(canvasNode)canvasNode.remove();
  // 移除相关连接
  nodeConnections=nodeConnections.filter(function(c){return c.from!==nodeId&&c.to!==nodeId;});
  // 清除选中的节点引用
  if(selectedNode&&selectedNode.getAttribute('data-node-id')===nodeId)selectedNode=null;
  currentWorkflowNodeId=null;
  renderWorkflowNodeList();
  renderConnections();
  updateDemandStatusDisplay();
  document.getElementById('workflowConfigPanel').style.display='none';
  document.getElementById('canvasNodePanel').style.display='flex';
  triggerAutoSave();
}
