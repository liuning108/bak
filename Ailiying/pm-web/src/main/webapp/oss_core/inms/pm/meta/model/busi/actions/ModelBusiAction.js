define(function() {
	return {
		qryModel:function(params,success){
			fish.post("busimodel/info",params).then(function(data){
					 success(data);
			})
			// portal.callService("MPM_META_MODEL_BUSI_QUERY",params,success)
		},
		qryModelField:function(params,success){
			fish.post("busimodel/field",params).then(function(data){
					 success(data);
			})
			// portal.callService("MPM_META_MODEL_BUSI_FIELD_QUERY",params,success)
		},
		operModel:function(params,success){
			if(params.OPER_TYPE.toLowerCase()=='add'){
				fish.post("busimodel/add",params).then(function(data){
             success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='del'){
				fish.post("busimodel/del",params).then(function(data){
						 success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='edit'){
				fish.post("busimodel/edit",params).then(function(data){
						 success(data);
				})
			}
			// portal.callService("MPM_META_MODEL_BUSI_OPER",params,success)
		}
	}
});
