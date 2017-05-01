package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import java.util.Calendar;
import java.util.Date;

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
public class CreateTableJob implements Job {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(CreateTableJob.class.getName());

    /**
     * [方法描述] sql调度执行
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param context 
     * @throws JobExecutionException <br>
     */
    public void execute(JobExecutionContext context) throws JobExecutionException {
        SLMEntyExtInfoTask schedulejob = (SLMEntyExtInfoTask) context.getJobDetail().getJobDataMap().get("task");
        SlaTpl jobSt = new SlaTpl();
        Session ses = null;
        try {
            Calendar _time = Calendar.getInstance();
            _time.setTime(new Date());
            ses = SessionContext.newSession();
            ses.beginTrans();
            jobSt.executeCreateSqlTpl(schedulejob, _time);
            ses.commitTrans();

        }
        catch (BaseAppException e) {
            logger.error("execute CreateTableJob error!", e);
        }
        finally {
            if (ses != null) {
                try {
                    ses.releaseTrans();
                }
                catch (BaseAppException e) {
                    logger.error("createTableJob execute error", e);
                }
            }
        }

    }

}
