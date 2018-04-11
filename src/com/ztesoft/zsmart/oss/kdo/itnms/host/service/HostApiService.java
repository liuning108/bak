package com.ztesoft.zsmart.oss.kdo.itnms.host.service;

import com.alibaba.fastjson.JSONObject;

public interface HostApiService {
   public JSONObject getHostByid(String id);
   public JSONObject getAllHostsByGroupids(String [] ids,String name,String ip ,String dns ,String port);

   public JSONObject getAllGroup();
   public JSONObject getAllProxy();
}
