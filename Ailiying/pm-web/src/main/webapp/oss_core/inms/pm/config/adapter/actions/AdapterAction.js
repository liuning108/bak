define(function() {
	return {
		qryAdapter:function(params,success){
			//portal.callService("MPM_CONFIG_ADAPTER_QUERY",params,success)
            fish.post("adapter/adapterinfo",params).then(function(data){
                success(data);
            });
        },

		qryMapping:function(params,success){
			//portal.callService("MPM_CONFIG_ADAPTER_MAPPING_QUERY",params,success)
            fish.post("adapter/adaptermapping",params).then(function(data){
                success(data);
            });
        },

		operAdapter:function(params,success){
			//portal.callService("MPM_CONFIG_ADAPTER_OPER",params,success)
            if(params.OPER_TYPE.toLowerCase()=='add'){
                fish.post("adapter/add",params).then(function(data){
                    success(data);
                })
            }
            if(params.OPER_TYPE.toLowerCase()=='del'){
                fish.post("adapter/del",params).then(function(data){
                    success(data);
                })
            }
            if(params.OPER_TYPE.toLowerCase()=='edit'){
                fish.post("adapter/edit",params).then(function(data){
                    success(data);
                })
            }
		}
	}
});
