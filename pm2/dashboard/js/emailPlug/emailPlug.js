define(["oss_core/pm/dashboard/js/emailPlug/emailConfigView"],function(emailConfigView){
  return {
      emailConfig:function(param){


        var configView =new emailConfigView().render();
        var option = {
             content: configView.$el,
             width: 340,
             height: 430
         };
        var view= fish.popup(option);
        configView.afterRender()
        configView.listenTo(configView, 'close',function () {
                   view.close();
        });
      }
  }
})
