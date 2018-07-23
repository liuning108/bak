define([], function() {
    return {
        getHostGroup: function() {
			return fish.get("hostGroup/qryHostGroup");
		},
        getHostGroupParams: function(data) {
            return fish.post("hostGroup/qryHostGroupWithParams",data);
        },
        getAllHostsByGroupids: function(ids) {
            return fish.post("host/getAllHostsByGroupids", ids);
        },
        qryTemplate: function() {
            return fish.get("templateMgr/qryTemplate");
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
     	updateActions:function(data){
	      	return fish.post("action/updateActions",data);
     	},
        deleteActions:function(data){
	      	return fish.post("action/deleteActions",data);
     	},
        getActions:function(data){
            return fish.post("action/getActions",data);
        },
     	itemTypes:function(data){
	      	return fish.get("itnms/paravalue/"+data);
     	},
        getScripts:function(data){
            return fish.post("action/getScripts",data);
        },
        getProxys:function(data){
            return fish.post("action/getProxys",data);
        },
        getDrule:function(data){
            return fish.post("action/getDrule",data);
        },
        getDcheck:function(data){
            return fish.post("action/getDcheck",data);
        },
        getUsers:function(data){
            return fish.post("action/getUsers",data);
        },
        getUserGroups:function(data){
            return fish.post("action/getUserGroups",data);
        },
        getMediatype:function(data){
            return fish.post("action/getMediatype",data);
        }
    }
})