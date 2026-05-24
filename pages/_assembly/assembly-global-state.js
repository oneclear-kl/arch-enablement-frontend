// =============================================================================
// 模块 3: assembly-global-state.js
// 来源: assembly.html
// 行号范围:
//   - 572-577  : selectedNode, workflowNodes, currentWorkflowNodeId,
//                selectedComponent, selectedNodeType, canvasUnlocked
//   - 580-583  : tempSaveList, selectedComponentsTemp, currentConfigComponent,
//                isMultiSelectMode
//   - 586-592  : dataItemLibrary, workflowDataServices, canvasNodeHotspots,
//                selectedHotspot, nodeConnections, isCreatingConnection,
//                connectionSourceNode
//   - 906      : selectedDemand
//   - 2798-2800: currentDataSource, selectedDataItems, currentDataItemCallback
//   - 3028-3031: isDrawingConnection, drawingSourceNode, drawingSourcePort, tempLine
//   - 4357-4360: connectionMode, connectionStartNodeId, isDrawingLine, tempLine
//   - 2671-2676: isDraggingNode, dragNode, dragStartX, dragStartY,
//                dragStartLeft, dragStartTop
// =============================================================================

// ===== 行 572-577 =====
let selectedNode=null;
let workflowNodes=[]; // 工作流节点列表
let currentWorkflowNodeId=null; // 当前选中的工作流节点 ID
let selectedComponent=null; // 当前选中的组件/服务
let selectedNodeType=null; // 当前选择的节点类型
let canvasUnlocked=false; // 画布是否已解锁

// ===== 行 580-583 =====
// ===== 多选和暂存配置 =====
let tempSaveList=[]; // 暂存的组件配置列表
let selectedComponentsTemp=[]; // 当前已选但未配置的组件列表
let currentConfigComponent=null; // 当前正在配置的组件
let isMultiSelectMode=true; // 是否开启多选模式

// ===== 行 586-592 =====
// ===== 数据项配置 =====
let dataItemLibrary=[]; // 数据项库
let workflowDataServices=[]; // 工作流中的数据服务
let canvasNodeHotspots={}; // 画布节点热区配置
let selectedHotspot=null; // 当前选中的热区
let nodeConnections=[]; // 节点关联关系
let isCreatingConnection=false; // 是否正在创建关联
let connectionSourceNode=null; // 关联源节点

// ===== 行 906 =====
// 当前选中的需求
var selectedDemand=null;

// ===== 行 2798-2800 =====
// ===== 数据项配置相关函数 =====
var currentDataSource='library'; // 当前数据源
var selectedDataItems=[]; // 当前选中的数据项
var currentDataItemCallback=null; // 数据项选择回调函数

// ===== 行 3028-3031 =====
var isDrawingConnection=false; // 是否正在绘制连线
var drawingSourceNode=null; // 绘制连线的源节点
var drawingSourcePort=null; // 绘制连线的源端口
var tempLine=null; // 临时绘制中的线

// ===== 行 4357-4360 =====
var connectionMode=false;        // 是否处于连线模式
var connectionStartNodeId=null;  // 连线起始节点 ID
var isDrawingLine=false;         // 是否正在绘制连线（重命名避免冲突）
var tempLine=null;               // 临时连线 SVG

// ===== 行 2671-2676 =====
var isDraggingNode=false;
var dragNode=null;
var dragStartX=0;
var dragStartY=0;
var dragStartLeft=0;
var dragStartTop=0;
