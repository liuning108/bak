package com.ericsson.inms.pm.service.impl.meta.model.busi.dao;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;


/** 
 * Description: <br> 
 *  
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月14日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.model.busi.dao <br>
 */
public abstract class ModelBusiDAO extends GeneralDAO {

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public abstract JSONObject getModelBusiInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public abstract JSONObject getModelBusiField(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public abstract JSONObject addModelBusiInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public abstract JSONObject editModelBusiInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public abstract JSONObject delModelBusiInfo(JSONObject dict) throws BaseAppException;
}
