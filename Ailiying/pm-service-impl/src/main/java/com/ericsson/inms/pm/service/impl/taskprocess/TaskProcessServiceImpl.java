package com.ericsson.inms.pm.service.impl.taskprocess;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.taskprocess.TaskProcessService;
import com.ericsson.inms.pm.schedule.ScheduleServer;
import com.ericsson.inms.pm.service.impl.adhoc.AdhocSrv;
import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ericsson.inms.pm.service.impl.taskprocess.util.JsonMapUtil;
import com.ericsson.inms.pm.service.impl.taskprocess.util.TaskFtpUtil;
import com.jcraft.jsch.ChannelSftp;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;

@Service("taskProcessServiceImpl")
public class TaskProcessServiceImpl implements TaskProcessService {
	
	private OpbLogger logger = OpbLogger.getLogger(TaskProcessServiceImpl.class, "PM");

	@Override
	public JSONObject onceDownloadFile(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		JSONObject result = new JSONObject();
		JSONObject param = dict.getJSONObject("param");
		Map<String, Object> params = JsonMapUtil.Json2Map(param);
		AdhocSrv adhocSrv = (AdhocSrv) SpringContext.getBean(AdhocSrv.class);
		System.out.println(params);
		try {
			Map<String, Object> loadDataRs = adhocSrv.loadData(params);
			List<Map> colModels = (List<Map>) loadDataRs.get("colModel");
			List<Map<String, Object>> dictColModel = new ArrayList<Map<String, Object>>();
			for (Map map : colModels) {
				Map<String, Object> dcol = new HashMap<String, Object>();
				dcol.put("label", map.get("col_label"));
				dcol.put("name", map.get("col_name"));
				dictColModel.add(dcol);
			}
			String sql = String.valueOf(loadDataRs.get("sql"));
			logger.info("onceDownloadFile sql==>"+sql);
			logger.info("onceDownloadFile dictColModel==>"+dictColModel);
			ParamArray pa = new ParamArray();
			String filePathExcel = getDAO().exportExcel(dictColModel, sql, pa);
			logger.info(filePathExcel);
			result.put("filePath", filePathExcel);
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("onceDownloadFile Error"+e.getMessage());
		}
		return result;
	}

	@Override
	public JSONObject moveFTPFile(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		JSONObject result = new JSONObject();

		String filepath = dict.getString("filepath");
		File target = new File(filepath);
		if (target.exists()) {
			// move file to web upload
			String fileDirectory = CommonHelper.getProperty("file.download.directory") + "/expTemp";
			File webPathDir = new File(fileDirectory);
			webPathDir.mkdirs();
			try {
				FileUtils.copyFileToDirectory(target, webPathDir);
			} catch (Exception e) {
				result.put("filename", "");
				result.put("error", e.getMessage());
				return dict;
			}
			String filename = "expTemp/" + target.getName();
			result.put("filename", filename);
		} else {
			File file = this.downlaodSFtpFile(target);

			if (file == null) {
				file = this.downlaodFtpFile(target);
			}
			String filename="";
			if(file!=null) {
				filename ="expTemp/"+file.getName();
			}
		   result.put("filename",filename);
		}
		return result;
	}

	private File downlaodFtpFile(File source) {
		  try {
			   logger.info("downlaodFtpFile");
	           JSONObject ftpInfo = this.getConfigFTP();
	            FTPClient client = TaskFtpUtil.getClient(ftpInfo);
	            if (client == null) {
	                System.err.println("Client is null");
	            } 
	            String fileDirectory = CommonHelper.getProperty("file.download.directory");
	            String webPathDirStr=TaskFtpUtil.getFilePath(fileDirectory,"expTemp");
	            File webPathDir = new File(webPathDirStr);
				webPathDir.mkdirs();
				String fileName =source.getName();
	            String ftpFile=source.getAbsolutePath();
	            String locaFile =TaskFtpUtil.getFilePath(webPathDir.getAbsolutePath(),fileName);
	            logger.info("fileName:"+fileName);
	            logger.info("ftpFile:"+ftpFile);
	            logger.info("locaFile:"+locaFile);
	            File target= TaskFtpUtil.getFTPFile(client, ftpFile,locaFile);
	            System.out.println(target);
	            client.logout();
	            return target;
	        } catch (Exception e) {
	           logger.info("downlaodFtpFile:"+e.getMessage());
	            return null;
	        }
	}

	private File downlaodSFtpFile(File source) {
		try {
			logger.info("downlaodSFtpFile");
            JSONObject ftpInfo =this.getConfigFTP();
            ChannelSftp client = TaskFtpUtil.getSFTPClient(ftpInfo);
            if (client == null) {
            	logger.info("Client is null");
            	return null;
            } 
            logger.info("Client is :"+client);
            
            String fileDirectory = CommonHelper.getProperty("file.download.directory");
            String webPathDirStr=TaskFtpUtil.getFilePath(fileDirectory,"expTemp");
            File webPathDir = new File(webPathDirStr);
			webPathDir.mkdirs();
            String fileName =source.getName();
            String ftpFile= source.getAbsolutePath();
            String locaFile =TaskFtpUtil.getFilePath(webPathDir.getAbsolutePath(),fileName);
            logger.info("fileName:"+fileName);
            logger.info("ftpFile:"+ftpFile);
            logger.info("locaFile:"+locaFile);
       
            File target= TaskFtpUtil.getSFTPFile(client, ftpFile,locaFile);
            System.err.println(target);
            client.exit();
            return target;
        } catch (Exception e) {
        	  logger.info("downlaodSFtpFile is :"+e.getMessage());
          return null;
        }
		
	}

	@Override
	public JSONObject exportTasklist(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		return getDAO().exportTasklist(dict);
	}

	@Override
	public JSONObject addExportTask(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		return getDAO().addExportTask(dict);
	}

	@Override
	public JSONObject getDataExpParam(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub

		return getDAO().getDataExpParam(dict);
	}

	@Override
	public void savefilePath(JSONObject dict) throws BaseAppException {
		getDAO().savefilePath(dict);
	}

	/**
	 * Description: <br>
	 * 
	 * @author XXX<br>
	 * @taskId <br>
	 * @return <br>
	 */
	private TaskProcessDAO getDAO() {
		try {
			TaskProcessDAO dao = (TaskProcessDAO) GeneralDAOFactory.create(TaskProcessDAO.class, JdbcUtil.OSS_PM);
			return dao;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public JSONObject getConfigFTP() throws BaseAppException {
		// TODO Auto-generated method stub
		JSONObject ftpInfo = new JSONObject();
		String ftpUrl = getParamter("ftpUrl");
		if(ftpUrl==null)return null;
		if(ftpUrl.length()<=5)return null;
		// String path =getParamter("ftpDir");
		Pattern p = Pattern.compile("&(\\b\\w+)=(.*?(?=\\s\\w+=|&(\\b\\w+)=|$))");
		Matcher m = p.matcher("&" + ftpUrl);
		while (m.find()) {
			ftpInfo.put(m.group(1), m.group(2));
		}
		ftpInfo.put("path", "pm_taskexpftp");
		return ftpInfo;
	}
	@Override
	public String getIntervalDelFile() throws BaseAppException {
		 String day = this.getParamter("intervalDelFile");
         if(day==null) return "7";
         if(day=="") return "7";
         return day;
          
	}

	private String getParamter(String key) {
		// TODO Auto-generated method stub
		try {
			return getDAO().getParamter(key);
		} catch (BaseAppException e) {
			logger.info("getParamter Error :"+e.getMessage());
			return null;
		}
	}

	@Override
	public JSONObject uploadFTP(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		logger.info("uploadFTP Begin");
		JSONObject result = new JSONObject();
		String ftpPath = TaskFtpUtil.saveSFTP(dict);
		
		if (ftpPath == null) {
			ftpPath = TaskFtpUtil.saveFTP(dict);
		}
		if (ftpPath == null)
			return null;
		result.put("ftpPath", ftpPath);
		logger.info("uploadFTP Result"+result);
		return result;
	}

	@Override
	public JSONObject getDelList(String day) throws BaseAppException {
		return getDAO().getDelList(day);
	}

	@Override
	public boolean delDataExpLogById(String id) throws BaseAppException {
		// TODO Auto-generated method stub
		return getDAO().delDataExpLogById(id);
	}

	@Override
	public void clearTempFile() throws BaseAppException {
		// TODO Auto-generated method stub
		  String fileDirectory = CommonHelper.getProperty("file.download.directory");
          String webPathDirStr=TaskFtpUtil.getFilePath(fileDirectory,"expTemp");
          Calendar calendar = Calendar.getInstance();
          calendar.setTime(new Date());
          calendar.add(Calendar.DATE, -1);
          
          File webPathDir = new File(webPathDirStr);
		  if(webPathDir.exists()) {
			 for (File file :  webPathDir.listFiles()) {
				 long time = file.lastModified();
				 long pastTime =calendar.getTime().getTime();
				 if(pastTime>time) {
					 boolean flag = file.delete();
					 logger.info(file.getAbsolutePath()+":"+flag); 	 
				 }
			 }
		  }
	}

	

}
