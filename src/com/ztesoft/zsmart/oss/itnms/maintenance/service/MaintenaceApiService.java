package com.ztesoft.zsmart.oss.itnms.maintenance.service;

import java.util.Map;
import com.alibaba.fastjson.JSONObject;
public interface MaintenaceApiService {

public JSONObject getAllMainByGroupids(Map<String,Object> param);
public JSONObject deleteByIds(Map<String,Object> param);

}
