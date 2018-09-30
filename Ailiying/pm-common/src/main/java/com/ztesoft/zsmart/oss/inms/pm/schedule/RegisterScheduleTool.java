package com.ztesoft.zsmart.oss.inms.pm.schedule;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dangdang.ddframe.job.config.JobCoreConfiguration;
import com.dangdang.ddframe.job.config.JobRootConfiguration;
import com.dangdang.ddframe.job.config.simple.SimpleJobConfiguration;
import com.dangdang.ddframe.job.lite.api.JobScheduler;
import com.dangdang.ddframe.job.lite.config.LiteJobConfiguration;
import com.dangdang.ddframe.job.reg.base.CoordinatorRegistryCenter;
import com.dangdang.ddframe.job.reg.zookeeper.ZookeeperConfiguration;
import com.dangdang.ddframe.job.reg.zookeeper.ZookeeperRegistryCenter;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl.JobAssignTaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl.JobExecuteTaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.PublicConstant;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.TimeProcess;

/** 
 * [描述] 初始化pm 系统job<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.schedule <br>
 */
public class RegisterScheduleTool {
    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(RegisterScheduleTool.class);

    private CoordinatorRegistryCenter createRegistryCenter() {
        CoordinatorRegistryCenter regCenter = new ZookeeperRegistryCenter(
                new ZookeeperConfiguration(PublicConstant.zookeeperCon, PublicConstant.registerNameSpace));
        regCenter.init();
        return regCenter;
    }

    private LiteJobConfiguration createJobProduceSpecInstInfoConfiguration(String cron) {
        // 定义作业核心配置
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration.newBuilder("JobProduceSpecInstInfo", cron, 1)
                .failover(true).build();
        // 定义SIMPLE类型配置
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig,
                JobProduceSpecInstInfo.class.getCanonicalName());
        // 定义Lite作业根配置
        JobRootConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig)
                .monitorExecution(true).overwrite(true).build();
        return (LiteJobConfiguration) simpleJobRootConfig;
    }

    public void registerJobProduceSpecInstInfo() {
        logger.info("----------- register JobProduceSpecInstInfo ------------------");
        java.util.Date date = TimeProcess.getInstance().getTimeWithIntime(10);
        String cronTime = TimeProcess.getInstance().getCronDay(date);
        // cronTime = "0 * * * * ? *";
        logger.info("JobProduceSpecInstInfo first run time:" + cronTime);
        new JobScheduler(createRegistryCenter(), createJobProduceSpecInstInfoConfiguration(cronTime)).init();
    }

    private LiteJobConfiguration createJobAssignTaskInstConfiguration(String cron) {
        // 定义作业核心配置
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration.newBuilder("JobAssignTaskInst", cron, 1)
                .failover(true).build();
        // 定义SIMPLE类型配置
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig,
                JobAssignTaskInst.class.getCanonicalName());
        // 定义Lite作业根配置
        JobRootConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig)
                .monitorExecution(true).overwrite(true).build();
        return (LiteJobConfiguration) simpleJobRootConfig;
    }

    public void registerJobAssignTaskInst() {
        logger.info("----------- register JobAssignTaskInst ------------------");
        int frequency = PublicConstant.assignTaskFrequency;

        if (frequency < 0 || frequency > 60) {
            frequency = 5;
        }
        Date date = TimeProcess.getInstance().getTimeWithIntime(10);
        String cronTime = TimeProcess.getInstance().getCronMin(date, "" + frequency);
        // cronTime = "0 * * * * ? *";
        logger.info("JobAssignTaskInst first run time:" + cronTime);
        new JobScheduler(createRegistryCenter(), createJobAssignTaskInstConfiguration(cronTime)).init();
    }

    private LiteJobConfiguration createJobExecuteTaskInstConfiguration(String cron) {
        // 定义作业核心配置
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration
                .newBuilder("JobExecuteTaskInst", cron, PublicConstant.pieceNum).failover(true).build();
        // 定义SIMPLE类型配置
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig,
                JobExecuteTaskInst.class.getCanonicalName());
        // 定义Lite作业根配置
        JobRootConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig)
                .monitorExecution(true).overwrite(true).build();
        return (LiteJobConfiguration) simpleJobRootConfig;
    }

    public void registerJobExecuteTaskInst() {
        logger.info("----------- register JobExecuteTaskInst ------------------");
        int frequency = PublicConstant.assignTaskFrequency;

        if (frequency < 0 || frequency > 60) {
            frequency = 5;
        }
        Date date = TimeProcess.getInstance().getTimeWithIntime(10);
        String cronTime = TimeProcess.getInstance().getCronMin(date, "" + frequency);
        // cronTime = "0 * * * * ? *";
        logger.info("JobExecuteTaskInst first run time:" + cronTime);
        // cronTime = "0 * * * * ? *";
        new JobScheduler(createRegistryCenter(), createJobExecuteTaskInstConfiguration(cronTime)).init();
    }

}
