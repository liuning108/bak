package com.ztesoft.zsmart.oss.itnms.maintenance.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilderWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.ZabbixApi;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.impl.DefaultZabbixApi;
import com.ztesoft.zsmart.oss.itnms.maintenance.service.MaintenaceApiService;
import com.ztesoft.zsmart.oss.itnms.maintenance.util.MaintenaceUtil;


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
	
	public static void main(String[] args) {
		// TODO Auto-generated constructor stub
				MaintenaceApiServiceImpl s = new MaintenaceApiServiceImpl();
				Map<String, Object> param  = new HashMap<String,Object>();
				List<String> ids = new ArrayList<String>();
				ids.add("3");
				param.put("ids", ids);
				JSONObject json =s.deleteByIds(param);
				System.out.println(json);
				
		
	}


}
