define(function() {
	return {
		// qrySysParamByMask: function(mask, success) {
		// 	return fish.get("sysparams/"+mask, success);
		// },
		isAdmin: function(success) {
			return fish.get("users/admin", success);
		},
        qryUserHasEmail: function(success) {
            return fish.get("email/enabled", success);
        },
        qrySecurityLevel: function(success) {
            return fish.get("sysparams/securitylevel", success);
        },
		qryCommonParams: function(success) {
			return fish.get("sysparams/common", success);
		},
		// qrySysParamsByMasks: function(masks, success) {
		// 	return fish.get("sysparams/masks/"+masks.join(","), success);
		// },
		qrySecurityRuleByLevelCode: function(levelCode, success) {
			return fish.get("sysparams/securityrules/"+levelCode, success);
		},
		qryCurrentSecurityRule: function(success) {
			return fish.get("sysparams/securityrules/current", success);
		},
		addMenuLog: function(logDto){
			return fish.post("menulogs", logDto);//该方法用于点击菜单记录日志，修改为menulog
		},
		addServiceLog: function(logDto){
			return fish.post("servicelog", logDto);//该方法用于记录业务log
		},
		qryCurrentUser: function(success) {
			return fish.get("users/current", success);
		},
		qryPortalListByUserId: function(userId, success) { //查询用户可以访问的portal列表
			return fish.get("users/"+userId+"/portals", success);
		},
		setCurrentMenu: function(currentMenuId) {
			return fish.post("menus/current", {menuId:currentMenuId});
		},
		qryRealCompPrivsByMenuId: function(menuId) {//TODO MENU_URL 这个参数要不要带
			return fish.get("menus/"+menuId+"/out/components");
		},
		qryCompPrivsByPrivCode: function (privCode) {
			return fish.get("menus/privcode/"+privCode+"/components");
		},
		qryAppListByUserId: function(userId) {
			return fish.get("apps/user/" + userId);
		},
		queryMenuByMenuUrl: function(menuUrl) {
			return fish.get("menus/url", {url : menuUrl});
		},
		queryOpenMenuPrivByPrivId: function(privId) {
			return fish.get("menus/openpriv/" + privId);
		},
		makeLoginUserToken: function(userCode) {
			return fish.get("usertoken/" + userCode);
		},
		userTokenLogin: function(appUrl, userToken) {
			return fish.ajax({
				type: 'POST',
				url: appUrl,
				data: {
					token: userToken
				},
				dataType: 'text'
			});	
		}
	}
});