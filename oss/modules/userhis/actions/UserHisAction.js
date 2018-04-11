define(["webroot"],function(webroot) {
	return {
		qryUserHisCount: function(cond, success) {
			return fish.get("users/history/count", cond, success, webroot);
		},

		qryUserHis: function(cond, filter, success) {
			return fish.get("users/history", fish.extend(cond, filter), success, webroot);
		}
	}
});