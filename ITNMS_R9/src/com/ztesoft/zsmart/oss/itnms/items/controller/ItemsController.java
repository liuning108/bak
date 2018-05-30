package com.ztesoft.zsmart.oss.itnms.items.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.hound.common.utils.CollectionUtils;
import com.ztesoft.zsmart.oss.itnms.items.service.ItemsService;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

@RestController
@RequestMapping("itnms")
public class ItemsController {

    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ItemsController.class);

    @Resource
    private ItemsService itemsServ;

    @PublicServ
    @RequestMapping(value = "items/info", method = RequestMethod.POST)
    public JSONObject queryItems(@RequestBody Map<String, Object> param) throws BaseAppException {
        LOG.debug("Begin ItemsController--queryItemsByCondition, param = " + JSON.toJSONString(param));
        return this.itemsServ.queryItems(param);
    }

    @PublicServ
    @RequestMapping(value = "items", method = RequestMethod.POST)
    public JSONObject createItems(@RequestBody List<Map<String, Object>> param) throws BaseAppException {
        LOG.info("Begin ItemsController--createItems");
        // 参数为空则返回错误码
        if (CollectionUtils.isEmpty(param)) {
            LOG.debug("ItemsController--createItems, param is Empty Collection.");
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("resultCode", "-1");
            result.put("errCode", "EMPTY_ITEM_LIST");
            result.put("resultMsg", "item List is Empty");
            return new JSONObject(result);
        }
        return this.itemsServ.createItems(param);
    }

    @PublicServ
    @RequestMapping(value = "items", method = RequestMethod.PUT)
    public JSONObject updateItems(@RequestBody List<Map<String, Object>> param) throws BaseAppException {
        LOG.info("Begin ItemsController--updateItems");
        // 参数为空则返回错误码
        if (CollectionUtils.isEmpty(param)) {
            LOG.debug("ItemsController--createItems, param is Empty Collection.");
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("resultCode", "-1");
            result.put("errCode", "EMPTY_ITEM_LIST");
            result.put("resultMsg", "item List is Empty");
            return new JSONObject(result);
        }
        JSONObject result = this.itemsServ.updateItems(param);
        LOG.info("End ItemsController--updateItems");
        return result;
    }

    @PublicServ
    @RequestMapping(value = "items", method = RequestMethod.DELETE)
    public JSONObject deleteItems(@RequestBody List<String> param) throws BaseAppException {
        LOG.info("Begin ItemsController--deleteItems");
        // 参数为空则返回错误码
        if (CollectionUtils.isEmpty(param)) {
            LOG.debug("ItemsController--createItems, param is Empty Collection.");
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("resultCode", "-1");
            result.put("errCode", "EMPTY_ITEMIDS");
            result.put("resultMsg", "itemId List is Empty");
            return new JSONObject(result);
        }
        String[] arr = new String[param.size()];
        return this.itemsServ.deleteItems((String[]) param.toArray(arr));
    }

}
