define(function() {
	return {
		qryActiveComponentInMenu: function(menuId, success) {
			fish.get("menus/" + menuId +"/components", success);
		},
		delComponent: function(componentId, success) {
			fish.remove("components/" + componentId, success);
		},
		//TODO 这个跟 modComponent重复 -- 
		modComponentPrivInfo: function(param, success) {
			fish.put("components", fish.extend({
				privType: 'C',
				privName: param.privName
			}, param), success);
		},
		addComponent: function(param, success) {
			fish.post("components", {
				menuId: param.menuId,
				objId: param.path,
				privName: param.name,
				privEl: param.privEl				
			}, success);
		},
		modComponent: function(param, success) {
			fish.put("components", {
				privId: param.privId,
				privName: param.name,
				menuId: param.menuId,
				objId: param.path,
				privEl: param.privEl				
			}, success);
		},
		qryCompInMenuByObjId: function(menuId, objId, success) {
			return fish.get("components/checked", {menuId:menuId,objId:objId}, success);
		},
		qryOrgJobListByStaffId: function(staffId, success) { //查询员工的职位列表信息
			fish.get("staffs/" + staffId + "/orgjobs", success, webroot);
		},
	}
});