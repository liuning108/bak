define(function() {
	return {
		qryTask:function(params,success){
			//portal.callService("MPM_CONFIG_TASK_QUERY",params,success)
            fish.post("task/taskinfo",params).then(function(data){
                success(data);
            });
		},

		qryDetail:function(params,success){
			//portal.callService("MPM_CONFIG_TASK_DETAIL_QUERY",params,success)
            fish.post("task/taskdetail",params).then(function(data){
                success(data);
            });
		},

		operTask:function(params,success){
			//portal.callService("MPM_CONFIG_TASK_OPER",params,success)
            if(params.OPER_TYPE.toLowerCase()=='add'){
                fish.post("task/addtaskinfo",params).then(function(data){
                    success(data);
                })
            }
            if(params.OPER_TYPE.toLowerCase()=='del'){
                fish.post("task/deltaskinfo",params).then(function(data){
                    success(data);
                })
            }
            if(params.OPER_TYPE.toLowerCase()=='edit'){
                fish.post("task/edittaskinfo",params).then(function(data){
                    success(data);
                })
            }
		}
	}
});
