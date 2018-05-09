define([],function(){
    var util={
      doNotNull:function(obj,arg){
         if(obj){
           return obj(arg);
         }
         return null;
      }
    };
    return util;
})
