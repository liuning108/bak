define([], function() {
    return {
        getHostGroup: function() {
			return fish.get("hostGroup/qryHostGroup");
		},
        getHostGroupParams: function(data) {
            return fish.post("hostGroup/qryHostGroupWithParams",data);
        },
        getHostByid:function(id){
            return fish.post("host/getHostByid",{"id":id});
        },
        itemGet:function(data){
            return fish.post("itnms/items/info",data);
        },
		triggerCreat:function(data){
	      	return fish.post("trigger/createTriggers",data);
     	},
        triggerGet:function(data){
	      	return fish.post("trigger/getTriggersByid",data);
     	},
     	triggerPut:function(data){
	      	return fish.post("trigger/updateTriggers",data);
     	},
        triggerRemove:function(data){
	      	return fish.post("trigger/deleteTriggers",data);
     	},
        macroGet:function(data){
            return fish.post("trigger/getMacros",data);
        },
     	itemTypes:function(data){
	      	return fish.get("itnms/paravalue/"+data);
     	},
        queryItnmsExpFunc:function(){
            return fish.post("trigger/queryItnmsExpFunc");
        },
        queryItnmsExpFuncPara:function(){
            return fish.post("trigger/queryItnmsExpFuncPara");
        }
    }
})