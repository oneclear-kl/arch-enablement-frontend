/**
 * 业务中台装配环境 - 共享脚手架
 *
 * 功能：侧边栏动态渲染、顶部导航、Toast 通知、弹窗控制等
 * 引用方式：<script src="../_shared/scaffold.js"></script>
 *
 * 每个页面只需定义当前页 ID，其余由脚手架自动生成
 */

var Scaffold = (function() {

  // ========== 侧边栏配置（三级：group → subgroup → item） ==========

  var SIDEBAR_CONFIG = [
    {
      group: '业务架构使能',
      icon: 'fa-building-columns',
      phase: 2,
      subgroups: [
        {
          label: '架构资产管理',
          icon: 'fa-sitemap',
          items: [
            { id: 'arch-assets',    label: '架构资产目录',        href: 'pages/architecture/assets.html',      phase: 2 },
            { id: 'arch-search',    label: '资产检索与共享',      href: 'pages/architecture/search.html',      phase: 2 }
          ]
        },
        {
          label: '架构治理驾驶舱',
          icon: 'fa-gauge-high',
          items: [
            { id: 'arch-panorama',  label: '架构全景看板',        href: 'pages/architecture/panorama.html',    phase: 2 },
            { id: 'arch-metrics',   label: '架构指标监控',        href: 'pages/architecture/metrics.html',     phase: 2 },
            { id: 'arch-assessment',label: '架构评估',            href: 'pages/architecture/assessment.html',  phase: 2 }
          ]
        },
        {
          label: '业务数字化单元建模管理',
          icon: 'fa-cubes',
          items: [
            { id: 'model-framework',label: '业务框架分级分类管理',   href: 'pages/modeling/framework.html',       phase: 2 },
            { id: 'model-org',     label: '标准化组织角色建模',   href: 'pages/modeling/organization.html',    phase: 2 },
            { id: 'model-unit',    label: '业务数字化单元建模',   href: 'pages/modeling/unit-model.html',      phase: 2 },
            { id: 'model-ontology',label: '业务数字化单元本体建模', href: 'pages/modeling/unit-ontology.html',   phase: 2 },
            { id: 'model-rules',   label: '业务规则建模与监控',   href: 'pages/modeling/rules-model.html',     phase: 2 },
            { id: 'model-standard',label: '业务数字化单元采集标准建模', href: 'pages/modeling/collection-standard.html', phase: 2 },
            { id: 'model-tools',   label: '业务数字化单元工具建模', href: 'pages/modeling/tools-model.html',     phase: 2 },
            { id: 'model-ledger',  label: '业务数字化单元台账',   href: 'pages/modeling/unit-ledger.html',     phase: 2 }
          ]
        },
        {
          label: '业务数字化单元采集管理',
          icon: 'fa-database',
          items: [
            { id: 'collect-process',label: '数据采集流程接入与适配', href: 'pages/collection/process.html',       phase: 2 },
            { id: 'collect-task',  label: '数据采集任务智能编排与调度', href: 'pages/collection/task-schedule.html', phase: 2 },
            { id: 'collect-assessment',label: '数据采集分析与考核', href: 'pages/collection/assessment.html',    phase: 2 },
            { id: 'collect-infra', label: '标准化采集基础支撑',   href: 'pages/collection/infrastructure.html',phase: 2 },
            { id: 'collect-iot',   label: '自动化采集率监控',     href: 'pages/collection/iot-monitor.html',   phase: 2 },
            { id: 'collect-lake',  label: '生产数据入湖质量分析', href: 'pages/collection/lake-quality.html',  phase: 2 },
            { id: 'collect-product',label: '数据产品可用性分析',  href: 'pages/collection/data-product.html',  phase: 2 }
          ]
        }
      ]
    },
    {
      group: '应用架构使能',
      icon: 'fa-layer-group',
      phase: 1,
      subgroups: [
        {
          label: '业务中台管理',
          icon: 'fa-clipboard-list',
          items: [
            { id: 'demand',     label: '业务中台需求台账管理',   href: 'pages/demand.html',       phase: 1 },
            { id: 'review',     label: '业务中台需求评审管理',   href: 'pages/review.html',       phase: 1 },
            { id: 'classification',label: '业务中台分级分类管理', href: 'pages/classification.html',phase: 1 },
            { id: 'monitoring', label: '业务中台运行监控',       href: 'pages/monitoring.html',   phase: 1 },
            { id: 'incidents',  label: '异常处理',               href: 'pages/incidents.html',    phase: 1 }
          ]
        },
        {
          label: '领域服务协同工作台',
          icon: 'fa-puzzle-piece',
          items: [
            { id: 'workspace',  label: '工作台总览',          href: 'pages/workspace.html',   phase: 1 },
            { id: 'components', label: '领域服务组件编排',       href: 'pages/components.html',   phase: 1 },
            { id: 'assembly',   label: '领域服务协同可视化设计', href: 'pages/assembly.html',     phase: 1 },
            { id: 'data-service',label: '领域服务数据标准接入',  href: 'pages/data-service.html', phase: 1 },
            { id: 'rules',      label: '领域服务编排规则配置',   href: 'pages/rules.html',        phase: 1 },
            { id: 'model-service',label: '领域服务智能能力适配', href: 'pages/model-service.html',phase: 1 },
            { id: 'publish',    label: '领域服务编排成果预览发布', href: 'pages/publish.html',      phase: 1 }
          ]
        },
        {
          label: '事件风暴管理',
          icon: 'fa-cloud-bolt',
          items: [
            { id: 'es-canvas',  label: '事件风暴建模',       href: 'pages/event-storming/canvas.html',  phase: 3 },
            { id: 'es-elements',label: '建模要素管理',       href: 'pages/event-storming/elements.html',phase: 3 },
            { id: 'es-ai',      label: '智能化辅助建模',     href: 'pages/event-storming/ai-assist.html',phase: 3 }
          ]
        },
        {
          label: '领域服务管理',
          icon: 'fa-diagram-project',
          items: [
            { id: 'domain-term',label: '领域名词管理',       href: 'pages/domain/terminology.html',       phase: 3 },
            { id: 'domain-center',label: '领域中心建模',    href: 'pages/domain/center-model.html',       phase: 3 },
            { id: 'domain-app', label: '应用前后端建模',     href: 'pages/domain/app-model.html',         phase: 3 },
            { id: 'domain-product',label: '产品体系建模',   href: 'pages/domain/product-model.html',     phase: 3 }
          ]
        }
      ]
    }
  ];

  // ========== 工具函数 ==========

  function getCurrentDate() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
  }

  function getCurrentTimestamp() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
      + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
  }

  // ========== Toast 通知 ==========

  function showToast(message, type) {
    type = type || 'info';
    var toast = document.getElementById('_toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = '_toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    var iconMap = { success: 'fa-check-circle', info: 'fa-info-circle', warning: 'fa-exclamation-triangle' };
    toast.className = 'toast show toast-' + type;
    toast.innerHTML = '<i class="fa-regular ' + (iconMap[type] || 'fa-info-circle') + '"></i><span>' + message + '</span>';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() { toast.classList.remove('show'); }, 2500);
  }

  // ========== 弹窗控制 ==========

  function showModal(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.add('show'); el.style.display = 'flex'; }
  }

  function hideModal(id) {
    var el = document.getElementById(id);
    if (el) { el.classList.remove('show'); el.style.display = 'none'; }
  }

  // ========== 全局 Confirm 弹窗 ==========
  var _confirmCallback = null;
  function showConfirm(message, title, callback) {
    title = title || '确认操作';
    var overlay = document.getElementById('_confirm_overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = '_confirm_overlay';
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = '<div class="confirm-box" id="_confirm_box">'
        + '<div class="confirm-header"><span class="confirm-title" id="_confirm_title">确认</span></div>'
        + '<div class="confirm-body"><p id="_confirm_message">确定要执行此操作？</p></div>'
        + '<div class="confirm-footer">'
        + '<button class="btn btn-outline" id="_confirm_cancel">取消</button>'
        + '<button class="btn btn-primary" id="_confirm_ok">确定</button></div></div>';
      document.body.appendChild(overlay);
      document.getElementById('_confirm_cancel').addEventListener('click', function() {
        overlay.style.display = 'none';
        if (_confirmCallback) _confirmCallback(false);
      });
      document.getElementById('_confirm_ok').addEventListener('click', function() {
        overlay.style.display = 'none';
        if (_confirmCallback) _confirmCallback(true);
      });
    }
    document.getElementById('_confirm_title').textContent = title;
    document.getElementById('_confirm_message').textContent = message;
    overlay.style.display = 'flex';
    _confirmCallback = callback || null;
  }

  // ========== 全局 Loading 遮罩 ==========

  function showLoading(message) {

    message = message || "加载中...";

    var el = document.getElementById("_loading_overlay");

    if (!el) {

      el = document.createElement("div");

      el.id = "_loading_overlay";

      el.className = "loading-overlay";

      el.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-spinner fa-spin text-2xl" style="color:var(--brand)"></i><p id="_loading_text" style="margin-top:8px;font-size:13px;color:var(--text-secondary)">加载中...</p></div>';

      document.body.appendChild(el);

    }

    document.getElementById("_loading_text").textContent = message;

    el.style.display = "flex";

  }

  function hideLoading() {

    var el = document.getElementById("_loading_overlay");

    if (el) el.style.display = "none";

  }

  // ========== 侧边栏折叠状态管理 ==========

  var LS_KEY = 'scaffold_sidebar_state';

  // ========== 页面导航桥接（localStorage 跨页传参） ==========

  var NAV_KEY = "scaffold_nav_params";

  function navigateTo(url, params) {

    if (params) {

      try { localStorage.setItem(NAV_KEY, JSON.stringify(params)); } catch(e) {}

    }

    window.location.href = url;

  }

  function getNavParams() {

    try {

      var raw = localStorage.getItem(NAV_KEY);

      localStorage.removeItem(NAV_KEY);

      return raw ? JSON.parse(raw) : null;

    } catch(e) { return null; }

  }

  

  // ========== 键盘快捷键管理 ==========

  var _shortcuts = [];

  function registerShortcut(key, ctrl, handler, desc) {

    _shortcuts.push({ key: key, ctrl: ctrl, handler: handler, desc: desc || "" });

  }

  function initKeyboardShortcuts(currentPageId) {

    document.addEventListener("keydown", function(e) {

      for (var i = 0; i < _shortcuts.length; i++) {

        var s = _shortcuts[i];

        if (e.key === s.key && (!s.ctrl || e.ctrlKey || e.metaKey)) {

          // 不在输入框中才触发全局快捷键

          var tag = e.target.tagName;

          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

          e.preventDefault();

          s.handler(e);

          return;

        }

      }

    });

    // 注册 Escape 关闭所有弹窗

    registerShortcut("Escape", false, function() {

      // 关闭所有 modal-overlay

      var modals = document.querySelectorAll(".modal-overlay.show, .detail-overlay.show, .confirm-overlay");

      for (var i = 0; i < modals.length; i++) {

        modals[i].style.display = "none";

        modals[i].classList.remove("show");

      }

      // 关闭 Toast

      var toasts = document.querySelectorAll(".toast.show");

      for (var i = 0; i < toasts.length; i++) {

        toasts[i].classList.remove("show");

      }

    }, "关闭弹窗");

  }

  

  function loadSidebarState() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function saveSidebarState(state) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch(e) {}
  }

  // ========== 渲染侧边栏（三级结构 + 折叠） ==========

  function renderSidebar(containerId, currentPageId, itemBase, homeBase) {
    itemBase = itemBase || '';
    homeBase = homeBase || itemBase;
    var container = document.getElementById(containerId);
    if (!container) return;

    var state = loadSidebarState();
    var html = '';

    // 首页链接
    html += '<a href="' + homeBase + 'index.html" class="side-link' + (currentPageId === 'home' ? ' active' : '') + '">'
      + '<i class="fa-solid fa-home w-4 text-center mr-2 text-xs"></i><span>首页工作台</span></a>';

    // 遍历一级分组
    for (var g = 0; g < SIDEBAR_CONFIG.length; g++) {
      var group = SIDEBAR_CONFIG[g];
      var groupKey = group.group;
      var groupCollapsed = (state[groupKey] === false);

      // 一级标题（可折叠）
      html += '<div class="side-section' + (groupCollapsed ? ' collapsed' : '') + '" data-scaffold-group="' + groupKey + '">'
        + '<span><i class="fa-solid ' + group.icon + ' text-[11px] mr-2" style="color:#888"></i>' + group.group + '</span>'
        + '<i class="fa-solid fa-chevron-down text-[10px]" style="color:#999"></i></div>';

      // 一级主体
      html += '<div class="side-group-body">';

      // 遍历二级子分组
      for (var s = 0; s < group.subgroups.length; s++) {
        var sub = group.subgroups[s];
        var subKey = groupKey + '|' + sub.label;
        var subCollapsed = (state[subKey] === false);

        // 检查当前页面是否属于这个 subgroup
        var subActive = false;
        for (var si = 0; si < sub.items.length; si++) {
          if (sub.items[si].id === currentPageId) { subActive = true; break; }
        }

        // 二级标题（可折叠）
        html += '<div class="side-subsection' + (subCollapsed ? ' collapsed' : '') + (subActive ? ' active' : '') + '" data-scaffold-sub="' + subKey + '">'
          + '<span><i class="fa-solid ' + sub.icon + ' text-[10px] mr-1" style="color:' + (subActive ? '#005AF0' : '#aaa') + '"></i>' + sub.label + '</span>'
          + '<i class="fa-solid fa-chevron-down text-[10px]" style="color:#999"></i></div>';

        // 二级主体
        html += '<div class="side-subgroup-body">';

        // 遍历三级菜单项
        for (var i = 0; i < sub.items.length; i++) {
          var item = sub.items[i];
          var isActive = (item.id === currentPageId);
          var phaseLabel = item.phase > 1 ? ' <span style="font-size:9px;color:#999;margin-left:auto">P' + item.phase + '</span>' : '';
          html += '<a href="' + itemBase + item.href + '" class="side-link sub' + (isActive ? ' active' : '') + '">'
            + '<i class="fa-solid fa-circle w-4 text-center mr-2 text-xs" style="font-size:4px;color:' + (isActive ? '#005AF0' : '#bbb') + '"></i>'
            + '<span>' + item.label + '</span>' + phaseLabel + '</a>';
        }

        html += '</div>'; // side-subgroup-body
      }

      html += '</div>'; // side-group-body
    }

    container.innerHTML = html;

    // 绑定折叠事件
    bindSidebarCollapse(container, state);
  }

  function bindSidebarCollapse(container, state) {
    // 一级折叠
    var sections = container.querySelectorAll('.side-section');
    for (var i = 0; i < sections.length; i++) {
      sections[i].addEventListener('click', function(e) {
        var el = this;
        var groupKey = el.getAttribute('data-scaffold-group');
        el.classList.toggle('collapsed');
        state[groupKey] = !el.classList.contains('collapsed');
        saveSidebarState(state);
      });
    }

    // 二级折叠
    var subsections = container.querySelectorAll('.side-subsection');
    for (var j = 0; j < subsections.length; j++) {
      subsections[j].addEventListener('click', function(e) {
        e.stopPropagation(); // 防止冒泡到一级
        var el = this;
        var subKey = el.getAttribute('data-scaffold-sub');
        el.classList.toggle('collapsed');
        state[subKey] = !el.classList.contains('collapsed');
        saveSidebarState(state);
      });
    }
  }

  // ========== 渲染面包屑 ==========

  function renderBreadcrumb(items) {
    var html = '<div class="breadcrumb">';
    for (var i = 0; i < items.length; i++) {
      if (items[i].href) {
        html += '<a href="' + items[i].href + '">' + items[i].label + '</a>';
      } else {
        html += '<span>' + items[i].label + '</span>';
      }
      if (i < items.length - 1) {
        html += ' <span class="breadcrumb-sep">/</span>';
      }
    }
    html += '</div>';
    return html;
  }

  // ========== 根据 pageId 查找菜单层级生成面包屑数据 ==========

  function buildBreadcrumbItems(pageId, homeBase) {
    for (var g = 0; g < SIDEBAR_CONFIG.length; g++) {
      var group = SIDEBAR_CONFIG[g];
      for (var s = 0; s < group.subgroups.length; s++) {
        var subgroup = group.subgroups[s];
        for (var i = 0; i < subgroup.items.length; i++) {
          var item = subgroup.items[i];
          if (item.id === pageId) {
            // 一级分组链接到该分组第一个页面
            var firstGroupHref = '';
            if (group.subgroups.length > 0 && group.subgroups[0].items.length > 0) {
              firstGroupHref = homeBase + group.subgroups[0].items[0].href;
            }
            // 二级子分组链接到该子分组第一个页面
            var firstSubHref = '';
            if (subgroup.items.length > 0) {
              firstSubHref = homeBase + subgroup.items[0].href;
            }
            return [
              { label: '首页', href: homeBase + 'index.html' },
              { label: group.group, href: firstGroupHref },
              { label: subgroup.label, href: firstSubHref },
              { label: item.label }
            ];
          }
        }
      }
    }
    return null; // 未找到匹配的菜单项
  }

  // ========== 页面加载完成后自动初始化 ==========

  function init(currentPageId) {
    var path = window.location.pathname;
    var itemBase = '';  // 侧边栏项的 basePath（href 格式: pages/xxx.html）
    var homeBase = '';  // 首页链接的 basePath（回到项目根 index.html）

    if (path.indexOf('/pages/') >= 0) {
      // 当前页面在 pages/ 目录内
      // 侧边栏项需要回到项目根部（因为 href 以 pages/ 开头）
      itemBase = '../';
      // 首页链接需要回到项目根（根据深度叠加 ../）
      var afterPages = path.substring(path.indexOf('/pages/') + 7);
      var subDepth = afterPages.split('/').length - 1;
      homeBase = '../'.repeat(subDepth + 1);
    }

    renderSidebar('sidebar', currentPageId || '', itemBase, homeBase);

    // 自动滚动侧边栏，使当前激活菜单项居中可见
    scrollActiveItemIntoView('sidebar');

    // 自动生成面包屑
    var bcContainer = document.getElementById('breadcrumb');
    if (currentPageId && bcContainer) {
      var bcItems = buildBreadcrumbItems(currentPageId, homeBase);
      if (bcItems) {
        bcContainer.innerHTML = renderBreadcrumb(bcItems);
      }
    }

    if (!document.getElementById('_toast')) {
      var t = document.createElement('div');
      t.id = '_toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }

    // 初始化键盘快捷键
    initKeyboardShortcuts(currentPageId);
  }

  // ========== 自动滚动到活跃菜单项（延迟到 CSS 动画完成后） ==========

  function scrollActiveItemIntoView(sidebarId) {
    var sidebar = document.getElementById(sidebarId);
    if (!sidebar) return;
    var active = sidebar.querySelector('.side-link.active');
    if (!active) return;
    // 延迟 400ms 等待侧边栏 max-height transition (0.3s) 完全结束
    setTimeout(function() {
      // 确保所有父级折叠容器已展开，让活跃项可达
      var el = active;
      while (el && el !== sidebar) {
        // 展开被折叠的 subgroup body
        if (el.classList && el.classList.contains('side-subgroup-body')) {
          var subHeader = el.previousElementSibling;
          if (subHeader && subHeader.classList.contains('side-subsection') && subHeader.classList.contains('collapsed')) {
            subHeader.classList.remove('collapsed');
          }
        }
        // 展开被折叠的 group body
        if (el.classList && el.classList.contains('side-group-body')) {
          var groupHeader = el.previousElementSibling;
          if (groupHeader && groupHeader.classList.contains('side-section') && groupHeader.classList.contains('collapsed')) {
            groupHeader.classList.remove('collapsed');
          }
        }
        el = el.parentElement;
      }
      
      // 等浏览器完成重排后再滚动
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          var sidebarRect = sidebar.getBoundingClientRect();
          var activeRect = active.getBoundingClientRect();
          if (activeRect.top < sidebarRect.top || activeRect.bottom > sidebarRect.bottom) {
            sidebar.scrollTop = sidebar.scrollTop + activeRect.top - sidebarRect.top 
              - sidebarRect.height / 2 + activeRect.height / 2;
          }
        });
      });
    }, 400);
  }

  // ========== 全局场景数据机制 ==========

  var SCENARIO_KEY = 'scene_oil_well_pump';

  function seedScenarioData() {
    localStorage.setItem(SCENARIO_KEY, 'active');
    localStorage.setItem('scene_demand_id', 'DMD-0024');
    localStorage.setItem('scene_demand_title', '油气生产智能感知平台');
    localStorage.setItem('scene_component_ids', JSON.stringify(['C001','C002','C017','C018','C019','C003']));
    localStorage.setItem('scene_component_names', '油井数据采集,压力传感器读取,振动传感器采集,温度传感器采集,电流电压采集,抽油机工艺流程图');
    localStorage.setItem('scene_domain', '油气新能源');
    localStorage.setItem('scene_rule_category', '业务流转规则');
    localStorage.setItem('scene_model_category', '预测分析能力');
    localStorage.setItem('scene_publish_service', '抽油机远程智能运维');
  }

  function clearScenarioData() {
    localStorage.removeItem(SCENARIO_KEY);
    localStorage.removeItem('scene_demand_id');
    localStorage.removeItem('scene_demand_title');
    localStorage.removeItem('scene_component_ids');
    localStorage.removeItem('scene_component_names');
    localStorage.removeItem('scene_domain');
    localStorage.removeItem('scene_rule_category');
    localStorage.removeItem('scene_model_category');
    localStorage.removeItem('scene_publish_service');
  }

  function isScenarioActive() {
    return localStorage.getItem(SCENARIO_KEY) === 'active';
  }

  // ===== 需求上下文：全局读写 =====
  var DEMAND_CTX_KEY = 'scaffold_demand_context';

  function setCurrentDemand(id, title) {
    try { localStorage.setItem(DEMAND_CTX_KEY, JSON.stringify({id: id, title: title})); } catch(e) {}
  }

  function getCurrentDemand() {
    try {
      var raw = localStorage.getItem(DEMAND_CTX_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  function clearCurrentDemand() {
    localStorage.removeItem(DEMAND_CTX_KEY);
  }

  function renderDemandBar() {
    // 页面上有 id="demandBar" 的容器时，渲染当前需求标签
    var bar = document.getElementById('demandBar');
    if (!bar) return;
    var d = getCurrentDemand();
    if (d) {
      bar.innerHTML = '<div class="flex items-center gap-2 px-3 py-1.5 rounded text-xs" style="background:var(--brand-subtle);border:1px solid var(--brand)">'
        + '<i class="fa-solid fa-file-lines" style="color:var(--brand);font-size:11px"></i>'
        + '<span style="color:var(--brand);font-weight:600">' + d.id + '</span>'
        + '<span style="color:var(--text-primary)">' + d.title + '</span>'
        + '</div>';
    } else {
      bar.innerHTML = '<div class="text-xs" style="color:var(--text-tertiary)">未选择需求</div>';
    }
  }

  // ===== 发布回写桥接：发布→需求状态+分类 =====
  function publishService(demandId, demandTitle, serviceName, version) {
    // 1. 保存发布记录
    var records = [];
    try { records = JSON.parse(localStorage.getItem('published_services') || '[]'); } catch(e) {}
    records.push({demandId: demandId, serviceName: serviceName, version: version, date: new Date().toISOString()});
    localStorage.setItem('published_services', JSON.stringify(records));

    // 2. 更新需求状态快照
    var updates = {};
    try { updates = JSON.parse(localStorage.getItem('demand_status_updates') || '{}'); } catch(e) {}
    updates[demandId] = {status: '已上线', version: version, serviceName: serviceName, updatedAt: new Date().toISOString()};
    localStorage.setItem('demand_status_updates', JSON.stringify(updates));
  }

  function getPublishedServices() {
    try { return JSON.parse(localStorage.getItem('published_services') || '[]'); } catch(e) { return []; }
  }

  function getDemandStatusUpdates() {
    try { return JSON.parse(localStorage.getItem('demand_status_updates') || '{}'); } catch(e) { return {}; }
  }

  // ===== 流水线步骤状态：各 step 页面写回进度 =====
  function _getStepKey() {
    var d = getCurrentDemand();
    return d && d.id ? 'workspace_status_' + d.id : null;
  }

  function markStepInProgress(stepId) {
    var key = _getStepKey();
    if (!key) return;
    try {
      var statuses = JSON.parse(localStorage.getItem(key) || '{}');
      if (statuses[stepId] !== 'completed') {
        statuses[stepId] = 'in_progress';
        localStorage.setItem(key, JSON.stringify(statuses));
      }
    } catch(e) {}
  }

  function markStepCompleted(stepId) {
    var key = _getStepKey();
    if (!key) return;
    try {
      var statuses = JSON.parse(localStorage.getItem(key) || '{}');
      statuses[stepId] = 'completed';
      localStorage.setItem(key, JSON.stringify(statuses));
    } catch(e) {}
  }

  // ========== 公开 API ==========

  return {
    VERSION: '2.1.0',
    SIDEBAR_CONFIG: SIDEBAR_CONFIG,
    renderSidebar: renderSidebar,
    renderBreadcrumb: renderBreadcrumb,
    showToast: showToast,
    showModal: showModal,
    hideModal: hideModal,
    showConfirm: showConfirm,
    showLoading: showLoading,
    hideLoading: hideLoading,
    navigateTo: navigateTo,
    getNavParams: getNavParams,
    registerShortcut: registerShortcut,
    getCurrentDate: getCurrentDate,
    getCurrentTimestamp: getCurrentTimestamp,
    init: init,
    seedScenarioData: seedScenarioData,
    clearScenarioData: clearScenarioData,
    isScenarioActive: isScenarioActive,
    setCurrentDemand: setCurrentDemand,
    getCurrentDemand: getCurrentDemand,
    clearCurrentDemand: clearCurrentDemand,
    renderDemandBar: renderDemandBar,
    publishService: publishService,
    getPublishedServices: getPublishedServices,
    getDemandStatusUpdates: getDemandStatusUpdates,
    markStepInProgress: markStepInProgress,
    markStepCompleted: markStepCompleted,
    SCENARIO_KEY: SCENARIO_KEY
  };

})();

// 兼容旧全局用法
var showToast = Scaffold.showToast;
var showModal = Scaffold.showModal;
var hideModal = Scaffold.hideModal;
var showConfirm = Scaffold.showConfirm;
var showLoading = Scaffold.showLoading;
var hideLoading = Scaffold.hideLoading;
var navigateTo = Scaffold.navigateTo;

if (typeof window !== 'undefined') {
  window.Scaffold = Scaffold;
}
