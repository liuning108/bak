package com.ztesoft.zsmart.oss.itnms.trigger.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

public interface TriggerService {
    /**
     * [方法描述]<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param hostid
     * @return <br>
     */ 
    public JSONObject getTriggersByid(Map<String, Object> params) throws BaseAppException;
    
    public JSONObject createTriggers(List<Object> params) throws BaseAppException;
    
    public JSONObject deleteTriggers(List<Object> params) throws BaseAppException;
    
    public List<JSONObject> updateTriggers(List<HashMap<String, Object>> params) throws BaseAppException;
    
    public JSONObject getMacros(Map<String, Object> params) throws BaseAppException;
    
    public List<Map<String, Object>> queryItnmsExpFunc();

    public List<Map<String,Object>> queryItnmsExpFuncPara();
    

}
