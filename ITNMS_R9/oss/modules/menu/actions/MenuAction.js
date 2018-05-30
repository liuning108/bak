define(function() {
	return {
		qryMenuList: function(portalId, success) {
			fish.get("users/portals/"+portalId+"/dirmenus", success);
		}
	}
});