package com.ericsson.inms.pm.service.impl.alarmtemplate.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.service.impl.alarmtemplate.dao <br>
 */
public abstract class AlarmTemplateDAO extends GeneralDAO<Map<String, String>> {
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> qryNeIconList(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return JSONObject 
     * @throws BaseAppException <br>
     */ 
    public abstract JSONObject getFieldInModel(Map<String, Object> params) throws BaseAppException;
    
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> qryTemplate(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> searchTemplate(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract Map<String, Object> qryTemplateDetail(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String addTemplate(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String delTemplate(Map<String, Object> params) throws BaseAppException;
    
}


