
define(['frm/portal/Portal'], function(app) {
    portal.appGlobal.set("commoni18n", {'en':'','zh':''});
  	portal.appGlobal.set("customi18n", {'en':'','zh':''});
  
require(["oss_core/pm/screendesigner/js/Zcharts","oss_core/pm/screendesigner/actions/BScreenMgrAction"], function(Zcharts,BScreenMgrAction) {
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

    BScreenMgrAction.queryBScreenById(id,function(data){
           var json = data.topicJson;
             json.dom = $('body')[0],
             json.perview = true;
             Zcharts.init(json);

    })


  });

});
