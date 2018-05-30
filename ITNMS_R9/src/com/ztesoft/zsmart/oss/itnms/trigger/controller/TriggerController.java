package com.ztesoft.zsmart.oss.itnms.trigger.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.trigger.service.TriggerService;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;


@RestController
@IgnoreSession
@RequestMapping("trigger")
public class TriggerController {

    @Autowired
    private TriggerService triggerService;
    
    @PublicServ
    @RequestMapping(value = "getTriggersByid", method = RequestMethod.POST)
    public JSONObject getTriggersByid(@RequestBody Map<String, Object> params) throws BaseAppException {
        return triggerService.getTriggersByid(params);
    }
    @PublicServ
    @RequestMapping(value = "createTriggers", method = RequestMethod.POST)
    public JSONObject createTriggers(@RequestBody List<Object> params) throws BaseAppException {
        return triggerService.createTriggers(params);
    }  
    @PublicServ
    @RequestMapping(value = "deleteTriggers", method = RequestMethod.POST)
    public JSONObject deleteTriggers(@RequestBody List<Object> params) throws BaseAppException {
        return triggerService.deleteTriggers(params);
    }
    @PublicServ
    @RequestMapping(value = "updateTriggers", method = RequestMethod.POST)
    public List<JSONObject> updateTriggers(@RequestBody List<HashMap<String, Object>> params)  throws BaseAppException {
        return triggerService.updateTriggers(params);
    } 
    @PublicServ
    @RequestMapping(value = "getMacros", method = RequestMethod.POST)
    public JSONObject getMacros(@RequestBody Map<String, Object> params) throws BaseAppException {
        return triggerService.getMacros(params);
    }
    @PublicServ
    @RequestMapping(value = "queryItnmsExpFunc", method = RequestMethod.POST)
    public List<Map<String, Object>> queryItnmsExpFunc() throws BaseAppException {
        return triggerService.queryItnmsExpFunc();
    }
    @PublicServ
    @RequestMapping(value = "queryItnmsExpFuncPara", method = RequestMethod.POST)
    public List<Map<String, Object>> queryItnmsExpFuncPara() throws BaseAppException {
        return triggerService.queryItnmsExpFuncPara();
    }    
}
