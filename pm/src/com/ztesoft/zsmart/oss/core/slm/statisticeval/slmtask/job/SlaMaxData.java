package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job;


import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SloTaskTableDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月27日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job <br>
 */
public class SlaMaxData implements Job {
    /**
     * log <br>
     */
    private static Logger log = Logger.getLogger(SliJob.class);

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // TODO Auto-generated method stub <br>
        log.info("8.step------- slo job execute -------------------");
        JobDataMap dataJobMap = context.getJobDetail().getJobDataMap();
        try {
            SloTaskTableDAO slaTask = (SloTaskTableDAO) GeneralDAOFactory.create(SloTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));

            if (Integer.parseInt(dataJobMap.getString("taskType")) == 0) {
                Session ses = null;
                try {
                    ses = SessionContext.newSession();
                    ses.beginTrans();
                    slaTask.selectMax();
                    ses.commitTrans();

                }
                catch (BaseAppException e) {
                    log.error("execute StatisticTaskExecuteJob error!", e);
                }
                finally {
                    if (ses != null) {
                        try {
                            ses.releaseTrans();
                        }
                        catch (BaseAppException e) {
                            // TODO Auto-generated catch block
                            log.error(e.toString());
                        }
                    }
                }
            }
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

}
