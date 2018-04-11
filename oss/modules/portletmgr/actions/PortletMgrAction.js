define(["webroot"],function(webroot) {
	return {
		queryAllPortletType: function(success){
			fish.get("portlets/types", success,webroot);
		},
		queryAllPortlets: function(success){
			fish.get("portlets", success,webroot);
		},
		addPortlets: function(param,success){
			fish.post("portlets", param, success, webroot);
		},
		modPortlets: function(param, success){
			fish.put("portlets", param, success, webroot);
		},
		enablePortlet: function(param, success){
			fish.patch("portlets/" + param.portletId + "/enable", success,webroot);
		},
		disabledPortlet: function(param, success){
			fish.patch("portlets/" + param.portletId + "/disable", success,webroot);
		},
		queryAllPortals: function(success){
			fish.get("portals",success,webroot);
		},
		queryAllPortalBindProtles: function(success){
			fish.get("portals/portlets", success, webroot);
		},
		queryMenu: function(success){
			fish.get("menus/D", success, webroot);
		},
		updateMenuPortletList: function(param, success){
			fish.post("menus/" + param.menuId + "/portlets", param.portletIdList, success, webroot);
		},
		updatePortalPortletList: function(param, success){
			fish.post("portals/" + param.portalId + "/portlets", param.portletIdList, success,webroot);
		}
	}
});