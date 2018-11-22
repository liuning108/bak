package com.ericsson.inms.pm.service.impl.resourceinfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.resourceinfo.IResourceInfoSrv;
import com.ericsson.inms.pm.service.impl.resourceinfo.bll.ResourceInfoManager;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * [描述] <br> 
 *  
 * @author  <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.itnms.templatemgr.service.impl <br>
 */
@Service("resourceInfoServ")
public class ResourceInfoServiceImpl implements IResourceInfoSrv{

	/**
     * resourceInfoManager <br>
     */
    @Autowired
    private ResourceInfoManager resourceInfoManager;
    
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
	@Override
	public JSONObject getResourceInfo(JSONObject dict) throws BaseAppException {
		return this.resourceInfoManager.getResourceInfo(dict);
	}
    
}
