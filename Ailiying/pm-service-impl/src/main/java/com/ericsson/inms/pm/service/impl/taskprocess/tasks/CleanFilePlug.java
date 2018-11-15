package com.ericsson.inms.pm.service.impl.taskprocess.tasks;

import java.io.File;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.taskprocess.TaskProcessService;
import com.ericsson.inms.pm.schedule.ScheduleServer;
import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.service.impl.taskprocess.TaskProcessServiceImpl;
import com.ericsson.inms.pm.service.impl.taskprocess.util.TaskFtpUtil;
import com.jcraft.jsch.ChannelSftp;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ericsson.inms.pm.taskarchive.model.PluginObject;
import com.ericsson.inms.pm.taskarchive.plugin.ArchivePluginBase;
public class CleanFilePlug  extends ArchivePluginBase {
	private OpbLogger logger = OpbLogger.getLogger(ScheduleServer.class, "PM");

	public void process() {
		logger.info("=============CleanFilePlug Begin=============");
		this.delFile();
		this.delTableRecode();
		logger.info("=============CleanFilePlug END=============");

	}

	private void delFile() {
		// TODO Auto-generated method stub
		logger.info("delFile start");
		String intervalDelFile = "7";
		try {
			intervalDelFile = getService().getIntervalDelFile();
			logger.info("intervalDelFile Day:" + intervalDelFile);
			intervalDelFile="0";
			JSONObject result = getService().getDelList(intervalDelFile);
			logger.info("DelFile List:" + result.toJSONString());
			JSONArray datas = result.getJSONArray("datas");
			this.delLocalFile(datas);
			this.delRemoteFile(datas);
		} catch (Exception e) {
			e.printStackTrace();
		}

		logger.info("delFile end");

	}

	private void delRemoteFile(JSONArray datas) {
		// TODO Auto-generated method stub
		JSONObject ftpInfo=null;
		try {
		  ftpInfo= this.getService().getConfigFTP();
		if (isSFTP(ftpInfo)) {
			this.delSFTPFile(datas,ftpInfo);
		} else {
			this.delFTPFile(datas,ftpInfo);
		}
		}catch(Exception e) {
			logger.info("delRemoteFile error"+e.getMessage());
			logger.info("delRemoteFile ftpInfo"+ftpInfo);
			
		}

	}

	private void delFTPFile(JSONArray datas,JSONObject ftpInfo) {
		// TODO Auto-generated method stub
		logger.info("delFTPFile begin");
		TaskFtpUtil.delFTPfiles(datas,ftpInfo);
		logger.info("delFTPFile end");
	}

	private void delSFTPFile(JSONArray datas,JSONObject ftpInfo) {
		// TODO Auto-generated method stub
		logger.info("delSFTPFile begin");
		
		TaskFtpUtil.delSFTPfiles(datas, ftpInfo);
		logger.info("delSFTPFile end");

	}

	private boolean isSFTP(JSONObject ftpInfo) {
		try {
			
			ChannelSftp client = TaskFtpUtil.getSFTPClient(ftpInfo);
			logger.info("isFTP client:" + client);
			if (client == null) {
				return false;
			} else {
				return true;
			}
		} catch (Exception e) {
			logger.info("isFTP error:" + e.getMessage());
			return false;
		}

	}

	private void delLocalFile(JSONArray datas) {
		// TODO Auto-generated method stub
		for (int i = 0; i < datas.size(); i++) {
			JSONObject item = datas.getJSONObject(i);
			String path = item.getString("PATH");
			if (path != null) {
				File pathFile = new File(path);
				boolean isDel = pathFile.delete();
				logger.info("Delete File" + path + "[" + isDel + "]");
			}

		}

	}

	private void delTableRecode() {
		logger.info("delTableRecode start");
		// TODO Auto-generated method stub
		try {
			String intervalDelFile = getService().getIntervalDelFile();
			String intervalDelFileDay = add(intervalDelFile, 1);
			logger.info("intervalDelFile Day:" + intervalDelFileDay);
			JSONObject result = getService().getDelList(intervalDelFileDay);
			logger.info("DelFile Recode:" + result.toJSONString());
			JSONArray datas = result.getJSONArray("datas");
			this.delRecode(datas);
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("delTableRecode end");

	}

	private void delRecode(JSONArray datas) {
		for (int i = 0; i < datas.size(); i++) {
			JSONObject item = datas.getJSONObject(i);
			String id = item.getString("ID");
			boolean delFlg = false;
			try {
				delFlg = this.getService().delDataExpLogById(id);
			} catch (BaseAppException e) {
				logger.info("delRecode");
			}
			logger.info("delete recode:" + id + " " + delFlg);

		}

	}

	private String add(String intervalDelFile, int i) {
		// TODO Auto-generated method stub
		Integer confDay = 7;
		try {
			confDay = Integer.parseInt(intervalDelFile);
		} catch (Exception e) {
			confDay = 7;
		}
		int sumDay = confDay + i;
		return "" + sumDay;
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

	@Override
	public JobResult invokePlugin(String taskNo, String taskID, String btime, String etime, String param,
			PluginObject pObj) {
		JobResult result =new JobResult();
		result.setState("0");
		this.process();
		return result;
	}
}
