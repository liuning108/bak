define(function() {
	return {
		qryModel:function(params,success){
			fish.post("phymodel/modelinfo",params).then(function(data){
					 success(data);
			})
			//portal.callService("MPM_META_MODEL_PHY_QUERY",params,success)
		},
		qryModelScript:function(params,success){
			fish.post("phymodel/scriptinfo",params).then(function(data){
					 success(data);
			})
			//portal.callService("MPM_META_MODEL_PHY_SCRIPT_QUERY",params,success)
		},
		qryModelDataSource:function(params,success){
			fish.post("phymodel/datasourceinfo",params).then(function(data){
					 success(data);
			})
		 //	portal.callService("MPM_META_MODEL_PHY_DATA_SOURCE_QUERY",params,success)
		},
		operModel:function(params,success){
			if(params.OPER_TYPE.toLowerCase()=='add'){
				fish.post("phymodel/add",params).then(function(data){
             success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='del'){
				fish.post("phymodel/del",params).then(function(data){
						 success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='edit'){
				fish.post("phymodel/edit",params).then(function(data){
						 success(data);
				})
			}
		//	portal.callService("MPM_META_MODEL_PHY_OPER",params,success)
		}

	}
});
