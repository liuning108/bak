package com.ericsson.inms.pm.service.impl.taskprocess;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.taskprocess.TaskProcessService;
import com.ericsson.inms.pm.service.impl.adhoc.AdhocSrv;
import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ericsson.inms.pm.service.impl.taskprocess.util.JsonMapUtil;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;

@Service("taskProcessServiceImpl")
public class TaskProcessServiceImpl implements TaskProcessService{

	@Override
	public JSONObject onceDownloadFile(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
	 	JSONObject result =new JSONObject();
	    String downloadDir=CommonHelper.getProperty("file.download.directory");
	    result.put("downloadDir", downloadDir);
	    JSONObject param =dict.getJSONObject("param");
	   
	    Map<String, Object> params  = JsonMapUtil.Json2Map(param);
	    AdhocSrv adhocSrv = (AdhocSrv)SpringContext.getBean(AdhocSrv.class);
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
	    System.err.println(sql);
	    System.err.println(dictColModel);
	    ParamArray pa = new ParamArray();
	    String filePathExcel = getDAO().exportExcel(dictColModel, sql, pa);
	    System.err.println(filePathExcel);
	    }catch(Exception e) {
	       	e.printStackTrace();
	    	  System.out.println(e);
	    }
	    	return result;
	}
	
	
	@Override
	public JSONObject moveFTPFile(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		JSONObject result = new JSONObject();
		
	       String filepath = dict.getString("filepath");
	        File target = new File(filepath);
	        if(target.exists()) {
	           //move  file to web upload
	            String fileDirectory =CommonHelper.getProperty("file.download.directory")+"/expTemp";
	            System.out.println(fileDirectory);
	            File webPathDir =new File(fileDirectory);
	            webPathDir.mkdirs();
	            try {
	                FileUtils.copyFileToDirectory(target, webPathDir);
	            }
	            catch (Exception e) {
	                dict.put("filename","");
	                dict.put("moveFTPFile error",e.getMessage());
	                return dict;
	            }
	            String filename ="expTemp/"+target.getName();
	            dict.put("filename",filename);
	        }else {
//	            File file    =DashBoardFTPUtil.downlaodFtpFile(target);
//	            if(file==null) {
//	                file =DashBoardFTPUtil.downlaodSFtpFile(target);
//	            }
//	            dict.add("filename", file.getName());
	        }
	        return result;
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
	
	
	 /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    private TaskProcessDAO getDAO() {
	    	try {
	    		TaskProcessDAO dao =(TaskProcessDAO) GeneralDAOFactory.create(TaskProcessDAO.class, JdbcUtil.OSS_PM);
	        return dao;
	    	}catch(Exception e) {
	    		e.printStackTrace();
	    		return null;
	    	}
    }

	

	


	
	

}
