define([
         "oss_core/pm/dashboard/js/downloadPlug/downloadConfigView",
         "oss_core/pm/dashboard/js/downloadPlug/downloadListView",
         "oss_core/pm/dashboard/js/downloadPlug/sendOnceEmailView"

     ],function(downloadConfigView,downloadListView,sendOnceEmail){
  return {
      downloadList:function() {
          var configView =new downloadListView({}).render();
          var option = {
               content: configView.$el,
               width: 500,
               height: 430
           };
          var view= fish.popup(option);
          configView.afterRender()
          configView.listenTo(configView, 'close',function () {
                     view.close();
          });
      },
      downloadConfig:function(param){
         console.log("downloadConfig");
        var configView =new downloadConfigView(param).render();
        var option = {
             content: configView.$el,
             width: 350,
             height: 300
         };
        var view= fish.popup(option);
        configView.afterRender()
        configView.listenTo(configView, 'close',function () {
                   view.close();
        });
    },
    sendOnceEmail:function(param){
       console.log("sendOnceEmail");
       console.log(param);
      var configView =new sendOnceEmail(param).render();
      var option = {
           content: configView.$el,
           width: 350,
           height: 400
       };
      var view= fish.popup(option);
      configView.afterRender()
      configView.listenTo(configView, 'close',function () {
                 view.close();
      });
    }

  }
})
