define(function() {
	return {
		qryCurrentUser: function(success) {
			return fish.get("users/current", success);
		},
		qryUserLastLoginTime: function(success) {
			fish.get("users/lastlogin", success);
		}
	}
});
