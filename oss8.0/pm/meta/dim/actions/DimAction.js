portal.define(function() {
	return {
		qryDim:function(params,success){
			portal.callService("MPM_META_DIM_QUERY",params,success)
		},
		operDim:function(params,success){
			portal.callService("MPM_META_DIM_OPER",params,success)
		}
	}
});