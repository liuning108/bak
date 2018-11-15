package com.ericsson.inms.pm.api.controller.resmgr;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.resmgr.ResMgrService;
import com.ztesoft.zsmart.core.exception.BaseAppException;

@RestController
@RequestMapping("pm/api/resmgr")
public class ResMgrController {
    
    @Resource(name = "resMgrServiceImpl")
    private ResMgrService resMgrService;
    
    @RequestMapping(value = "loadTree", method = RequestMethod.POST)
    public JSONObject loadTree(@RequestBody JSONObject dict)  throws BaseAppException {
        return resMgrService.loadTree(dict);
    }
    
    @RequestMapping(value = "qurRes", method = RequestMethod.POST)
    public JSONObject qurRes(@RequestBody JSONObject dict)  throws BaseAppException {
        return resMgrService.qurRes(dict);
    }
    

    @RequestMapping(value = "qurTmpInfo", method = RequestMethod.POST)
    public JSONObject qurTmpInfo(@RequestBody JSONObject dict)  throws BaseAppException {
        return resMgrService.qurTmpInfo(dict);
    }
    
    
}
