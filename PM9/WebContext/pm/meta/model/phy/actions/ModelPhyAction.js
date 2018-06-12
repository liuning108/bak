portal.define(function() {
	return {
		qryModel:function(params,success){
			portal.callService("MPM_META_MODEL_PHY_QUERY",params,success)
		},
		qryModelScript:function(params,success){
			portal.callService("MPM_META_MODEL_PHY_SCRIPT_QUERY",params,success)
		},
		qryModelDataSource:function(params,success){
			portal.callService("MPM_META_MODEL_PHY_DATA_SOURCE_QUERY",params,success)
		},
		operModel:function(params,success){
			portal.callService("MPM_META_MODEL_PHY_OPER",params,success)
		}
		
	}
});