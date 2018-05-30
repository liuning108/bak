package com.ztesoft.zsmart.oss.itnms.items.bll;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.util.ZabbixApiUtil;

/**
 * @author Administrator
 */
@Component
public class ItemsManager {

    /**
     * 查询监控项信息
     * 
     * @param params
     * @return
     * @throws BaseAppException
     */
    public JSONObject queryItems(Map<String, Object> params) throws BaseAppException {

        Map<String, Object> condition = ZabbixApiUtil.reBuildZabbixApiParam(params, "item.get");

        JSONObject result = ZabbixApiUtil.postForObject(condition);

        JSONArray rsList = result.getJSONArray("result");

        for (int i = 0; i < rsList.size(); i++) {
            JSONObject next = (JSONObject) (rsList.get(i));

            Object obj = next.get("triggers");
            if (obj instanceof JSONArray) {
                next.put("trigger_count", ((JSONArray) obj).size());
            }
            else {
                break;
            }
        }
        result.put("result", rsList);

        return result;
    }

    /**
     * 更新监控项信息
     * 
     * @param params
     * @return
     * @throws BaseAppException
     */
    public JSONObject updateItems(List<Map<String, Object>> params) throws BaseAppException {
        Map<String, Object> condition = ZabbixApiUtil.reBuildZabbixApiParam4List(params, "item.update");

        return ZabbixApiUtil.postForObject(condition);
    }

    /**
     * 创建监控项信息
     * 
     * @param params
     * @return
     * @throws BaseAppException
     */
    public JSONObject createItems(List<Map<String, Object>> params) throws BaseAppException {

        Map<String, Object> condition = ZabbixApiUtil.reBuildZabbixApiParam4List(params, "item.create");

        return ZabbixApiUtil.postForObject(condition);
    }

    /**
     * 根据监控项ID删除监控项信息
     * 
     * @param itemIdArr
     * @return
     * @throws BaseAppException
     */
    public JSONObject deleteItems(String[] itemIdArr) throws BaseAppException {
        Map<String, Object> condition = new HashMap<String, Object>();
        condition.put("params", itemIdArr);
        condition.put("method", "item.delete");

        return ZabbixApiUtil.postForObject(condition);
    }
}
