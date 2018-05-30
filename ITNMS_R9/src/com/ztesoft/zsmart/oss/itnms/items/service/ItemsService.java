package com.ztesoft.zsmart.oss.itnms.items.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

public interface ItemsService {
    JSONObject queryItems(Map<String, Object> param) throws BaseAppException;

    JSONObject createItems(List<Map<String, Object>> params) throws BaseAppException;

    JSONObject deleteItems(String[] itemIdArr) throws BaseAppException;

    JSONObject updateItems(List<Map<String, Object>> params) throws BaseAppException;
}
