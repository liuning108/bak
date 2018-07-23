define([], function() {
    return {
        getCategoryTree: function() {
            return fish.get("host/getCategoryTree", {});
        },
        getHostGroup: function() {
			return fish.get("hostGroup/qryHostGroup");
		},
        getAllHostsByGroupids: function(ids) {
            return fish.post("host/getAllHostsByGroupids", ids);
        },
        getHostByid:function(id){
            return fish.post("host/getHostByid",{"id":id});
        },
        getInterfase:function(data){
            return fish.post("itnms/hostinterface/info",data);
        },
		itemCreat:function(data){
	      	return fish.post("itnms/items",[data]);
     	},
        itemGet:function(data){
	      	return fish.post("itnms/items/info",data);
     	},
     	itemPut:function(data){
	      	return fish.put("itnms/items",data);
     	},
        itemRemove:function(data){
	      	return fish.remove("itnms/items",data);
     	},
     	itemTypes:function(data){
	      	return fish.get("itnms/paravalue/"+data);
     	}
    }
})