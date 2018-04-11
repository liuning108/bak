define(["webroot"],function(webroot) {
	return {
		qryDelegatesOfStaff: function(staffId,success){ //查询员工的代理人信息
			fish.post("staffs/rela/staff2",{
				staff1: parseInt(staffId),
				rela: "0"
			},success,webroot);
		},
		queryAttrDefList: function(success){//查询STAFF的属性定义列表信息
			return fish.get("attrs/staff", success, webroot);
		},
		modStaff: function(param,success){
			return fish.patch("staffs/self", param, success, webroot);
		},
		qryAttrDataByStaffId: function(id,success){
			return fish.get("attrs/staff/staffId/"+id, success, webroot);
		},
		//删除代理人
		deleteStaffDelegate: function(param,success){
			fish.remove("staffs/rela", [param], success, webroot);
		},
		//查询组织
		qryAllOrgList: function(success){
			fish.get("orgs",success,webroot);
		},
		qryStaffUserListByOrgId: function(orgId,success){
			fish.get("orgs/" + orgId + "/staffs" , success, webroot);
		},
		//新增员工代理
		addStaffDelegate: function(param,success){
			fish.post("staffs/rela", [param], success, webroot);
		},

		modUserInfoBySelf: function(param,success){
			fish.patch("users/self", param, success, webroot);
		},

		qryLoginLogList: function(filter, success){
			fish.get("logs/login/self",filter, success, webroot);
		}
	};
});