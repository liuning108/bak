define([], function() {
  return {
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
