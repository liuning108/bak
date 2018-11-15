package com.ericsson.inms.pm.api.service.meta.kpi;

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
 * @see com.ericsson.zsmart.oss.core.pm.meta.kpi.service <br>
 */
public interface KPIService {
    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject getKPIInfo(JSONObject dict) throws BaseAppException;
    
    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject getCLASSInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject getKPIFormular(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject addKPIInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject editKPIInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    JSONObject delKPIInfo(JSONObject dict) throws BaseAppException;

}
