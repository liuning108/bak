package com.ericsson.inms.pm.service.impl.taskprocess.tasks;

import com.ericsson.inms.pm.api.service.taskprocess.TaskProcessService;
import com.ericsson.inms.pm.schedule.ScheduleServer;
import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.service.impl.taskprocess.TaskProcessServiceImpl;
import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ericsson.inms.pm.service.impl.taskprocess.util.JsonMapUtil;
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
	
	private Boolean check(Object target,String id) {
		if(target==null) {
			this.savefilePath(id, "", JsonMapUtil.DOWANLOAD_STATE_ERROR);
			return false ;
		}else {
			return true;
		}
	}

	@Override
	public JobResult executeInst(TaskParamVer taskParamVer, TaskInst taskInst, OnceExecArg onceExecArg) {
		JobResult result = new JobResult();
		
		String id = taskInst.getTaskID();
		logger.info("=============DownloadPlug Begin:" + id+"=============");
		JSONObject info = getDataExpParam(id);
		logger.info("DownloadPlug Info:" + info);
		if(!this.check(info, id)) {
			result.setState("3");
			result.setCause("info is null");
			return result;
		}
		String filePath = getDownloadFile(info);
		logger.info("DownloadPlug Local filePath:" + filePath);
		if(!this.check(filePath, id)) {
			result.setState("3");
			result.setCause("filePath is null");
			return result;
		}
		JSONObject ftpInfo = this.getConfigFTP();
		logger.info("DownloadPlug ftpInfo:" + ftpInfo);
		if(!this.check(ftpInfo, id)) {
			result.setState("3");
			result.setCause("ftpInfo is null");
			return result;
		}
		if (ftpInfo != null) {
			// 配有FTP，得到上传后的FTP
			String ftpFilePath = this.uploadFTP(ftpInfo, filePath);
			if(ftpFilePath==null) {
				logger.info("DownloadPlug FTP Upload Error ftpFilePath is NULL,ftpInfo:" + ftpInfo);
				
			}else {
				filePath =ftpFilePath;   //保存上传好的文件
			}
			if(!this.check(ftpFilePath, id)) {
				result.setState("3");
				result.setCause("ftpFilePath is null");
				return result;
			}
			logger.info("DownloadPlug FTP File:" + filePath);
			result = this.savefilePath(id, filePath, JsonMapUtil.DOWANLOAD_STATE_DONE);
		} else {
			// 没有配FTP,保存本地的路径
			result = this.savefilePath(id, filePath, JsonMapUtil.DOWANLOAD_STATE_DONE);
		}
		logger.info("=============DownloadPlug End:"+result.getState()+":"+result.getCause()+"=============");
		return result;

	}

	private String uploadFTP(JSONObject ftpInfo, String filePath) {
		try {
			JSONObject dict = new JSONObject();
			dict.put("ftpInfo", ftpInfo);
			dict.put("filePath", filePath);
			JSONObject result = getService().uploadFTP(dict);
			String ftpFilePath = result.getString("ftpPath");
			return ftpFilePath;
		} catch (Exception e) {
			return null;
		}

	}

	private JSONObject getConfigFTP() {
		try {
			return getService().getConfigFTP();
		} catch (Exception e) {
			return null;
		}
	}

	private JobResult savefilePath(String id, String filePath, String state) {
		JobResult result = new JobResult();
		try {
			JSONObject dict = new JSONObject();
			dict.put("id", id);
			dict.put("filePath", filePath);
			dict.put("state", state);
			getService().savefilePath(dict);
			result.setState("0");
			result.setCause("");
		} catch (Exception e) {
			result.setCause("3");
			result.setCause(e.getMessage());
		}
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
