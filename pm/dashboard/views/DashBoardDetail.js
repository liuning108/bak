
define([
  "oss_core/pm/dashboard/js/html2canvas",
  "oss_core/pm/dashboard/js/Dcharts",
  "oss_core/pm/dashboard/js/echarts-all-3",
   "i18n!oss_core/pm/dashboard/i18n/SDesinger",
   "text!oss_core/pm/dashboard/templates/DashBoardDetail.html"
], function(html2canvas, Dcharts, echarts, i18nData, tpl) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    resource: fish.extend({}, i18nData),
    initialize: function(options) {
      this.options = options;
    },
    events: {
      'click #saveButton': 'saveButton',
      'click #perviewButton': 'perviewButton',
      'click .canvaset': 'RenderView',
      'click #canvasPage': 'RenderView',
      'click #showListButton': 'showListButton',
      'click #uplodImage': 'upload',
      'click .BarBase': 'addBarBase'
    },

    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    afterRender: function() {
       this.$el.find(".dashboardName").text(this.model.name);
    }
  });
});
