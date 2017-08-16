
define(['frm/portal/Portal'], function(app) {
    portal.appGlobal.set("commoni18n", {'en':'','zh':''});
  	portal.appGlobal.set("customi18n", {'en':'','zh':''});
  require(["oss_core/pm/screendesigner/js/Zcharts"], function(Zcharts) {
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
    var json = fish.store.get(id);
    if (json) {
      json.dom = $('body')[0],
      json.perview = true;
      Zcharts.init(json);
    } else {
      fish.info('请重新预览');
    }

  });

});
