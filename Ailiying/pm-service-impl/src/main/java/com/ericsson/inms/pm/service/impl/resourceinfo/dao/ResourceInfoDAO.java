package com.ericsson.inms.pm.service.impl.resourceinfo.dao;

import java.io.InputStream;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.kpi.dao <br>
 */
public abstract class ResourceInfoDAO extends GeneralDAO {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getResourceInfo(JSONObject dict) throws BaseAppException;
      
}