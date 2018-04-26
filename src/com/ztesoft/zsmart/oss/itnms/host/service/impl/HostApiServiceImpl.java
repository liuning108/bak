package com.ztesoft.zsmart.oss.itnms.host.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.host.service.HostApiService;
import com.ztesoft.zsmart.oss.itnms.host.service.HostService;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilderWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.ZabbixApi;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.impl.DefaultZabbixApi;
import com.ztesoft.zsmart.oss.itnms.util.ZabbixApiUtil;

@Service("HostApiServiceImpl")
public class HostApiServiceImpl implements HostApiService{
	@Override
	  public JSONObject getAllHostsByGroupids(List<String> ids,String name,String ip ,String dns ,String port) throws BaseAppException {
		  
		  Map<String, String> result= ZabbixApiUtil.getZabbixApiInfo();
		  ZabbixApi  zabbixApi = new DefaultZabbixApi(result.get("url"));
		  zabbixApi.init();
		  zabbixApi.setAuth(result.get("auth"));
		  
		  JSONObject search = new JSONObject();
		  search.put("name", name);
		  search.put("ip", ip);
		  search.put("dns", dns);
		  search.put("port", port);
		  Request getRequest = RequestBuilder.newBuilder()
					.method("host.get")
					                                 .paramEntry("output", new String[] { "name","status","description","available","ipmi_available","jmx_available","snmp_available","error","ipmi_error","jmx_error","snmp_error"})
					                                 .paramEntry("groupids", ids)
					                                 .paramEntry("selectInterfaces", new String[] {"type","ip","dns","port"})
					                                 .paramEntry("search",search)
					                                 .paramEntry("sortfield", "hostid")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}
	
	@Override
	public JSONObject getAllGroup(List<String >ids ) throws BaseAppException {
		// TODO Auto-generated method stub
		 ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		
		 zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
				  Request getRequest = RequestBuilder.newBuilder()
					.method("hostgroup.get")
					                                 .paramEntry("output", new String[] { "groupid", "name"})
					                                 .paramEntry("groupids", ids)
					                                 .paramEntry("sortfield", "groupid")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}
	@Override
	public JSONObject getAllProxy() {
		  ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
			 zabbixApi.init();
			  zabbixApi.login("Admin", "zabbix");
		
		  Request getRequest = RequestBuilder.newBuilder()
					.method("proxy.get")
					                                 .paramEntry("output", new String[] { "proxyid","host","status"})
					                                 .paramEntry("sortfield", "host")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}
	
	public static void main(String[] args) throws BaseAppException {
		HostApiService  imp = new HostApiServiceImpl();
		HostService dao = new HostServiceImpl();
      System.out.println(imp.getTemplateByGroupId("16"));
       
	}

	

	@Override
	public JSONObject getHostByid(String id) throws BaseAppException {
		ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  Request getRequest = RequestBuilder.newBuilder()
					.method("host.get")
					                                 .paramEntry("hostids", id)	
					                                 .paramEntry("output","extend")
					                                 .paramEntry("selectGroups", "extend")
					                                 .paramEntry("selectInterfaces", "extend")
					                                .paramEntry("selectParentTemplates", new String[] {"host","name","templateid"})
					                                .paramEntry("selectMacros","extend")
					                                .paramEntry("selectInventory", "extend")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}


	@Override
	public JSONObject saveOrUpHost(Map<String, Object> param,String new_gid)  throws BaseAppException {
   System.out.println(param);
   
     String hostid =(String)param.get("hostid");
     String host =(String)param.get("host");
     String name =(String)param.get("name");
     String proxy_hostid =(String)param.get("proxy_hostid");
     if(proxy_hostid==null)proxy_hostid="0";
     String status=(String)param.get("status");
     String description= (String)param.get("description");
     String inventory_mode=(String)param.get("inventory_mode");

     String method="host.update";
    
     if("none".equalsIgnoreCase(hostid)) {
    	  method = "host.create";
    	  hostid=null;
     }
     List<Map<String,String>> groups =(List<Map<String,String>> )param.get("groups");
     if(new_gid!=null) {
    	    Map<String,String> map = new HashMap<String,String>();
    	    map.put("groupid", new_gid);
    	    groups.add(map);
     }
     List<Map<String,String>>  interfaces =(List<Map<String,String>>)param.get("interfaces");
     List<Map<String,String>>  templates =(List<Map<String,String>>)param.get("templates");
     List<Map<String,String>>  templates_clear =(List<Map<String,String>>)param.get("templates_clear");
     List<Map<String,String>>  macros =(List<Map<String,String>>)param.get("macros");
     Map<String,String> inventory  = (Map<String,String>)param.get("inventory");
     
     ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
	  zabbixApi.init();
	  zabbixApi.login("Admin", "zabbix");
			  Request getRequest = RequestBuilder.newBuilder()
				.method(method)
				                                 .paramEntry("hostid", hostid)
				                                 .paramEntry("host", host)
				                                 .paramEntry("name", name)
				                                 .paramEntry("proxy_hostid", proxy_hostid)
				                                 .paramEntry("status", status)
				                                 .paramEntry("description", description)
				                                 .paramEntry("groups", groups)
				                                 .paramEntry("interfaces", interfaces)
				                                 .paramEntry("templates", templates)
				                                 .paramEntry("templates_clear", templates_clear)
				                                 .paramEntry("macros", macros)
				                                 .paramEntry("inventory_mode", inventory_mode)
				                                 .paramEntry("inventory", inventory)
				.build();
	 JSONObject getResponse = zabbixApi.call(getRequest);
	  zabbixApi.destroy();

	  return getResponse;
    	}

	@Override
	public JSONObject deleteHost(Map<String, Object> param) throws BaseAppException {
		  List<String>ids= (List<String>)param.get("ids");
		  String[] idsArray=ids.toArray(new String[ids.size()]);
	      ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  RequestWithArrayParams getRequest = RequestBuilderWithArrayParams.newBuilder()
                  .method("host.delete")
                  .params(idsArray)
                  .build();
        com.alibaba.fastjson.JSONObject getResponse = zabbixApi.call(getRequest);
        zabbixApi.destroy();

		  return getResponse;
	}

	@Override
	public JSONObject changeHostStatus(Map<String, Object> param) throws BaseAppException {
	    List<Map<String,String>>  hosts =(List<Map<String,String>>)param.get("hosts");
		String status = (String)param.get("status");
		 ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
				  Request getRequest = RequestBuilder.newBuilder()
					.method("host.massupdate")
					                                 .paramEntry("hosts", hosts)
					                                 .paramEntry("status", status)
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}

	@Override
	public JSONObject addHostGroup(String name) throws BaseAppException{
		 ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
				  Request getRequest = RequestBuilder.newBuilder()
					.method("hostgroup.create")
					                                 .paramEntry("name", name)
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  if(isError(getResponse))return getResponse;
		
		  Map<String,Object> result =(Map<String,Object>)getResponse.get("result");
		  List<String> groupids  =( List<String>) result.get("groupids");
		  getResponse.put("newGid", groupids.get(0));
		  return getResponse;
	}

	@Override
	public boolean isError(JSONObject result) throws BaseAppException {
		// TODO Auto-generated method stub
	    Object  o = result.get("error");
		return (o==null)?false:true;
	}

	@Override
	public JSONObject removeHostGroup(String new_gid)  throws BaseAppException {
		 ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  RequestWithArrayParams getRequest = RequestBuilderWithArrayParams.newBuilder()
                  .method("hostgroup.delete")
                  .params(new String[] {new_gid})
                  .build();
         JSONObject getResponse = zabbixApi.call(getRequest);
		  return getResponse;
	}

	@Override
	public JSONObject getTemplateByGroupId(String id) throws BaseAppException {
		  ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  Request getRequest = RequestBuilder.newBuilder()
					.method("template.get")
					                                 .paramEntry("output", new String[] {"templateid","name"})
					                                 .paramEntry("groupids", new String [] {id})
					                                 .paramEntry("sortfield", "name")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}
	

	

	
	

	

}
