define([], function() {
  return {
    moveFTPFile:function(filepath){
     return fish.post("pm/api/taskprocessweb/moveFTPFile", {'filepath':filepath});
    },
    exportTasklist: function(param) {
      return fish.post("pm/api/taskprocessweb/exportTasklist", {name:param});
    },
    addExportTask: function(param) {
      return fish.post("pm/api/taskprocessweb/addExportTask", param);
    },
    onceDownloadFile: function(param) {
      return fish.post("pm/api/taskprocessweb/onceDownloadFile", param);
    }
  }
})
