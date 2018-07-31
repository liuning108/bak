define(function() {
	var action={};
	action.service="MPM_BADQUALITYCELL_INDEX_SERVICE";
	action.getCellAreaInfo=function(time,success){
		var param={};
		param.method="getCellAreaInfo"
		param.time=time;
		return portal.callService(this.service,param);
	}
	action.getCellAllInfo=function(time,success){
		var param={};
		param.method="getCellAllInfo"
		param.time=time;
		return portal.callService(this.service,param);
	}
	action.getTopCellInfo=function(time,success){
		var param={};
		param.method="getTopCellInfo"
		param.time=time;
		param.top =100;
		return portal.callService(this.service,param);
	}
	return action;
});
