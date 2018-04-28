package com.ztesoft.zsmart.oss.itnms.maintenance.service;

import java.util.Map;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
public interface MaintenaceApiService {

public JSONObject getAllMainByGroupids(Map<String,Object> param);
public JSONObject deleteByIds(Map<String,Object> param);
public JSONObject getMaintenanceById(Map<String,Object> param);
public JSONObject saveOrUpdate(Map<String, Object> param) throws BaseAppException;

}
