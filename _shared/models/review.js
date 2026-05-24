/**
 * 评审模型（Review）
 *
 * 依赖：enums.js, utils.js
 * 引用方式：<script src="../_shared/models/review.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  M.Review = {
    /**
     * 创建评审对象
     * @param {Object} data - 评审数据
     * @returns {Object} 完整的评审对象
     */
    create: function(data) {
      data = data || {};
      return {
        id: data.id || '',
        demandId: data.demandId || '',
        status: data.status || M.Enum.ReviewStatus.PENDING,
        reviewers: data.reviewers || [],
        meeting: data.meeting || '',
        deadline: data.deadline || '',
        conclusion: data.conclusion || '',
        checklist: data.checklist || [
          { text: '需求完整性', done: false },
          { text: '技术可行性', done: false },
          { text: '资源评估', done: false },
          { text: '排期合理性', done: false }
        ],
        comments: data.comments || [],

        // 装配扩展字段
        iterating: data.iterating || false,
        members: data.members || []
      };
    }
  };

})();
