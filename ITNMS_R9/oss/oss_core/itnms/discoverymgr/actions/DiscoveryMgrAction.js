define(["webroot"],function(webroot) {
	return {
		qryCategoryAndSubtypes: function(success) {
			fish.get("discoveryMgr/qryCategoryAndSubtypes", success, webroot);
		},

		qryDiscoveryRule: function(success) {
			fish.get("discoveryMgr/qryDiscoveryRule", success, webroot);
		},

		qryProxy: function(success) {
			fish.get("discoveryMgr/qryProxy", success, webroot);
		},

		qryCheckType: function(success) {
			fish.get("discoveryMgr/qryCheckType", success, webroot);
		},

		qryParamDataById: function (paraObj, success) {
			fish.post("discoveryMgr/qryParamDataById", paraObj, success, webroot);
		},

		addDrule: function(druleDetailObj, success) {
			fish.post("discoveryMgr/addDrule", druleDetailObj, success, webroot);
		},

		uploadTemplate: function(uploadDetailObj, success) {
			fish.post("templateMgr/uploadTemplate", uploadDetailObj, success, webroot);
		},

		modDiscoveryRela: function(discoveryRelaObj, success) {
			fish.post("discoveryMgr/modDiscoveryRela", discoveryRelaObj, success, webroot);
		},

		changeDrulesStatus: function(paramObj, success) {
			fish.post("discoveryMgr/changeDrulesStatus", paramObj, success, webroot);
		},

		delHostGroup: function(paramObj, success) {
			fish.post("hostGroup/delHostGroup", paramObj, success, webroot);
		},

		delDrule: function(paramObj, success) {
			fish.post("discoveryMgr/delDrule", paramObj, success, webroot);
		}
	}
});