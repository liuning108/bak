package com.ztesoft.zsmart.oss.itnms.maintenance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.maintenance.service.MaintenaceApiService;
import com.ztesoft.zsmart.oss.itnms.maintenance.util.MaintenaceUtil;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

@RestController
@RequestMapping("maintenance")
public class MaintenanceController {
	@Autowired
	MaintenaceApiService apiService;
	@RequestMapping(value = "getAllMainByGroupids", method = RequestMethod.POST)
	@PublicServ
	public JSONObject getAllMainByGroupids(@RequestBody Map<String,Object> param) throws BaseAppException {
		String state =(String)param.get("state");
		return MaintenaceUtil.getMainList(apiService.getAllMainByGroupids(param), state);
	}
	
	@RequestMapping(value = "deleteByIds", method = RequestMethod.POST)
	@PublicServ
	public JSONObject deleteByIds(@RequestBody Map<String,Object> param) throws BaseAppException {
		return apiService.deleteByIds(param);
	}
	
	
	@RequestMapping(value = "getMaintenanceById", method = RequestMethod.POST)
	@PublicServ
	public JSONObject getMaintenanceById(@RequestBody Map<String,Object> param) throws BaseAppException {
		return apiService.getMaintenanceById(param);
	}
	
	
	@RequestMapping(value = "saveOrUpdate", method = RequestMethod.POST)
	@PublicServ
	public JSONObject saveOrUpdate(@RequestBody Map<String,Object> param) throws BaseAppException {
		return apiService.saveOrUpdate(param);
	}
	
}
