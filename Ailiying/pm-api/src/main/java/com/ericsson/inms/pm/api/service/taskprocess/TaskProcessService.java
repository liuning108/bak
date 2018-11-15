package com.ericsson.inms.pm.api.service.taskprocess;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @since V8<br>
 */
public interface TaskProcessService {
	
	/**
	 * Description: <br>
	 * 
	 * @author XXX<br>
	 * @taskId <br>
	 * @param dict
	 * @return
	 * @throws BaseAppException
	 *             <br>
	 */
	JSONObject onceDownloadFile(JSONObject dict) throws BaseAppException;

	
	/**
	 * Description: <br>
	 * 
	 * @author XXX<br>
	 * @taskId <br>
	 * @param dict
	 * @return
	 * @throws BaseAppException
	 *             <br>
	 */
	JSONObject addExportTask(JSONObject dict) throws BaseAppException;

	/**
	 * Description: <br>
	 * 
	 * @author XXX<br>
	 * @taskId <br>
	 * @param dict
	 * @return
	 * @throws BaseAppException
	 *             <br>
	 */
	JSONObject exportTasklist(JSONObject dict) throws BaseAppException;

	/**
	 * Description: <br>
	 * 
	 * @author XXX<br>
	 * @taskId <br>
	 * @param dict
	 * @return
	 * @throws BaseAppException
	 *             <br>
	 */
	JSONObject moveFTPFile(JSONObject dict) throws BaseAppException;
    
	/**
	 * Description: <br>
	 * 
	 * @author XXX<br>
	 * @taskId <br>
	 * @param dict
	 * @return
	 * @throws BaseAppException
	 *             <br>
	 */
	JSONObject getDataExpParam(JSONObject dict) throws BaseAppException;

	
	void savefilePath(JSONObject dict) throws BaseAppException;


	JSONObject getConfigFTP() throws BaseAppException;


	JSONObject uploadFTP(JSONObject dict) throws BaseAppException;


	String getIntervalDelFile() throws BaseAppException;


	JSONObject getDelList(String day) throws BaseAppException;


	boolean delDataExpLogById(String id) throws BaseAppException;


	void  clearTempFile()  throws BaseAppException;
	
}
