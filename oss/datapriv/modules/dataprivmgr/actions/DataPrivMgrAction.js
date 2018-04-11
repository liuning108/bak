define(["webroot"],function(webroot) {
	return {
		qryDataPrivList: function(success) {
			fish.get("datapriv/dataprivs", {}, success, webroot);
		},
		qryDataPrivListByRoleId: function(roleId, success) {
			fish.get("datapriv/roles/" + roleId + "/dataprivs", roleId, success, webroot);
		},
		qryRoleList: function(success) {
			fish.get("datapriv/roles", {}, success, webroot);
		},
		qryUserListLeftUserDataPrivCount: function(cond, success) {
			fish.get("datapriv/users/dataprivs/count",cond,success,webroot);
		},
		//分页问题
		qryUserListLeftUserDataPriv: function(cond, filter, success) {
			fish.get("datapriv/users/dataprivs",fish.extend(cond, filter),success,webroot);
		},
		qryRoleListLeftRoleDataPriv: function(cond, success) {
			fish.get("datapriv/roles/dataprivs",cond,success,webroot);
		},
		qryDataPrivValueListByDataSrc: function(dataSrc, success) {
			fish.get(dataSrc,success,webroot);
		},
		addDataPrivToUser: function(data, success) {
			fish.post("datapriv/users/dataprivs",fish.pick(data,"dataPrivId","ownedType","privValue","userId"),success,webroot);
		},
		addDataPrivToRole: function(data, success) {
			fish.post("datapriv/roles/dataprivs",fish.pick(data,"dataPrivId","ownedType","privValue","roleId"),success,webroot);
		},
		editDataPrivOfUser: function(data, success) {
			fish.put("datapriv/users/dataprivs",fish.pick(data,"dataPrivId","ownedType","privValue","userId"),success,webroot);
		},
		editDataPrivOfRole: function(data, success) {
			fish.put("datapriv/roles/dataprivs",fish.pick(data,"dataPrivId","ownedType","privValue","roleId"),success,webroot);
		},
		delDataPrivFromUser: function(dataPrivId, userId, success) {
			fish.remove("datapriv/users/dataprivs",{
				dataPrivId: dataPrivId,
				userId: userId
			},success,webroot);
		},
		delDataPrivFromRole: function(dataPrivId, roleId, success) {
			fish.remove("datapriv/roles/dataprivs",{
				dataPrivId: dataPrivId,
				roleId: roleId
			},success,webroot);
		}
	}
});