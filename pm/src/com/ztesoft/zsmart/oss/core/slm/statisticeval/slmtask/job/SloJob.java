package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliDataTableDAO;
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
public class SloJob implements Job {
    /**
     * log <br>
     */
    private static Logger log = Logger.getLogger(SliJob.class);

    /**
     * taskExcuteTime <br>
     */
    private Timestamp taskExcuteTime;

    /**
     * taskExcuteDuration <br>
     */
    private Timestamp taskExcuteDuration;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        // TODO Auto-generated method stub <br>
        log.info("----------------------- SLO TASK job execute -------------------");
        JobDataMap dataJobMap = context.getJobDetail().getJobDataMap();
        Date begin = new Date();
        taskExcuteTime = new Timestamp(begin.getTime());
        dataJobMap.put("taskExcuteTime", taskExcuteTime);
        try {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss.SSS");
            DynamicDict datainfo = new DynamicDict();
            datainfo.set("taskId", dataJobMap.getString("taskId"));
            datainfo.set("btime", dataJobMap.getString("btime"));
            datainfo.set("etime", dataJobMap.getString("etime"));
            datainfo.set("slaInstId", dataJobMap.getString("slaInstId"));
            datainfo.set("sloInstId", dataJobMap.getString("sloInstId"));
            datainfo.set("sliInstId", dataJobMap.getString("sliInstId"));
            SliDataTableDAO sliData = (SliDataTableDAO) GeneralDAOFactory.create(SliDataTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
            SloTaskTableDAO sloTask = (SloTaskTableDAO) GeneralDAOFactory.create(SloTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));

            if (Integer.parseInt(dataJobMap.getString("taskType")) == 0) {
                Session ses = null;
                try {
                    ses = SessionContext.newSession();
                    ses.beginTrans();
                    sliData.insertCaculateSloData(datainfo);
                    Date end = new Date();
                    taskExcuteDuration = new Timestamp(end.getTime());
                    long duration = taskExcuteDuration.getTime() - taskExcuteTime.getTime();
                    HashMap<String, String> list = new HashMap<String, String>();
                    list.put("taskid", dataJobMap.getString("taskId"));
                    list.put("duration", duration + "");
                    list.put("taskexcutetime", dateFormat.format(taskExcuteTime).toString());
                    list.put("taskexcuteduration", dateFormat.format(taskExcuteDuration).toString());

                    log.debug("taskid is: " + dataJobMap.getString("taskId"));
                    log.debug("duration is: " + duration + "");
                    log.debug("taskexcutetime is: " + dateFormat.format(taskExcuteTime).toString());
                    log.debug("taskexcuteduration is: " + dateFormat.format(taskExcuteDuration).toString());
                    sloTask.upadateSloTaskState(list);
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
            else {
                Session ses = null;
                try {
                    ses = SessionContext.newSession();
                    ses.beginTrans();
                    sliData.insertStateSloData(datainfo);
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
