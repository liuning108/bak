package com.ericsson.inms.pm.taskalarm.agg.redis;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.taskalarm.agg.dao.PhyTableConstants;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.Response;

import java.io.Serializable;
import java.util.*;
import org.apache.log4j.Logger;

public class RedisUtil implements Serializable {
    private static Logger logger = Logger.getLogger(RedisUtil.class);


    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    private static JedisCluster jedisCluster = null;

    private static RedisUtil redisUtil;

    public static RedisUtil getInstance(String host) {
        if (redisUtil == null) {
            synchronized (RedisUtil.class) {
                if (redisUtil == null) {
                    redisUtil = new RedisUtil(host);
                    return redisUtil;
                }
            }
        }

        return redisUtil;
    }

    private RedisUtil(String host) {
        Set<HostAndPort> nodes = new HashSet<>();
        String[] hostAndPortStr = host.split(",");
        for (String hpStr : hostAndPortStr) {
            String[] hpArr = hpStr.split(":");
            int port = 6379;
            try {
                port = Integer.valueOf(hpArr[1]);
            }
            catch (Exception ignore) {
            }
            nodes.add(new HostAndPort(hpArr[0], port));
        }
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(5000);
        config.setMaxIdle(50);
        config.setMaxWaitMillis(5 * 1000);
        config.setTestOnBorrow(true);
        jedisCluster = new JedisCluster(nodes, config);
    }

    public JedisClusterPipeline getPipeline() {
        JedisClusterPipeline jcp = JedisClusterPipeline.pipelined(jedisCluster);
        jcp.refreshCluster();
        return jcp;
    }

    public void saveAlarmData(Map<String, double[]> stringMap, int lastN) {
        JedisClusterPipeline pip = getPipeline();
        for (String key : stringMap.keySet()) {
            String[] gidAndKpi = key.split(":");
            String gid = gidAndKpi[0];
            String kpi = gidAndKpi[1];
            double[] values = stringMap.get(key);
            String max = String.valueOf(values[0]);
            String min = String.valueOf(values[1]);
            String avg = String.valueOf(values[2]);
            String sum = String.valueOf(values[3]);

            String maxKey = PhyTableConstants.REDIS_AGG_PREFIX + ":" + lastN + ":" + kpi + ":max";
            pip.hset(maxKey, gid, max);
            String minKey = PhyTableConstants.REDIS_AGG_PREFIX + ":" + lastN + ":" + kpi + ":min";
            pip.hset(minKey, gid, min);
            String avgKey = PhyTableConstants.REDIS_AGG_PREFIX + ":" + lastN + ":" + kpi + ":avg";
            pip.hset(avgKey, gid, avg);
            String sumKey = PhyTableConstants.REDIS_AGG_PREFIX + ":" + lastN + ":" + kpi + ":sum";
            pip.hset(sumKey, gid, sum);
        }
        pip.sync();
        pip.close();
    }

    /**
     * 告警环比查询接口
     * */
    public Map<String, Map<String, String>> getLastData(List<String> keys) {
        JedisClusterPipeline pip = getPipeline();
        Map<String, Response<Map<String, String>>> tmpRes = new HashMap<>();
        for (String key : keys) {
            String[] keyArr = key.split("_");
            String lastN = keyArr[1];
            String fuc = keyArr[2];
            String kpi = keyArr[3];
            String redisKey = PhyTableConstants.REDIS_AGG_PREFIX + ":" + lastN + ":" + kpi + ":" + fuc;
            tmpRes.put(key, pip.hgetAll(redisKey));
        }
        pip.sync();
        Map<String, Map<String, String>> res = getFromHashResponse(tmpRes);
        pip.close();
        return res;
    }

    /**
     * 告警次数信息查询接口
     * */
    public Map<String, Map<String, String>> getLastAlarmStatus(Set<String> gids) {
        JedisClusterPipeline pip = getPipeline();
        Map<String, Response<Map<String, String>>> tmpRes = new HashMap<>();
        for (String gid : gids) {
            String redisKey = PhyTableConstants.REDIS_STATUS_PREFIX + ":" + gid;
            tmpRes.put(gid, pip.hgetAll(redisKey));
        }
        pip.sync();
        Map<String, Map<String, String>> res = getFromHashResponse(tmpRes);
        pip.close();
        return res;
    }

    /**
     * 告警次数信息更新接口
     * */
    public void setLastAlarmStatus(Map<String, Map<String, String>> data) {
        JedisClusterPipeline pip = getPipeline();

        for (String gid : data.keySet()) {
            Map<String, String> gidData = data.get(gid);
            for (String info : gidData.keySet()) {
                String redisKey = PhyTableConstants.REDIS_STATUS_PREFIX + ":" + gid;

                pip.hset(redisKey, info, gidData.get(info));
                logger.debug("RedisUtil set key:" + redisKey + "; field:"+ info + "; value:" + gidData.get(info));
            }
        }
        pip.sync();
        pip.close();
    }

    /**
     * 告警信息清除接口
     * */
    public void cleanLastAlarmStatus(Set<String> gids, String newTime){
//        JedisClusterPipeline pipGet = getPipeline();
//        JedisClusterPipeline pipSet = getPipeline();
//
//        Map<String, Response<Map<String, String>>> tmpRes = new HashMap<>();
//        for (String gid : gids) {
//            String redisKey = PhyTableConstants.REDIS_STATUS_PREFIX + ":" + gid;
//            tmpRes.put(gid, pipGet.hgetAll(redisKey));
//        }
//        pipGet.sync();

        Map<String, Map<String, String>> tmpRes  = getLastAlarmStatus(gids);
        for(String gid : tmpRes.keySet()){
            Map<String, String> levels = tmpRes.get(gid);
            for(String level : levels.keySet()){
                String value = levels.get(level);
                String[] valueArr = value.split(",");
                if(valueArr.length == 4){
                    String newValue = "0," + newTime + "," + valueArr[2] + "," + valueArr[3];
                    levels.put(level, newValue);
                }
            }
        }

        setLastAlarmStatus(tmpRes);
    }

    /**
     * 通过Gid查询资源数据中的name
     * 资源有两张表
     * FM:RESOURCE:DEVICE_UID_INFO
     * FM:RESOURCE:OBJECT_INFO
     * */
    public Map<String, String> getResourceName(Set<String> gids){
        Map<String, String> ret = new HashMap<>();
        MapSearch(PhyTableConstants.DEVICE_UID_INFO, gids, ret);
        MapSearch(PhyTableConstants.OBJECT_INFO, gids, ret);
        return ret;
    }

    private void MapSearch(String tableName, Set<String> gids, Map<String, String> ret){
        Map<String, String> deviceInfo = jedisCluster.hgetAll(tableName);
        for(String gid: gids){
            if (deviceInfo.containsKey(gid)){
                String jsonStr = deviceInfo.get(gid);
                JSONObject jsonObject = JSON.parseObject(jsonStr);
                String name = jsonObject.getString("name");
                ret.put(gid, name);
            }
        }
        deviceInfo.clear();
    }



    /**
     * 告警规则写入接口
     * */
    public void setTaskRule(String table, String rule){
        String key = PhyTableConstants.REDIS_RULE_PREFIX + ":" + table;
        jedisCluster.set(key, rule);
    }

    /**
     * 告警规则批量设置解接口
     * */
    public void setTaskRule(Map<String, String> rules){
        JedisClusterPipeline pip = getPipeline();
        for(String table : rules.keySet()){
            String rule = rules.get(table);
            String key = PhyTableConstants.REDIS_RULE_PREFIX + ":" + table;
            pip.set(key, rule);
        }
        pip.sync();
        pip.close();
    }

    /**
     * 告警规则读取接口
     * 如果找不到会返回null
     * */
    public String getTaskRule(String table){
        String key = PhyTableConstants.REDIS_RULE_PREFIX + ":" + table;
        return jedisCluster.get(key);
    }

    /**告警信息批量获取*/
    public Map<String, String> getTaskRule(Set<String> tables){
        JedisClusterPipeline pip = getPipeline();
        Map<String, Response<String>> tmpRes = new HashMap<>();
        for (String table : tables) {
            String redisKey = PhyTableConstants.REDIS_RULE_PREFIX + ":" + table;
            tmpRes.put(table, pip.get(redisKey));
        }
        pip.sync();
        Map<String, String> res = getFromStringResponse(tmpRes);
        pip.close();
        return res;
    }







    //私有方法区
    private Map<String, Map<String, String>> getFromHashResponse(Map<String, Response<Map<String, String>>> tmpRes) {
        Map<String, Map<String, String>> res = new HashMap<>();
        for (String key : tmpRes.keySet()) {
            Map<String, String> map = tmpRes.get(key).get();
            res.put(key, map);
        }
        return res;
    }

    private Map<String, String> getFromStringResponse(Map<String, Response<String>> tmpRes) {
        Map<String, String> res = new HashMap<>();
        for (String key : tmpRes.keySet()) {
            String value = tmpRes.get(key).get();
            res.put(key, value);
        }
        return res;
    }

}
