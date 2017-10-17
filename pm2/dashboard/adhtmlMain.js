
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
    var id = getUrlParameter("id");

var view = adhocFactory.adhocForMailSend(367, id,{
            dateGranu:'_D',
            btime:"2017-10-17 09:54:00",
            etime:"2017-10-18 09:54:00"
        });
             var context =$('body');
             context.css({"background":"none"});
             context.html(view.$el);
             context.find('.vbox').height(context.height());
            view.dashBoardResize(context.width(),context.height())


  });

});
