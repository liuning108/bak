define(["webroot"],function(webroot)  {	return {
		qryInactiveJobs: function(success) {
			fish.get("stafforg/jobs/inactive",success,webroot);
		},
		qryActiveJobs: function(success) {
            return fish.get("stafforg/jobs" ,success,webroot);
		},
		qryRoles: function(jobId, success) {
			fish.get("stafforg/jobs/"+jobId+"/roles",success,webroot);
		},
		qryAllRoles: function(success, ctx) {
			fish.get("roles",success,webroot)
		},
		addRoles2Job: function(jobId, roleIdList, success) {
			fish.post("stafforg/jobs/"+jobId,roleIdList,success,webroot);
		},
		addRoles2JobAndUsers: function(jobId, roleIdList, userIdList, success) {
			fish.post("stafforg/jobs/"+jobId+"/users",{'roleIdList' : roleIdList , 'userIdList' :userIdList},success,webroot);
		},
		delRoleFromJob: function(jobId, roleId, success) {
			fish.remove("stafforg/jobs/"+jobId+"/role",[roleId],success,webroot);
		},
		delRoleFromJobAndUsers: function(jobId, roleId, userIdList, success) {
			fish.remove("stafforg/jobs/"+jobId+"/users",{'roleIdList' : [roleId] , 'userIdList' :userIdList},success,webroot);
		},
		addJob: function(jobName, state, success) {
			return fish.post("stafforg/jobs",{'jobName':jobName,'state': state},success,webroot);
		},
		modJob: function(jobId, jobName, success) {
            fish.patch("stafforg/jobs/" + jobId + "/jobName", jobName, success, webroot);
		},
		disableJob: function(jobId, success) {
			fish.patch("stafforg/jobs/"+jobId+"/disable",{},success,webroot);
		},
		enableJob: function(jobId, success) {
			fish.patch("stafforg/jobs/"+jobId+"/enable",{},success,webroot);
		},
		qryUserInfoByJobId: function(jobId, success) {
			return fish.get("stafforg/jobs/"+jobId+"/users",success,webroot);
		},
        queryUsedJobIdsByOrgId:function(orgId, success) {
            return fish.get("stafforg/orgs/"+orgId+"/jobIds/used",success,webroot);
        }
	}
});