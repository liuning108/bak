package com.ericsson.inms.pm.taskalarm.agg;

import com.ericsson.inms.pm.taskalarm.agg.redis.JedisClusterPipeline;
import com.ericsson.inms.pm.taskalarm.agg.redis.RedisUtil;
import redis.clients.jedis.Response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TestRedisCluster {
    public static void main(String[] args) {
        RedisUtil util = RedisUtil.getInstance("10.45.51.84:6379,10.45.51.85:6379,10.45.51.86:6379");
        JedisClusterPipeline pip = util.getPipeline();
        pip.set("key1","123213");
        pip.set("key2","234345");
        pip.set("key3","567567");
        pip.sync();

        pip.get("key1");
        pip.get("key2");
        pip.get("key3");
        List<Object> list = pip.syncAndReturnAll();
        for(Object obj: list){
            System.out.println((String)obj);
        }

//        Map<String,Response<String>> resMap = new HashMap<>();
//        resMap.put("key1", pip.get("key1"));
//        resMap.put("key2", pip.get("key2"));
//        resMap.put("key3", pip.get("key3"));
//        pip.sync();
//        for(String key : resMap.keySet()){
//            System.out.println(key + "===>" + resMap.get(key).get());
//        }
//        System.out.println("done!!!");
    }
}
