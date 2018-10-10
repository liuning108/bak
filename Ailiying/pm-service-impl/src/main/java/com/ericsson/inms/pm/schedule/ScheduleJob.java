package com.ericsson.inms.pm.schedule;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDaoUtil;
import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.schedule.jobsys.tool.TimeProcess;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule <br>
 */
public class ScheduleJob implements Job {
    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(ScheduleJob.class, "PM");
    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param context
     * @throws JobExecutionException <br>
     */
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        TaskParamVer taskParamVer = (TaskParamVer) context.getJobDetail().getJobDataMap().get("TaskParamVer");
        TaskInst taskInst = (TaskInst) context.getJobDetail().getJobDataMap().get("TaskInst");
        String classPath = (String) context.getJobDetail().getJobDataMap().get("classPath");
        try {
            logger.info(" >>>>>>>> begin execute task taskNo.taskID[" + taskInst.getTaskNo() + "."
                    + taskInst.getTaskID() + "]");
            Date btime = new Date();
            taskInst.setTaskExecDate(TimeProcess.getInstance().getTimeStr(btime));

            JobResult result = invokeMethod(taskParamVer, taskInst, classPath);

            taskInst.setTaskState(result.getState());
            Date etime = new Date();
            taskInst.setTaskFinishDate(TimeProcess.getInstance().getTimeStr(etime));
            if (result.toString().length() > 3500) taskInst.setTaskExceptInfo(result.toString().substring(0, 3500));
            taskInst.setTaskExceptInfo(result.getCause());
            taskInst.setTaskExecDuration((etime.getTime() - btime.getTime()) / 1000);
            taskInst.setTaskExecTimes(taskInst.getTaskExecTimes() + 1);
        }
        catch (Exception e) {
            logger.error("SCHEDU-E-001", ">>>>>>>> execute task taskNo.taskID[" + taskInst.getTaskNo() + "." + taskInst.getTaskID()
                    + "] exception:", e);
            taskInst.setTaskState("3");
            Date etime = new Date();
            taskInst.setTaskFinishDate(TimeProcess.getInstance().getTimeStr(etime));
            if (e.toString().length() > 3500) taskInst.setTaskExceptInfo(e.toString().substring(0, 3500));
            taskInst.setTaskExceptInfo(e.toString());
            // taskInst.setTaskExecDuration((etime.getTime() - btime.getTime()) / 1000);
            taskInst.setTaskExecTimes(taskInst.getTaskExecTimes() + 1);
        }
        finally {
            sysJobDaoUtil.updateAfterExecuTaskInst(taskInst);
            logger.info(">>>>>>>> finish execute task taskNo.taskID[" + taskInst.getTaskNo() + "."
                    + taskInst.getTaskID() + "] ");
        }

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer
     * @param taskInst
     * @param classpath
     * @return  <br>
     */
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
                logger.warn("SCHEDU-W-001", "classpath[" + classpath + "] return JobResult null");
                result = new JobResult();
            }
        }
        catch (ClassNotFoundException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] ClassNotFoundException:", e);
        }
        catch (SecurityException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] SecurityException:", e);
        }
        catch (NoSuchMethodException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] NoSuchMethodException:", e);
        }
        catch (IllegalArgumentException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] IllegalArgumentException:", e);
        }
        catch (IllegalAccessException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] IllegalAccessException:", e);
        }
        catch (InvocationTargetException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] InvocationTargetException:", e);
            Throwable t = e.getTargetException();
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] Throwable:" + t);
        }
        catch (InstantiationException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] InstantiationException:", e);
        }
        return result;
    }
}
