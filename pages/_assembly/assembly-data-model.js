// =============================================================================
// 模块 1: assembly-data-model.js
// 来源: assembly.html
// 行号范围:
//   - 612-621 : DATA_ITEM_LIBRARY 定义
//   - 624-659 : switchTab, filterComponents, handleWorkflowNodeDragStart 函数
//   - 692-844 : componentLibrary, COMPONENT_LIBRARY 定义
//   - 847-883 : normalizeDemands 函数
//   - 886-906 : DEMANDS, REVIEWED_DEMANDS, selectedDemand
//   - 908-1134: showDemandDropdown, selectDemand, clearSelectedDemand, toggleExpand,
//               highlightKeyword, buildDemandTree, renderDemandTree, renderDemandRow,
//               searchDemands
//   - 2933-2955: componentHotspotConfig 变量
// =============================================================================

// ===== 行 612-621 =====
var DATA_ITEM_LIBRARY=[
  {id:'DI001',name:'今日产量',code:'production.today',type:'number',unit:'吨',source:'生产数据库',category:'生产数据'},
  {id:'DI002',name:'设备运行率',code:'device.rate',type:'percent',unit:'%',source:'设备监控系统',category:'设备数据'},
  {id:'DI003',name:'压力值',code:'pressure.value',type:'number',unit:'MPa',source:'传感器',category:'实时数据'},
  {id:'DI004',name:'温度值',code:'temperature.value',type:'number',unit:'℃',source:'传感器',category:'实时数据'},
  {id:'DI005',name:'流量值',code:'flow.value',type:'number',unit:'m³/h',source:'流量计',category:'实时数据'},
  {id:'DI006',name:'累计产量',code:'production.total',type:'number',unit:'吨',source:'生产数据库',category:'生产数据'},
  {id:'DI007',name:'告警数量',code:'alarm.count',type:'number',unit:'个',source:'告警系统',category:'告警数据'},
  {id:'DI008',name:'完成率',code:'completion.rate',type:'percent',unit:'%',source:'生产数据库',category:'生产数据'}
];

// ===== 行 624-659 =====
// ===== 工具函数 =====
function switchTab(tab,btn){['props','data','events'].forEach(t=>{document.getElementById('tab-'+t).style.display=t===tab?'block':'none'});btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
function filterComponents(type,btn){btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.component-card').forEach(card=>{if(type==='all'||card.dataset.type===type){card.style.display='block'}else{card.style.display='none'}})}

// 全局拖拽预览节点（拖拽结束后清理）
var _dragPreviewEl=null;

// 工作流节点拖拽开始
function handleWorkflowNodeDragStart(e,nodeId){
  e.stopPropagation();
  var node=workflowNodes.find(function(n){return n.id===nodeId;});
  if(!node)return;

  e.dataTransfer.setData('nodeId',nodeId);
  e.dataTransfer.setData('componentId',node.componentId);
  e.dataTransfer.setData('name',node.name);
  e.dataTransfer.setData('type',node.type);
  e.dataTransfer.setData('icon',node.icon);
  e.dataTransfer.setData('color',node.color);
  e.dataTransfer.effectAllowed='copy';

  // 设置拖拽预览（保留在 DOM 中，拖拽结束后清理）
  if(_dragPreviewEl){try{document.body.removeChild(_dragPreviewEl);}catch(ex){}}
  _dragPreviewEl=document.createElement('div');
  _dragPreviewEl.className='workflow-node-item';
  _dragPreviewEl.style.cssText='position:absolute;top:-9999px;width:200px;padding:10px;background:var(--surface-base);border:1px solid var(--border-default);border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.1);';
  _dragPreviewEl.innerHTML='<div class="flex items-center gap-3"><div class="w-9 h-9 rounded flex items-center justify-center" style="background:'+node.color+'20"><i class="fa-solid '+node.icon+' text-sm" style="color:'+node.color+'\"></i></div><div class="flex-1"><div class="text-xs font-medium">'+node.name+'</div></div></div>';
  document.body.appendChild(_dragPreviewEl);
  e.dataTransfer.setDragImage(_dragPreviewEl,0,0);
}

// 拖拽结束后清理预览节点
document.addEventListener('dragend',function(){
  if(_dragPreviewEl){try{document.body.removeChild(_dragPreviewEl);}catch(ex){}}
  _dragPreviewEl=null;
});

// ===== 行 692-844 =====
// ===== 组件库数据（从 components.html 同步） =====
// 为了让组件匹配功能正常工作，在这里定义一份组件库数据
var componentLibrary = [
  // ===== 油气生产经营域 =====
  {id:'C001',code:'YC-CJ-001',name:'油井数据采集',category:'油气生产经营',type:'业务组件',dataItems:[{name:'油井压力',code:'well.pressure'},{name:'油井温度',code:'well.temperature'},{name:'产液量',code:'well.liquid_rate'},{name:'含水率',code:'well.water_cut'},{name:'套压',code:'well.casing_pressure'}],icon:'fa-oil-well',color:'var(--brand)',
   config:{fields:[
     {name:'油井编号',type:'text'},
     {name:'采集协议',type:'select',options:['OPC UA','Modbus TCP','MQTT','HART']},
     {name:'采集频率',type:'select',options:['1 秒','5 秒','30 秒','1 分钟']},
     {name:'数据源',type:'select',options:['SCADA 系统','DCS 系统','RTU 远传']},
     {name:'超时阈值(ms)',type:'number'},
     {name:'断线重连次数',type:'number'},
     {name:'数据压缩',type:'select',options:['无','LZ4','ZSTD','Snappy']}
   ]}},
  {id:'C007',code:'YC-CJ-002',name:'压力传感器读取',category:'油气生产经营',type:'业务组件',dataItems:[{name:'井口油压',code:'sensor.wellhead_pressure'},{name:'井口套压',code:'sensor.casing_pressure'},{name:'管线压力',code:'sensor.pipeline_pressure'},{name:'分离器压力',code:'sensor.separator_pressure'}],icon:'fa-gauge',color:'var(--brand)',
   config:{fields:[
     {name:'传感器型号',type:'text'},
     {name:'通信协议',type:'select',options:['HART','4-20mA','RS485','Modbus RTU']},
     {name:'采样频率',type:'select',options:['100ms','500ms','1 秒','5 秒']},
     {name:'量程上限(MPa)',type:'number'},
     {name:'量程下限(MPa)',type:'number'},
     {name:'精度等级',type:'select',options:['0.05级','0.1级','0.25级','0.5级']},
     {name:'异常过滤',type:'select',options:['3σ 检测','中值滤波','无']}
   ]}},
  // ===== 油气新能源域 =====
  {id:'C013',code:'YY-CJ-003',name:'振动传感器采集',category:'油气新能源',type:'业务组件',dataItems:[{name:'振动加速度',code:'sensor.vibration_accel'},{name:'振动速度',code:'sensor.vibration_speed'},{name:'振动位移',code:'sensor.vibration_displacement'},{name:'包络值',code:'sensor.envelope'}],icon:'fa-wave-square',color:'var(--brand)',
   config:{fields:[
     {name:'传感器型号',type:'text'},
     {name:'采集方式',type:'select',options:['IEPE','MEMS','压电式','电涡流']},
     {name:'采样频率(Hz)',type:'number'},
     {name:'FFT 窗长(点)',type:'select',options:['512','1024','2048','4096']},
     {name:'频谱范围上限(Hz)',type:'number'},
     {name:'传输协议',type:'select',options:['MQTT','WebSocket','TCP 直连']},
     {name:'边缘预处理',type:'select',options:['无','降采样','频域压缩','特征提取']}
   ]}},
  {id:'C014',code:'YY-CJ-004',name:'温度传感器采集',category:'油气新能源',type:'业务组件',dataItems:[{name:'轴承温度',code:'sensor.bearing_temp'},{name:'绕组温度',code:'sensor.winding_temp'},{name:'环境温度',code:'sensor.ambient_temp'},{name:'介质温度',code:'sensor.medium_temp'}],icon:'fa-thermometer-half',color:'var(--brand)',
   config:{fields:[
     {name:'传感器型号',type:'text'},
     {name:'测温原理',type:'select',options:['PT100','PT1000','热电偶(K型)','热电偶(T型)','红外']},
     {name:'采集频率',type:'select',options:['1 秒','5 秒','30 秒']},
     {name:'测温范围(℃)',type:'text'},
     {name:'接线方式',type:'select',options:['二线制','三线制','四线制']},
     {name:'报警阈值(℃)',type:'number'}
   ]}},
  {id:'C015',code:'YY-CJ-005',name:'电流电压采集',category:'油气新能源',type:'业务组件',dataItems:[{name:'A 相电流',code:'motor.current_a'},{name:'B 相电流',code:'motor.current_b'},{name:'C 相电流',code:'motor.current_c'},{name:'线电压',code:'motor.voltage'},{name:'有功功率',code:'motor.active_power'},{name:'功率因数',code:'motor.power_factor'}],icon:'fa-bolt',color:'var(--brand)',
   config:{fields:[
     {name:'采集设备',type:'select',options:['电能质量分析仪','多功能电表','CT/PT 互感器']},
     {name:'采样频率',type:'select',options:['1 秒','5 秒']},
     {name:'CT 变比',type:'number'},
     {name:'PT 变比',type:'number'},
     {name:'通信协议',type:'select',options:['Modbus RTU','IEC 61850','DL/T 645']},
     {name:'谐波分析',type:'select',options:['无','2~31 次','2~63 次']}
   ]}},
  // ===== 数据服务域 =====
  {id:'C016',code:'SJ-CL-002',name:'数据清洗与过滤',category:'数据服务',type:'数据组件',dataItems:[{name:'清洗后数据',code:'clean.data'},{name:'数据质量标识',code:'clean.quality'},{name:'异常数据标记',code:'clean.anomaly_flag'},{name:'缺失值插补结果',code:'clean.imputed'}],icon:'fa-filter',color:'var(--success)',
   config:{fields:[
     {name:'清洗策略',type:'select',options:['中值滤波','3σ 异常检测','孤立森林','IQR 四分位','组合策略']},
     {name:'缺失值处理',type:'select',options:['线性插值','前值填充','均值填充','删除','KNN 填充']},
     {name:'质量阈值(%)',type:'number'},
     {name:'滑动窗口大小',type:'number'},
     {name:'是否去重',type:'select',options:['是','否']},
     {name:'单位换算',type:'select',options:['自动检测','手动配置','不转换']}
   ]}},
  {id:'C022',code:'SJ-DB-002',name:'监测数据记录',category:'数据服务',type:'数据组件',dataItems:[{name:'记录 ID',code:'record.id'},{name:'存储状态',code:'record.status'},{name:'写入延迟(ms)',code:'record.write_latency'},{name:'数据量(条)',code:'record.count'}],icon:'fa-database',color:'var(--success)',
   config:{fields:[
     {name:'存储引擎',type:'select',options:['TDengine','InfluxDB','TimescaleDB','PiSystem']},
     {name:'数据保留天数',type:'number'},
     {name:'压缩算法',type:'select',options:['LZ4','ZSTD','GZIP','不压缩']},
     {name:'写入模式',type:'select',options:['批量写入(1s)','批量写入(5s)','实时写入']},
     {name:'分表策略',type:'select',options:['按设备','按时间(天)','按时间(小时)','按设备+时间']},
     {name:'超表(SuperTable)名',type:'text'}
   ]}},
  {id:'C017',code:'SJ-TZ-001',name:'特征提取',category:'数据服务',type:'数据组件',dataItems:[{name:'峰值',code:'feature.peak'},{name:'RMS 有效值',code:'feature.rms'},{name:'峭度',code:'feature.kurtosis'},{name:'偏度',code:'feature.skewness'},{name:'主频',code:'feature.dominant_freq'},{name:'频谱能量',code:'feature.spectral_energy'},{name:'波形因子',code:'feature.crest_factor'}],icon:'fa-chart-line',color:'var(--success)',
   config:{fields:[
     {name:'特征类型',type:'select',options:['时域','频域','时频域','全量提取']},
     {name:'FFT 窗函数',type:'select',options:['汉宁窗','汉明窗','布莱克曼窗','矩形窗']},
     {name:'窗长(采样点)',type:'select',options:['512','1024','2048','4096']},
     {name:'重叠率(%)',type:'number'},
     {name:'频域分辨率(Hz)',type:'number'},
     {name:'特征标准化',type:'select',options:['Z-Score','Min-Max','无']}
   ]}},
  // ===== 分析决策域 =====
  {id:'C018',code:'FX-PG-001',name:'设备健康度评估',category:'分析决策',type:'模型组件',dataItems:[{name:'健康度评分',code:'health.score'},{name:'健康等级',code:'health.grade'},{name:'异常指标',code:'health.indicators'},{name:'退化趋势',code:'health.trend'}],icon:'fa-heartbeat',color:'oklch(55% 0.22 315)',
   config:{fields:[
     {name:'模型算法',type:'select',options:['XGBoost','LightGBM','Random Forest','LSTM','Transformer']},
     {name:'输入特征',type:'text'},
     {name:'评分方法',type:'select',options:['加权评分','模糊综合评判','D-S 证据理论','PCA+聚类']},
     {name:'正常阈值(分)',type:'number'},
     {name:'注意阈值(分)',type:'number'},
     {name:'异常阈值(分)',type:'number'},
     {name:'模型更新策略',type:'select',options:['定期重训练','在线增量','手动触发']},
     {name:'推理方式',type:'select',options:['边缘推理','云端推理','混合推理']}
   ]}},
  {id:'C019',code:'FX-PG-002',name:'故障预测与诊断',category:'分析决策',type:'模型组件',dataItems:[{name:'故障类型',code:'fault.type'},{name:'故障概率',code:'fault.probability'},{name:'剩余寿命(RUL)',code:'fault.rul'},{name:'故障位置',code:'fault.location'},{name:'置信度',code:'fault.confidence'}],icon:'fa-brain',color:'oklch(55% 0.22 315)',
   config:{fields:[
     {name:'模型算法',type:'select',options:['Transformer','BiLSTM','CNN-LSTM','GNN','Autoencoder']},
     {name:'预测窗口',type:'select',options:['6h','12h','24h','72h','7d']},
     {name:'故障类型库',type:'text'},
     {name:'置信度阈值(%)',type:'number'},
     {name:'训练样本数',type:'number'},
     {name:'模型精度(%)',type:'number'},
     {name:'推理延迟要求(ms)',type:'number'},
     {name:'部署方式',type:'select',options:['边缘设备','云端 GPU','混合部署']}
   ]}},
  {id:'C023',code:'FX-YH-001',name:'模型自学习优化',category:'分析决策',type:'模型组件',dataItems:[{name:'模型版本',code:'model.version'},{name:'更新状态',code:'model.update_status'},{name:'准确率',code:'model.accuracy'},{name:'F1-Score',code:'model.f1'},{name:'召回率',code:'model.recall'}],icon:'fa-sync-alt',color:'oklch(55% 0.22 315)',
   config:{fields:[
     {name:'重训触发',type:'select',options:['定时触发','数据量达标','精度下降','手动触发']},
     {name:'重训周期',type:'select',options:['每天','每周','每月','每季度']},
     {name:'最小样本量',type:'number'},
     {name:'目标准确率(%)',type:'number'},
     {name:'A/B 测试',type:'select',options:['启用','禁用']},
     {name:'回滚策略',type:'select',options:['自动回滚','手动确认','不回滚']},
     {name:'模型仓库',type:'select',options:['MLflow','本地','MinIO']}
   ]}},
  // ===== 炼化新材料域 =====
  {id:'C020',code:'LH-GJ-002',name:'紧急告警推送',category:'炼化新材料',type:'规则组件',dataItems:[{name:'告警 ID',code:'alert.id'},{name:'告警级别',code:'alert.level'},{name:'告警详情',code:'alert.detail'},{name:'推送记录',code:'alert.push_log'},{name:'升级记录',code:'alert.escalation'}],icon:'fa-bell',color:'var(--warning)',
   config:{fields:[
     {name:'通知渠道',type:'text'},
     {name:'触发条件',type:'text'},
     {name:'升级时间(分钟)',type:'number'},
     {name:'升级策略',type:'select',options:['逐级上浮','直达负责人','并行通知']},
     {name:'冷却时间(分钟)',type:'number'},
     {name:'确认方式',type:'select',options:['一键确认','短信回复','自动确认']},
     {name:'值班表联动',type:'select',options:['启用','禁用']},
     {name:'告警分类',type:'select',options:['设备类','安全类','环境类','工艺类']}
   ]}},
  {id:'C021',code:'LH-GJ-003',name:'预警通知',category:'炼化新材料',type:'规则组件',dataItems:[{name:'预警 ID',code:'warning.id'},{name:'预警级别',code:'warning.level'},{name:'推送状态',code:'warning.push_status'},{name:'接收人',code:'warning.receiver'}],icon:'fa-envelope',color:'var(--warning)',
   config:{fields:[
     {name:'通知渠道',type:'text'},
     {name:'预警规则',type:'text'},
     {name:'通知对象',type:'select',options:['设备负责人','安全员','生产调度','全部']},
     {name:'冷却时间(分钟)',type:'number'},
     {name:'消息模板',type:'select',options:['简洁版','详细版','自定义']},
     {name:'附件生成',type:'select',options:['无','趋势截图','PDF 报告']}
   ]}},
  {id:'C009',code:'YY-WB-001',name:'维保工单管理',category:'油气新能源',type:'业务组件',dataItems:[{name:'工单编号',code:'workorder.id'},{name:'设备信息',code:'workorder.device'},{name:'故障类型',code:'workorder.fault_type'},{name:'工单状态',code:'workorder.status'},{name:'责任人',code:'workorder.assignee'},{name:'完成时间',code:'workorder.completed_at'}],icon:'fa-clipboard-check',color:'var(--brand)',
   config:{fields:[
     {name:'工单来源',type:'select',options:['自动生成','手动创建','巡检转派','外委工单']},
     {name:'优先级规则',type:'text'},
     {name:'派单策略',type:'select',options:['自动派单','轮询派单','技能匹配','手动派单']},
     {name:'SLA 时效(h)',type:'number'},
     {name:'工单流转节点',type:'text'},
     {name:'关联系统',type:'select',options:['EAM 系统','ERP 系统','CMMS','无']},
     {name:'照片/附件',type:'select',options:['必填','选填','不需要']},
     {name:'完工确认',type:'select',options:['现场拍照','电子签名','主管审批']}
   ]}}
];

// 统一别名 + 补充兼容字段：componentType 用于旧代码 type 过滤，relevance 用于排序
var COMPONENT_LIBRARY = componentLibrary.map(function(c){
  var ctMap={'业务组件':'component','数据组件':'data','模型组件':'model','规则组件':'rule'};
  c.componentType = ctMap[c.type] || 'component';
  c.relevance = c.relevance || 95;
  return c;
});

// ===== 行 847-883 =====
// ===== 数据模型转换（不依赖外部 Models，直接构造纯对象） =====
function normalizeDemands(rawDemands) {
  return rawDemands.map(function(d) {
    return {
      id: d.id || '',
      title: d.title || '',
      type: d.type || 'other',
      domain: d.domain || '',
      priority: d.priority || 'medium',
      status: d.status || '待评审',
      assignee: d.assignee || '',
      reporter: typeof d.reporter === 'string' ? {name: d.reporter, unit: '', dept: ''} : (d.reporter || {name: '', unit: '', dept: ''}),
      parentId: d.parentId || null,
      source: d.source || '1',
      businessBackground: d.businessBackground || d.desc || '',
      userStory: d.userStory || d.desc || '',
      expectedValue: d.expectedValue || '',
      acceptance: d.acceptance || '',
      desc: d.desc || '',
      iterationType: d.iterationType || 'new',
      version: d.version || '',
      expectedDate: d.expectedDate || '',
      estHours: d.estHours || 0,
      designLink: d.designLink || '',
      devLink: d.devLink || '',
      testLink: d.testLink || '',
      releaseLink: d.releaseLink || '',
      tags: d.tags || [],
      sprint: d.sprint || '',
      created: d.created || '',
      updated: d.updated || '',
      history: d.history || [],
      comments: d.comments || [],
      iterating: d.iterating || false,
      members: d.members || []
    };
  });
}

// ===== 行 886-906 =====
// 模拟需求台账数据（与 demand.html 同步，含主子需求结构）
var DEMANDS = normalizeDemands([
  // 主需求：油气生产智能感知平台
  {id:'DMD-0024',title:'油气生产智能感知平台',domain:'油气生产经营',priority:'紧急',status:'设计中',assignee:'李业务',parentId:null,members:['张架构']},
  {id:'DMD-0024-1',title:'生产数据实时采集服务',domain:'油气生产经营',priority:'紧急',status:'设计中',assignee:'张架构',parentId:'DMD-0024',members:['李业务']},
  {id:'DMD-0024-2',title:'油井监控数据异常告警',domain:'油气生产经营',priority:'高',status:'设计中',assignee:'王技术',parentId:'DMD-0024',members:['张架构']},
  {id:'DMD-0024-3',title:'管网压力分析服务',domain:'装备制造',priority:'高',status:'设计中',assignee:'赵工程',parentId:'DMD-0024',members:['张架构']},
  // 主需求：生产报表自动生成（已上线，迭代中）
  {id:'DMD-0021',title:'生产报表自动生成',domain:'炼化新材料',priority:'中',status:'已上线',assignee:'孙分析',parentId:null,members:['张架构'],iterating:true},
  {id:'DMD-0021-1',title:'报表模板自定义配置',domain:'炼化新材料',priority:'中',status:'设计中',assignee:'孙分析',parentId:'DMD-0021',members:['张架构']},
  {id:'DMD-0021-2',title:'报表定时推送服务',domain:'炼化新材料',priority:'低',status:'设计中',assignee:'孙分析',parentId:'DMD-0021',members:['张架构']},
  // 其他主需求
  {id:'DMD-0019',title:'安全巡检数字化',domain:'油气新能源',priority:'中',status:'已上线',assignee:'郑安全',parentId:null,members:[],iterating:false},
  {id:'DMD-0001',title:'基础数据管理平台',domain:'炼化新材料',priority:'高',status:'已上线',assignee:'孙分析',parentId:null,members:[],iterating:false}
]);

// ✅ 验证数据加载
// 模拟评审数据 - 记录已通过评审的需求（含子需求）
var REVIEWED_DEMANDS=['DMD-0024','DMD-0024-1','DMD-0024-2','DMD-0024-3','DMD-0021','DMD-0021-1','DMD-0021-2','DMD-0019','DMD-0001'];

// 当前选中的需求
var selectedDemand=null;

// ===== 行 908-1134 =====
function showDemandDropdown(){
  window._demandDropdownJustOpened=true;
  // 动态计算下拉框位置（使用 fixed 定位避免被 overflow:hidden 裁剪）
  var input=document.getElementById('demandSearchInput');
  var results=document.getElementById('demandResults');
  if(input&&results){
    var rect=input.getBoundingClientRect();
    results.style.top=(rect.bottom+4)+'px';
    results.style.left=rect.left+'px';
  }
  searchDemands('');
  setTimeout(function(){window._demandDropdownJustOpened=false;},300);
}


function selectDemand(id,title,event){
  // 阻止事件冒泡和默认行为，避免一次点击触发多次调用
  if(event){
    event.stopPropagation();
    event.preventDefault();
  }
  // 如果切换了不同需求，先保存当前需求状态
  if(selectedDemand && selectedDemand.id!==id){
    saveCanvasState();
  }
  selectedDemand={id:id,title:title};
  // 同步到全局需求上下文
  if(typeof Scaffold !== 'undefined' && Scaffold.setCurrentDemand){
    Scaffold.setCurrentDemand(id, title);
  }
  document.getElementById('demandSearchInput').value='';
  document.getElementById('demandResults').style.display='none';
  var nameEl=document.getElementById('selectedDemandName');
  var displayEl=document.getElementById('selectedDemandDisplay');
  if(nameEl)nameEl.textContent=id+' '+title;
  if(displayEl)displayEl.classList.remove('hidden');
  document.getElementById('workflowHint').textContent='已选择：'+title;
  updateDemandStatusDisplay();
  // 加载该需求的历史保存状态（内部会清空旧状态并渲染新状态）
  loadDemandState(id);
  triggerAutoSave();
}

function clearSelectedDemand(){
  selectedDemand=null;
  var displayEl=document.getElementById('selectedDemandDisplay');
  var nameEl=document.getElementById('selectedDemandName');
  if(displayEl)displayEl.classList.add('hidden');
  if(nameEl)nameEl.textContent='';
  document.getElementById('workflowHint').textContent='请先选择需求并配置工作流节点';
  // 清空工作流节点、连接和画布
  workflowNodes=[];
  nodeConnections=[];
  currentWorkflowNodeId=null;
  canvasUnlocked=false;
  renderWorkflowNodeList();
  updateDemandStatusDisplay();
  clearCanvasNodes();
  // 清除画布上的连线 SVG
  var oldSvg=document.getElementById('connections-svg');
  if(oldSvg)oldSvg.parentNode.removeChild(oldSvg);
  document.getElementById('canvasMask').style.display='flex';
  document.getElementById('workflowConfigPanel').style.display='none';
  document.getElementById('canvasNodePanel').style.display='flex';
  // 清除自动保存
  clearCanvasState();
}

// 展开/折叠主需求
function toggleExpand(parentId){
  if(!window.expandedParentIds)window.expandedParentIds={};
  window.expandedParentIds[parentId]=!window.expandedParentIds[parentId];
  searchDemands(document.getElementById('demandSearchInput').value);
}

// 高亮关键字
function highlightKeyword(text,keyword){
  if(!keyword)return text;
  var regex=new RegExp('('+keyword+')','gi');
  return text.replace(regex,'<span style="background:var(--amber-subtle);color:var(--amber);font-weight:600">$1</span>');
}

// 构建树状结构
function buildDemandTree(filteredDemands){
  var tree=[];
  var childrenMap={};
  
  // 第一遍：只处理主需求，创建树的根节点
  for(var i=0;i<filteredDemands.length;i++){
    var d=filteredDemands[i];
    if(!d.parentId){
      tree.push({node:d,children:[]});
    }
  }
  
  // 第二遍：处理子需求，挂载到对应的父需求
  for(var i=0;i<filteredDemands.length;i++){
    var d=filteredDemands[i];
    if(d.parentId){
      if(!childrenMap[d.parentId])childrenMap[d.parentId]=[];
      childrenMap[d.parentId].push({node:d,children:[]});
    }
  }
  
  // 第三遍：挂载子需求并统计数量
  for(var j=0;j<tree.length;j++){
    var parentId=tree[j].node.id;
    if(childrenMap[parentId]){
      tree[j].children=childrenMap[parentId];
      tree[j].node.childCount=childrenMap[parentId].length;
    }else{
      tree[j].node.childCount=0;
    }
  }
  return tree;
}

// 渲染树状结构
function renderDemandTree(tree,keyword){
  if(!window.expandedParentIds)window.expandedParentIds={};
  var html='';
  for(var i=0;i<tree.length;i++){
    var item=tree[i];
    var hasChildren=item.children.length>0;
    // 有子需求时：有关键词则自动展开，无关键词时默认展开
    if(hasChildren){
      if(!(item.node.id in window.expandedParentIds)){
        window.expandedParentIds[item.node.id]=true;
      }
    }
    var isExpanded=window.expandedParentIds[item.node.id]||false;
    // 有关键词时，若子需求有匹配则强制展开
    if(keyword&&hasChildren){
      var hasMatchedChild=item.children.some(function(c){
        return c.node.title.indexOf(keyword)!==-1||c.node.id.indexOf(keyword)!==-1;
      });
      if(hasMatchedChild)isExpanded=true;
    }
    html+=renderDemandRow(item.node,0,hasChildren,isExpanded,keyword);
    if(hasChildren&&isExpanded){
      for(var j=0;j<item.children.length;j++){
        html+=renderDemandRow(item.children[j].node,1,false,false,keyword);
      }
    }
  }
  return html;
}

// 渲染单个需求行
function renderDemandRow(demand,level,hasChildren,isExpanded,keyword){
  var statusText=demand.status==='设计中'?'未发布':'迭代中';
  var statusColor=demand.status==='设计中'?'var(--brand)':'var(--success)';
  var childCount=hasChildren?(demand.childCount||0):0;
  var rowClass=level===0?'demand-tree-row':'demand-tree-row child';
  
  var safeTitle=demand.title.replace(/'/g,"\\'").replace(/"/g,'&quot;');
  var html='<div class="'+rowClass+'" onclick="selectDemand(\''+demand.id+'\',\''+safeTitle+'\',event)">';
  html+='<div class="flex items-center gap-2">';

  if(hasChildren){
    var icon=isExpanded?'fa-caret-down':'fa-caret-right';
    html+='<button class="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200" style="color:var(--text-tertiary);flex-shrink:0" onclick="event.stopPropagation();toggleExpand(\''+demand.id+'\')"><i class="fa-solid '+icon+' text-xs"></i></button>';
  }else if(level===0){
    html+='<span class="w-4 h-4 flex-shrink-0"></span>';
  }
  
  html+='<div class="flex-1 min-w-0">';
  html+='<div class="flex items-center gap-2">';
  html+='<div class="demand-tree-id">'+demand.id+'</div>';
  html+='<div class="text-sm truncate">'+highlightKeyword(demand.title,keyword)+'</div>';
  html+='<span class="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0" style="background:'+statusColor+'20;color:'+statusColor+'">'+statusText+'</span>';
  html+='</div>';
  if(hasChildren){
    html+='<div class="text-[10px] mt-0.5" style="color:var(--text-tertiary)"><i class="fa-solid fa-diagram-project mr-1"></i>'+childCount+' 个子需求</div>';
  }else{
    html+='<div class="text-[10px] mt-0.5" style="color:var(--text-tertiary)">负责人：'+demand.assignee+(demand.members&&demand.members.length>0?' | 成员：'+demand.members.join('、'):'')+'</div>';
  }
  html+='</div></div></div>';

  return html;
}

// searchDemands 函数 - 支持树状结构
function searchDemands(keyword){
  const results=document.getElementById('demandResults');
  
  // 第一遍：过滤所有匹配的需求（含主子需求）
  var matched=DEMANDS.filter(function(d){
    if(REVIEWED_DEMANDS.indexOf(d.id)===-1) return false;
    // 支持中英文状态
    var statusText = d.status;
    if(statusText === 'designing') statusText = '设计中';
    if(statusText === 'online') statusText = '已上线';
    if(statusText === 'pending_review') statusText = '待评审';
    if(statusText === 'rejected') statusText = '已驳回';
    if(statusText!=='设计中' && !(statusText==='已上线' && d.iterating)) return false;
    // 检查负责人或成员
    if(d.assignee!==currentUser && (!d.members || d.members.indexOf(currentUser)===-1)) return false;
    if(keyword && d.title.indexOf(keyword)===-1 && d.id.indexOf(keyword)===-1) return false;
    return true;
  });
  
  if(matched.length===0){
    results.style.display='block';
    results.innerHTML='<div class="p-4 text-xs text-gray-500 text-center"><i class="fa-solid fa-inbox text-2xl mb-2" style="color:var(--border-subtle)"></i><div>无匹配需求</div><div class="text-[10px] mt-1" style="color:var(--text-tertiary)">只显示您负责且已通过评审的需求</div></div>';
    return;
  }
  
  // 第二遍：如果是子需求匹配，需要找到并保留其父需求
  var matchIds={};
  for(var i=0;i<matched.length;i++){
    var m=matched[i];
    matchIds[m.id]=true;
    // 如果是子需求，标记其父需求 ID
    if(m.parentId) matchIds[m.parentId]='parent-by-child';
  }
  
  // 第三遍：构建最终列表（所有主需求 + 匹配的子需求）
  var finalList=[];
  for(var k=0;k<DEMANDS.length;k++){
    var d=DEMANDS[k];
    if(!d.parentId && matchIds[d.id]) {
      finalList.push(d);
    } else if(d.parentId && matchIds[d.id]===true) {
      finalList.push(d);
    }
  }
  
  // 构建树状结构
  var tree=buildDemandTree(finalList);
  var html=renderDemandTree(tree,keyword||'');
  
  results.style.display='block';
  results.innerHTML=html;
};

// ===== 行 2933-2955 =====
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
