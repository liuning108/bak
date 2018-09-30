package com.ztesoft.zsmart.oss.inms.pm.schedule;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.dao.SysJobDaoUtil;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.JobResult;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.tool.TimeProcess;

public class ScheduleJob implements Job {
    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(ScheduleJob.class);
    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        int cnt = 0;
        String specJson = (String) context.getJobDetail().getJobDataMap().get("specJson");
        String instJson = (String) context.getJobDetail().getJobDataMap().get("instJson");
        String classPath = (String) context.getJobDetail().getJobDataMap().get("classPath");
        TaskParamVer taskParamVer = (TaskParamVer) JSON.parseObject(specJson, TaskParamVer.class);
        TaskInst taskInst = (TaskInst) JSON.parseObject(instJson, TaskInst.class);
        try {
            logger.info("begin execute task taskID.taskNo[" + taskInst.getTaskID() + "." + taskInst.getTaskNo() + "]");
            Date btime = new Date();
            taskInst.setTaskExecDate(TimeProcess.getInstance().getTimeStr(btime));

            JobResult result = invokeMethod(taskParamVer, taskInst, classPath);
            taskInst.setTaskState(result.getState());
            Date etime = new Date();
            taskInst.setTaskFinishDate(TimeProcess.getInstance().getTimeStr(etime));
            taskInst.setTaskExceptInfo(result.getCause());
            taskInst.setTaskExecDuration((etime.getTime() - btime.getTime()) / 1000);
            taskInst.setTaskExecTimes(taskInst.getTaskExecTimes() + 1);
        }
        catch (Exception e) {
            logger.error("execute task taskID.taskNo[" + taskInst.getTaskID() + "." + taskInst.getTaskNo()
                    + "] exception:" + e);
            taskInst.setTaskState("3");
            Date etime = new Date();
            taskInst.setTaskFinishDate(TimeProcess.getInstance().getTimeStr(etime));
            if(e.toString().length() > 3500) taskInst.setTaskExceptInfo(e.toString().substring(0, 3500));
            taskInst.setTaskExceptInfo(e.toString());
            //taskInst.setTaskExecDuration((etime.getTime() - btime.getTime()) / 1000);
            taskInst.setTaskExecTimes(taskInst.getTaskExecTimes() + 1);
        }
        finally {
            cnt = sysJobDaoUtil.updateAfterExecuTaskInst(taskInst);
            logger.info("finish execute task taskID.taskNo[" + taskInst.getTaskID() + "." + taskInst.getTaskNo()
                    + "] cnt:" + cnt);
        }

    }

    private JobResult invokeMethod(TaskParamVer taskParamVer, TaskInst taskInst, String classpath) {
        JobResult result = new JobResult();
        try {
            Class<?> clazz = Class.forName(classpath);
            @SuppressWarnings("rawtypes")
            Class[] argsClass = new Class[2];
            argsClass[0] = TaskParamVer.class;
            argsClass[1] = TaskInst.class;
            Method method = clazz.getMethod("executeJob", argsClass);
            result = (JobResult) method.invoke(clazz.newInstance(), taskParamVer, taskInst);
            if (result == null) {
                logger.warn("classpath[" + classpath + "] return JobResult null");
                result = new JobResult();
            }
        }
        catch (ClassNotFoundException e) {
            logger.error("invokeMethod class[" + classpath + "] ClassNotFoundException:" + e);
        }
        catch (SecurityException e) {
            logger.error("invokeMethod class[" + classpath + "] SecurityException:" + e);
        }
        catch (NoSuchMethodException e) {
            logger.error("invokeMethod class[" + classpath + "] NoSuchMethodException:" + e);
        }
        catch (IllegalArgumentException e) {
            logger.error("invokeMethod class[" + classpath + "] IllegalArgumentException:" + e);
        }
        catch (IllegalAccessException e) {
            logger.error("invokeMethod class[" + classpath + "] IllegalAccessException:" + e);
        }
        catch (InvocationTargetException e) {
            logger.error("invokeMethod class[" + classpath + "] InvocationTargetException:" + e);
            Throwable t = e.getTargetException();
            logger.error("invokeMethod class[" + classpath + "] Throwable:" + t);
        }
        catch (InstantiationException e) {
            logger.error("invokeMethod class[" + classpath + "] InstantiationException:" + e);
        }
        return result;
    }
}
