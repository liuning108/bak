define(function() {
	return {
		qryDim:function(params,success){
			 if(params==null){
				 params={};
			 }
			 fish.post("dim/diminfo",{}).then(function(data) {
				  success(data);
			 })
		},
		operDim:function(params,success){
       if(params.OPER_TYPE.toLowerCase()=='add'){
         fish.post('dim/dimadd',params).then(function(data){
					   success(data)
				 })
			 }
			 if(params.OPER_TYPE.toLowerCase()=='del'){
				 fish.post('dim/dimdel',params).then(function(data){
						success(data)
			  	})
			 }
			 if(params.OPER_TYPE.toLowerCase()=="edit") {
				 fish.post('dim/dimedit',params).then(function(data){
						success(data)
			  	})
			 }
      //portal.callService("MPM_META_DIM_OPER",params,success)
		}
	}
});
