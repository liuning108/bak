package com.ztesoft.zsmart.oss.itnms.application.service;

import java.util.Map;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

public interface ApplicationApiService {
	public JSONObject getApplication(Map<String, Object> param) throws BaseAppException;
	public JSONObject deleteApplicaton(Map<String, Object> param) throws BaseAppException;
	public JSONObject addApplication(Map<String, Object> param) throws BaseAppException;
	public JSONObject updateApplication(Map<String, Object> param) throws BaseAppException;
	public JSONObject getSubApplicationInfo(Map<String, Object> param) throws BaseAppException;
	public JSONObject getTemplate(Map<String, Object> param) throws BaseAppException;

}
