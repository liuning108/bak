package com.ericsson.inms.pm.taskalarm.agg;

import com.ericsson.inms.pm.taskalarm.agg.redis.RedisUtil;

import java.util.*;

public class TestRedisApi {
//    public static void main(String[] args) {
//        RedisUtil util = RedisUtil.getInstance("10.45.51.84:6379,10.45.51.85:6379,10.45.51.86:6379");
//
//        List<String> input = new ArrayList<>();
//        input.add("last_30_min_PA2EOSB00002");
//        input.add("last_30_max_PA2EOSB00001");
//        Map<String,Map<String, String>> res = util.getLastData(input);
//        for(String kpi: res.keySet()){
//            for(String gid: res.get(kpi).keySet()){
//                System.out.println(kpi + "===>" + gid + ":"+ res.get(kpi).get(gid));
//            }
//        }
//    }

//    public static void main(String[] args) {
//        RedisUtil util = RedisUtil.getInstance("10.45.51.84:6379,10.45.51.85:6379,10.45.51.86:6379");
//
//        Map<String, Map<String, String>> input = new HashMap<>();
//        Map<String, String> ele = new HashMap<>();
//        ele.put("xxxx","whatever");
//        input.put("mo_gid1",ele);
//        util.setLastAlarmStatus(input);
//        Set<String> set = new HashSet<>();
//        set.add("mo_gid1");
//        Map<String, Map<String, String>> output = util.getLastAlarmStatus(set);
//
//        for(String kpi: output.keySet()){
//            for(String gid: output.get(kpi).keySet()){
//               System.out.println(kpi + "===>" + gid + ":"+ output.get(kpi).get(gid));
//            }
//        }
//    }

    public static void main(String[] args) {
        RedisUtil util = RedisUtil.getInstance("10.45.51.84:6379,10.45.51.85:6379,10.45.51.86:6379");
        Set<String> set = new HashSet<>();
        set.add("4401ERHX2PAKC66BDD736F19189C");
        Map<String, String> ret = util.getResourceName(set);
        for(String key : ret.keySet()){
            System.out.println(key+"=====>"+ret.get(key));
        }
    }
}
