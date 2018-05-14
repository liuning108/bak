portal.define(function() {
	return {
		qryKPI:function(params,success){
			portal.callService("MPM_META_KPI_QUERY",params,success)
		},
		qryKPIFormular:function(params,success){
			portal.callService("MPM_META_KPI_FORMULAR_QUERY",params,success)
		},
		operKPI:function(params,success){
			portal.callService("MPM_META_KPI_OPER",params,success)
		}
		
	}
});