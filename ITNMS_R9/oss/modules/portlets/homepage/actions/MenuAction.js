define(function() {
	return {
		qryMenuList: function(url, success) {
			portal.callService("QryMenuList", {
				URL: url
			}, success);
		}
	}
});