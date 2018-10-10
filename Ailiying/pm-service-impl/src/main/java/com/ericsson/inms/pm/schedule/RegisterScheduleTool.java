package com.ericsson.inms.pm.schedule;

import java.util.Date;

import com.dangdang.ddframe.job.config.JobCoreConfiguration;
import com.dangdang.ddframe.job.config.JobRootConfiguration;
import com.dangdang.ddframe.job.config.simple.SimpleJobConfiguration;
import com.dangdang.ddframe.job.lite.api.JobScheduler;
import com.dangdang.ddframe.job.lite.config.LiteJobConfiguration;
import com.dangdang.ddframe.job.reg.base.CoordinatorRegistryCenter;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ericsson.inms.pm.schedule.config.ScheduleConf;
import com.ericsson.inms.pm.schedule.config.ScheduleConstant;
import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobAssignTaskInst;
import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobExecuteTaskInst;
import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ericsson.inms.pm.schedule.jobsys.tool.TimeProcess;

/** 
 * [描述] 初始化pm 系统job<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule <br>
 */
public class RegisterScheduleTool {
    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(RegisterScheduleTool.class, "PM");
    /**
     * scheduleConf <br>
     */
    private ScheduleConf scheduleConf = (ScheduleConf) SpringContext.getBean("scheduleConf");

    /**
     * center <br>
     */
    private CoordinatorRegistryCenter center = (CoordinatorRegistryCenter) SpringContext
            .getBean("pmTaskZKRegistryCenter");

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>  <br>
     */
    public RegisterScheduleTool() {
        logger.debug("class obj :" + scheduleConf + "|" + center);
        logger.debug("config :" + scheduleConf.getAssignTaskFrequency() + "|" + scheduleConf.getExecuteTaskFrequency()
                + "|" + scheduleConf.getPieceNum());
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param cron
     * @return  <br>
     */
    private LiteJobConfiguration createJobProduceSpecInstInfoConfiguration(String cron) {
        // 定义作业核心配置
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration
                .newBuilder(ScheduleConstant.jobProduceSpec, cron, 1).failover(true).build();
        // 定义SIMPLE类型配置
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig,
                JobProduceSpecInstInfo.class.getCanonicalName());
        // 定义Lite作业根配置
        JobRootConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig)
                .monitorExecution(true).overwrite(true).build();
        return (LiteJobConfiguration) simpleJobRootConfig;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>  <br>
     */
    public void registerJobProduceSpecInstInfo() {
        logger.info("----------- register JobProduceSpecInstInfo ------------------");
        java.util.Date date = TimeProcess.getInstance().getTimeWithIntime(10);
        String cronTime = TimeProcess.getInstance().getCronDay(date);
        // cronTime = "0 * * * * ? *";
        logger.info("JobProduceSpecInstInfo first run time:" + cronTime);
        new JobScheduler(center, createJobProduceSpecInstInfoConfiguration(cronTime)).init();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param cron
     * @return  <br>
     */
    private LiteJobConfiguration createJobAssignTaskInstConfiguration(String cron) {
        // 定义作业核心配置
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration.newBuilder(ScheduleConstant.jobAssignTask, cron, 1)
                .failover(true).build();
        // 定义SIMPLE类型配置
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig,
                JobAssignTaskInst.class.getCanonicalName());
        // 定义Lite作业根配置
        JobRootConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig)
                .monitorExecution(true).overwrite(true).build();
        return (LiteJobConfiguration) simpleJobRootConfig;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>  <br>
     */
    public void registerJobAssignTaskInst() {
        logger.info("----------- register JobAssignTaskInst ------------------");
        int frequency = scheduleConf.getAssignTaskFrequency();

        if (frequency < 0 || frequency > 60) {
            frequency = 5;
        }
        Date date = TimeProcess.getInstance().getTimeWithIntime(10);
        String cronTime = TimeProcess.getInstance().getCronMin(date, "" + frequency);
        // cronTime = "0 * * * * ? *";
        logger.info("JobAssignTaskInst first run time:" + cronTime);
        new JobScheduler(center, createJobAssignTaskInstConfiguration(cronTime)).init();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param cron
     * @return  <br>
     */
    private LiteJobConfiguration createJobExecuteTaskInstConfiguration(String cron) {
        // 定义作业核心配置
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration
                .newBuilder(ScheduleConstant.jobExecuTask, cron, scheduleConf.getPieceNum()).failover(true).build();
        // 定义SIMPLE类型配置
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig,
                JobExecuteTaskInst.class.getCanonicalName());
        // 定义Lite作业根配置
        JobRootConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig)
                .monitorExecution(true).overwrite(true).build();
        return (LiteJobConfiguration) simpleJobRootConfig;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>  <br>
     */
    public void registerJobExecuteTaskInst() {
        logger.info("----------- register JobExecuteTaskInst ------------------");
        int frequency = scheduleConf.getExecuteTaskFrequency();

        if (frequency < 0 || frequency > 60) {
            frequency = 5;
        }
        Date date = TimeProcess.getInstance().getTimeWithIntime(10);
        String cronTime = TimeProcess.getInstance().getCronMin(date, "" + frequency);
        // cronTime = "0 * * * * ? *";
        logger.info("JobExecuteTaskInst first run time:" + cronTime);
        // cronTime = "0 * * * * ? *";
        new JobScheduler(center, createJobExecuteTaskInstConfiguration(cronTime)).init();
    }

}
