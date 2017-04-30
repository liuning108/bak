portal.define(function() {
	return {
		qryEMSInfo:function(success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_EMS",null,success);
			}else{
				portal.callService("MPM_UTIL_EMS",null,success);
			}
			
		},
		qryParavalue:function(success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_PARAVALUE",null,success);
			}else{
				portal.callService("MPM_UTIL_PARAVALUE",null,success);
			}
		},
		qryParameter:function(success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_PARAMETER",null,success);
			}else{
				portal.callService("MPM_UTIL_PARAMETER",null,success);
			}
		},
	}
});