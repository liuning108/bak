package com.ztesoft.zsmart.oss.itnms.application.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.application.service.ApplicationApiService;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

@RestController
@RequestMapping("application")
public class ApplicationController {  
   
   @Autowired
   ApplicationApiService hostApiService;
   
   
   @RequestMapping(value = "addApplications", method = RequestMethod.POST)
   @PublicServ
	public JSONObject addApplications(@RequestBody Map<String,Object> param) throws BaseAppException {
		return hostApiService.addApplication(param);
	}
   
   @RequestMapping(value = "getApplications", method = RequestMethod.POST)
   @PublicServ
	public JSONObject getApplications(@RequestBody Map<String,Object> param) throws BaseAppException {
		return hostApiService.getApplication(param);
	}
   
   @RequestMapping(value = "delApplications", method = RequestMethod.POST)
   @PublicServ
	public JSONObject delApplications(@RequestBody Map<String,Object> param) throws BaseAppException {
		return hostApiService.deleteApplicaton(param);
	}
   
   
   @RequestMapping(value = "updateApplications", method = RequestMethod.POST)
   @PublicServ
	public JSONObject updateApplications(@RequestBody Map<String,Object> param) throws BaseAppException {
		return hostApiService.updateApplication(param);
	}
   
   
   @RequestMapping(value = "getSubApplicationInfo", method = RequestMethod.POST)
   @PublicServ
	public JSONObject getSubApplicationInfo(@RequestBody Map<String,Object> param) throws BaseAppException {
		return hostApiService.getSubApplicationInfo(param);
	}
   
   
	
	
 	
	
}
