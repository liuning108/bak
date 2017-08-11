portal.define(function() {
	return {
		qryAdapter:function(params,success){
			portal.callService("MPM_CONFIG_ADAPTER_QUERY",params,success)
		},
		qryMapping:function(params,success){
			portal.callService("MPM_CONFIG_ADAPTER_MAPPING_QUERY",params,success)
		},
		operAdapter:function(params,success){
			portal.callService("MPM_CONFIG_ADAPTER_OPER",params,success)
		}
	}
});