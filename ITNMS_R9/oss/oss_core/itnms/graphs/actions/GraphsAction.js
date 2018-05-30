define([], function() {
  return {
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
