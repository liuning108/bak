package com.ztesoft.zsmart.oss.inms.pm.schedule.shardingstrategy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dangdang.ddframe.job.lite.api.strategy.JobInstance;
import com.dangdang.ddframe.job.lite.api.strategy.JobShardingStrategy;

public class PmAvgShardingStrategy implements JobShardingStrategy {
    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(PmAvgShardingStrategy.class);

    @Override
    public Map<JobInstance, List<Integer>> sharding(List<JobInstance> arg0, String arg1, int arg2) {
        logger.info("PmAvgShardingStrategy execute :" + arg0.size() + "|" + arg1 + "|" + arg2);
        Map<JobInstance, List<Integer>> result = new HashMap<JobInstance, List<Integer>>();
        for (int i = 0; i < arg0.size(); i++) {
            List<Integer> a = new ArrayList<Integer>();
            a.add(i);
            result.put(arg0.get(i), a);
        }

        for (Entry<JobInstance, List<Integer>> en : result.entrySet()) {
            String r = en.getKey().getIp() + " ==> ";
            for (Integer ret : en.getValue())
                r = "" + ret + "|";
            logger.info("PmAvgShardingStrategy result :" + r);
        }

        return result;
    }
}