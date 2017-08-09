/**
 * 指标筛选弹出窗
 */
define([
  "oss_core/pm/dashboard/js/html2canvas",
  "oss_core/pm/dashboard/js/Dcharts",
  "oss_core/pm/dashboard/js/echarts-all-3",
  "i18n!oss_core/pm/dashboard/i18n/SDesinger",
  "text!oss_core/pm/dashboard/templates/DashBoardIndex.html",
  'css!oss_core/pm/util/css/ad-component.css',
  'css!oss_core/pm/util/css/ad-block.css',
  'css!oss_core/pm/dashboard/assets/bi-common.css',
  'css!oss_core/pm/dashboard/assets/adhoc.css'
], function(html2canvas, Dcharts, echarts, i18nData, tpl) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    resource: fish.extend({}, i18nData),
    initialize: function(options) {
      this.parentView = options.parentView;
      this.params = options.params;
    },
    events: {},

    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    afterRender: function() {
      this.initTopicTabs();
      this.initTopicTree();
      this.resize();
      return this;
    },

    initTopicTree: function() {
      this.treeSetting = {
        expandAll: true,
        view: {
          selectedMulti: false
        },
        edit: {
          enable: true,
          removeTitle: 'removeTitle',
          renameTitle: 'renameTitle',
          editNameSelectAll: true,
          drag: false
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        fNodes: [
          {
            id: 1,
            pId: 0,
            name: "展开、折叠 iconSkin",
            open: true
          }, {
            id: 11,
            pId: 1,
            name: "字体图标1",
            iconSkin: "ico_ind"
          }, {
            id: 12,
            pId: 1,
            name: "字体图标2",
            iconSkin: "ico_ind"
          }, {
            id: 13,
            pId: 1,
            name: "字体图标3",
            iconSkin: "ico_ind"
          }, {
            id: 21,
            pId: 2,
            name: "字体图标1",
            iconSkin: "ico_ind"
          }, {
            id: 22,
            pId: 2,
            name: "字体图标2",
            iconSkin: "ico_ind"
          }, {
            id: 23,
            pId: 2,
            name: "字体图标3",
            iconSkin: ""
          }, {
            id: 3,
            pId: 0,
            name: "使用字体图标iconSkin",
            iconSkin: "pIcon02",
            open: true
          }, {
            id: 31,
            pId: 3,
            name: "字体图标1"
          }, {
            id: 32,
            pId: 3,
            name: "字体图标2"
          }, {
            id: 33,
            pId: 3,
            name: "字体图标3"
          }
        ],
        callback: {}
      };
      alert(this.$el.find("#dashboardTree").length);
      this.$el.find("#dashboardTree").tree(this.treeSetting);

    },

    initTopicTabs: function() {
      var self = this;
      this.$("#ad-dashboard-tabs").tabs({
        canClose: true,
        paging: {
          "selectOnAdd": true
        },
        remove: function(e, ui) {},
        activate: function(e, ui) {}
      });
    },

    resize: function() {
      this.uiTabHeight = this.$el.parents(".tabs_nav").outerHeight();
      this.leftTreeHeight = this.uiTabHeight - 83; //95
      this.$el.find("#dashboardTree").css({
        'height': + this.leftTreeHeight + 'px'
      });

    }

  });
});
