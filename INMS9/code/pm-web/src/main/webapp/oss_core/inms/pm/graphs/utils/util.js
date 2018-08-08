define([],function(){
    var util={
      timetrans: function(tt) {
        var date = new Date(tt); //php time为10位需要乘1000
        var Y ='';
        var M = (
          date.getMonth() + 1 < 10
          ? '0' + (
          date.getMonth() + 1)
          : date.getMonth() + 1) + '/';
        var D = (
          date.getDate() < 10
          ? '0' + (
          date.getDate())
          : date.getDate()) + ' ';
        var h = (
          date.getHours() < 10
          ? '0' + date.getHours()
          : date.getHours()) + ':';
        var m = (
          date.getMinutes() < 10
          ? '0' + date.getMinutes()
          : date.getMinutes()) + ':';
        var s = (
          date.getSeconds() < 10
          ? '0' + date.getSeconds()
          : date.getSeconds());
        return  M + D + h + m+s;
      },
      resizeH:function(el){
        var docH = $(document).height();
        var tableH=(docH-48-35-70)*0.92;
        el.slimscroll({
             'height':tableH,
              width: "100%"
        });
      },
      combobox:function(el,dataSource){
        return el.combobox({
             editable: false,
             dataTextField: 'name',
             dataValueField: 'value',
             dataSource: dataSource
          });
      },
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
      },
      titlePos:function(value){
         switch (value) {
           case "L":
             return "left"
           case "R":
             return "right"
           case "C":
             return "center"
           default:
             return "left"
         }
      }
    };
    return util;
})
