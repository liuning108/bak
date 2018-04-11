define(["webroot"],function(webroot) {
	return {
		qryVersionList: function(success) {
			fish.get("versions", success, webroot);
		}
	};
});