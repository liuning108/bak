define(function() {
	var action={};
	action.service="MPM_DASHBOARD_TOPIC_SERVICE";

	action.addDashBoardClass=function(name,userId,success) {
		var param={};
		param.method="addDashBoardClass"
	    param.name=name;
		param.userId=userId;
		portal.callService(this.service,param, success);
	}

	action.queryDashBoardClassByUserID=function(userId,success) {
		var param={};
		param.method="queryDashBoardClassByUserID"
		param.userId=userId;
		portal.callService(this.service,param, success);
	}

	action.delDashBoardClassByID=function(classId,success) {
		var param={};
		param.method="delDashBoardClassByID"
		param.classId=classId;
		portal.callService(this.service,param, success);
	}

	action.changeDashBoardClassNameByID=function(name,classId,success) {
		var param={};
		param.method="changeDashBoardClassNameByID"
		param.classId=classId;
		param.name=name;
		portal.callService(this.service,param, success);
	}

	action.saveUpdateDashBoard=function(json,success) {
		var param={};
		param.method="saveUpdateDashBoard"
		param.json=json;
		portal.callService(this.service,param, success);
	}

	action.queryDashBoarListByClassId =function(userId,classId,success) {
		var param={};
		param.method="queryDashBoarListByClassId"
		param.userId=userId;
		param.classId=classId;
		portal.callService(this.service,param, success);
	}

	action.queryDashBoardById =function(id,success) {
		var param={};
		param.method="queryDashBoardById"
		param.id=id;
		portal.callService(this.service,param, success);
	}












	return action;
});
