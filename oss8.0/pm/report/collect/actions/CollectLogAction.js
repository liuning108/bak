portal.define(function() {
	return {
		qryCollectLog:function(params,success){
			portal.callService("MPM_COLLECT_LOG_QUERY",params,success)
		},		
	}
});