define(["oss_core/pm/dashboard/js/emailPlug/emailConfigView"],function(emailConfigView){
  return {
      emailConfig:function(param){


        var configView =new emailConfigView(param).render();
        var option = {
             content: configView.$el,
             width: 370,
             height: 580
         };
        var view= fish.popup(option);
        configView.afterRender()
        configView.listenTo(configView, 'close',function () {
                   view.close();
        });
      }
  }
})
