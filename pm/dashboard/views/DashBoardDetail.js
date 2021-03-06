
define([
  "oss_core/pm/dashboard/actions/DashBoardAction",
  "oss_core/pm/dashboard/js/html2canvas",
  "oss_core/pm/dashboard/js/Dcharts",
  "oss_core/pm/dashboard/js/echarts-all-3",
   "i18n!oss_core/pm/dashboard/i18n/SDesinger",
   "text!oss_core/pm/dashboard/templates/DashBoardDetail.html"
], function(action,html2canvas, Dcharts, echarts, i18nData, tpl) {
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
      'click .BarBase': 'addBarBase',
      'click .ad-editdashboard-btn':"editDashBoard",
      'click .ad-deldashboard-btn':"delDashBoard"
    },

    delDashBoard:function() {

      var self =this;
      action.delDashBoardById(self.model.id,function(){
       fish.confirm('Confirm whether to delete this dashboard').result.then(function() {
          var pv=  self.options.parentView;
          pv.$("#ad-dashboard-tabs").tabs("remove", 1);
          var treeInstance = pv.$el.find("#dashboardTree").tree("instance");
          treeInstance.removeNode(self.model.treeNode)
           fish.toast('success', 'successfully delete')
       });

      })

    },

    editDashBoard:function() {
        var self =this;

        self.options.parentView.parentView.edit(this.dcharts.getJson());
    },

    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    afterRender: function() {
       this.$el.find(".dashboardName").text(this.model.name);
       var canvasjson =this.model.json;
       var len =$("#dashboard-detail-canvas").length
       var ratio = (9 / 16);
       var dash_w = this.$el.find("#dashboard-detail-canvas").outerWidth()
       var factor=dash_w/canvasjson.attrs.size.w;
       this.dcharts=Dcharts.init({
         id:canvasjson.id,
         name:this.model.name,
         containment: "#dashboard-detail-canvas",
         ratio: ratio,
         size: {
           w: dash_w,
           h: canvasjson.attrs.size.h*factor
         },
         factor: factor,
         nodes:canvasjson.nodes,
         classNo:canvasjson.classNo,
         perview:true,
       });


    }
  });
});
