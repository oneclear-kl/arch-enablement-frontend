/**
 * 状态流转规则（StatusFlow）
 *
 * 依赖：enums.js（引用枚举值做流转判断）
 * 引用方式：<script src="../_shared/models/status-flow.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  M.StatusFlow = {
    // 需求状态流转
    demand: {
      'pending_review': ['designing', 'rejected'],
      'designing': ['online'],
      'online': ['designing'],
      'rejected': ['pending_review']
    },

    // 评审状态流转
    review: {
      'pending': ['approved', 'rejected'],
      'approved': ['published'],
      'rejected': ['pending']
    },

    /**
     * 检查状态是否允许流转
     * @param {string} entityType - 实体类型：'demand' | 'review'
     * @param {string} currentStatus - 当前状态
     * @param {string} targetStatus - 目标状态
     * @returns {boolean} 是否允许
     */
    canTransition: function(entityType, currentStatus, targetStatus) {
      var flow = this[entityType];
      if (!flow || !flow[currentStatus]) {
        return false;
      }
      return flow[currentStatus].includes(targetStatus);
    }
  };

})();
