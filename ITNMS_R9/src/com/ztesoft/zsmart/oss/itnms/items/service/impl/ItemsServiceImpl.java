package com.ztesoft.zsmart.oss.itnms.items.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.itnms.items.bll.ItemsManager;
import com.ztesoft.zsmart.oss.itnms.items.service.ItemsService;

@Service("itemsServ")
public class ItemsServiceImpl implements ItemsService {

    private final static ZSmartLogger LOG = ZSmartLogger.getLogger(ItemsServiceImpl.class);

    @Autowired
    private ItemsManager itemsManager;

    @Override
    public JSONObject queryItems(Map<String, Object> param) throws BaseAppException {

        LOG.debug("ItemsServiceImpl--queryItems, param = " + JSONObject.toJSONString(param));
        return this.itemsManager.queryItems(param);
    }

    @Override
    public JSONObject createItems(List<Map<String, Object>> params) throws BaseAppException {
        LOG.debug("ItemsServiceImpl--createItems, params = " + JSONObject.toJSONString(params));

        return this.itemsManager.createItems(params);
    }

    @Override
    public JSONObject deleteItems(String[] itemIdArr) throws BaseAppException {
        LOG.debug("ItemsServiceImpl--deleteItems, itemIdArr = " + JSONObject.toJSONString(itemIdArr));

        return this.itemsManager.deleteItems(itemIdArr);
    }

    @Override
    public JSONObject updateItems(List<Map<String, Object>> params) throws BaseAppException {
        LOG.debug("ItemsServiceImpl--updateItems, params = " + JSONObject.toJSONString(params));

        return this.itemsManager.updateItems(params);
    }

}
