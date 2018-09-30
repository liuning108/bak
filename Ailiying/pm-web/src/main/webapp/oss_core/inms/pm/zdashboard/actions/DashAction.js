define([], function() {
  return {
    getGraphsByCondition:function(param){
      return fish.post("inms/graphs/getGraphsByUserID", param);
    },
    saveOrUpdateDash:function(param){
     return fish.post("inms/graphs/updateDash", param);
    },
    getDash:function(id){
     return fish.post("inms/graphs/getDash", {'id':id});
    },
    getConfigById:function(id){
      return fish.post("inms/graphs/getConfigById", {'id':id});
    }



  }
})
