package com.ztesoft.zsmart.oss.inms.pm.schedule;

import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.TriggerBuilder.newTrigger;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerKey;
import org.quartz.impl.StdSchedulerFactory;

/**
 * [描述] schedule tool base  method impl<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.schedule <br>
 */
public class ScheduleServer {

    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(ScheduleServer.class);

    /**
     * ScheduleServer <br>
     */
    private final static ScheduleServer ScheduleServer = new ScheduleServer();

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public static ScheduleServer getInstance() {
        return ScheduleServer;
    }

    /**
     * scheduler <br>
     */
    private Scheduler scheduler = null;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public Scheduler getScheduler() {
        return scheduler;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br> <br>
     */
    public void start() {
        try {
            this.scheduler = new StdSchedulerFactory().getScheduler();
            this.scheduler.start();
            logger.info("ScheduleServer start success .");
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer start exception [" + e + "]");
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public boolean isStarted() {
        try {
            if (this.scheduler == null) return false;
            return this.scheduler.isStarted();
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer isStarted exception [" + e + "]");
            return false;
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public boolean isShutDown() {
        try {
            return this.scheduler.isShutdown();
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer isShutdown exception [" + e + "]");
            return false;
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param cronExpression
     * @param jobDetail
     * @return  <br>
     */ 
    public Date addJob(String cronExpression, JobDetail jobDetail) {
        String jobName = jobDetail.getKey().getName();
        String jobGroup = jobDetail.getKey().getGroup();
        CronTrigger trigger = newTrigger().withIdentity(jobName, jobGroup).withSchedule(cronSchedule(cronExpression))
                .build();
        try {
            Date date = this.scheduler.scheduleJob(jobDetail, trigger);
            return date;
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer addJob job[" + jobName + "." + jobGroup + "] cron[" + cronExpression
                    + "] exception [" + e + "]");
            return null;
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param jobName
     * @param jobGroup <br>
     */
    public void pauseJob(String jobName, String jobGroup) {
        try {
            JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
            this.scheduler.pauseJob(jobKey);
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer pauseJob job[" + jobName + "." + jobGroup + "] exception [" + e + "]");
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param jobName
     * @param jobGroup <br>
     */
    public void resumeJob(String jobName, String jobGroup) {
        try {
            JobKey jobKey = JobKey.jobKey(jobName, jobGroup);
            this.scheduler.resumeJob(jobKey);
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer resumeJob job[" + jobName + "." + jobGroup + "] exception [" + e + "]");
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param jobName
     * @param jobGroup
     * @return <br>
     */
    public boolean deleteJob(String jobName, String jobGroup) {
        try {
            TriggerKey triggerKey = TriggerKey.triggerKey(jobName, jobGroup);
            scheduler.pauseTrigger(triggerKey);
            scheduler.unscheduleJob(triggerKey);
            JobKey jobKey = new JobKey(jobName, jobGroup);
            return scheduler.deleteJob(jobKey);
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer deleteJob job[" + jobName + "." + jobGroup + "] exception [" + e + "]");
            return false;
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param jobName
     * @param jobGroup <br>
     */
    public void pauseTrigger(String jobName, String jobGroup) {
        try {
            TriggerKey triggerKey = new TriggerKey(jobName, jobGroup);
            this.scheduler.pauseTrigger(triggerKey);
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer pauseTrigger job[" + jobName + "." + jobGroup + "] exception [" + e + "]");
        }

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param jobName
     * @param jobGroup <br>
     */
    public void resumeTrigger(String jobName, String jobGroup) {
        try {
            TriggerKey triggerKey = new TriggerKey(jobName, jobGroup);
            this.scheduler.resumeTrigger(triggerKey);
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer resumeTrigger job[" + jobName + "." + jobGroup + "] exception [" + e + "]");
        }

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param jobName
     * @param jobGroup
     * @return <br>
     */
    public boolean removeTrigger(String jobName, String jobGroup) {
        try {
            TriggerKey triggerKey = new TriggerKey(jobName, jobGroup);
            this.scheduler.pauseTrigger(triggerKey);
            return this.scheduler.unscheduleJob(triggerKey);
        }
        catch (SchedulerException e) {
            logger.error("ScheduleServer removeTrigger job[" + jobName + "." + jobGroup + "] exception [" + e + "]");
            return false;
        }
    }

}
