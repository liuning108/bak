define(["stafforg/modules/stafforg/actions/StaffOrgAction",
	"frm/portal/Portal"], function (StaffOrgAction) {
    

        portal.appEvent.onEnterBefore(selectStaffJob);

        function selectStaffJob($def){
            var that = this;
            StaffOrgAction.qryIsStaffJobEnabled(function (data) {
                if (data && "true" == data) {
                    StaffOrgAction.qryOrgJobListBySelf(function(data) {
                        var jobList = data || [];
                        if (jobList && jobList.length > 0) {
                            if (jobList.length == 1) { //只有一个不用选择
                                saveStaffJob(jobList[0],$def);
                             }
                            else {
                                fish.popupView({ //弹框必须选择一个
                                    url:'stafforg/modules/stafforg/views/StaffJobSelect',
                                    canClose: false,
                                    keyboard:false,
                                    viewOption:{
                                        list: jobList,
                                        cssprop : 'grid-height-sm'                                            
                                    },
                                    close : function(staffJobObj){
                                        saveStaffJob(staffJobObj,$def);
                                    }
                                });
                            }
                        } else { //此用户没有配置staffjob
                            $def.resolve();
                        }
                    });
                } else { //未开启staffjob选择
                    $def.resolve();
                }
            });
        }

        function saveStaffJob(params,$def){
            StaffOrgAction.saveStaffJobId({"staffJobId":params.staffJobId}, function(){
            	portal.appGlobal.set("staffId", params.staffId);
                portal.appGlobal.set("orgId", params.orgId);
                portal.appGlobal.set("areaId", params.areaId);
                portal.appGlobal.set("jobId", params.jobId);
                portal.appGlobal.set("orgName", params.orgName);
                portal.appGlobal.set("staffName", params.staffName);
                portal.appGlobal.set("areaName", params.areaName);
                portal.appGlobal.set("staffJobId", params.staffJobId);
                
                $def.resolve();
            });
        } 


});
