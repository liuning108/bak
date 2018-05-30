package com.ztesoft.zsmart.oss.itnms.trigger.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

public class TestMain {
    private static void getTriggersByidTest() throws BaseAppException {
        TriggerServiceImpl tt = new TriggerServiceImpl();
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("triggerids", "15447");
        // params.put("groupid", null);
        // params.put("filter", (Object)
        // JSONObject.parseObject("{priority:\"3\",state:\"0\",status:\"0\"}"));
        JSONObject str = tt.getTriggersByid(params);
        System.out.println("==>\n" + str.toString());
    }
    private static void getMacrosTest() throws BaseAppException {
        TriggerServiceImpl tt = new TriggerServiceImpl();
        Map<String, Object> params = new HashMap<String, Object>();
        //params.put("globalmacro", true);
        params.put("hostids", 10184);
        // params.put("filter", (Object)
        // JSONObject.parseObject("{priority:\"3\",state:\"0\",status:\"0\"}"));
        JSONObject str = tt.getMacros(params);
        System.out.println("==>\n" + str.toString());
    }    
    
    private static void createTriggersTest() throws BaseAppException {
        TriggerServiceImpl tt = new TriggerServiceImpl();
        List<Object> listStr = new ArrayList<Object>();
        String strr = "{\"description\": \"Processor load is too high on {HOST.NAME}\","
                + "\"expression\": \"{spark244:system.boottime.last(#6,11)}=0\","
                + "            \"dependencies\": [                {                    \"triggerid\": \"15445\""
                + "                }            ]        }";
        JSONObject strt = JSONObject.parseObject(strr);
        listStr.add(strt);

        JSONObject str = tt.createTriggers(listStr);
        System.out.println("==>\n" + str.toString());
    }

    private static void deleteTriggersTest() throws BaseAppException {
        TriggerServiceImpl tt = new TriggerServiceImpl();
        List<Object> listStr = new ArrayList<Object>();
        String strr = "15446";

        listStr.add(strr);

        JSONObject str = tt.deleteTriggers(listStr);
        System.out.println("==>\n" + str.toString());
    }

    private static void updateTriggersTest() throws BaseAppException {
        TriggerServiceImpl tt = new TriggerServiceImpl();
        List<HashMap<String, Object>> listparams = new ArrayList<HashMap<String, Object>>();

        HashMap<String, Object> params = new HashMap<String, Object>();
        params.put("status", "0");
        params.put("triggerid", 15447);
        listparams.add(params);
        HashMap<String, Object> params1 = new HashMap<String, Object>();
        params1.put("status", "0");
        params1.put("triggerid", 15446);
        listparams.add(params1);
        List<JSONObject> str = tt.updateTriggers(listparams);
        for(JSONObject j : str)
            System.out.println("==>\n" + j.toString());
    }
    private static void testdao(){
        TriggerServiceImpl tt = new TriggerServiceImpl();
        List<Map<String, Object>> listdata = tt.queryItnmsExpFunc();
        System.out.println(listdata.toString());
    }
    public static void main(String arg[]) throws BaseAppException {
        testdao();
//        
//        getTriggersByidTest();
//        getMacrosTest();
//        createTriggersTest();
//        updateTriggersTest();
//        deleteTriggersTest();
    }
}
