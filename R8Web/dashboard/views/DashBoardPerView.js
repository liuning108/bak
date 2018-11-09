
define([
  "oss_core/pm/dashboard/actions/DashBoardAction",
  "oss_core/pm/dashboard/js/html2canvas",
  "oss_core/pm/dashboard/js/Dcharts",
  "oss_core/pm/dashboard/js/echarts-all-3",
   "i18n!oss_core/pm/dashboard/i18n/SDesinger",
   "text!oss_core/pm/dashboard/templates/DashBoardPerView.html"
], function(action,html2canvas, Dcharts, echarts, i18nData, tpl) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    resource: fish.extend({}, i18nData),
    initialize: function(options) {
      this.options = options;
    },
    events: {

    },



    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    afterRender: function() {
        var self =this;
       var canvasjson =this.model.json;
       var len =this.$el.find("#dashboard-detail-canvas").length
       var ratio = (9 / 16);
       var dash_w = this.$el.find("#dashboard-detail-canvas").outerWidth()
      this.$el.find(".dashBoardDetailPerviewContext").slimscroll({
   				  	height: self.model.h-53,  	//取其父元素高度作为滚动高度；默认为250px
   				  	width: 'auto',	  	//取其父元素宽度作为滚动宽度；默认为'auto'
   				  	axis: 'y',
   				  	hideBarAfterInit: true   //滚动轴初始化完成后是否隐藏，默认为隐藏
   				});


       var factor=dash_w/canvasjson.attrs.size.w;
       this.dcharts=Dcharts.init({
         id:canvasjson.id,
         name:this.model.name,
         containment: this.$el.find("#dashboard-detail-canvas"),
         ratio: ratio,
         bgitem:canvasjson.attrs.bgitem||0,
         bk:canvasjson.attrs.bk||{"background":"#fff"},
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
