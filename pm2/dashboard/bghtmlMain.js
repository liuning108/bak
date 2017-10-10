
define(['frm/portal/Portal'], function(app) {
    portal.appGlobal.set("commoni18n", {'en':'','zh':''});
  	portal.appGlobal.set("customi18n", {'en':'','zh':''});

require(["oss_core/pm/screendesigner/js/Zcharts",
  "oss_core/pm/screendesigner/actions/BScreenMgrAction",
  "oss_core/pm/dashboard/actions/DashBoardAction",
  "oss_core/pm/dashboard/js/Dcharts",
  "css!oss_core/pm/dashboard/css/dashboard.css",
  "css!oss_core/pm/dashboard/css/dcmegamenu2.css",
  "css!oss_core/pm/dashboard/css/icomoon.css",
  "css!oss_core/pm/dashboard/js/colorpicker/colorpicker.css",],
   function(Zcharts,BScreenMgrAction,action,Dcharts) {
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
    alert(id)
      action.queryDashBoardById(id,function(data){
          console.log(data);
           var canvasjson =data.result.topicJson;
           var dash_w=$("body").outerWidth()
           var factor=dash_w/canvasjson.attrs.size.w;
           var ratio = (9 / 16);
           var dcharts=Dcharts.init({
             id:canvasjson.id,
             name:canvasjson.name,
             containment: $("#dashboard-detail-canvas"),
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

      })



  });

});
