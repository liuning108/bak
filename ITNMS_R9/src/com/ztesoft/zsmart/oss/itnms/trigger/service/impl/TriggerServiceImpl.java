package com.ztesoft.zsmart.oss.itnms.trigger.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilderWithListParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestWithListParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.ZabbixApi;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.impl.DefaultZabbixApi;
import com.ztesoft.zsmart.oss.itnms.trigger.dao.ExpFunDao;
import com.ztesoft.zsmart.oss.itnms.trigger.service.TriggerService;
import com.ztesoft.zsmart.oss.itnms.util.ZabbixApiUtil;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.JdbcUtil;

@Service("TriggerServiceImpl")
public class TriggerServiceImpl implements TriggerService {

    private final static ZSmartLogger logger = ZSmartLogger.getLogger(TriggerServiceImpl.class);

    private ZabbixApi getzabbixApi() throws BaseAppException {
//        ZabbixApi zabbixApi = new DefaultZabbixApi("http://10.45.53.18:7777/zabbix/api_jsonrpc.php");
//        zabbixApi.init();
//        zabbixApi.login("Admin", "zabbix");

         Map<String, String> result= ZabbixApiUtil.getZabbixApiInfo();
         ZabbixApi zabbixApi = new DefaultZabbixApi(result.get("url"));
         zabbixApi.init();
         zabbixApi.setAuth(result.get("auth"));
         return zabbixApi;
    }
    @Override
    public JSONObject getMacros(Map<String, Object> params) throws BaseAppException{
        ZabbixApi zabbixApi = getzabbixApi();
        Request getRequest = RequestBuilder.newBuilder().method("usermacro.get")
                .paramEntry("output", "extend")
                .build();

        if (null != params) {
            Object groupid = params.get("groupids");
            Object hostid = params.get("hostids");
            Object templateid = params.get("templateids");
            if (null != groupid)
                getRequest.putParam("groupids", groupid);
            if (null != hostid)
                getRequest.putParam("hostids", hostid);
            if (null != templateid)
                getRequest.putParam("templateids", templateid);
            Object globalmacro = (Object) params.get("globalmacro");
            if (null != globalmacro)
                getRequest.putParam("globalmacro", globalmacro);
        }
        logger.debug("getMacros getRequest[" + getRequest.toString() + "]");
        JSONObject getResponse = zabbixApi.call(getRequest);
        zabbixApi.destroy();
        return getResponse;
    }
    
    @Override
    public JSONObject getTriggersByid(Map<String, Object> params) throws BaseAppException {
        ZabbixApi zabbixApi = getzabbixApi();
        Request getRequest = RequestBuilder.newBuilder().method("trigger.get").paramEntry("output", "extend")
                // new String[] { "triggerid", "description", "priority",
                // "expression", "recovery_expression",
                // "status" })
                .paramEntry("sortfield", "triggerid").paramEntry("sortorder", "ASC")
                .paramEntry("selectDependencies", new String[] { "triggerid", "description", "priority", "state" })
                .paramEntry("expandExpression", "true").paramEntry("selectGroups", new String[] { "groupid", "name" })
                .paramEntry("selectHosts", new String[] { "hostid", "host" })
                .paramEntry("selectItems", new String[] { "itemid", "name" }).paramEntry("selectTags", "extend")
                .build();

        if (null != params) {
            Object groupids = params.get("groupids");
            Object hostids = params.get("hostids");
            Object templateids = params.get("templateids");
            if (null != groupids)
                getRequest.putParam("groupids", groupids);
            if (null != hostids)
                getRequest.putParam("hostids", hostids);
            if (null != templateids)
                getRequest.putParam("templateids", templateids);
            Object filter = (Object) params.get("filter");
            if (null != filter)
                getRequest.putParam("filter", filter);
            Object triggerids = params.get("triggerids");
            if (null != triggerids)
                getRequest.putParam("triggerids", triggerids);
        }
        logger.debug("getTriggersByid getRequest[" + getRequest.toString() + "]");
        JSONObject getResponse = zabbixApi.call(getRequest);
        zabbixApi.destroy();
        return getResponse;
    }

    @Override
    public JSONObject createTriggers(List<Object> params) throws BaseAppException {

        if (null == params) {
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("resultCode", "-1");
            result.put("errCode", "NULL_TRIGGER_PARAM");
            result.put("resultMsg", "createTriggers param is null");
            return new JSONObject(result);
        }

        ZabbixApi zabbixApi = getzabbixApi();
        RequestWithListParams getRequest = RequestBuilderWithListParams.newBuilder().method("trigger.create")
                .params(params).build();
        
        logger.debug("createTriggers getRequest[" + getRequest.toString() + "]");
        JSONObject getResponse = zabbixApi.call(getRequest);
        zabbixApi.destroy();
        return getResponse;
    }

    @Override
    public JSONObject deleteTriggers(List<Object> params) throws BaseAppException {

        if (null == params) {
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("resultCode", "-1");
            result.put("errCode", "NULL_TRIGGER_PARAM");
            result.put("resultMsg", "deleteTriggers param is null");
            return new JSONObject(result);
        }

        ZabbixApi zabbixApi = getzabbixApi();
        RequestWithListParams getRequest = RequestBuilderWithListParams.newBuilder().method("trigger.delete")
                .params(params).build();
        logger.debug("deleteTriggers getRequest[" + getRequest.toString() + "]");
        JSONObject getResponse = zabbixApi.call(getRequest);
        zabbixApi.destroy();
        return getResponse;
    }
    
    @Override
    public List<JSONObject> updateTriggers(List<HashMap<String, Object>> params) throws BaseAppException {
        List<JSONObject> listResult = new ArrayList<JSONObject>();
        if (null == params) {
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("resultCode", "-1");
            result.put("errCode", "NULL_TRIGGER_PARAM");
            result.put("resultMsg", "updateTriggers param is null");
            listResult.add(new JSONObject(result));
            return listResult;
        }
        ZabbixApi zabbixApi = getzabbixApi();
        for(HashMap<String, Object> p : params)
            listResult.add(updateEachTriggers(p,zabbixApi));
        zabbixApi.destroy();
        return listResult;
    }
    private JSONObject updateEachTriggers(HashMap<String, Object> params, ZabbixApi zabbixApi){
        Request getRequest = RequestBuilder.newBuilder().method("trigger.update").build();
        for (Entry<String, Object> en : params.entrySet()) {
            getRequest.putParam(en.getKey(), en.getValue());
        }
        logger.debug("updateEachTriggers getRequest[" + getRequest.toString() + "]");
        JSONObject getResponse = zabbixApi.call(getRequest);
        return getResponse;
    }
    
    @Override
    public List<Map<String, Object>> queryItnmsExpFunc(){
        ExpFunDao dao = (ExpFunDao) GeneralDAOFactory.create(ExpFunDao.class, JdbcUtil.OSS_KDO);
        return dao.queryItnmsExpFunc();
    }
    @Override
    public List<Map<String,Object>> queryItnmsExpFuncPara(){
        ExpFunDao dao = (ExpFunDao) GeneralDAOFactory.create(ExpFunDao.class, JdbcUtil.OSS_KDO);
        return dao.queryItnmsExpFuncPara();
    }
}
