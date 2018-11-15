define(function() {
	return {
		qurTmpInfo:function(tid){
			return fish.post("pm/api/resmgr/qurTmpInfo ",{'tid':tid})
		},
		loadTree:function(){
			 return fish.post("pm/api/resmgr/loadTree ",{})
  	},
		qurRes : function(){
			return fish.post("pm/api/resmgr/qurRes ",{})
		}
	}
});
