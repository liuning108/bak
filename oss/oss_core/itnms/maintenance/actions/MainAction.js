define([], function() {
  return {
    getCategoryTree: function() {
      return fish.get("host/getCategoryTree", {});
    },
    getAllGroup: function() {
      return fish.get("host/getAllGroup", {});
    },
    getGroupidsBySubNo: function(id) {
      return fish.post("host/getGroupidsBySubNo", {"id": id});
    },
    getAllProxy: function() {
      return fish.get("host/getAllProxy", {});
    },
    getAllMainByGroupids:function(param){
      return fish.post("maintenance/getAllMainByGroupids", param);
    },
    deleteByIds:function(param) {
      return fish.post("maintenance/deleteByIds", param);
    },
    getMaintenanceById:function(id) {
     return fish.post("maintenance/getMaintenanceById", {'id':id+""});
    },


  }
})
