define(function() {
	return {
		queryBulletinByStaffId: function(params, success){
			fish.get("bulletins/self", params, success);
		},
		modBulletinView: function(bulletinId, success){
			fish.patch("bulletins/"+ bulletinId + "/viewstate", success);
		},
	}
});