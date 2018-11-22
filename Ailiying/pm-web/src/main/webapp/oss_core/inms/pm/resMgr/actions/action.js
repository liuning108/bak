define(function() {
	return {
    getInfo:function(){
			return fish.post("pm/api/resmgr/getInfo",{});
		},
		qurTmpInfo:function(tid){
			return fish.post("pm/api/resmgr/qurTmpInfo",{'tid':tid})
		},
		loadTree:function(vntypes){
			 return fish.post("pm/api/resmgr/loadTree",{"vntypes":vntypes})
  	},
		qurRes : function(param,initData){
			return fish.post("pm/api/resmgr/qurRes",{
				"param":param,
				"initData":initData
			})
		},
		getSubTreeData:function(ids){
			return fish.post("pm/api/resmgr/getSubTreeData",{
				"ids":ids
			})
		},
	}
});
