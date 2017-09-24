define(function() {
	var action={};
	action.service="MPM_BSCREEN_MANAGE_SERVICE";

	action.delFile=function(filename,success) {
		var param={};
		param.method="delFile"
		param.fileName = filename;
		portal.callService(this.service,param, success);
	}

	action.getServerSkeleton=function(no,success) {
		var param={};
		param.method="getServerSkeleton"
		param.Id = no;
		portal.callService(this.service,param, success);
	}

	action.getSourceServiceById = function(no , success) {
		var param={};
		param.method="getSourceServiceById"
		param.Id = no;
		portal.callService(this.service,param, success);
	}

	action.delSourceServiceById = function(no,success) {
		var param={};
		param.method="delSourceServiceById"
		param.Id = no;
		portal.callService(this.service,param, success);
	}

	action.getSourceServiceListByUserID = function(userId,success) {
		var param={};
		param.method="getSourceServiceList"
		param.userId = userId;
		portal.callService(this.service,param, success);
	}

	action.saveOrUpdateSourceService=function(json,success) {
		var param={};
 		param.method="saveOrUpdateSourceService"
		param.json = json;
		portal.callService(this.service,param, success);
	}

	action.getFields=function(source,sql,success){
		var param={};
		param.method="getFields"
  	    param.source=source;
		param.sql=sql;
  	    portal.callService(this.service,param, success);
	}
	// TODO: 获得数据源
	action.getSource=function(success){
	  var param={};
	  param.method="getSource"
	  portal.callService(this.service,param, success);
    //   portal.callService("MPM_UTIL_DATA_SOURCE",param, success);

	}
	// TODO: 更新大屏仪表盘
	action.saveOrUpdate=function(json,success){
      var param={};
	  param.method="saveOrUpdate"
	  param.data=json;
	  portal.callService(this.service,param, success);
	}
	// TODO: 查询大屏主题
    action.queryBScreenById=function(id,success){
	 var param={};
	 param.method="queryBScreenById"
	 param.topId=id;
	 portal.callService(this.service,param, success);
	}
	// TODO: 查询大屏列表
    action.queryBScreenListByUserID=function(id,success){
	 var param={};
	 param.method="queryBScreenListByUserID"
	 param.userId=id;
	 portal.callService(this.service,param, success);
	}
	// TODO: 删除大屏设计
    action.deleteBScreenById=function(id,success){
	 var param={};
	 param.method="deleteBScreenById"
	 param.topicId=id;
	 portal.callService(this.service,param, success);
	}
	// TODO: move File 
	action.moveFile=function(targetDirs,sourceFile,success){
	 this.service="MPM_BSCREEN_MANAGE_SERVICE";
	 var param={};
	 param.method="moveFile"
	 param.targetDirs=targetDirs;
	 param.sourceFile=sourceFile;
	 portal.callService(this.service,param, success);
	}






	return action;
});
