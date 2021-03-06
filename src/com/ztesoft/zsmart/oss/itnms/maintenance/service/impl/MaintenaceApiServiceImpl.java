package com.ztesoft.zsmart.oss.itnms.maintenance.service.impl;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilderWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.ZabbixApi;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.impl.DefaultZabbixApi;
import com.ztesoft.zsmart.oss.itnms.maintenance.service.MaintenaceApiService;


@Service("MaintenaceApiServiceImpl")
public class MaintenaceApiServiceImpl implements MaintenaceApiService {

	@Override
	public JSONObject getAllMainByGroupids(Map<String, Object> param) {
		  List<String> ids =(List<String>)param.get("ids");
		  ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  
		  JSONObject search = new JSONObject();
		  search.put("name", (String)param.get("sName"));
		  
		  Request getRequest = RequestBuilder.newBuilder()
					.method("maintenance.get")
					                                 .paramEntry("output", "extend")
					                                 .paramEntry("groupids", ids)
					                                 .paramEntry("sortfield", "maintenanceid")
					                                 .paramEntry("search", search)
					         .build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		 
		  zabbixApi.destroy();
		  return getResponse;
	}
	
	

	@Override
	public JSONObject deleteByIds(Map<String, Object> param) {
		  List<String>ids= (List<String>)param.get("ids");
		  String[] idsArray=ids.toArray(new String[ids.size()]);
	      ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  RequestWithArrayParams getRequest = RequestBuilderWithArrayParams.newBuilder()
                  .method("maintenance.delete")
                  .params(idsArray)
                  .build();
		  JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
		 
	}
	

	@Override
	public JSONObject getMaintenanceById(Map<String, Object> param) {
		  String id =(String)param.get("id");
		  ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  JSONObject search = new JSONObject();
		  search.put("name", (String)param.get("sName"));
		  Request getRequest = RequestBuilder.newBuilder()
					.method("maintenance.get")
					                                 .paramEntry("output", "extend")
					                                 .paramEntry("maintenanceids", id)
					                                 .paramEntry("selectGroups", "extend")
					                                 .paramEntry("selectHosts", "extend")
					                                 .paramEntry("selectTimeperiods", "extend")
					         .build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}



	@Override
	public JSONObject saveOrUpdate(Map<String, Object> param) throws BaseAppException {
		 String maintenanceid =(String)param.get("maintenanceid");
	     String active_since =param.get("active_since")+"";
	     String active_till =param.get("active_till")+"";
	     String maintenance_type =(String)param.get("maintenance_type");
	     String name=(String)param.get("name");
	     String description= (String)param.get("description");
	     String method="maintenance.update";
	     if("none".equalsIgnoreCase(maintenanceid)) {
	    	  method = "maintenance.create";
	    	  maintenanceid=null;
	     }
	     List<String> groupids= (List<String>)param.get("groupids");
	     List<String> hostids= (List<String>)param.get("hostids");
	     List<Map<String,String>> timeperiods=(List<Map<String,String>>)param.get("timeperiods");
	     ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		 zabbixApi.init();
		 zabbixApi.login("Admin", "zabbix");
		Request getRequest = RequestBuilder.newBuilder()
					.method(method)
					.paramEntry("maintenanceid", maintenanceid)
					.paramEntry("active_since", active_since)
					.paramEntry("active_till", active_till)
					.paramEntry("maintenance_type", maintenance_type)
					.paramEntry("name",name)
					.paramEntry("description", description)
					.paramEntry("timeperiods", timeperiods)
					.paramEntry("groupids", groupids)
					.paramEntry("hostids", hostids)
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}


}
