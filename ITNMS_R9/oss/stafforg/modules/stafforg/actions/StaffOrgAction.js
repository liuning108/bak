define(["webroot"],function(webroot) {
	return {
		qryRootOrgListByStaffId: function(success) { //查询当前员工可以管理的Org列表
			fish.get("stafforg/orgs/self/root", success, webroot);
		},
		qryStaffMasterOrgList: function(success) {
			fish.get("stafforg/orgs/self", success, webroot);
		},
		disableOrg: function(orgId, success) {
			fish.put("stafforg/orgs/" + orgId + "/disable", success, webroot);
		},
		qryJobListByOrgId: function(orgId, success) {
			fish.get("stafforg/orgs/" + orgId + "/jobs", success, webroot);
		},
		qryStaffUserInfoByOrgId: function(orgId, success) {
			fish.get("stafforg/orgs/" + orgId + "/staffs",success,webroot);
		},
		qryAttrDataByStaffId: function(id,success){
			fish.get("stafforg/attrs/staff/staffId/"+id, success, webroot);
		},
		qryAttrDataByOrgId: function(id,success){
			fish.get("stafforg/attrs/org/orgId/"+id, success, webroot);
		},
		addOrg: function(orgInfo, success) {
			orgInfo.state = "A";
			fish.post("stafforg/orgs", fish.extend(fish.omit(orgInfo, "attrData", "jobIdList"), {jobIdList:orgInfo.jobIdList}, {attrList:orgInfo.attrData}), success, webroot);
		},
		modOrg: function(orgInfo, success) {
			var leader = {staffId: ''};
			if (orgInfo.leader !== undefined){
				leader = fish.extend(leader,orgInfo.leader);
			}
			fish.put("stafforg/orgs", fish.extend(fish.omit(orgInfo, "attrData", "jobIdList","leader"), {jobIdList:orgInfo.jobIdList}, {attrList:orgInfo.attrData},{leader:leader.staffId}), success, webroot);
		},
		queryAllStaffByOrgId: function(orgId, success) {
			fish.get("stafforg/orgs/" + orgId + "/staffs/all", success, webroot);
		},
		queryStaffByOrgId: function(orgId, success) {
			fish.get("stafforg/orgs/" + orgId + "/staffs" , success, webroot);
		},
		addStaff: function(param, success) {
			var p = fish.extend(fish.omit(param, "orgId", "attrData"), {attrList:param.attrData});
			fish.post("stafforg/orgs/"+param.orgId+"/staffs", p, success, webroot);
		},
		modStaff: function(param, success) {
			var p = fish.extend(fish.omit(param, "orgId", "attrData"), {attrList:param.attrData});
			fish.put("stafforg/staffs", p, success, webroot);
		},
		disableStaff: function(staffId, userFlag, success) {
			fish.patch("stafforg/staffs/" + staffId + "/disable", success, webroot);
		},
		disableStaffBatch: function(staffList, userFlag, success) {
			fish.patch("stafforg/staffs/batch/disable", staffList,success, webroot);
		},
		enableStaff: function(staffId, userFlag, success) {
			fish.patch("stafforg/staffs/" + staffId + "/enable", success, webroot);
		},
		enableStaffBatch: function(staffList, userFlag, success) {
			fish.patch("stafforg/staffs/batch/enable", staffList, success, webroot);
		},
		//datapriv 
		// qryLowOrgByOrgId: function(orgId, success) {
		// 	fish.get("stafforg/orgs/loworg/" + orgId, success, webroot);
		// },
		qryOrgListByStaffId: function(staffId, success) {
			fish.get("stafforg/staffs/" + staffId + "/orgs", success, webroot);
		},
		addStaffToOrgs: function(staffId, orgIdList, newDefaultOrgId, success) {
			fish.post("stafforg/staffs/" + staffId + "/orgs/default/" + newDefaultOrgId, orgIdList, success, webroot);
		},
		addStaffToOrgsBatch: function(staffList, orgIdList, success) {
			fish.post("stafforg/stafforgs/batch", {
				staffList: staffList,
				orgList: orgIdList
			}, success, webroot);
		},
		qryStaffJobCountInOrg: function(staffId, orgId, success) {
			fish.get("stafforg/orgs/"+ orgId + "/staffs/"+staffId + "/staffjobs" , success, webroot);
		},
		delStaffFromOrg: function(staffId, orgId, success) {
			fish.remove("stafforg/orgs/" + orgId +"/staffs/" + staffId, success, webroot);
		},
		qryStaffHistory: function(param, success) {
			fish.get("stafforg/staffs/history", param, success, webroot);
		},
		qryOrgChangeHisCount: function(cond, success) {
			fish.get("stafforg/orgs/history/count", cond, success, webroot);
		},
		qryOrgChangeHis: function(cond, filter, success) {
			fish.get("stafforg/orgs/history", fish.extend(cond, filter), success, webroot);
		},
		qryOrgJobListByStaffId: function(staffId, success) { //查询员工的职位列表信息
			fish.get("stafforg/staffs/" + staffId + "/orgjobs", success, webroot);
		},
		qryJobListInOrgByStaffId: function(staffId, success) { //根据员工ID查询员工所在的
			fish.get("stafforg/staffs/" + staffId  + "/jobs", success, webroot);
		},
		addJobsToStaffBatch: function(staffList, jobList, success) {
			fish.post("stafforg/staffjobs/batch", {
				staffList: staffList,
				jobList: jobList
			}, success, webroot);
		},
		modStaffJobs: function(addJobList, deleteJobList, success) {
			fish.post("stafforg/staffjobs/",{
				addJobList: addJobList,
				deleteJobList: deleteJobList
			}, success, webroot);
		},
		qryAllOrgList: function(success) {
			fish.get("stafforg/orgs",success,webroot);
		},
		qryStaffRelaJoinStaff1InfoList: function(param, success) {
			fish.post("stafforg/staffs/rela/staff1",param,success,webroot);
		},
		qryStaffRelaJoinStaff2InfoList: function(param, success) {
			fish.post("stafforg/staffs/rela/staff2",param,success,webroot);
		},
		qryOrgAttrDefJSON: function(success) {
			fish.get("stafforg/attrs/org", success, webroot);
		},
        initStaffAttrWithLinkageFormItem: function(success) {
        	fish.get("stafforg/attrs/staff", success, webroot);
        },
        qryCurrentStaffDescendants: function(param, success) {
        	// portal.callService("QryCurrentStaffDescendants", fish.clone(param), success);
        	fish.get("stafforg/staffs/descendants/" + param.staffId + "/" + param.staffIdsInList, success, webroot);
        },
        addStaffRela: function(staffRealList, success) {
        	fish.post("stafforg/staffs/rela", staffRealList, success, webroot);
        },
        delStaffReal: function(staffRealList, success) {
        	fish.remove("stafforg/staffs/rela", staffRealList, success, webroot);
        },
        qryStaffDefaultOrg: function(staffId, success) {
        	fish.get("stafforg/staffs/"+staffId+"/orgs/default" , success, webroot);
        },
        queryOrgListByParentId: function(orgId, success) {
        	fish.get("stafforg/orgs/parent/" + orgId, success, webroot);
        },
        queryOrgType: function(success) {
        	fish.get("stafforg/orgs/types", success, webroot);
        },



        //从CommonAction移过来
		qryOrgJobListBySelf: function(success) {
			return fish.get("stafforg/staffs/self/orgjobs", success);
		},
        qryIsStaffJobEnabled: function(success) {
            return fish.get("stafforg/enabled", success);
        },
        saveStaffJobId : function(params, success){
            return fish.post("stafforg/staffjob/current", params, success);
        }
	};
});