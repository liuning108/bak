define(["webroot"],function(webroot) {
	return {		
		// qryBulletinListCount: function(params, success){
		// 	fish.get("bulletin/count", params, success, webroot);
		// },
		qryBulletinListByPageInfo: function(params, filter, success){
			fish.get("bulletins", fish.extend(params, filter), success, webroot);
		},
		delBulletin: function(bulletinId, success){
			fish.remove("bulletins/" + bulletinId, success,webroot);
		},
		delPhysicalBulletin: function(bulletinId, success){
			fish.remove("bulletins/" + bulletinId+'/history', success, webroot);
		},
		qryBulletinTypeByParentId: function(parentTypeId, success){
			var id = parentTypeId?parentTypeId:0;
			fish.get("bulletins/types/" + id + "/types", success, webroot);
		}, 
	
		qryBulletinTmpl: function(success){
			fish.get("bulletins/templates",success, webroot);
		}, 
	
		qryBulletinLevel: function(success){
			fish.get("bulletins/levels",success, webroot);
		}, 

		qryAllType: function(success){
			fish.get("bulletins/types",success, webroot);
		},

		addBulletin: function(detail, success){
			fish.post("bulletins", detail, success, webroot);
		},
		modBulletin: function(detail, success){
			fish.put("bulletins", detail, success, webroot);
		},		
		qryReadRecord: function(bulletinId, success){
			fish.get("bulletins/" + bulletinId + "/viewstate", success, webroot);
		},
		qryReadRecordDetail: function(bulletinId, orgId, success){
			fish.get("bulletins/" + bulletinId + "/orgs" + orgId + "/viewstate", success, webroot);
		},
		queryBulletinByStaffId: function(params, filter, success){
			fish.get("bulletins/self", fish.extend(params, filter), success, webroot);
		},		
		qryBulletinByType: function(typeName,success){
			fish.get("bulletins/" + typeName + "/bulletins",success, webroot);
		},
	};
});