define(function() {
	return {
		//查询某个menu在门户下的布局,此布局只有管理员能修改
		QryMenuLayout: function(portalId,menuId, success) {
			fish.get("portals/"+portalId+"/menuId/"+menuId+"/layouts", success);
		},
		ModMenuLayout: function(option, success) {
			fish.put("portals/"+option.portalId+"/layouts", {widgets:option.widgets,layoutId:option.layoutId}, success);
		},
		AddMenuLayout: function(option, success) {
			fish.post("portals/"+option.portalId+"/menuId/"+option.menuId+"/layouts", {widgets:option.widgets}, success);
		},
		QryUserPortletListByMenuId : function(menuId, success) {
			fish.get("menus/"+menuId+"/user/portlets", success);
		}
	}
});