package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.trigger;

import java.util.Date;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.quartz.impl.StdSchedulerFactory;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliTaskTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job.SystemGenerateJob;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * [任务管理类] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年8月15日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.trigger <br>
 */
public final class SchedulerServer {
    /**
     * logger <br>
     */
    private static final Logger logger = Logger.getLogger(SchedulerServer.class);

    /**
     * firstFlag <br>
     */
    public static int firstFlag = 0;

    /**
     * calCycle <br>
     */
    public static String calCycle = "00";

    /**
     * week <br>
     */
    public static int week = 0;

    /**
     * mon <br>
     */
    public static int mon = 0;

    /**
     * scheduler <br>
     */
    private Scheduler scheduler = null;

    /**
     * dt <br>
     */
    Date dt = new Date();

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public Scheduler getScheduler() {
        return scheduler;
    }

    /**
     * 构造函数
     */
    private SchedulerServer() {
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static SchedulerServer getInstance() {
        return SingleTon.GAMESCH;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @throws SchedulerException <br>
     */
    public void startTimerTask() throws SchedulerException {
        try {
            SchedulerFactory schedulerFactory = new StdSchedulerFactory();
            this.scheduler = schedulerFactory.getScheduler();
            this.scheduler.start();
        }
        catch (SchedulerException e) {
            logger.error("GameTaskServer start error", e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws SchedulerException <br>
     */
    public boolean isStartTimerTisk() throws SchedulerException {
        return this.scheduler.isStarted();
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws SchedulerException <br>
     */
    public boolean isShutDownTimerTisk() throws SchedulerException {
        return this.scheduler.isShutdown();
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     * @param groupName <br>
     * @param time <br>
     * @param jobClass <br>
     */
    public void addSysJob(String name, String groupName, String time, Class<? extends Job> jobClass) {

        logger.info("3.step------- SysJob started -------------------");
        try {
            JobBuilder jbulid = JobBuilder.newJob(jobClass).withIdentity("job_" + name, groupName);
            JobDetail jobDetail = jbulid.build();

            CronScheduleBuilder cronSch = CronScheduleBuilder.cronSchedule(time);
            TriggerBuilder<CronTrigger> triggerBulid = TriggerBuilder.newTrigger().withIdentity("trigger_" + name, groupName).withSchedule(cronSch);

            CronTrigger trigger = triggerBulid.build();
            dt = this.scheduler.scheduleJob(jobDetail, trigger);
            logger.info(jobDetail.getKey() + " will run at: " + dt);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     * @param groupName <br>
     * @param time <br>
     * @param jobClass <br>
     */
    public void addGenerateJob(String name, String groupName, String time, Class<SystemGenerateJob> jobClass) {
        try {
            JobBuilder jbulid = JobBuilder.newJob(jobClass).withIdentity("job_" + name, groupName);
            JobDetail jobDetail = jbulid.build();

            CronScheduleBuilder cronSch = CronScheduleBuilder.cronSchedule(time);
            TriggerBuilder<CronTrigger> triggerBulid = TriggerBuilder.newTrigger().withIdentity("trigger_" + name, groupName).withSchedule(cronSch);

            CronTrigger trigger = triggerBulid.build();
            dt = this.scheduler.scheduleJob(jobDetail, trigger);
            logger.info(jobDetail.getKey() + " will run at: " + dt);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     * @param groupName <br>
     * @param time <br>
     * @param jobClass <br>
     */
    public void addSlaMaxJob(String name, String groupName, String time, Class<? extends Job> jobClass) {
        logger.info("sla job is started: ");

        JobBuilder jbulid = JobBuilder.newJob(jobClass).withIdentity("slaJob_" + name, groupName);
        JobDetail jobDetail = jbulid.build();

        CronScheduleBuilder cronSch = CronScheduleBuilder.cronSchedule(time);
        TriggerBuilder<CronTrigger> triggerBulid = TriggerBuilder.newTrigger().withIdentity("slaTrigger_" + name, groupName).withSchedule(cronSch);

        CronTrigger trigger = triggerBulid.build();
        try {
            dt = this.scheduler.scheduleJob(jobDetail, trigger);
        }
        catch (SchedulerException e) {
            // TODO Auto-generated catch block <br>
            logger.error(e.toString());
        }
        logger.info("---------------SYS JOD GET MAX DATA -------------" + jobDetail.getKey() + " will run at: " + dt + "---------------------");
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     * @param groupName <br>
     * @param time <br>
     * @param jobClass <br>
     * @param dataMap <br>
     */
    public void addSingleSliJob(String name, String groupName, String time, Class<? extends Job> jobClass, HashMap<String, String> dataMap) {
        try {
            JobBuilder jbulid = JobBuilder.newJob(jobClass).withIdentity("sliJob_" + name, groupName);
            JobDetail jobDetail = jbulid.build();

            CronScheduleBuilder cronSch = CronScheduleBuilder.cronSchedule(time);
            TriggerBuilder<CronTrigger> triggerBulid = TriggerBuilder.newTrigger().withIdentity("sliTrigger_" + name, groupName)
                .withSchedule(cronSch);

            CronTrigger trigger = triggerBulid.build();
            jobDetail.getJobDataMap().put("taskId", dataMap.get("taskid".toUpperCase()));
            jobDetail.getJobDataMap().put("btime", dataMap.get("btime".toUpperCase()));
            jobDetail.getJobDataMap().put("etime", dataMap.get("etime".toUpperCase()));
            jobDetail.getJobDataMap().put("slaInstId", dataMap.get("sla_instid".toUpperCase()));
            jobDetail.getJobDataMap().put("sloInstId", dataMap.get("slo_instid".toUpperCase()));
            jobDetail.getJobDataMap().put("sliInstId", dataMap.get("sli_instid".toUpperCase()));
            jobDetail.getJobDataMap().put("stTable", dataMap.get("st_table".toUpperCase()));
            jobDetail.getJobDataMap().put("taskType", dataMap.get("task_type".toUpperCase()));
            jobDetail.getJobDataMap().put("sloNo", dataMap.get("sli_no".toUpperCase()));
            jobDetail.getJobDataMap().put("evaluateCycle", dataMap.get("evaluate_cycle".toUpperCase()));
            jobDetail.getJobDataMap().put("warnValue", dataMap.get("warn_value".toUpperCase()));
            jobDetail.getJobDataMap().put("objValue", dataMap.get("objectives_value".toUpperCase()));
            jobDetail.getJobDataMap().put("stTable", dataMap.get("st_table".toUpperCase()));
            jobDetail.getJobDataMap().put("operator", dataMap.get("operator".toUpperCase()));

            jobDetail.getJobDataMap().put("timepattern_id", dataMap.get("timepattern_id".toUpperCase()));
            jobDetail.getJobDataMap().put("daypattern_id", dataMap.get("daypattern_id".toUpperCase()));
            Session ses = null;
            SliTaskTableDAO slitask = (SliTaskTableDAO) GeneralDAOFactory.create(SliTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
            try {
                ses = SessionContext.newSession();
                ses.beginTrans();
                // insert into sliT1/sloT1/slaT1
                slitask.updateTaskState(dataMap.get("taskid".toUpperCase()));
                ses.commitTrans();

            }
            catch (BaseAppException e) {
                logger.error("execute StatisticTaskExecuteJob error!", e);
            }
            finally {
                if (ses != null) {
                    try {
                        ses.releaseTrans();
                    }
                    catch (BaseAppException e) {
                        // TODO Auto-generated catch block
                        logger.error(e.toString());
                    }
                }
            }

            logger.debug("datainfo.objValue: " + dataMap.get("objectives_value".toUpperCase()));
            logger.debug("datainfo.warnValue: " + dataMap.get("warn_value".toUpperCase()));
            logger.debug("datainfo.timepattern_id: " + dataMap.get("timepattern_id".toUpperCase()));
            logger.debug("datainfo.daypattern_id: " + dataMap.get("daypattern_id".toUpperCase()));

            dt = this.scheduler.scheduleJob(jobDetail, trigger);
            logger.info("----------------add SLI taskId is : " + dataMap.get("taskId".toUpperCase()) + "--------------------------");
            logger.info("---------------- SLI TASK : " + jobDetail.getKey() + " will run at: " + dt);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     * @param groupName <br>
     * @param time <br>
     * @param jobClass <br>
     * @param dataMap <br>
     */
    public void addSingleSloJob(String name, String groupName, String time, Class<? extends Job> jobClass, HashMap<String, String> dataMap) {
        try {
            JobBuilder jbulid = JobBuilder.newJob(jobClass).withIdentity("sloJob_" + name, groupName);
            JobDetail jobDetail = jbulid.build();

            CronScheduleBuilder cronSch = CronScheduleBuilder.cronSchedule(time);
            TriggerBuilder<CronTrigger> triggerBulid = TriggerBuilder.newTrigger().withIdentity("sloTrigger_" + name, groupName)
                .withSchedule(cronSch);

            CronTrigger trigger = triggerBulid.build();
            jobDetail.getJobDataMap().put("taskId", dataMap.get("taskid".toUpperCase()));
            jobDetail.getJobDataMap().put("btime", dataMap.get("btime".toUpperCase()));
            jobDetail.getJobDataMap().put("etime", dataMap.get("etime".toUpperCase()));
            jobDetail.getJobDataMap().put("slaInstId", dataMap.get("sla_instid".toUpperCase()));
            jobDetail.getJobDataMap().put("sloInstId", dataMap.get("slo_instid".toUpperCase()));
            jobDetail.getJobDataMap().put("sliInstId", dataMap.get("sli_instid".toUpperCase()));
            jobDetail.getJobDataMap().put("taskType", dataMap.get("task_type".toUpperCase()));

            logger.debug("taskid is: " + dataMap.get("taskid".toUpperCase()));
            logger.debug("task_type is: " + dataMap.get("task_type".toUpperCase()));
            dt = this.scheduler.scheduleJob(jobDetail, trigger);
            logger.info("----------------add SLO taskId is : " + dataMap.get("taskId".toUpperCase()) + "--------------------------");
            logger.info("---------------- SLo TASK : " + jobDetail.getKey() + " will run at: " + dt);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobName <br>
     * @param taskGroup <br>
     * @throws SchedulerException <br>
     */
    public void pauseJob(String jobName, String taskGroup) throws SchedulerException {
        try {
            JobKey jobKey = JobKey.jobKey(jobName, taskGroup);
            this.scheduler.pauseJob(jobKey);
        }
        catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskName <br>
     * @param groupName <br>
     * @throws SchedulerException <br>
     */
    public void resumeJob(String taskName, String groupName) throws SchedulerException {
        try {
            this.scheduler.resumeTrigger(new TriggerKey(taskName, groupName));
        }
        catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskName <br>
     * @param taskGroup <br>
     * @return <br>
     * @throws SchedulerException <br>
     */
    public boolean deleteJob(String taskName, String taskGroup) throws SchedulerException {
        try {
            TriggerKey tk = TriggerKey.triggerKey(taskName, taskGroup);
            scheduler.pauseTrigger(tk);
            scheduler.unscheduleJob(tk);
            JobKey jobKey = new JobKey(taskName, taskGroup);
            return scheduler.deleteJob(jobKey);
        }
        catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param triggerName <br>
     * @param taskGroup <br>
     * @throws SchedulerException <br>
     */
    public void pauseTrigger(String triggerName, String taskGroup) throws SchedulerException {
        try {
            TriggerKey triggerKey = new TriggerKey(triggerName, taskGroup);
            this.scheduler.pauseTrigger(triggerKey);
        }
        catch (SchedulerException e) {
            throw new RuntimeException(e);
        }

    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param triggerName <br>
     * @param taskGroup <br>
     * @throws SchedulerException <br>
     */
    public void resumeTrigger(String triggerName, String taskGroup) throws SchedulerException {
        try {
            TriggerKey triggerKey = new TriggerKey(triggerName, taskGroup);
            this.scheduler.resumeTrigger(triggerKey);
        }
        catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param triggerName <br>
     * @param taskGroup <br>
     * @return <br>
     */
    public boolean removeTrigger(String triggerName, String taskGroup) {
        try {
            TriggerKey triggerKey = new TriggerKey(triggerName, taskGroup);
            this.scheduler.pauseTrigger(triggerKey);
            return this.scheduler.unscheduleJob(triggerKey);
        }
        catch (SchedulerException e) {
            logger.error(e.toString());
            return false;
        }
    }

    /**
     * [描述].
     * 
     * @author [作者名]<br>
     * @version 1.0<br>
     * @taskId <br>
     * @CreateDate 2016年9月26日 <br>
     * @since V7.0<br>
     * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.trigger <br>
     */
    private static final class SingleTon {
        /**
         * . GAMESCH <br>
         */
        private static final SchedulerServer GAMESCH = new SchedulerServer();
    }

}
