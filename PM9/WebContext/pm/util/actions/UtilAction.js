define(function() {
	return {
		qryEMSInfo:function(success,syn){
			var result ={};
		  var option={
				 async:!syn,
				 data:{},
				 url:"util/ems",
				 "success":function(data){
						 success(data);
				 }
			 }
		 fish.post(option);
		},
		qryParavalue:function(success,syn){
			var result ={};
		  var option={
				 async:!syn,
				 data:{},
				 url:"util/paravalue",
				 "success":function(d){
						 result.paraList=d;
						 success(result);
				 }
			 }
		 fish.post(option);
			// if(syn){
			// 	portal.callServiceSyn("MPM_UTIL_PARAVALUE",null,success);
			// }else{
			// 	portal.callService("MPM_UTIL_PARAVALUE",null,success);
			// }
		},
		qryParameter:function(success,syn){
       	var result ={};
				var option={
					  async:!syn,
						data:{},
					  url:"util/parameter",
						"success":function(d){
								result.paraList=d;
								success(result);
						}
					}
			 fish.post(option);
		},
		qryDataSource:function(param,success,syn){
			var result ={};
		  var option={
				 async:!syn,
				 data:{},
				 url:"util/datasource",
				 "success":function(data){
						 success(data);
				 }
			 }
		 fish.post(option);
		},
		qryScriptResult:function(param,success,syn){
			if(syn){
				portal.callServiceSyn("MPM_UTIL_SCRIPT_RESULT",param,success);
			}else{
				portal.callService("MPM_UTIL_SCRIPT_RESULT",param,success);
			}
		},
		qryPluginSpec:function(param,success,syn){
			var result ={};
			 var option={
					 async:!syn,
					 data:param,
					 url:"util/pluginspec",
					 "success":function(data){
							 success(data);
					 }
				 }
			fish.post(option);
		},
		qryPluginParam:function(param,success,syn){
			///util/pluginparam
			 var result ={};
			 var option={
					 async:!syn,
					 data:param,
					 url:"util/pluginparam",
					 "success":function(data){
							 success(data);
					 }
				 }
			fish.post(option);
		},
		operPluginParam:function(param,success,syn){
			//没人使用
			// if(syn){
			// 	portal.callServiceSyn("MPM_UTIL_PLUGIN_PARAM_OPER",param,success);
			// }else{
			// 	portal.callService("MPM_UTIL_PLUGIN_PARAM_OPER",param,success);
			// }
		},
	}
});
