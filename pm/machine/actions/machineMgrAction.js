define(function() {
	var action={};
	action.service="MPM_MACHINE_MANAGE_SERVICE";
	action.qryCollectMachines=function(success){
	  var param={};
	  param.method="qryCollectMachines"
	  portal.callService(this.service,param, success);
	}
	action.saveOrUpdate=function(mdata,success){
      var param={};
	  param.method="saveOrUpdate"
	  param.data=mdata.meachineData;
	  param.taskData=mdata.tasks;
	  portal.callService(this.service,param, success);
	}
	action.deleteCollectMachine=function(data,success){
	  var param={};
	  param.method="deleteCollectMachine"
	  param.data=data;
	  portal.callService(this.service,param, success);
	}
	action.queryUndistbutedTask=function(data,success){
	  var param={};
	  param.method="queryUndistbutedTask"
	  param.data=data;
	  portal.callService(this.service,param, success);
	}
	action.queryCollectMachineTasks=function(data,success){
	  var param={};
	  param.method="queryCollectMachineTasks"
	  param.data=data;
	  portal.callService(this.service,param, success);
	}

	
	action.isExistDisposeMachine=function(data,success){
	  var param={};
	  param.method="isExistDisposeMachine"
	  param.data=data;
	  portal.callService(this.service,param, success);
	}
	return action;
});