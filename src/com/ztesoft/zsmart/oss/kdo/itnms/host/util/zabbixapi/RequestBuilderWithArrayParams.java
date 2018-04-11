package com.ztesoft.zsmart.oss.kdo.itnms.host.util.zabbixapi;

import java.util.concurrent.atomic.AtomicInteger;


public class RequestBuilderWithArrayParams {
	private static final AtomicInteger nextId = new AtomicInteger(1);

	private RequestWithArrayParams request = new RequestWithArrayParams();
	
	private RequestBuilderWithArrayParams(){

	}
	
	static public RequestBuilderWithArrayParams newBuilder(){
		return new RequestBuilderWithArrayParams();
	}
	
	public RequestWithArrayParams build(){
		if(request.getId() == null){
			request.setId(nextId.getAndIncrement());
		}
		return request;
	}
	
	public RequestBuilderWithArrayParams version(String version){
		request.setJsonrpc(version);
		return this;
	}
	
	/**
	 * Do not necessary to call this method.If don not set id, ZabbixApi will auto set request auth.. 
	 * @param auth
	 * @return
	 */
	public RequestBuilderWithArrayParams auth(String auth){
		request.setAuth(auth);
		return this;
	}
	
	public RequestBuilderWithArrayParams params(String[] params){
        request.setParams(params);
        return this;
    }
	
	public RequestBuilderWithArrayParams method(String method){
		request.setMethod(method);
		return this;
	}
	
	/**
	 * Do not necessary to call this method.If don not set id, RequestBuilder will auto generate.
	 * @param id
	 * @return
	 */
	public RequestBuilderWithArrayParams id(Integer id){
		request.setId(id);
		return this;
	}
}
