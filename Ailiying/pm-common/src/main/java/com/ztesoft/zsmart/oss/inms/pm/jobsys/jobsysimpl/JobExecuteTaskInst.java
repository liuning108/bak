package com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl;

import java.net.InetAddress;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.dangdang.ddframe.job.api.ShardingContext;
import com.dangdang.ddframe.job.api.simple.SimpleJob;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.dao.SysJobDaoUtil;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.TimeProcess;
import com.ztesoft.zsmart.oss.inms.pm.schedule.ScheduleJob;
import com.ztesoft.zsmart.oss.inms.pm.schedule.ScheduleServer;

public class JobExecuteTaskInst implements SimpleJob {

    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(JobExecuteTaskInst.class);
    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);
    /**
     * ip <br>
     */
    public String ip = "";

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

            ip = InetAddress.getLocalHost().toString();
            List<TaskInst> listTaskInst = sysJobDaoUtil.getExecuTaskInst(shardingItem);
            // 获取规格参数
            Map<String, TaskParamVer> mapTaskParamVer = sysJobDaoUtil.getMapTaskParamVer();

            addScheduleQueue(listTaskInst, mapTaskParamVer);

        }
        catch (Exception e) {
            logger.error("JobExecuteTaskInst exception[" + e + "]");
        }
        finally {
            logger.info(" ********** finish JobExecuteTaskInst job[" + jobName + "|get pieceSeq = " + shardingItem
                    + " and execute it  ********** ");
        }

    }

    private void addScheduleQueue(List<TaskInst> listTaskInst, Map<String, TaskParamVer> mapTaskParamVer) {
        synchronized (ScheduleServer.getInstance()) {
            if (!ScheduleServer.getInstance().isStarted()) {
                ScheduleServer.getInstance().start();
            }
        }
        for (TaskInst inst : listTaskInst) {
            inst.setMachineNo(ip);
            String classPath = JobProduceSpecInstInfo.mapTaskTypeClass.get(inst.getTaskType());
            if (classPath == null) {
                logger.error("taskID[" + inst.getTaskNo() + "] taskType[" + inst.getTaskType()
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

    private void addScheduleJob(TaskInst inst, TaskParamVer taskParamVer, String classPath) {
        Date date = TimeProcess.getInstance().getStrTime(inst.getTaskExecDate());
        String cron = TimeProcess.getInstance().getCron(date);
        Date now = new Date();
        if (date.before(now)) {
            java.util.Date date1 = TimeProcess.getInstance().getTimeWithIntime(10);
            cron = TimeProcess.getInstance().getCron(date1);
        }
        String specJson = JSONObject.toJSONString(taskParamVer, SerializerFeature.WriteMapNullValue);
        String instJson = JSONObject.toJSONString(inst, SerializerFeature.WriteMapNullValue);

        JobDetail jobDetail = JobBuilder.newJob(ScheduleJob.class).withIdentity(inst.getTaskID(), inst.getTaskNo())
                .build();
        jobDetail.getJobDataMap().put("specJson", specJson);
        jobDetail.getJobDataMap().put("instJson", instJson);
        jobDetail.getJobDataMap().put("classPath", classPath);

        // 更新状态成功再执行后续操作
        if (sysJobDaoUtil.updateOneTaskInst(inst) != 1) return;

        Date exec = ScheduleServer.getInstance().addJob(cron, jobDetail);
        if (exec == null) logger.error("taskNO[" + inst.getTaskNo() + "] taskID[" + inst.getTaskID() + "] cron[" + cron
                + "] addScheduleJob failed");

    }
}
