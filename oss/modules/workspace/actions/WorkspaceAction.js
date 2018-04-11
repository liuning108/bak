define(function() {
	return {
		QryUserLayout: function(portalId, success) {
			fish.get("portals/"+portalId+"/layouts/default", success);
		}
	}
});