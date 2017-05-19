define(function() {
	var action={};
	action.service="MPM_BSCREEN_MANAGE_SERVICE";
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




	return action;
});
