define([ 'frm/portal/Portal' ], function(app) {

	portal.callService("GetLocalInfo").then(function(data){
		var deferred = $.Deferred();
		portal.appGlobal.set(fish.pick(data, "charset", "version","language", "shortLanguage"));

		fish.setLanguage(portal.appGlobal.get('shortLanguage'));

		if (data.webroot){
			var rootweb = data.webroot;
			rootweb = (rootweb.slice(-1) == "/") ? rootweb.slice(0,-1):rootweb;
			portal.appGlobal.set("webroot",rootweb);
		}
		if (fish.cookies.get("skin")) {
			$("#indexCss").prop("href", fish.cookies.get("skin"));
		}

		portal.appGlobal.set("commoni18n", {});//框架公用的
		portal.appGlobal.set("customi18n", {});//客户定制的

	var i18nArr = ["i18n/common." + data.language];
		if(data.CUSTOM_LANGUAGE){
			i18nArr.push("i18n/custom." + data.CUSTOM_LANGUAGE);
		}
		require(i18nArr, function(commonI18n,customI18n) {
			portal.appGlobal.get("commoni18n")[data.language] = commonI18n;
			if (customI18n) {
				var argu = _.omit(customI18n,function(value, key, object) {
					return !/[^\s]+/.test(value);
				});
				portal.appGlobal.get("customi18n")[data.language] = argu;
			}
			deferred.resolve();
		})
		portal.appGlobal.set("ssoMode", data.SSO_MODE);
		return deferred.promise();
	}).then(function(){
         function getUrlParameter(sParam){
			 var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		          sURLVariables = sPageURL.split('&'),
		          sParameterName,
		          i;

		      for (i = 0; i < sURLVariables.length; i++) {
		          sParameterName = sURLVariables[i].split('=');

		          if (sParameterName[0] === sParam) {
		              return sParameterName[1] === undefined ? true : sParameterName[1];
		          }
		      }
		 }
		require(["oss_core/pm/screendesigner/js/Zcharts"], function(Zcharts) {
            var id=getUrlParameter("id");
			var json = fish.store.get(id);
			if (json){
				json.dom = $('body')[0],
				json.perview = true;
				Zcharts.init(json);
			}else{
				fish.info('请重新预览');
			}

		});
	})

});
