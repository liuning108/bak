define([],function(){
    var util={
      doNotNull:function(obj,arg){
         if(obj){
           return obj(arg);
         }
         return null;
      },
      kdoinputStyle:function(el){
        el.off('click').on('click',function() {
           $(this).find(".textInput").focus();
        })
      }
    };
    return util;
})
