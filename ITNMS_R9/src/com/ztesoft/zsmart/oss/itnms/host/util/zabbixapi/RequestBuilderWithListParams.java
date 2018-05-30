package com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class RequestBuilderWithListParams {
    private static final AtomicInteger nextId = new AtomicInteger(1);

    private RequestWithListParams request = new RequestWithListParams();
    
    private RequestBuilderWithListParams(){

    }
    
    static public RequestBuilderWithListParams newBuilder(){
        return new RequestBuilderWithListParams();
    }
    
    public RequestWithListParams build(){
        if(request.getId() == null){
            request.setId(nextId.getAndIncrement());
        }
        return request;
    }
    
    public RequestBuilderWithListParams version(String version){
        request.setJsonrpc(version);
        return this;
    }
    
    /**
     * Do not necessary to call this method.If don not set id, ZabbixApi will auto set request auth.. 
     * @param auth
     * @return
     */
    public RequestBuilderWithListParams auth(String auth){
        request.setAuth(auth);
        return this;
    }
    
    public RequestBuilderWithListParams params(List<Object> params){
        request.setParams(params);
        return this;
    }
    
    public RequestBuilderWithListParams method(String method){
        request.setMethod(method);
        return this;
    }
    
    /**
     * Do not necessary to call this method.If don not set id, RequestBuilder will auto generate.
     * @param id
     * @return
     */
    public RequestBuilderWithListParams id(Integer id){
        request.setId(id);
        return this;
    }
}
