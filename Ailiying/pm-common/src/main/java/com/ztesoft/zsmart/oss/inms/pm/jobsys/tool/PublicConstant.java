package com.ztesoft.zsmart.oss.inms.pm.jobsys.tool;

import java.text.SimpleDateFormat;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.common <br>
 */
public interface PublicConstant {
    /**
     * format <br>
     */
    public static SimpleDateFormat normalFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss SSS");
    
    /**
     * cronFormat <br>
     */
    public static SimpleDateFormat cronFormat = new SimpleDateFormat("ss mm HH dd MM ? yyyy");
    
    /**
     * sysProduceJobName 系统job 生成规格实例参数的jobName<br>
     */
    public final static String sysProduceJobName = "Job_ProduceSpecInstInfo";
    /**
     * sysProduceJobGroup 系统job 生成规格实例参数的jobGroup<br>
     */
    public final static String sysProduceJobGroup = "Group_ProduceSpecInstInfo";
    /**
     * pieceNum 分片个数<br>
     */
    public final static int pieceNum = 2;
    public final String zookeeperCon = "10.45.50.244:2181";
    public final String registerNameSpace = "inms-pm-distribute-task";
    
    //
    public final int assignTaskFrequency =  3;
    public final int executeTaskFrequency =  3;
}
