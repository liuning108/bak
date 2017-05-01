package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.domain.SlaTpl;

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
public class StatisticTaskExecuteJob implements Job {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(StatisticTaskExecuteJob.class.getName());

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param context 
     * @throws JobExecutionException <br>
     */ 
    public void execute(JobExecutionContext context) throws JobExecutionException {
        SLMBasicStatisticTask schedulejob = (SLMBasicStatisticTask) context.getJobDetail().getJobDataMap().get("task");
        SlaTpl jobSt = new SlaTpl();
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            jobSt.executeStatSqlTpl(schedulejob);
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
                    logger.error("execute StatisticTaskExecuteJob error!", e);
                }
            }
        }

    }
}
