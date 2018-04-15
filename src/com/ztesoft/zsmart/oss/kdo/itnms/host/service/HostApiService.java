package com.ztesoft.zsmart.oss.kdo.itnms.host.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public interface HostApiService {
	
   public JSONObject getHostByid(String id);
   public JSONObject getAllHostsByGroupids(List<String> ids,String name,String ip ,String dns ,String port);
   public JSONObject getAllGroup(List<String>  ids);
   public JSONObject getAllProxy();
  public JSONObject saveOrUpHost(Map<String, Object> param,String new_gid);
 public JSONObject deleteHost(Map<String, Object> param);
 public JSONObject changeHostStatus(Map<String, Object> param);
 public JSONObject addHostGroup(String name);
public boolean isError(JSONObject result);
public JSONObject removeHostGroup(String new_gid);
 
}
