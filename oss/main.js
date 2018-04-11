define(['frm/portal/Portal' ], function(app) {
	
	fish.get("local").then(function(data){
		var deferred = $.Deferred();
		portal.appGlobal.set(fish.pick(data, "language", "shortLanguage","app","deployMode","currencyPrecision","projectCode"));
		
		fish.setLanguage(portal.appGlobal.get('shortLanguage'));

		if (fish.store.get("skin")) {
			$("#indexCss").attr("href", fish.store.get("skin"));
		}
		if (fish.store.get("themes")) {
			$("#themesCss").attr("href", fish.store.get("themes"));
		}
		
		portal.appGlobal.set("commoni18n", {});//框架公用的
		portal.appGlobal.set("customi18n", {});//客户定制的
		
		var extraurl = ["i18n/common." + data.shortLanguage];
		if(data.customLanguage){
			extraurl.push("i18n/custom." + data.customLanguage);
		}
		require(extraurl, function(commonI18n,customI18n) {
			portal.appGlobal.get("commoni18n")[data.language] = commonI18n;
			if (customI18n) {
				var argu = _.omit(customI18n,function(value, key, object) {
					return !/[^\s]+/.test(value);
				});
				portal.appGlobal.get("customi18n")[data.language] = argu;					
			}
			//国际化语言设置完成之后,再加载业务模块的内容
			extraurl = [];
			if(data.configJs && data.configJs.length>0){
				fish.each(data.configJs,function(url){
					extraurl.push(url + "/config");
				})
			}
			require(extraurl, function() {
				deferred.resolve();
			})
		})
		return deferred.promise();
	}).then(function(){
		require([ 'modules/index/views/IndexView' ], function(IndexView) {
			new IndexView().index();
		});
	})
	
});