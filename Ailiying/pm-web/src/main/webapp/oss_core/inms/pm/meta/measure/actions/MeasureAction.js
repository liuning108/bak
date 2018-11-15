define(function() {
	return {
		qryMeasure:function(params,success,syn){
			var result ={};
			var option={
				 async:!syn,
				 data:params,
				 url:"measure/measureinfo",
				 "success":function(data){
						 success(data);
				 }
			 }
		 fish.post(option);
		},
		qryMeasureField:function(params,success,syn){
			var result ={};
			var option={
				 async:!syn,
				 data:params,
				 url:"measure/measurefield",
				 "success":function(data){
						 success(data);
				 }
			 }
		 fish.post(option);

		},
		operMeasure:function(params,success){
			// portal.callService("MPM_META_MEASURE_OPER",params,success)
			console.log("operMeasure");
			if(params.OPER_TYPE.toLowerCase()=='add'){
				fish.post("measure/measureadd",params).then(function(data){
             success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='del'){
				fish.post("measure/measuredel",params).then(function(data){
						 success(data);
				})
			}
			if(params.OPER_TYPE.toLowerCase()=='edit'){
				fish.post("measure/measureedit",params).then(function(data){
						 success(data);
				})
			}
		}
	}
});
