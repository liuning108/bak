package com.ericsson.inms.pm.api.service.resourceinfo;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * [描述] <br> 
 *  
 * @author  <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月3日 <br>
 * @since R9.0<br>
 * @see com.ericsson.inms.pm.api.service <br>
 */
public interface IResourceInfoSrv {
	
	/**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject getResourceInfo(JSONObject dict) throws BaseAppException;
	
}
