define(["webroot"],function(webroot) {
	return {
		qrySystemParamList: function(success) {
			fish.get("sysparams",success, webroot);
		},
		clearCache: function(success) {
			fish.remove("sysparams/cache", success, webroot);
		},
		editParam: function(param, success) {
			fish.put("sysparams", param, success, webroot);
		}
	}
});