package com.ericsson.inms.pm.api.controller.alarmtemplate;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.alarmtemplate.IAlarmTemplateSrv;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018-8-27 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.api.controller.alarmtemplate <br>
 */
@RestController
//@IgnoreSession
@RequestMapping("pm/api/alarmtemplate")
public class AlarmTemplateController {
    
    /**
     * alarmTplSrv <br>
     */
    @Autowired
    private IAlarmTemplateSrv alarmTplSrv;
    
    /**
     * [获取设备图标集合] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "neIconList", method = RequestMethod.POST)
    @PublicServ
    public List<Map<String, Object>> qryNeIconList(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.qryNeIconList(params);
    }    
    
    /**
     * [根据建表脚本获取字段信息] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "getFieldInModel", method = RequestMethod.POST)
    @PublicServ
    public JSONObject getFieldInModel(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.getFieldInModel(params);
    } 
    
    /**
     * [添加模板] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "addTemplate", method = RequestMethod.POST)
    @PublicServ
    public String addTemplate(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.addTemplate(params);
    }
    
    /**
     * [添加模板] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "delTemplate", method = RequestMethod.POST)
    @PublicServ
    public String delTemplate(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.delTemplate(params);
    }
    
    /**
     * [查询模板] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List<Map<String, Object>>  
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "qryTemplate", method = RequestMethod.POST)
    public List<Map<String, Object>> qryTemplate(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.qryTemplate(params);
    }
    
    /**
     * [搜索模板] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List<Map<String, Object>>  
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "searchTemplate", method = RequestMethod.POST)
    @PublicServ
    public List<Map<String, Object>> searchTemplate(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.searchTemplate(params);
    }
    
    /**
     * [查询模板] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map<String, Object>  
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "qryTemplateDetail", method = RequestMethod.POST)
    @PublicServ
    public Map<String, Object> qryTemplateDetail(@RequestBody Map<String, Object> params) throws BaseAppException {
        return alarmTplSrv.qryTemplateDetail(params);
    }
    
}


