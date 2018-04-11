define(["webroot", "frm/portal/Portal"], function(webroot) {
	var initMenuObj = portal.utils.extractUrlParam((function(queryString) {
		if (queryString.length > 0 && queryString.startsWith('?')) {
			return queryString.slice(1);
		} else {
			// extract init menu url from cookie
			return (function() {
				var initMenu = fish.cookies.get('INIT_MENU');
	        	if (initMenu && initMenu.indexOf('"') == 0) {
	        		initMenu = initMenu.slice(1);
	        	}
	        	if (initMenu && initMenu.lastIndexOf('"') + 1 == initMenu.length) {
	        		initMenu = initMenu.slice(0, -1);
	        	}
	        	if (initMenu == "null") {
	        		initMenu = "";
	        	}
	        	if (initMenu) {
	        		fish.cookies.remove('INIT_MENU');
	        	}
	        	return initMenu;
			})();
		}
	})(window.location.search));
	fish.get("local").then(function(data){
		var deferred = $.Deferred();
		portal.appGlobal.set(fish.pick(data, "charset", "version","language", "shortLanguage","ssoMode","origin"));
		
		fish.setLanguage(portal.appGlobal.get('shortLanguage'));

		// if (data.webroot){ //TODO 这里的webroot应该是带后缀的,无论是后台返回还是前台定义
		// 	var rootweb = data.webroot;
		// 	rootweb = (rootweb.slice(-1) == "/") ? rootweb.slice(0,-1):rootweb;
		// 	portal.appGlobal.set("webroot",rootweb);
		// }
		if (fish.cookies.get("skin")) {
			$("#indexCss").prop("href", fish.cookies.get("skin"));
		}
		
		portal.appGlobal.set("commoni18n", {});//框架公用的
		portal.appGlobal.set("customi18n", {});//客户定制的
		
		var i18nArr = [webroot + "i18n/common." + data.language];
		if(data.customLanguage){
			i18nArr.push(webroot + "i18n/custom." + data.customLanguage);
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
		portal.appGlobal.set("ssoMode", data.ssoMode);
		return deferred.promise();
	}).then(function(){
		//每个菜单对应一个iframe
		require([initMenuObj.url], function(View) {
			var viewObj = new View(fish.extend({el: $('#menu')}, initMenuObj.params)).render();
            var $el = viewObj.$el;
            var delta = $el.parent().height() - $el.outerHeight();
            viewObj.resize(delta);
		});
	})
});