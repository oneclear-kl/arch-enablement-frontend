/**
 * 工具函数
 *
 * 依赖：enums.js（getEnumText 需要 Models.Enum）
 * 引用方式：<script src="../_shared/models/utils.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  /**
   * 根据枚举值获取显示文本
   */
  M.getEnumText = function(value) {
    var textMap = {
      'DemandStatus': M.Enum.DemandStatusText,
      'Priority': M.Enum.PriorityText,
      'DemandType': M.Enum.DemandTypeText,
      'IterationType': M.Enum.IterationTypeText,
      'Source': M.Enum.SourceText,
      'PublishStatus': M.Enum.PublishStatusText,
      'ReviewStatus': M.Enum.ReviewStatusText,
      'Environment': M.Enum.EnvironmentText
    };

    for (var key in textMap) {
      if (textMap[key] && textMap[key][value]) {
        return textMap[key][value];
      }
    }
    return value;
  };

  /**
   * 获取当前时间戳字符串
   */
  M.getCurrentTimestamp = function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  };

  /**
   * 获取当前日期字符串
   */
  M.getCurrentDate = function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  };

})();
