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
     },
     saveOrUpHost:function(host){
       return fish.post("host/saveOrUpHost", host);
     },
     deleteHost:function(ids){
       return fish.post("host/deleteHost", ids);
     },
     getHostByid:function(id){
      return fish.post("host/getHostByid",{"id":id});
    },
     changeHostStatus:function(hosts){
      return fish.post("host/changeHostStatus",hosts);
     }


  }
})
