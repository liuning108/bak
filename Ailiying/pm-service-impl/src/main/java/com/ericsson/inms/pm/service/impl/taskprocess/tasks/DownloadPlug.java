package com.ericsson.inms.pm.service.impl.taskprocess.tasks;

import com.ericsson.inms.pm.api.service.taskprocess.TaskProcessService;
import com.ericsson.inms.pm.schedule.ScheduleServer;
import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.service.impl.taskprocess.TaskProcessServiceImpl;
import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ericsson.inms.pm.taskoneexec.IOnecExecInst;
import com.ericsson.inms.pm.taskoneexec.model.OnceExecArg;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

import com.alibaba.fastjson.JSONObject;

public class DownloadPlug implements IOnecExecInst {

	private OpbLogger logger = OpbLogger.getLogger(ScheduleServer.class, "PM");

	@Override
	public JobResult executeInst(TaskParamVer taskParamVer, TaskInst taskInst, OnceExecArg onceExecArg) {
		JobResult result = new JobResult();
		String id = taskInst.getTaskID();
		logger.info("DownloadPlug Begin:" + id);
		JSONObject info = getDataExpParam(id);
		logger.info("DownloadPlug Info:" + info);
		String filePath = getDownloadFile(info);
		logger.info("DownloadPlug filePath:" + filePath);
		result.setState("3");
		result.setCause("Test DownloadPlug ");
		return result;

	}

	private String getDownloadFile(JSONObject info) {
		JSONObject dict = new JSONObject();
		dict.put("param", info);
		try {
			JSONObject result = getService().onceDownloadFile(dict);
			return result.getString("filePath");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	private JSONObject getDataExpParam(String id) {
		JSONObject dict = new JSONObject();
		dict.put("id", id);
		try {
			return getService().getDataExpParam(dict);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	private TaskProcessService getService() {
		try {
			TaskProcessService taskProcessService = (TaskProcessService) SpringContext
					.getBean(TaskProcessServiceImpl.class);
			return taskProcessService;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
