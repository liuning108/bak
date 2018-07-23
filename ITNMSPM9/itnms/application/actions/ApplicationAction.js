define([], function() {
  return {
    getTemplate:function(param){
     return fish.post("application/getTemplate", param);
    },
    getSubApplicationInfo:function(param){
     return fish.post("application/getSubApplicationInfo", param);
    },
    updataApplciton:function(param){
     return fish.post("application/updateApplications", param);
    },
    addApplciton:function(param){
     return fish.post("application/addApplications", param);
    },
    delApplciton:function(param){
     return fish.post("application/delApplications", param);
    },
    getApplication:function(param){
       return fish.post("application/getApplications", param);
    },
    getAllGroup: function() {
      return fish.get("host/getAllGroup", {});
    },
    getTemplateByGroupId: function(id) {
      return fish.post("host/getTemplateByGroupId", {'groupId': id});
    },
    getAllHostsByGroupids: function(ids) {
      var filterParam = {
        name: '',
        ip: '',
        dns: '',
        port: ''
      };
      return fish.post("host/getAllHostsByGroupids", {'ids':ids,"search":filterParam,"extendParam":{}}
     );
    },
    getHostByid: function(id) {
      return fish.post("host/getHostByid", {"id": id+""});
    },
  }
})
