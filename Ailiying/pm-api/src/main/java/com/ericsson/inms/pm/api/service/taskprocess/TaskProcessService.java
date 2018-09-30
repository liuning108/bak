package com.ericsson.inms.pm.api.service.taskprocess;

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
	

}
