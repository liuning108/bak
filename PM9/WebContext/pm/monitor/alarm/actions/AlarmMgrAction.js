define(function() {
	var action={};
	action.service="MPM_ALRAM_MANAGE_SERVICE";

	action.queryAlramList=function(json,success) {
		var param=json;
		param.method="queryAlramList"
		portal.callService(this.service,param, success);
	}




	return action;
});
