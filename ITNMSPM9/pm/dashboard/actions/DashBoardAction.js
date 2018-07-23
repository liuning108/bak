define(function() {
	var action={};
	action.service="MPM_DASHBOARD_TOPIC_SERVICE";
	action.getTaskParam=function(taskid,success){
		var param={};
		param.method="getTaskParam"
		param.taskid=taskid;
		portal.callService(this.service,param, success);
	}
    action.moveFTPFile=function(filepath,success){
		var param={};
		param.method="moveFTPFile"
		param.filepath=filepath;
		portal.callService(this.service,param, success);
	}
	action.delDashBoardById=function(id,success) {
		var param={};
		param.method="delDashBoardById"
	    param.id=id;
		portal.callService(this.service,param, success);
	}

	action.getExportTaskListByUserId=function(success){
		var param={};
		param.method="getExportTaskListByUserId"
		portal.callService(this.service,param, success);
	}


	action.getExportTaskListByUserIdAndFilter=function(filter,success){
		var param={};
		param.method="getExportTaskListByUserIdAndFilter"
		param.filter=filter
		portal.callService(this.service,param, success);
	}


    action.addExportTask=function(config,success){
		var param = {};
		param.method="addExportTask"
		param.type=config.type;
		param.topicNo=config.topicNo
		param.filename=config.filename;
		param.exportDate=config.exportDate;
		param.jsonParam=config.jsonParam;
		portal.callService(this.service,param,success);
	}

	action.sendTopicPic=function(config,success) {
		var param={};
		param.method="sendTopicPic"
		param.urlRoot=config.urlRoot;
		param.urlPage=config.urlPage;
		param.fileName=config.fileName;
		param.topicName=config.topicName;
		param.emails=config.emails;
		portal.callService(this.service,param, success);
	}

	action.saveOrUpdateSendTopic=function(param,success){
     param.method="saveOrUpdateSendTopic"
		 portal.callService(this.service,param, success);
	}

	action.querySendTopicByNo=function(param,success) {
	 param.method="querySendTopicByNo"
	 portal.callService(this.service,param, success);
	},

	action.delSendTopic=function(param,success) {
	 param.method="delSendTopic"
	 portal.callService(this.service,param, success);
	},


	 action.isEmailSendOn=function(success) {
		var param={};
		param.method="isEmailSendOn"
		portal.callService(this.service,param, success);
	},

		action.updateSysClass=function(topicId,classType,userId,isDel,success) {
			var param={};
			param.method="updateSysClass"
		  param.topicId=topicId;
			param.classType=classType;
			param.userId=userId;
			param.isDel=isDel?'1':'0';
			portal.callService(this.service,param, success);
		}

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
