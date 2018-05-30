define(function() {
	return {
		qryUserFavMenuListByPortalId: function(portalId, success) {
			var url = "portals/" + portalId + "/user/favorites";
			fish.get(url, success);
		}
	}
});