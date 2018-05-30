define(["webroot"],function(webroot) {
	return {
		QryUserLayoutList: function(portalId, success) {
			fish.get("portals/"+portalId+"/layouts", success, webroot);
		},
		ModUserLayout: function(option, success) {
			fish.put("portals/"+option.portalId+"/layouts", {widgets:option.widgets,title:option.title,layoutId:option.layoutId}, success, webroot);
		},
		AddUserLayout:function(option, success){
			fish.post("portals/"+option.portalId+"/layouts", {widgets:option.widgets,title:option.title}, success, webroot);
		},
		/**
		 * 查询用户在这个门户下的可选组件
		 */
		QryUserPortletListByPortalId:function(portalId,success){
			fish.get("portals/"+portalId+"/user/portlets", success, webroot);
		},
		SetUserLayoutDefault:function(layoutId,portalId,success){
			fish.patch( "portals/" + portalId +"/layouts/"+layoutId +"/default", {}, success, webroot);
		},
		DelUserLayout:function(layoutId,success){
			fish.remove("layouts/"+layoutId, success, webroot);
		}
		
	}
});