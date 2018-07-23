define(["webroot"],function(webroot) {
	return {
		qryCategoryAndSubtypes: function(success) {
			fish.get("hostGroup/qryCategoryAndSubtypes", success, webroot);
		},

		qryHostGroup: function(success) {
			fish.get("hostGroup/qryHostGroup", success, webroot);
		},

		qryHostGroupWithParams: function(paramObj, success) {
			fish.post("hostGroup/qryHostGroupWithParams", paramObj, success, webroot);
		},

		addHostGroup: function(groupDetailObj, success) {
			fish.post("hostGroup/addHostGroup", groupDetailObj, success, webroot);
		},

		modGroupRela: function(groupRelaObj, success) {
			fish.post("hostGroup/modGroupRela", groupRelaObj, success, webroot);
		},

		changeNodesStatus: function(paramObj, success) {
			fish.post("hostGroup/changeNodesStatus", paramObj, success, webroot);
		},

		delHostGroup: function(paramObj, success) {
			fish.post("hostGroup/delHostGroup", paramObj, success, webroot);
		}
	}
});