package com.ericsson.inms.pm.api.service.graphs;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月26日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.api.service.graphs <br>
 */
public interface GraphService {
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
	JSONObject getTemplateCatagorys(JSONObject dict) throws BaseAppException;

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
	JSONObject getTemplateById(JSONObject dict) throws BaseAppException;

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
	JSONObject getTemplatesByCatagroyId(JSONObject dict) throws BaseAppException;

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
	JSONObject getItemsByTemplateId(JSONObject dict) throws BaseAppException;

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
	JSONObject getGraphsTags(JSONObject dict) throws BaseAppException;

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
	JSONObject saveOrUpdateGraphs(JSONObject dict) throws BaseAppException;

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
	JSONObject getGraphsByUserID(JSONObject dict) throws BaseAppException;

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
	JSONObject delGraphs(JSONObject dict) throws BaseAppException;

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
	JSONObject getGraphsById(JSONObject dict) throws BaseAppException;

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
	JSONObject getItemsByTId(JSONObject dict) throws BaseAppException;

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
	JSONObject getTimeConfig(JSONObject dict) throws BaseAppException;

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
	JSONObject loadKpiData(JSONObject dict) throws BaseAppException;

}
