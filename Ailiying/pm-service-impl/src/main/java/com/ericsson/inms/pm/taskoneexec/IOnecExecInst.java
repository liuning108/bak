package com.ericsson.inms.pm.taskoneexec;

import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.taskoneexec.model.OnceExecArg;

public interface IOnecExecInst {
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer
     * @param taskInst
     * @return <br>
     */
    JobResult executeInst(TaskParamVer taskParamVer, TaskInst taskInst, OnceExecArg onceExecArg);
}
