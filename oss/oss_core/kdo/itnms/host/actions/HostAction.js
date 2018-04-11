define([],function() {
  return {
     getCategoryTree:function(){
      return fish.get("host/getCategoryTree", {});
     },
     getAllGroup:function(){
      return fish.get("host/getAllGroup", {});
     },
     getAllHostsByGroupids:function(ids){
      return fish.post("host/getAllHostsByGroupids", ids);
     },
     getGroupidsBySubNo:function(id){
      return fish.get("host/getGroupidsBySubNo",id);
     },
     getAllProxy:function(){
       return fish.get("host/getAllProxy", {});
     }
  }
})
