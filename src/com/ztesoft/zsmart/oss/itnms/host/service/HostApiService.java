package com.ztesoft.zsmart.oss.itnms.host.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

public interface HostApiService {
	
   public JSONObject getHostByid(String id) throws BaseAppException;
   public JSONObject getAllHostsByGroupids(List<String> ids,String name,String ip ,String dns ,String port) throws BaseAppException;
   public JSONObject getAllGroup(List<String>  ids) throws BaseAppException;
   public JSONObject getAllProxy() throws BaseAppException;
  public JSONObject saveOrUpHost(Map<String, Object> param,String new_gid) throws BaseAppException;
 public JSONObject deleteHost(Map<String, Object> param) throws BaseAppException;
 public JSONObject changeHostStatus(Map<String, Object> param) throws BaseAppException;
 public JSONObject addHostGroup(String name) throws BaseAppException;
public boolean isError(JSONObject result) throws BaseAppException;
public JSONObject removeHostGroup(String new_gid) throws BaseAppException;
public JSONObject getTemplateByGroupId(String id) throws BaseAppException;



 
}
