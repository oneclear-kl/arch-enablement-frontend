/**
 * 发布模型（Publish）
 *
 * 依赖：enums.js, utils.js
 * 引用方式：<script src="../_shared/models/publish.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  M.Publish = {
    /**
     * 创建发布对象
     * @param {Object} data - 发布数据
     * @returns {Object} 完整的发布对象
     */
    create: function(data) {
      data = data || {};
      return {
        id: data.id || '',
        name: data.name || '',
        type: data.type || '',
        typeName: data.typeName || '',
        version: data.version || 'v1.0',
        applicant: data.applicant || '',
        applyTime: data.applyTime || M.getCurrentTimestamp(),
        description: data.description || '',
        environment: data.environment || M.Enum.Environment.PROD,
        status: data.status || M.Enum.ReviewStatus.PENDING,
        testUrl: data.testUrl || '',
        prodUrl: data.prodUrl || '',
        timeline: data.timeline || []
      };
    }
  };

})();
