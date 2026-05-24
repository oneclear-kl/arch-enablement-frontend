/**
 * 数据模型聚合入口
 *
 * 统一导出 Models 到全局，确保向后兼容
 * 引用方式（按依赖顺序）：
 *
 * <script src="../_shared/models/enums.js"></script>
 * <script src="../_shared/models/utils.js"></script>
 * <script src="../_shared/models/status-flow.js"></script>
 * <script src="../_shared/models/demand.js"></script>
 * <script src="../_shared/models/review.js"></script>
 * <script src="../_shared/models/publish.js"></script>
 * <script src="../_shared/models/catalog.js"></script>
 * <script src="../_shared/models/index.js"></script>
 *
 * 或简化（本文件做最后验证）：
 * <script src="../_shared/models/enums.js"></script>
 * <script src="../_shared/models/utils.js"></script>
 * <script src="../_shared/models/status-flow.js"></script>
 * <script src="../_shared/models/demand.js"></script>
 * <script src="../_shared/models/review.js"></script>
 * <script src="../_shared/models/publish.js"></script>
 * <script src="../_shared/models/catalog.js"></script>
 */
(function() {

  var M = window.Models;

  // 验证完整性
  var required = ['Enum', 'Demand', 'Component', 'DataService', 'ModelService', 'Rule', 'Review', 'Publish', 'StatusFlow'];
  var missing = [];
  for (var i = 0; i < required.length; i++) {
    if (!M || !M[required[i]]) {
      missing.push(required[i]);
    }
  }

  if (missing.length > 0) {
    console.warn('[Models] 以下模块未加载：' + missing.join(', '));
  }

  // 导出到全局（兼容旧用法）
  if (typeof window !== 'undefined') {
    window.Models = M;
  }

})();
