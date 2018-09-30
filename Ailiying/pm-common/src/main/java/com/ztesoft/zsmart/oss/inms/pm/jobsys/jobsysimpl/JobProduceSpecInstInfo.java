package com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dangdang.ddframe.job.api.ShardingContext;
import com.dangdang.ddframe.job.api.simple.SimpleJob;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.dao.SysJobDaoUtil;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.ProduceInstParam;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.ProduceSpecParam;

/** 
 * [描述] 依次获取各个task_no 的规格参数和实例参数, 默认一天执行一次<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.job.sysJob <br>
 */
public class JobProduceSpecInstInfo implements SimpleJob {

    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(JobProduceSpecInstInfo.class);

    /**
     * mapTaskTypeClass 保存注册中心信息到内存里，一段时间随着该job更新一次<br>
     */
    public static Map<String, String> mapTaskTypeClass = new HashMap<String, String>();

    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    @Override
    public void execute(ShardingContext arg0) {
        String jobName = arg0.getJobName();
        String taskId = arg0.getTaskId();
        int shardingItem = arg0.getShardingItem();
        logger.info(" ********** begin JobProduceSpecInstInfo job[" + jobName + "|" + shardingItem + "|" + taskId
                + "] ********** ");
        try {
            // 扫描注册中心
            synchronized (mapTaskTypeClass) {
                sysJobDaoUtil.getJobRegisterInfo();
            }
            // 所有任务调度基本信息
            List<Map<String, Object>> taskNoList = sysJobDaoUtil.getValidTaskNoScheduleInfo();

            // 有效的taskNo - key = taskNo+taskNoVer value=TaskParamVer
            Map<String, TaskParamVer> mapTaskParamVer = new HashMap<String, TaskParamVer>();

            // 规格参数生成入库，回填listTaskParamVer 中其他信息,剔除taskNoList中无效taskNo信息
            new ProduceSpecParam().produceAllSpecParam(mapTaskParamVer, taskNoList);

            // 实例参数生成入库
            new ProduceInstParam().produceAllInstParam(mapTaskParamVer, taskNoList);
        }
        catch (Exception e) {
            logger.error("JobProduceSpecInstInfo exception[" + e + "]");
        }
        finally {
            logger.info(" ********** finish JobProduceSpecInstInfo job[" + jobName + "|" + shardingItem + "|" + taskId
                    + "] ********** ");
        }
    }

}
