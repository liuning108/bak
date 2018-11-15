package com.ericsson.inms.pm.api.service.meta.dim;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.dim.service.impl <br>
 */
public interface DimService {
    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param params params
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject getDimInfo(JSONObject params) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dimCode dimCode
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject delDimInfo(String dimCode) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br> 
     * @param param param
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject addDimInfo(JSONObject param) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject editDimInfo(JSONObject param) throws BaseAppException;
}
