define(["webroot"],function(webroot) {
	return {
		editSecurityRule: function(param, success) {
			fish.put("sysparams/securityrules", param, success, webroot);

		}
	};
});