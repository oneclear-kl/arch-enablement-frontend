/**
 * 统一枚举定义
 *
 * 所有枚举常量集中在此文件，独立无依赖
 * 引用方式：<script src="../_shared/models/enums.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  M.Enum = {
    // 需求状态
    DemandStatus: {
      PENDING_REVIEW: 'pending_review',
      DESIGNING: 'designing',
      ONLINE: 'online',
      REJECTED: 'rejected'
    },

    DemandStatusText: {
      'pending_review': '待评审',
      'designing': '设计中',
      'online': '已上线',
      'rejected': '已驳回'
    },

    // 优先级
    Priority: {
      URGENT: 'urgent',
      HIGH: 'high',
      MEDIUM: 'medium',
      LOW: 'low'
    },

    PriorityText: {
      'urgent': '紧急',
      'high': '高',
      'medium': '中',
      'low': '低'
    },

    // 需求类型
    DemandType: {
      SCENARIO: 'scenario',
      MODULE: 'module',
      COMPONENT: 'component',
      DATA_SERVICE: 'data_service',
      MODEL_SERVICE: 'model_service',
      OTHER: 'other'
    },

    DemandTypeText: {
      'scenario': '场景',
      'module': '模块',
      'component': '组件',
      'data_service': '数据服务',
      'model_service': '模型服务',
      'other': '其他'
    },

    // 迭代类型
    IterationType: {
      NEW: 'new',
      MINOR: 'minor',
      MAJOR: 'major'
    },

    IterationTypeText: {
      'new': '全新需求',
      'minor': 'V1.x 小迭代',
      'major': 'V2.0 重大迭代'
    },

    // 需求来源
    Source: {
      BUSINESS: '1',
      PRODUCT_MANAGER: '2',
      OPERATION: '3',
      CUSTOMER_SERVICE: '4',
      API: '5',
      MANAGEMENT: '6'
    },

    SourceText: {
      '1': '业务方提报',
      '2': '产品经理',
      '3': '运营反馈',
      '4': '客服反馈',
      '5': 'API 拓取',
      '6': '管理层指令'
    },

    // 发布状态
    PublishStatus: {
      DRAFT: 'draft',
      PUBLISHED: 'published'
    },

    PublishStatusText: {
      'draft': '草稿',
      'published': '已发布'
    },

    // 审批状态
    ReviewStatus: {
      PENDING: 'pending',
      APPROVED: 'approved',
      PUBLISHED: 'published',
      REJECTED: 'rejected'
    },

    ReviewStatusText: {
      'pending': '待审批',
      'approved': '已通过',
      'published': '已发布',
      'rejected': '已拒绝'
    },

    // 组件类型
    ComponentType: {
      BUSINESS: '业务组件',
      DATA: '数据组件',
      UI: 'UI 组件',
      OTHER: '其他'
    },

    // 数据服务类型
    DataServiceType: {
      QUERY: '查询服务',
      PUSH: '推送服务',
      PROCESS: '处理服务'
    },

    // 模型类型
    ModelType: {
      PREDICTION: '预测模型',
      DIAGNOSIS: '诊断模型',
      OPTIMIZATION: '优化模型'
    },

    // 规则类型
    RuleType: {
      THRESHOLD: '阈值告警',
      LOGIC: '逻辑判断',
      VALIDATION: '数据校验'
    },

    // 发布环境
    Environment: {
      TEST: 'test',
      PROD: 'prod'
    },

    EnvironmentText: {
      'test': '测试环境',
      'prod': '生产环境'
    }
  };

})();
