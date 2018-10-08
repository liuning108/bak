define([
  "oss_core/inms/pm/taskprocess/actions/TaskProcessAction.js",
  "oss_core/inms/pm/taskprocess/js/downloadPlug/downloadConfigView.js",
  "oss_core/inms/pm/taskprocess/js/downloadPlug/downloadListView.js"
  ],
  function (action,downloadConfigView,downloadListView) {
     return {
       downloadList:function(){
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
       downloadConfig:function(config){
         console.log("donwloadConfig",config);
         if(!config.param.extendDimFilterList){
           config.param.extendDimFilterList=[];
         }
          var configView = new downloadConfigView(config).render();
          var option = {
            content: configView.$el,
            width: 350,
            height: 300
          };
          var view = fish.popup(option);
          configView.afterRender()
          configView.listenTo(configView, 'close', function () {
            view.close();
          });
         action.onceDownloadFile(config);
       }
     }
})
