define(["webroot"],function(webroot) {
	return {
		qryRoleList: function(success) {
			fish.get("roles", success, webroot);
		},
		addRole: function(data, success) {
			fish.post("roles", fish.omit(data, "name"), success, webroot);
		},
		modRole: function(data, success) {
			fish.put("roles", fish.omit(data, "id", "name"), success, webroot);
		},
		delRole: function(roleId, success) {
			fish.remove("roles/"+roleId, success, webroot);
		},
		qryUserList: function(success) {
			fish.get("users", success, webroot);
		},

		qryUserListByRoleId: function(roleId, success) {
			fish.get("roles/"+roleId+"/users", success, webroot);
		},
		grantUser2Role: function(roleId, userList, success) {
			userList = fish.map(userList, function(item, index) { 
				return fish.pick(item, "userId");
			});
			fish.put("roles/"+roleId+"/users", userList, success, webroot);
		},
		qryPortalList: function(success) {
			return fish.get("portals",success, webroot);
		},

		grantPortal2Role: function(roleId, portalList, success) {
			portalList = fish.map(portalList, function(item, index) { 
				return fish.pick(item, "portalId");
			});
			fish.put("roles/"+roleId+"/portals", portalList, success, webroot)
		},
		
		qryPortalListByRoleId: function(roleId, success) {
			return fish.get("roles/"+roleId+"/portals",success, webroot)
		},
		
		//查询到角色的门户之后,加载门户下的所有目录;目录有递归  TODO 这个放在role模块不太合适
		qryDirListByPartyId: function(partyId,portalId, success) {
			fish.get("portals/"+portalId+"/party/"+partyId+"/dirs", success, webroot);
		},
		
		//查询到用户的门户之后,首先加载门户的跟菜单;也可以加载任意目录下挂的菜单
		qryMenuListByPartyId: function(partyId,portalId, roleId, success) {
			fish.get("roles/"+roleId+"/portals/"+portalId+"/party/"+partyId+"/menus", success, webroot)
		},
		
		//查询跟目录下的子元素;目录有递归,同qryDirListByPartyId
		qryDirListByDirId: function(dirId, success) {
			fish.get("dirs/" + dirId + "/dirs", success, webroot);
		},
		
		//查询指定目录下的菜单，同qryMenuListByPartyId
		qryMenuListByDirId: function(options, success) {
			fish.get("roles/" + options.roleId + "/dirs/" + options.dirId+"/menus", success, webroot);
		},
		
		qryMenuListByRoleId: function(roleId, success) {
			fish.get("roles/"+roleId+"/menus",success,webroot);
		},
		
		grantPrivToRole: function(roleId, privList, success) {
			fish.post("roles/"+roleId+"/privs", privList, success, webroot);
		},
		
		degrantPrivFromRole: function(roleId, privList, success) {
			fish.remove("roles/"+roleId+"/privs", privList, success, webroot);
		},
		
		modRolePrivLevel: function(privId, roleId, privLevel, success) {
			fish.patch("roles/privlevel", {privId: privId, roleId: roleId, privLevel: privLevel}, success, webroot);
		},
		
		//根据门户或者目录查询子元素
		qryDirMenuListByPartyId: function(partyId,portalId, success) {
			fish.get("portals/"+portalId+"/party/"+partyId+"/dirmenus", success, webroot);
		},
		//根据菜单查询界面元素
		qryCompListByMenuId : function(roleId,menuId,success) {
			fish.get("roles/"+roleId+"/menus/"+menuId+"/components",success,webroot);
		},

		qryCompListByRoleId: function(roleId, success) {
			fish.get("roles/"+roleId+"/components", success, webroot);
		},
		
		/* datapriv 暂不实现component/priv
		qryDataPrivList: function(success) {
			fish.get("dataPriv", success, webroot);
		},
		qryDataPrivListByRoleId: function(roleId, success) {
			fish.get("dataPriv/role/" + roleId + "/null", success, webroot);
		},
		addDataPrivToRole: function(data, success) {			
			fish.post("dataPriv/roles/dataPriv",fish.pick(data,"dataPrivId","ownedType","privValue","roleId"),success,webroot);
		},
		qryDataPrivValueListByDataPrivId: function(dataPrivId, success) {
		    fish.get("dataPriv/" + dataPrivId +"/dataPrivValues",dataPrivId,success,webroot);
		},
		delDataPrivFromRole: function(dataPrivId, roleId, success) {
			fish.remove("dataPriv/roles/dataPriv",{
				dataPrivId: dataPrivId,
				roleId: roleId
			},success,webroot);
		},
		editDataPrivOfRole: function(data, success) {
			fish.put("dataPriv/roles/dataPriv",fish.pick(data,"dataPrivId","ownedType","privValue","roleId"),success,webroot);
		},
		*/
		qryPortletListByPortalIdLeftJoinRoleOwnedInfo: function(cond, success) {
			fish.get("roles/"+cond.roleId+"/portals/"+cond.portalId+"/portlets",success, webroot);
		},
		qryAllPortletType: function(success) {
			fish.get("portlets/types", success, webroot)
		},
		qryPortletListByTypeIdLeftJoinRoleOwnedInfo: function(cond, success) {
			fish.get("roles/" + cond.roleId + "/types/" + cond.typeId + "/portlets", success, webroot);
		},
		qryRoleOwnedPortletList: function(roleId, success) {
			fish.get("roles/"+roleId+"/portlets", success, webroot);
		},
		// 服务权限 start...
		qryServiceListByRoleId: function(roleId, success) {
			fish.get("roles/"+roleId+"/services",success,webroot);
		},
		delServicePriv: function(roleId, privId, success) {
			fish.remove("roles/"+roleId+"/services/"+privId,success,webroot);
		},
		addServicePriv: function(roleId, priv, success) {
			fish.post("roles/"+roleId+"/services",priv,success,webroot);
		},
		modServicePriv: function(priv, success) {
			fish.put("roles/services",priv,success,webroot);
		},
		refreshCache: function(success) {
			fish.remove("roles/services/cache", success, webroot);
		}
		// 服务权限 end...

	}
});