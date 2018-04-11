define(["webroot"],function(webroot) {
	return {
		qryPortalList: function(success) {
			fish.get("portals", success, webroot);
		},

		qryUserListCount: function(userDetailJSON, success) {
			fish.get("users/count", userDetailJSON, success, webroot);
		},
		qryUserListByPageInfo: function(userDetailJSON, filter, success) {
			fish.get("users", fish.extend(userDetailJSON, filter), success, webroot);
		},

		addUser: function(userDetailJSON, success) {
			fish.post("users", fish.pick(userDetailJSON,"userId","userName","userCode","phone","email","address","userEffDate","isEffectiveNow","userExpDate","memo"), success, webroot);
		},
		modUser: function(userDetailJSON, success) {
			fish.put("users", fish.pick(userDetailJSON,"userId","userName","userCode","phone","email","address","userEffDate","isEffectiveNow","userExpDate","memo"), success, webroot);
		},
		qryRoleList: function(success) {
			fish.get("roles", success, webroot);
		},
		qryRoleListByUserId: function(userId, success) {
			fish.get("users/"+userId+"/roles", success, webroot);
		},
		grantRole2User: function(userId, roleList, success) {
			fish.post("users/"+userId+"/roles", roleList, success, webroot);
		},
		degrantRole2User: function(userId, roleList, success) {
			fish.remove("users/"+userId+"/roles", roleList, success, webroot);
		},

		qryUserPortalListByUserId: function(userId, success) {
			fish.get("users/"+userId+"/user/portals", success, webroot);
		},
		qryRolePortalListByUserId: function(userId, success) {
			fish.get("users/"+userId+"/role/portals", success, webroot);
		},
		grantPortal2User: function(userId, defaultPortalId, portalList, success) {
			fish.post("users/"+userId+"/user/portals?defaultPortalId="+defaultPortalId, portalList, success, webroot);
		},

		qryMenuListByUserId: function(userId, success) {
			fish.get("users/"+ userId + "/menus", success, webroot);
		},

		//用户可访问的门户 ，同 CommonAction.qryPortalListByUserId
		qryPortalListByUserId: function(userId, success) {
			fish.get("users/"+userId+"/portals", success, webroot);
		},
		
		//查询到角色的门户之后,加载门户下的所有目录;目录有递归  TODO 这个放在role模块不太合适 
		qryDirListByPartyId: function(partyId,portalId, success) {
			fish.get("portals/"+portalId+"/party/"+partyId+"/dirs", success, webroot);
		},
		
		//查询到用户的门户之后,首先加载门户的跟菜单;也可以加载任意目录下挂的菜单;按门户下定义的菜单顺序
		qryMenuListByPartyId: function(partyId,portalId, userId, success) {
			fish.get("users/"+userId+"/portals/"+portalId+"/party/"+partyId+"/menus", success, webroot)
		},
		
		//查询跟目录下的子元素;目录有递归,同qryDirListByPartyId
		qryDirListByDirId: function(dirId, success) {
			fish.get("dirs/" + dirId + "/dirs", success, webroot);
		},
		
		//查询指定目录下的菜单，同qryMenuListByPartyId;按菜单定义的顺序
		qryMenuListByDirId: function(options, success) {
			fish.get("users/" + options.userId + "/dirs/" + options.dirId+"/menus", success, webroot);
		},
		
		//查询用户的界面元素权限
		qryCompListByUserId: function(userId, success) {
			fish.get("users/" + userId + "/components", success, webroot);
		},
		
		//根据门户或者目录查询子元素,含目录菜单 
		qryDirMenuListByPartyId: function(partyId,portalId, success) {
			fish.get("portals/"+portalId+"/party/"+partyId+"/dirmenus", success, webroot);
		},
		
		//根据菜单查询界面元素
		qryCompListByMenuId : function(userId,menuId,success) {
			fish.get("users/"+userId+"/menus/"+menuId+"/components",success,webroot);
		},
		
		//将priv挂到user上,priv含有privId,privLevel信息
		grantPrivToUser: function(userId, privList, success) {
			fish.post("users/"+userId+"/privs", privList, success, webroot);
		},
		
		//将priv从user中解除
		degrantPrivFromUser: function(userId, privList, success) {
			fish.remove("users/" + userId + "/privs", privList, success, webroot);
		},
		
		//修改user priv的权限等级,目前之区分可见不可见
		modUserPrivLevel: function(privId, userId, privLevel, success) {
			fish.patch("users/privlevel", {privId: privId, userId: userId, privLevel: privLevel}, success, webroot);
		},
		
		disableUser: function(userId, success) {
			fish.patch("users/"+userId+"/disable", success);
		},
		enableUser: function(userId, success) {
			fish.patch("users/"+userId+"/enable", success);
		},
		lockUser: function(userId, success) {
			fish.patch("users/"+userId+"/lock", success);
		},
		unlockUser: function(userId, success) {
			fish.patch("users/"+userId+"/unLock", success);
		},
		resetPasswd: function(userId, success) {
			fish.patch("users/"+userId+"/pwd", success);
		},
		/* 数据权限暂不处理
		qryDataPrivList: function(success) {
			fish.get("dataPriv", success, webroot);
		},
		qryDataPrivListByUserId: function(userId, success) {
			fish.get("dataPriv/user/" + userId + "/null", success, webroot);
		},
		addDataPrivToUser: function(data, success) {
			fish.post("dataPriv/users/dataPriv",fish.pick(data,"dataPrivId","ownedType","privValue","userId"),success,webroot);
		},
		qryDataPrivValueListByDataPrivId: function(dataPrivId, success) {
			fish.get("dataPriv/" + dataPrivId +"/dataPrivValues",dataPrivId,success,webroot);
		},
		delDataPrivFromUser: function(dataPrivId, userId, success) {
			fish.remove("dataPriv/users/dataPriv",{dataPrivId: dataPrivId, userId: userId},success,webroot);
		},
		editDataPrivOfUser: function(data, success) {
			fish.put("dataPriv/users/dataPriv",fish.pick(data,"dataPrivId","ownedType","privValue","userId"),success,webroot);
		},
		*/
		qryPortletListByPortalIdLeftJoinUserOwnedInfo: function(cond, success) {
			fish.get("users/" + cond.userId + "/portal/" + cond.portalId + "/portlets", success, webroot);
		},
		qryAllPortletType: function(success) {
			fish.get("portlets/types", success,webroot);
		},
		qryPortletListByTypeIdLeftJoinUserOwnedInfo: function(cond, success) {
			fish.get("users/" + cond.userId + "/type/" + cond.typeId + "/portlets", success, webroot);
		},
		qryUserOwnedPortletList: function(userId, success) {
			fish.get("users/" + userId + "/portlets", success, webroot);
		}
	}
});