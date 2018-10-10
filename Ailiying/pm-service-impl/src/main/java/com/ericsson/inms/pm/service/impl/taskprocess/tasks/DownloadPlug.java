package com.ericsson.inms.pm.service.impl.taskprocess.tasks;

import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.taskoneexec.IOnecExecInst;
import com.ericsson.inms.pm.taskoneexec.model.OnceExecArg;

public class DownloadPlug implements IOnecExecInst {

	@Override
	public JobResult executeInst(TaskParamVer taskParamVer, TaskInst taskInst, OnceExecArg onceExecArg) {
		JobResult result = new JobResult();
		result.setState("3");
		result.setCause("Test DownloadPlug ");
	    System.err.println("DownloadPlug Begint:"+taskInst .getTaskID());
		return result;
	}


}
