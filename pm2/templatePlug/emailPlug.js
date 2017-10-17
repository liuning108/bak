define(["oss_core/pm/dashboard/js/emailPlug/emailConfigView"],function(emailConfigView){
  return {
      emailConfig:function(param){

        alert(emailConfigView)
        var configView =new emailConfigView().render();
        var option = {
             content: configView.$el,
             width: param.width,
             height: param.height
         };
        var view= fish.popup(option);
        configView.afterRender()
        // view.listenTo(view, 'close',function () {
        //            view.close();
        // });
      }
  }
})
