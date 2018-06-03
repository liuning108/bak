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
		qryDataSource:function(param,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_DATA_SOURCE",null,success);
			}else{
				portal.callService("MPM_UTIL_DATA_SOURCE",null,success);
			}
		},
		qryScriptResult:function(param,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_SCRIPT_RESULT",param,success);
			}else{
				portal.callService("MPM_UTIL_SCRIPT_RESULT",param,success);
			}
		},
		qryPluginSpec:function(param,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_PLUGIN_SPEC",param,success);
			}else{
				portal.callService("MPM_UTIL_PLUGIN_SPEC",param,success);
			}
		},
		qryPluginParam:function(param,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_PLUGIN_PARAM",param,success);
			}else{
				portal.callService("MPM_UTIL_PLUGIN_PARAM",param,success);
			}
		},
		operPluginParam:function(param,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_PLUGIN_PARAM_OPER",param,success);
			}else{
				portal.callService("MPM_UTIL_PLUGIN_PARAM_OPER",param,success);
			}
		},
	}
});