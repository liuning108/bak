portal.define(function() {
	return {
		qryCounterList:function(params,success){
			portal.callService("MPM_COUNTER_LIST_QUERY",params,success)
		},
		qryCounterData:function(params,success){
			portal.callService("MPM_COUNTER_DATA_QUERY",params,success)
		},
		
	}
});