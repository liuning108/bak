package com.ericsson.inms.pm.schedule.config;

import java.text.SimpleDateFormat;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.common <br>
 */
public final class ScheduleConstant {
    /**
     * format <br>
     */
    public static SimpleDateFormat normalFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS");

    /**
     * sysProduceJobName 系统job 生成规格实例参数的jobName<br>
     */
    public final static String sysProduceJobName = "Job_ProduceSpecInstInfo";
    /**
     * sysProduceJobGroup 系统job 生成规格实例参数的jobGroup<br>
     */
    public final static String sysProduceJobGroup = "Group_ProduceSpecInstInfo";
    /**
     * jobProduceSpec <br>
     */
    public final static String jobProduceSpec = "JobProduceSpecInstInfo";
    /**
     * jobAssignTask <br>
     */
    public final static String jobAssignTask = "JobAssignTaskInst";
    /**
     * jobExecuTask <br>
     */
    public final static String jobExecuTask = "JobExecuteTaskInst";

    // args
    public final static String pieceNum = "pm.schedule.cluster.wokers.num";
    public final static String assignTaskFrequency = "pm.schedule.job.jobassigntaskinst.frequency";
    public final static String executeTaskFrequency = "pm.schedule.job.jobexecutetaskinst.frequency";

}
