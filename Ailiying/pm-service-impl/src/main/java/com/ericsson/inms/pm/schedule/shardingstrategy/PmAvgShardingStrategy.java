package com.ericsson.inms.pm.schedule.shardingstrategy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.dangdang.ddframe.job.lite.api.strategy.JobInstance;
import com.dangdang.ddframe.job.lite.api.strategy.JobShardingStrategy;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.shardingstrategy <br>
 */
public class PmAvgShardingStrategy implements JobShardingStrategy {
    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(PmAvgShardingStrategy.class, "PM");

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param arg0
     * @param arg1
     * @param arg2
     * @return <br>
     */
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