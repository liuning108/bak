define(["webroot"],function(webroot) {
	return {
		qryCategoryAndSubtypes: function(success) {
			fish.get("hostGroup/qryCategoryAndSubtypes", success, webroot);
		},

		qryTemplate: function(success) {
			fish.get("templateMgr/qryTemplate", success, webroot);
		},

		addTemplate: function(templateDetailObj, success) {
			fish.post("templateMgr/addTemplate", templateDetailObj, success, webroot);
		},

		uploadTemplate: function(uploadDetailObj, success) {
			fish.post("templateMgr/uploadTemplate", uploadDetailObj, success, webroot);
		},

		modGroupRela: function(groupRelaObj, success) {
			fish.post("hostGroup/modGroupRela", groupRelaObj, success, webroot);
		},

		changeNodesStatus: function(paramObj, success) {
			fish.post("hostGroup/changeNodesStatus", paramObj, success, webroot);
		},

		delHostGroup: function(paramObj, success) {
			fish.post("hostGroup/delHostGroup", paramObj, success, webroot);
		},

		delTemplate: function(paramObj, success) {
			fish.post("templateMgr/delTemplate", paramObj, success, webroot);
		}
	}
});