define(function () {
    return {
        saveParam: function (param, success) {
          console.log(param);
          fish.post("param",param.paramList).then(function(){
                  success()
          })
        },
        loadParam: function (param, success) {
           fish.get("param",param).then(function(datas){
             var result={};
                 result.paramList=datas;
              success(result);
           })
        }

    }
});
