
define(['frm/portal/Portal'], function(app) {
    portal.appGlobal.set("commoni18n", {'en':'','zh':''});
  	portal.appGlobal.set("customi18n", {'en':'','zh':''});

require([
  "oss_core/pm/adhocdesigner/views/AdhocFactory",
  "oss_core/pm/screendesigner/js/Zcharts",
  "oss_core/pm/screendesigner/actions/BScreenMgrAction",
  "oss_core/pm/dashboard/actions/DashBoardAction",
  "oss_core/pm/dashboard/js/Dcharts",
  "css!oss_core/pm/dashboard/css/dashboard.css",
  "css!oss_core/pm/dashboard/css/dcmegamenu2.css",
  "css!oss_core/pm/dashboard/css/icomoon.css",
  "css!oss_core/pm/dashboard/js/colorpicker/colorpicker.css",],
   function(adhocFactory,Zcharts,BScreenMgrAction,action,Dcharts) {
    function getUrlParameter(sParam) {
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

      for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined
            ? true
            : sParameterName[1];
        }
      }
    }

    var taskid=getUrlParameter('taskid');
    var opt ={};
    if(taskid){
        action.getTaskParam(taskid,function(data){
            var result =data.result;
            var json = eval('(' + result + ')');
            opt=json.param;
            var id =json.param.topic_no;
            console.log(id);
            console.log(opt);
            var view = adhocFactory.adhocForMailSend(367, id,opt);
            var context =$('body');
            context.css({"background":"none"});
            context.html(view.$el);
            context.find('.vbox').height(context.height());
            //view.dashBoardResize(context.width(),context.height())
        })

    }else{
        var id = getUrlParameter("id");
        var cycle=getUrlParameter('cycle')
        var btime =getUrlParameter('btime');
        var etime =getUrlParameter('etime');

        opt={
              dateGranu: cycle,
              btime:btime,
              etime:etime,
              dateGranuType:"custom"
          }
          console.log(opt);
          console.log(id);
        var view = adhocFactory.adhocForMailSend(367, id,opt);
        var context =$('body');
        context.css({"background":"none"});
        context.html(view.$el);
        context.find('.vbox').height(context.height());
        view.dashBoardResize(context.width(),context.height())
    }//end of if

  });

});
