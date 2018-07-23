define(function() {
	return {
		qryKPI:function(params,success){
			fish.post("kpi/kpiinfo",params).then(function(data){
					 success(data);
			})
			// portal.callService("MPM_META_KPI_QUERY",params,success)
		},
		qryKPIFormular:function(params,success){
			fish.post("kpi/kpiformular",params).then(function(data){
					 success(data);
			})
			// portal.callService("MPM_META_KPI_FORMULAR_QUERY",params,success)
		},
		operKPI:function(params,success){
			if(params.OPER_TYPE.toLowerCase()=='add'){
				fish.post("kpi/add",params).then(function(data){
						 success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='del'){
				fish.post("kpi/del",params).then(function(data){
						 success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='edit'){
				fish.post("kpi/edit",params).then(function(data){
						 success(data);
				})
			}
			// portal.callService("MPM_META_KPI_OPER",params,success)
		}

	}
});
