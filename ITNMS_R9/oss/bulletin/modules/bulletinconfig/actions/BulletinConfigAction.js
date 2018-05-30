define(["webroot"],function(webroot) {
	return {		
		delBulletinType: function(typeId, success) {
			fish.remove("bulletins/types/" + typeId, success, webroot);
		},
		addBulletinType: function(param, success) {
			fish.post("bulletins/types", fish.clone(param), success, webroot);
		},
		modBulletinType: function(typeId, param, success) {
			fish.put("bulletins/types", fish.extend({typeId: typeId}, param), success, webroot);
		},
		qryBulletinTypeByParentId: function(parentTypeId, success){
			var id = parentTypeId?parentTypeId:0;
			fish.get("bulletins/types/" + id + "/types", success, webroot);
		}, 
		delBulletinTmpl: function(templateId, success) {
			fish.remove("bulletins/templates/" + templateId, success, webroot);
		},
		addBulletinTmpl: function(param, success) {
			fish.post("bulletins/templates", fish.clone(param), success, webroot);
		},
		modBulletinTmpl: function(param, success) {
			fish.put("bulletins/templates", param, success, webroot);
		},
		qryBulletinTmpl: function(success){
			fish.get("bulletins/templates",success, webroot);
		}, 
		delBulletinLevel: function(levelId, success) {
			fish.remove("bulletins/levels/" + levelId, success, webroot);
		},
		addBulletinLevel: function(param, success) {
			fish.post("bulletins/levels", fish.clone(param), success, webroot);
		},
		modBulletinLevel: function(param, success) {
			fish.put("bulletins/levels", param, success, webroot);
		},
		qryBulletinLevel: function(success){
			fish.get("bulletins/levels",success, webroot);
		}, 

	};
});