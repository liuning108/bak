portal.define(function() {
	return {
		qryMeasure:function(params,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_META_MEASURE_QUERY",params,success);
			}else{
				portal.callService("MPM_META_MEASURE_QUERY",params,success)
			}
			
		},
		qryMeasureField:function(params,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_META_MEASURE_FIELD_QUERY",params,success);
			}else{
				portal.callService("MPM_META_MEASURE_FIELD_QUERY",params,success);
			}
			
		},
		operMeasure:function(params,success){
			portal.callService("MPM_META_MEASURE_OPER",params,success)
		}
	}
});