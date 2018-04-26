package com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi;

import com.alibaba.fastjson.JSONObject;

public interface ZabbixApi {
	void init();

	void destroy();

	String apiVersion();

	JSONObject call(Request request);
	
	JSONObject call(RequestWithArrayParams request);

	String login(String user, String password);
	String setAuth(String auth);
}
