define([], function() {
  return {
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
