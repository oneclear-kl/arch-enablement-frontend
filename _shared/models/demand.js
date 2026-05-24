/**
 * 需求模型（Demand）
 *
 * 依赖：enums.js, utils.js
 * 引用方式：<script src="../_shared/models/demand.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  M.Demand = {
    /**
     * 创建需求对象
     * @param {Object} data - 需求数据
     * @returns {Object} 完整的需求对象
     */
    create: function(data) {
      data = data || {};
      var now = M.getCurrentTimestamp();
      return {
        // 基础信息
        id: data.id || '',  // 后端生成
        title: data.title || '',
        type: data.type || M.Enum.DemandType.OTHER,
        domain: data.domain || '',
        priority: data.priority || M.Enum.Priority.MEDIUM,
        status: data.status || M.Enum.DemandStatus.PENDING_REVIEW,

        // 关联信息
        assignee: data.assignee || '',
        reporter: data.reporter || {
          name: '',
          unit: '',
          dept: ''
        },
        parentId: data.parentId || null,

        // 需求内容
        source: data.source || M.Enum.Source.BUSINESS,
        businessBackground: data.businessBackground || '',
        userStory: data.userStory || '',
        expectedValue: data.expectedValue || '',
        acceptance: data.acceptance || '',
        desc: data.desc || '',

        // 迭代信息
        iterationType: data.iterationType || M.Enum.IterationType.NEW,
        iterationNote: data.iterationNote || '',
        version: data.version || '',

        // 链接信息
        expectedDate: data.expectedDate || '',
        estHours: data.estHours || 0,
        designLink: data.designLink || '',
        devLink: data.devLink || '',
        testLink: data.testLink || '',
        releaseLink: data.releaseLink || '',

        // 系统字段
        tags: data.tags || [],
        sprint: data.sprint || '',
        created: data.created || now,
        updated: data.updated || now,
        history: data.history || [],
        comments: data.comments || [],

        // 装配扩展字段
        iterating: data.iterating || false,
        members: data.members || []
      };
    },

    /**
     * 验证需求对象
     * @param {Object} demand - 需求对象
     * @returns {Object} {valid: boolean, errors: string[]}
     */
    validate: function(demand) {
      var errors = [];

      if (!demand.title || demand.title.length > 200) {
        errors.push('需求标题长度 1-200 字符');
      }

      if (!demand.type || !Object.values(M.Enum.DemandType).includes(demand.type)) {
        errors.push('需求类型无效');
      }

      if (!demand.domain) {
        errors.push('业务域必填');
      }

      if (!demand.priority || !Object.values(M.Enum.Priority).includes(demand.priority)) {
        errors.push('优先级无效');
      }

      if (!demand.source || !Object.values(M.Enum.Source).includes(demand.source)) {
        errors.push('需求来源无效');
      }

      if (!demand.businessBackground || demand.businessBackground.length < 10) {
        errors.push('业务背景最少 10 字');
      }

      if (!demand.userStory) {
        errors.push('用户故事必填');
      }

      if (!demand.expectedValue) {
        errors.push('预期价值必填');
      }

      if (!demand.iterationType || !Object.values(M.Enum.IterationType).includes(demand.iterationType)) {
        errors.push('迭代类型无效');
      }

      if (demand.reporter && typeof demand.reporter === 'object') {
        if (!demand.reporter.name) {
          errors.push('提出人姓名必填');
        }
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    }
  };

})();
