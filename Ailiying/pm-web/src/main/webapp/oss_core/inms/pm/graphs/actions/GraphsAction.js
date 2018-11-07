define([], function() {
  return {
    loadKpiData:function(param){
      return fish.post("inms/graphs/loadKpiData", param);
    },
    getKpiInfo:function(CODES){
      return fish.post("kpi/kpiformular",{KPI_CODE_S: CODES});
    },
    getTimeConfig:function(CODE){
     return fish.post("inms/graphs/getTimeConfig",{});
    },
    getbusField:function(CODE){

     return fish.post("busimodel/field",{"MODE":'ALL',"MODEL_BUSI_CODE":CODE});
    },
    getGraphsByCondition:function(param){
      return fish.post("inms/graphs/getGraphsByUserID", param);
    },
    getItemsByTId:function(tid){
      return fish.post("inms/graphs/getItemsByTId", {'tid':tid});
    },
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
      param.name="";
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
