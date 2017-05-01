package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliTaskTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SloTaskTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.trigger.SchedulerServer;
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
public class SystemCallSlmJob implements Job {
    /**
     * log <br>
     */
    Logger log = Logger.getLogger(SchedulerServer.class);

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cycle <br>
     * @return <br>
     */
    private int getCycle(String cycle) {
        int value = 1440;
        if ("00".equals(cycle)) {
            value = 5;
        }
        if ("01".equals(cycle)) {
            value = 15;
        }
        if ("02".equals(cycle)) {
            value = 30;
        }
        if ("03".equals(cycle)) {
            value = 60;
        }
        if ("04".equals(cycle)) {
            value = 1440;
        }
        if ("05".equals(cycle)) {
            value = 1440 * 7;
        }
        if ("06".equals(cycle)) {
            java.util.Date now = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(now);
            int totalDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
            value = totalDay * 1440 * 7;
        }
        return value;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cal_cycle <br>
     * @param setime <br>
     * @param sdelay <br>
     * @param flag <br>
     * @return <br>
     * @throws ParseException <br>
     */
    private String string2Time(String cal_cycle, String setime, String sdelay, boolean flag) throws ParseException {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        dateFormat.setLenient(false);
        java.util.Date now = new Date();
        java.util.Date etime = dateFormat.parse(setime);
        java.util.Date stime = new Date();
        String time = "";
        Calendar cal = Calendar.getInstance();
        long interval = 0;
        // 考虑延时或者重算任务调度，若是此类任务直接调度以系统时间等待执行
        if (now.getTime() > etime.getTime()) {
            if (!flag) {
                stime.setTime(now.getTime() + 1 * 60 * 1000);
            }
            else {
                stime.setTime(now.getTime() + 10 * 60 * 1000);
            }
            cal.setTime(stime);
            time = "0 " + cal.get(Calendar.MINUTE) + " " + cal.get(Calendar.HOUR_OF_DAY) + " " + cal.get(Calendar.DAY_OF_MONTH) + " "
                + (cal.get(Calendar.MONTH) + 1) + " ? " + cal.get(Calendar.YEAR);
            log.info("System time is:" + now.toString() + " SLI task will run at :" + time);
            return time;
        }
        // log.info(cal_cycle + ":" + sdelay);
        if (sdelay != null && cal_cycle != null) {
            interval = (long) (getCycle(cal_cycle) * 60 * 1000 * (Double.valueOf(sdelay) - 1.0));
        }
        else {
            interval = 0;
        }
        stime.setTime(etime.getTime() + interval);

        cal.setTime(stime);
        time = "0 " + cal.get(Calendar.MINUTE) + " " + cal.get(Calendar.HOUR_OF_DAY) + " " + cal.get(Calendar.DAY_OF_MONTH) + " "
            + (cal.get(Calendar.MONTH) + 1) + " ? " + cal.get(Calendar.YEAR);
        if (flag) {
            log.info("System time is:" + now.toString() + " SLO task will run at :" + time);
        }
        else {
            log.info("System time is:" + now.toString() + " SLI task will run at :" + time);
        }
        return time;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @throws BaseAppException <br>
     */
    private void addBatchSliJob() throws BaseAppException {
        log.info("-----------------SLI TASK READY TO ADD --------------------------------------------");
        SliTaskTableDAO sliTask = (SliTaskTableDAO) GeneralDAOFactory.create(SliTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        List<HashMap<String, String>> taskList = null;
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            taskList = sliTask.selectTaskInfoByStat();
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

        HashMap<String, String> task = new HashMap<String, String>();
        if (taskList.isEmpty() || taskList != null) {
            log.debug(taskList);
            for (int i = 0; i < taskList.size(); i++) {
                task = taskList.get(i);
                String etime = task.get("etime".toUpperCase());
                String delay = task.get("delaytime".toUpperCase());
                String cycle = task.get("cycle_units".toUpperCase());
                String taskid = task.get("taskid".toUpperCase());

                log.debug("the taskid is:" + task.get("taskid".toUpperCase()));
                log.debug("the etime is:" + task.get("etime".toUpperCase()));
                log.debug("the delay is:" + task.get("delayTime".toUpperCase()));
                log.debug("the cycle_units is:" + task.get("cycle_units".toUpperCase()));
                log.debug("the operator is:" + task.get("operator".toUpperCase()));

                try {
                    String time = string2Time(cycle, etime, delay, false);
                    SchedulerServer.getInstance().addSingleSliJob(taskid, "SLIGROUP", time, SliJob.class, task);
                }
                catch (ParseException e) {
                    log.error(e.toString());
                }
            }
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobClass <br>
     * @throws BaseAppException <br>
     */
    private void addBatchSloJob(Class<? extends Job> jobClass) throws BaseAppException {
        log.info("-------SLO TASK READY TO ADD-------------------------------");
        SloTaskTableDAO sloTask = (SloTaskTableDAO) GeneralDAOFactory.create(SloTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        List<HashMap<String, String>> taskList = null;
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            taskList = sloTask.selectTaskInfoByStat();
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

        if (taskList.size() != 0 || taskList != null) {
            HashMap<String, String> task = new HashMap<String, String>();
            for (int i = 0; i < taskList.size(); i++) {
                log.debug("map size is : " + taskList.size() + "this count is: " + i);
                task = taskList.get(i);
                log.debug("the sloinstid is:" + task.get("slo_instid".toUpperCase()));
                log.debug("the sliinstid is:" + task.get("sli_instid".toUpperCase()));
                String etime = task.get("etime".toUpperCase());
                String delay = task.get("delayTime".toUpperCase());
                String taskid = task.get("taskid".toUpperCase());
                String cycle = task.get("cycle_units".toUpperCase());

                log.info("the taskid is:" + task.get("taskid".toUpperCase()));
                log.debug("the etime is:" + task.get("etime".toUpperCase()));
                log.debug("the delay is:" + task.get("delayTime".toUpperCase()));
                log.debug("the cycle_units is:" + task.get("cycle_units".toUpperCase()));
                try {
                    String time = string2Time(cycle, etime, delay, true);
                    SchedulerServer.getInstance().addSingleSloJob(taskid, "SLOGROUP", time, SloJob.class, task);
                }
                catch (ParseException e) {
                    log.error(e.toString());
                }
            }
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @throws BaseAppException <>
     * @taskId <br>
     */
    public void removeJob2his() throws BaseAppException {
        log.info("-------TASK READY TO HIS_TABLE-------------------------------");
        SliTaskTableDAO slITask = (SliTaskTableDAO) GeneralDAOFactory.create(SliTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        SloTaskTableDAO sloTask = (SloTaskTableDAO) GeneralDAOFactory.create(SloTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            slITask.moveTaskInfoByStat();
            sloTask.moveTaskInfoByStat();
            ses.commitTrans();

        }
        catch (BaseAppException e) {
            log.error("execute MOVE HIS_TABLE  error!", e);
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

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            log.info("------- SysJob execute-------------------");
            addBatchSliJob();
            addBatchSloJob(SloJob.class);

            // back into task history
            removeJob2his();
        }
        catch (BaseAppException e) {
            log.error(e.toString());
        }
    }

}
