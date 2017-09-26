define([
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
  "oss_core/pm/adhocdesigner/views/AdhocFactory",
], function(GNode,echarts,adhocFactory) {

  var AdHocNode = GNode.extend({
    createGNode:function(){
        var self =this;
        this.myChart ={resize:function(){}}
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.append('<div class="adhocImage"></div>')
        this.context=$divContext.find('.adhocImage');
        if(self.attrs.adhocNo){
          this.context.css({"background":"none"});
           self.showAdhoc(self.attrs.adhocNo);
        }
    },

    showAdhoc: function (adhocNo) {

           this.view = adhocFactory.adhocForDashBoard(367, adhocNo);
           this.context.show();
           this.context.css({"background":"none"});
           this.context.html(this.view.$el);
           this.context.find('.vbox').height(this.context.height());
          this.view.dashBoardResize(this.context.width(),this.context.height())
    },


    resizableStop:function(event, ui) {
      this.options.w=ui.size.width;
      this.options.h=ui.size.height;
       //this.context.find('.vbox').height(this.context.height());
       //this.view.resize();
       //
        this.view.dashBoardResize(this.options.w, this.options.h);
    },

    editNode:function() {
      var self =this;
      var adhocNo=self.attrs.adhocNo;
      var view=adhocFactory.adhocConfigForDashBoard(600,adhocNo);
      var content = view.$el;
      
      var option = {
          content: content,
          width: 1300,
          height: 600
      };
      this.adhocCfgView = fish.popup(option);

      view.listenTo(view, 'AdhocSaveEvent', function (data) {
        self.context.css({"background":"none"});
          self.showAdhoc(data.adhocNo)
          self.attrs.adhocNo=data.adhocNo;
          self.adhocCfgView.close();
          self.autoSave();
      });

      view.listenTo(view, 'AdhocCancelEvent',function () {
           self.adhocCfgView.close();
      });




    },
  });

  return AdHocNode
})
