define([], function() {
    return {
        getItemsInfo: function(data) {
            return fish.post("items/getItemsInfo", data);
        },
        delItemsInfo: function(data) {
            return fish.post("items/delItemsInfo", data);
        },
        addItemsInfo:function(data){
            return fish.post("items/addItemsInfo",data);
        },
        updateItemsInfo:function(data){
            return fish.post("items/updateItemsInfo",data);
        },
        updateItemsStatus: function(data) {
            return fish.post("items/updateItemsStatus", data);
        },
        getParamvalueInfo: function(data) {
            return fish.get("param/getParamvalueInfo?paraIds="+data);
        },
        queryTempalte:function(catagory){
           return fish.post("template/pmtemplate", {"catagory" : catagory});
        },
        getMetricKeyInfo:function(){
            return fish.post("items/getMetricKeyInfo",{
                "paraId": "METRIC_KEY"
            });
        },
        getGroupedComboxOption:function(data){
            return fish.post("items/getGroupedComboxOption?paraId="+data);
        },
        pmtemplateCPInfo:function(data){
            return fish.post("template/pmtemplateCPInfo",data);
        },
        getItemsTotalInfo:function(data){
            return fish.post("items/getItemsTotalInfo",data);
        }
    }
})