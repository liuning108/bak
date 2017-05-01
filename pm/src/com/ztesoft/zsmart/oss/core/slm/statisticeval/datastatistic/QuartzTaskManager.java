package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

import java.util.HashMap;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;





/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月9日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.datastatistic <br>
 */
public class QuartzTaskManager {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(QuartzTaskManager.class.getName());
    /**
     * schedFact <br>
     */
    private SchedulerFactory schedFact = new org.quartz.impl.StdSchedulerFactory();

    /**
     * [方法描述] 添加一个建表任务<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @param jobMap  
     * @throws SchedulerException <br>
     */ 
    public void addCreatetask(SLMEntyExtInfoTask task, HashMap<String, SLMEntyExtInfoTask> jobMap) throws SchedulerException {
        logger.debug("add create table task[" + task.getjobGroup() + "_" + task.getjobName() + "]");
        logger.debug(task.printJobInfo());

        /* 任务组+任务名称构成唯一任务id */
        jobMap.put(task.getjobGroup() + "_" + task.getjobName(), task);
        CreateTableJob executesqljob = new CreateTableJob();
        JobDetail jobDetail = JobBuilder.newJob(executesqljob.getClass())
                .withIdentity(task.getjobName(), task.getjobGroup()).build();
        jobDetail.getJobDataMap().put("task", task);
        CronTrigger trigger = newTrigger().withIdentity(task.getjobName() + "_trigger", task.getjobGroup() + "_trigger")
                .withSchedule(cronSchedule(task.getcronExpression())).build();
        Scheduler sched = schedFact.getScheduler();
        sched.start();
        sched.scheduleJob(jobDetail, trigger);
    }

    /**
     * [方法描述] 新增一个统计job<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param job 
     * @param jobMap 
     * @throws SchedulerException  E<br>
     */ 
    public void addStatisticJob(SLMBasicStatisticTask job, HashMap<String, SLMBasicStatisticTask> jobMap) throws SchedulerException {
        logger.debug("add Statistic task[" + job.getJobGroup() + "_" + job.getJobName() + "]");
        job.printJobInfo();
        /* 任务组+任务名称构成唯一任务id */
        jobMap.put(job.getJobGroup() + "_" + job.getJobName(), job);
        StatisticTaskExecuteJob executesqljob = new StatisticTaskExecuteJob();
        JobDetail jobDetail = JobBuilder.newJob(executesqljob.getClass())
                .withIdentity(job.getJobName(), job.getJobGroup()).build();
        jobDetail.getJobDataMap().put("task", job);
        CronTrigger trigger = newTrigger().withIdentity(job.getJobName() + "_trigger", job.getJobGroup() + "_trigger")
                .withSchedule(cronSchedule(job.getCronExpression())).build();
        Scheduler sched = schedFact.getScheduler();
        sched.start();
        sched.scheduleJob(jobDetail, trigger);

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobMap 
     * @throws SchedulerException <br>
     */ 
    public void clearCreateTableTask(HashMap<String, SLMEntyExtInfoTask> jobMap) throws SchedulerException {
        // TODO Auto-generated method stub
        for (Entry<String, SLMEntyExtInfoTask> entry : jobMap.entrySet()) {
            JobKey jobKey = JobKey.jobKey(entry.getValue().getjobName(), entry.getValue().getjobGroup());
            Scheduler sched = schedFact.getScheduler();
            // sched.pauseJob(jobKey);
            sched.deleteJob(jobKey);
            logger.info("delete CreateTableTask[" + entry.getValue().getjobGroup() + "_" + entry.getValue().getjobName()
                    + "]");
        }
        jobMap.clear();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobMap 
     * @throws SchedulerException <br>
     */ 
    public void clearBasicStatisticTask(HashMap<String, SLMBasicStatisticTask> jobMap) throws SchedulerException {
        // TODO Auto-generated method stub
        for (Entry<String, SLMBasicStatisticTask> entry : jobMap.entrySet()) {
            JobKey jobKey = JobKey.jobKey(entry.getValue().getJobName(), entry.getValue().getJobGroup());
            Scheduler sched = schedFact.getScheduler();
            // sched.pauseJob(jobKey);
            sched.deleteJob(jobKey);
            logger.info("delete BasicStatisticTask[" + entry.getValue().getJobGroup() + "_"
                    + entry.getValue().getJobName() + "]");
        }
        jobMap.clear();
    }

    /**
     * [方法描述] 手动触发当前jobName<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @throws SchedulerException <br>
     */ 
    public void triggertask(SLMEntyExtInfoTask task) throws SchedulerException {
        JobKey jobKey = JobKey.jobKey(task.getjobName(), task.getjobGroup());
        Scheduler sched = schedFact.getScheduler();
        sched.triggerJob(jobKey);
        logger.info("active trigger task[" + task.getjobGroup() + "_" + task.getjobName() + "]");
    }

    /**
     * [方法描述] 移除一个任务 <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobName <br>
     */ 
    public static void removeJob(String jobName) {

    }
}
