define(["webroot"],function(webroot) {
	return {	
		qryDBResCataLogList: function(success) {
			fish.get("i18n/db/resCataLog", success, webroot);
		},
		qryResFileDirList: function(success){
			fish.get("i18n/web/resFileDir", success, webroot);
		},
		qrySupportLang: function(success){
			fish.get("languages", success, webroot);
		},
		qryTransWebRes: function(param, success){
			fish.get("i18n/web/res/trans/query", param, success, webroot);
		},
		qryWebRes: function(param, success){
			fish.get("i18n/web/res/query", param, success, webroot);
		},
		modWebRes: function(param, success){
			fish.put("i18n/web/res", param, success, webroot);
		},
		qryDBResList: function(param, success){
			fish.get("i18n/db/" + param + "/resChildDir", success, webroot);
		},
		qryDBRes: function(param, success){
			fish.get("i18n/db/res/query", param, success, webroot);
		},
//		qryDBResCount: function(param, success){
//			fish.post("i18n/db/res/count", param, success, webroot);
//		},
		qryTransDBRes: function(param, success){
			fish.get("i18n/db/res/trans", param, success, webroot);
		},
//		qryTransDBResCount: function(param, success){
//			fish.post("i18n/db/res/trans/count", param, success, webroot);
//		},
		addDBRes: function(param, success){
			fish.post("i18n/db/res", param, success, webroot);
		},
		delDBRes: function(param, success){
			fish.remove("i18n/db/res", param, success, webroot);
		},
		modDBRes: function(param, success){
			fish.put("i18n/db/res", param, success, webroot);
		},
		clearDBCache: function(success) {
			fish.remove("i18n/clearDBResCache", success, webroot);
		},
		clearWebCache: function(success) {
			fish.get("i18n/clearWebResCache", success, webroot);
		},
		translateAll: function(lang,success) {
			fish.get("i18n/translateWebRes/" + lang, success, webroot);
		},
		exportAll: function(lang,success) {
			fish.get("i18n/exportWebRes/" + lang, success, webroot);
		},
	}
});