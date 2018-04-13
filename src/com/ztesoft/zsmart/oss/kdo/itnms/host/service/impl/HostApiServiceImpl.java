package com.ztesoft.zsmart.oss.kdo.itnms.host.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.oss.kdo.itnms.host.service.HostApiService;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.RequestBuilderWithArrayParams;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.RequestWithArrayParams;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.ZabbixApi;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.impl.DefaultZabbixApi;

@Service("HostApiServiceImpl")
public class HostApiServiceImpl implements HostApiService{
	@Override
	  public JSONObject getAllHostsByGroupids(String [] ids,String name,String ip ,String dns ,String port) {
		  ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  
		  JSONObject search = new JSONObject();
		  search.put("name", name);
		  search.put("ip", ip);
		  search.put("dns", dns);
		  search.put("port", port);
		  System.out.println(search);
		
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
	public JSONObject getAllGroup() {
		// TODO Auto-generated method stub
		 ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		
		 zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
				  Request getRequest = RequestBuilder.newBuilder()
					.method("hostgroup.get")
					                                 .paramEntry("output", new String[] { "groupid", "name"})
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
	
	public static void main(String[] args) {
		HostApiServiceImpl imp = new HostApiServiceImpl();
//		System.out.println(imp.deleteHost(ids));
		  List<String>ids= new ArrayList<String>();
		  ids.add("1");
		  String[] idsArray=new String[] {"1"};//ids.toArray(new String[ids.size()]);
		  for(String a: idsArray) {
			  System.out.println(a);
		  }
		  System.out.println(idsArray.toString());
	}

	@Override
	public JSONObject getHostByid(String id) {
		ZabbixApi  zabbixApi = new DefaultZabbixApi("http://10.45.50.133:7777/zabbix/api_jsonrpc.php");
		  zabbixApi.init();
		  zabbixApi.login("Admin", "zabbix");
		  Request getRequest = RequestBuilder.newBuilder()
					.method("host.get")
					                                 .paramEntry("hostids", id)	
					                                 .paramEntry("output","extend")
					                                 .paramEntry("selectGroups", "extend")
					                                 .paramEntry("selectInterfaces", "extend")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}


	@Override
	public JSONObject saveOrUpHost(Map<String, Object> param) {
   System.out.println(param);
   
     String hostid =(String)param.get("hostid");
     String host =(String)param.get("host");
     String name =(String)param.get("name");
     String proxy_hostid =(String)param.get("proxy_hostid");
     if(proxy_hostid==null)proxy_hostid="0";
     String status=(String)param.get("status");
     String description= (String)param.get("description");
    String method="host.update";
    
     if("none".equalsIgnoreCase(hostid)) {
    	  method = "host.create";
    	  hostid=null;
     }
     List<String> groups =(List<String>)param.get("groups");
     List<Map<String,String>>  interfaces =(List<Map<String,String>>)param.get("interfaces");
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
				.build();
	 JSONObject getResponse = zabbixApi.call(getRequest);
	  zabbixApi.destroy();

	  return getResponse;
    	}

	@Override
	public JSONObject deleteHost(Map<String, Object> param) {
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
	public JSONObject changeHostStatus(Map<String, Object> param) {
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
	

	

	
	

	

}
