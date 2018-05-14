portal.define(function() {
	return {
		qryTask:function(params,success){
			portal.callService("MPM_CONFIG_TASK_QUERY",params,success)
		},
		qryDetail:function(params,success){
			portal.callService("MPM_CONFIG_TASK_DETAIL_QUERY",params,success)
		},
		operTask:function(params,success){
			portal.callService("MPM_CONFIG_TASK_OPER",params,success)
		}
	}
});