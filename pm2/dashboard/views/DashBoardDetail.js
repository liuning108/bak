
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
      'click .ad-deldashboard-btn':"delDashBoard",
      'click .ad-refreshdashboard-btn':"refresh",
      'click .dashboard-favdashboard-btn': 'favdash',
      'click .dashboard-mail-btn':'sendmail'
    },
    sendmail:function() {
      var id =this.model.id;
      var re = new RegExp(/^.*\//);
      var url =re.exec(window.location.href);
      var self =this;
      fish.prompt('emails', '122273014@qq.com').result.then(function(edata) {
            if(!edata)return;
            if(edata.length>1){
              action.sendTopicPic({
                'urlRoot':url,
                'urlPage':'/oss_core/pm/dashboard/bghtml.html?id='+self.model.id,
                "fileName":self.model.id+".png",
                'topicName':self.model.name,
                'emails':edata
              },function(data){
                fish.toast('success', 'send success')
              })
            }

        });

    },
    favdash:function(e) {
      this.model.fav=!this.model.fav;
      var topicId =this.model.id;
      var userId = portal.appGlobal.get("userId")
      var classType ="00"
      var isDel = this.model.fav?false:true;
      var sysClassStyle = this.model.fav?'fa-star-o':'fa-star';
      var self =this;
      action.updateSysClass(topicId,classType,userId,isDel,function(){
        $(e.currentTarget).find('.fa')
                          .removeClass('fa-star')
                          .removeClass('fa-star-o')
                          .addClass(sysClassStyle)
          self.options.parentView.favoriteNods();
          fish.toast('success', 'success')
      })


    },
    refresh:function() {
        var self =this;
        self.options.parentView.previewDashBoard(self.model.id,self.model.name,self.model.treeNode);
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
        var self =this;
       this.$el.find(".dashboardName").text(this.model.name);
       var sysClassStyle = this.model.fav?'fa-star-o':'fa-star';
       $('.dashboard-favdashboard-btn').find('.fa').addClass(sysClassStyle)
       var canvasjson =this.model.json;
       var len =$("#dashboard-detail-canvas").length
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
