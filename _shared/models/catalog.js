/**
 * 目录类模型（Component / DataService / ModelService / Rule）
 *
 * 四个实体结构相似，集中管理
 * 依赖：enums.js, utils.js
 * 引用方式：<script src="../_shared/models/catalog.js"></script>
 */
(function() {

  var M = window.Models = window.Models || {};

  // ========== 组件 ==========

  M.Component = {
    create: function(data) {
      data = data || {};
      return {
        id: data.id || '',
        name: data.name || '',
        type: data.type || M.Enum.ComponentType.BUSINESS,
        version: data.version || 'v1.0',
        status: data.status || M.Enum.PublishStatus.DRAFT,
        enabled: data.enabled !== undefined ? data.enabled : true,
        owner: data.owner || '',
        createTime: data.createTime || M.getCurrentDate(),
        desc: data.desc || '',

        dataItems: data.dataItems || [],
        config: data.config || [],
        usage: data.usage || { referenced: 0, assembled: 0 },
        demands: data.demands || [],
        icon: data.icon || 'fa-cube',
        color: data.color || '#4A7DE0'
      };
    }
  };

  // ========== 数据服务 ==========

  M.DataService = {
    create: function(data) {
      data = data || {};
      return {
        id: data.id || '',
        name: data.name || '',
        type: data.type || M.Enum.DataServiceType.QUERY,
        version: data.version || 'v1.0',
        status: data.status || M.Enum.PublishStatus.DRAFT,
        enabled: data.enabled !== undefined ? data.enabled : true,
        owner: data.owner || '',
        createTime: data.createTime || M.getCurrentDate(),
        desc: data.desc || '',

        dataItems: data.dataItems || [],
        config: data.config || [],
        usage: data.usage || { referenced: 0, assembled: 0 },
        demands: data.demands || [],
        icon: data.icon || 'fa-database',
        color: data.color || '#52C41A'
      };
    }
  };

  // ========== 模型服务 ==========

  M.ModelService = {
    create: function(data) {
      data = data || {};
      return {
        id: data.id || '',
        name: data.name || '',
        type: data.type || M.Enum.ModelType.PREDICTION,
        version: data.version || 'v1.0',
        status: data.status || M.Enum.PublishStatus.DRAFT,
        enabled: data.enabled !== undefined ? data.enabled : true,
        owner: data.owner || '',
        createTime: data.createTime || M.getCurrentDate(),
        desc: data.desc || '',

        inputs: data.inputs || [],
        outputs: data.outputs || [],
        config: data.config || [],
        usage: data.usage || { referenced: 0, assembled: 0 },
        demands: data.demands || [],
        icon: data.icon || 'fa-brain',
        color: data.color || '#722ED1'
      };
    }
  };

  // ========== 规则 ==========

  M.Rule = {
    create: function(data) {
      data = data || {};
      return {
        id: data.id || '',
        name: data.name || '',
        type: data.type || M.Enum.RuleType.THRESHOLD,
        version: data.version || 'v1.0',
        status: data.status || M.Enum.PublishStatus.DRAFT,
        enabled: data.enabled !== undefined ? data.enabled : true,
        owner: data.owner || '',
        createTime: data.createTime || M.getCurrentDate(),
        desc: data.desc || '',

        conditions: data.conditions || [],
        config: data.config || [],
        usage: data.usage || { referenced: 0, assembled: 0 },
        demands: data.demands || [],
        icon: data.icon || 'fa-sliders',
        color: data.color || '#FAAD14'
      };
    }
  };

})();
