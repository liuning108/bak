portal.define(function() {
	return {
		qryModel:function(params,success){
			portal.callService("MPM_META_MODEL_BUSI_QUERY",params,success)
		},
		qryModelField:function(params,success){
			portal.callService("MPM_META_MODEL_BUSI_FIELD_QUERY",params,success)
		},
		operModel:function(params,success){
			portal.callService("MPM_META_MODEL_BUSI_OPER",params,success)
		}
	}
});