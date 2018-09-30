define([], function() {
  return {
    onceDownloadFile:function(param){
      return fish.post("pm/api/taskprocessweb/onceDownloadFile", param);
    },
  }
})
