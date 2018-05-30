define(["webroot"],function(webroot) {
	return {
		qryLoginLogCount: function(param, success) {
			fish.get("logs/login/count",param, success, webroot);
		},
		qryLoginLogList: function(param, filter, success) {
			fish.get("logs/login",fish.extend(param, filter), success, webroot);
		},
		qryEventSrcList: function(success) {
			fish.get("logs/event/src", success, webroot);
		},
		qryEventTypeList: function(success) {
			fish.get("logs/event/type", success, webroot);
		},
		qrySysLogCount: function(param, success) {
			fish.get("logs/system/count",param, success, webroot);
		},
		qrySysLogList: function(param, filter, success) {
			fish.get("logs/system",fish.extend(param, filter), success, webroot);
		},
		qryAuditLogCount: function(param, success) {
			fish.get("logs/audit/count",param, success, webroot);
		},
		qryAuditLogList: function(param, filter, success) {
			fish.get("logs/audit",fish.extend(param, filter), success, webroot);
		}
	}
});