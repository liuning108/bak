define([], function() {
  return {
    getGraphsTags:function(){
      return fish.post("inms/graphs/getGraphsTags", {'num':50});
    },
    getGraphsById:function(id){
      return fish.post("inms/graphs/getGraphsById", {'id':id});
    },
    delGraphs:function(param){
      return fish.post("inms/graphs/delGraphs", param);
    },
    getGraphsByUserID:function(param){
      return fish.post("inms/graphs/getGraphsByUserID", param);
    },
    saveOrUpdateGraphs: function(data){
    return fish.post("inms/graphs/saveOrUpdateGraphs", data);
    },
    getItemsByTemplateId:function(id){
     return fish.post("inms/graphs/getItemsByTemplateId", {"id":""+id});
    },
    getTemplatesByCatagroyId:function(id){
     return fish.post("inms/graphs/getTemplatesByCatagroyId", {"id":""+id});
    },
    getTemplateById: function(id) {
      return fish.post("inms/graphs/getTemplateById", {"id":""+id});
    },
    getAllGroup: function() {
      return fish.post("inms/graphs/getTemplateCatagorys", {});
    }
  }
})
