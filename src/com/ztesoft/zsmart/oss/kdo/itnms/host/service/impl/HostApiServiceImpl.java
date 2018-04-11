package com.ztesoft.zsmart.oss.kdo.itnms.host.service.impl;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.oss.kdo.itnms.host.service.HostApiService;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi.RequestBuilder;
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
					                                 .paramEntry("output", new String[] { "proxyid", "host","status"})
					                                 .paramEntry("sortfield", "host")
					.build();
		 JSONObject getResponse = zabbixApi.call(getRequest);
		  zabbixApi.destroy();
		  return getResponse;
	}
	
	public static void main(String[] args) {
		HostApiService imp = new HostApiServiceImpl();
		String [] ids = new String[] {"1","2","3","4","5","6","7","8","10","11","12","13","14","15"};
		System.out.println(imp.getHostByid("10275"));
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

	

	

}
