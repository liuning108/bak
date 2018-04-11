define(function() {
	return {
		qryUserLastOperMenus: function(success) {
			fish.get("users/lastoper", success);
		}
	}
});