package com.ericsson.inms.pm.schedule.jobsys.jobsysimpl;

import java.net.InetAddress;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.dangdang.ddframe.job.api.ShardingContext;
import com.dangdang.ddframe.job.api.simple.SimpleJob;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDaoUtil;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.schedule.jobsys.tool.TimeProcess;
import com.ericsson.inms.pm.schedule.ScheduleJob;
import com.ericsson.inms.pm.schedule.ScheduleServer;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.jobsys.jobsysimpl <br>
 */
public class JobExecuteTaskInst implements SimpleJob {

    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(JobExecuteTaskInst.class, "PM");
    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);
    /**
     * ip <br>
     */
    public String ip = "";

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param arg0 <br>
     */
    @Override
    public void execute(ShardingContext arg0) {
        String jobName = arg0.getJobName();
        int shardingItem = arg0.getShardingItem();
        logger.info(" ********** begin JobExecuteTaskInst job[" + jobName + "| get pieceSeq = " + shardingItem
                + " and execute it  ********** ");

        try {
            // 扫描注册中心
            synchronized (JobProduceSpecInstInfo.mapTaskTypeClass) {
                if (JobProduceSpecInstInfo.mapTaskTypeClass.size() == 0) sysJobDaoUtil.getJobRegisterInfo();
            }

            ip = InetAddress.getLocalHost().getHostAddress().toString();
            // 获取规格参数
            Map<String, TaskParamVer> mapTaskParamVer = sysJobDaoUtil.getMapTaskParamVer();

            List<TaskInst> listTaskInst = sysJobDaoUtil.getExecuTaskInst(shardingItem, ip);

            addScheduleQueue(listTaskInst, mapTaskParamVer);

        }
        catch (Exception e) {
            logger.error("SCHEDU-E-001", "JobExecuteTaskInst exception:", e);
        }
        finally {
            logger.info(" ********** finish JobExecuteTaskInst job[" + jobName + "|get pieceSeq = " + shardingItem
                    + " and execute it  ********** \n");
        }

    }

    public void executeTaskID (String taskID) {
        logger.info(" ********** begin JobExecuteTaskInst taskID [" + taskID + "] and execute it  ********** ");

        try {
            // 扫描注册中心
            synchronized (JobProduceSpecInstInfo.mapTaskTypeClass) {
                if (JobProduceSpecInstInfo.mapTaskTypeClass.size() == 0) sysJobDaoUtil.getJobRegisterInfo();
            }

            ip = InetAddress.getLocalHost().getHostAddress().toString();

            // 获取规格参数
            Map<String, TaskParamVer> mapTaskParamVer = sysJobDaoUtil.getMapTaskParamVer();

            List<TaskInst> listTaskInst = sysJobDaoUtil.getExecuTaskInstByTaskID(taskID, ip);
System.err.println(taskID + "--list size:" + listTaskInst.size());
            addScheduleQueue(listTaskInst, mapTaskParamVer);

        }
        catch (Exception e) {
            logger.error("SCHEDU-E-001", "JobExecuteTaskInst exception:", e);
        }
        finally {
            logger.info(" ********** finish JobExecuteTaskInst taskID[" + taskID + "] and execute it  ********** \n");
        }

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst
     * @param mapTaskParamVer  <br>
     */
    private void addScheduleQueue(List<TaskInst> listTaskInst, Map<String, TaskParamVer> mapTaskParamVer) {
        synchronized (ScheduleServer.getInstance()) {
            if (!ScheduleServer.getInstance().isStarted()) {
                ScheduleServer.getInstance().start();
            }
        }
        for (TaskInst inst : listTaskInst) {
            String classPath = JobProduceSpecInstInfo.mapTaskTypeClass.get(inst.getTaskType());
            if (classPath == null) {
                logger.error("SCHEDU-E-001", "taskID[" + inst.getTaskNo() + "] taskType[" + inst.getTaskType()
                        + "] can not find task classPath regiter info");
                inst.setTaskState("3");
                inst.setTaskExceptInfo("can not find task classPath regiter info");
                sysJobDaoUtil.updateOneTaskInst(inst);
                continue;
            }

            TaskParamVer taskParamVer = mapTaskParamVer.get(inst.getTaskNo() + inst.getTaskNoVer());
            addScheduleJob(inst, (taskParamVer == null) ? new TaskParamVer() : taskParamVer, classPath);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param inst
     * @param taskParamVer
     * @param classPath  <br>
     */
    private void addScheduleJob(TaskInst inst, TaskParamVer taskParamVer, String classPath) {
        Date date = TimeProcess.getInstance().getStrTime(inst.getTaskExecDate());
        String cron = TimeProcess.getInstance().getCron(date);
        Date now = new Date();
        if (date.before(now)) {
            java.util.Date date1 = TimeProcess.getInstance().getTimeWithIntime(10);
            cron = TimeProcess.getInstance().getCron(date1);
        }

        JobDetail jobDetail = JobBuilder.newJob(ScheduleJob.class).withIdentity(inst.getTaskID(), inst.getTaskNo())
                .build();
        jobDetail.getJobDataMap().put("TaskParamVer", taskParamVer);
        jobDetail.getJobDataMap().put("TaskInst", inst);
        jobDetail.getJobDataMap().put("classPath", classPath);

        Date exec = ScheduleServer.getInstance().addJob(cron, jobDetail);
        if (exec == null) {
            logger.error("SCHEDU-E-001", "taskNO[" + inst.getTaskNo() + "] taskID[" + inst.getTaskID() + "] cron[" + cron
                    + "] addScheduleJob failed");
            inst.setTaskState("3");
            inst.setTaskExceptInfo("addScheduleJob failed. please check log ERROR");
            sysJobDaoUtil.updateOneTaskInst(inst);
        }
        ;

    }
}
