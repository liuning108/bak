package com.ztesoft.zsmart.oss.itnms.application.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.application.service.ApplicationApiService;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilderWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.ZabbixApi;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.impl.DefaultZabbixApi;
import com.ztesoft.zsmart.oss.itnms.util.ZabbixApiUtil;

@Service("ApplicationApiServiceImpl")
public class ApplicationApiServiceImpl implements ApplicationApiService {
	
	private ZabbixApi getZabbixApi() throws BaseAppException {
//		  Map<String, String> result= ZabbixApiUtil.getZabbixApiInfo();
//		  ZabbixApi  zabbixApi = new DefaultZabbixApi(result.get("url"));
//		  zabbixApi.init();
//		  zabbixApi.setAuth(result.get("auth"));
		 ZabbixApi  zabbixApi= new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		 zabbixApi.init();
		 zabbixApi.login("Admin", "zabbix");
		 return zabbixApi;		  
	}
	
	@Override
	public JSONObject deleteApplicaton(Map<String, Object> param) throws BaseAppException {
		  List<String>ids= (List<String>)param.get("ids");
		  String[] idsArray=ids.toArray(new String[ids.size()]);
		  ZabbixApi  zabbixApi =getZabbixApi();
		  RequestWithArrayParams getRequest = RequestBuilderWithArrayParams.newBuilder()
                  .method("application.delete")
                  .params(idsArray)
                  .build();
        JSONObject getResponse = zabbixApi.call(getRequest);
        zabbixApi.destroy();
		return getResponse;
	}
	
	@Override
	public JSONObject addApplication(Map<String, Object> param) throws BaseAppException {
		 String name=""+param.get("name");
		 String id = ""+param.get("id");
		 ZabbixApi  zabbixApi =getZabbixApi();
		 Request getRequest = RequestBuilder.newBuilder()
					.method("application.create")
					      .paramEntry("name", name)
					      .paramEntry("hostid", id)
					.build();
		  JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}

	@Override
	public JSONObject getApplication(Map<String, Object> param) throws BaseAppException {
		 Object hostids=param.get("hostids");
		 ZabbixApi  zabbixApi =getZabbixApi();
		 Request getRequest = RequestBuilder.newBuilder()
					.method("application.get")
					      .paramEntry("output", "extend")
					      .paramEntry("hostids", hostids)
					      .paramEntry("sortfield","name")
					      .paramEntry("selectItems",new String[]{"name"})
					      .paramEntry("selectHost", true)
					.build();
		  JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}	
	public static void main(String[] args) throws BaseAppException {
		Map<String, Object> param = new HashMap<String,Object>();
		param.put("id", "13");
	
		ApplicationApiServiceImpl a = new ApplicationApiServiceImpl();
		JSONObject result =a.getSubApplicationInfo(param);
		System.out.println(result);
		
	}

	@Override
	public JSONObject updateApplication(Map<String, Object> param) throws BaseAppException {
		 String name=""+param.get("name");
		 String id = ""+param.get("id");
		 ZabbixApi  zabbixApi =getZabbixApi();
		 Request getRequest = RequestBuilder.newBuilder()
					.method("application.update")
					      .paramEntry("name", name)
					      .paramEntry("applicationid", id)
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		 zabbixApi.destroy();
		 return getResponse;
	}
	
	
	@Override
	public JSONObject getTemplate(Map<String, Object> param) throws BaseAppException {
		 String id = ""+param.get("id");
		 ZabbixApi  zabbixApi =getZabbixApi();
		 Request getRequest = RequestBuilder.newBuilder()
					.method("template.get")
						  .paramEntry("output", new String[] {"name","templateid"})
						  .paramEntry("templateids", id)
						  .paramEntry("selectGroups", true)
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		 zabbixApi.destroy();
		 return getResponse;
	}

	@Override
	public JSONObject getSubApplicationInfo(Map<String, Object> param) throws BaseAppException {
		 String id = ""+param.get("id");
		 ZabbixApi  zabbixApi =getZabbixApi();
		 JSONObject result = new JSONObject();
		 Request getRequest = RequestBuilder.newBuilder()
					.method("application.get")
					      .paramEntry("output", "extend")
					      .paramEntry("applicationids", id)
					      .paramEntry("selectHost", true)
					      
					.build();
		 JSONArray appInfo = zabbixApi.call(getRequest).getJSONArray("result");
		 if(appInfo.size()>0){
			 JSONObject hostInfo =appInfo.getJSONObject(0).getJSONObject("host");
			 String hostid=hostInfo.getString("hostid");
			 Request getRequest2 = RequestBuilder.newBuilder()
						.method("template.get")
						      .paramEntry("output", new String[] {"name","templateid"})
						      .paramEntry("templateids", hostid)
						      .paramEntry("selectGroups", true)
						.build();
			  result = zabbixApi.call(getRequest2);
		 }else {
			 JSONObject error  =new JSONObject();;
			 error.put("data", "none data");
			 result.put("error", error);
			 return result;
		 }
		 
		 zabbixApi.destroy();
		 return result;
	}

}
