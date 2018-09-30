define(["oss_core/inms/pm/taskprocess/actions/TaskProcessAction.js"],
  function(action){
     return {
       downloadConfig:function(config){
         console.log("donwloadConfig",config);
         if(!config.param.extendDimFilterList){
           config.param.extendDimFilterList=[];
         }
         action.onceDownloadFile(config);


       }
     }
})
