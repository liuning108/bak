package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.SchedulerException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SlaScItemTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliDataTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliTaskTableDAO;
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
public class SliJob implements Job {
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

    /**
     * <>
     */
    public SliJob() {
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskType <br>
     * @param datainfo <br>
     * @throws BaseAppException <br>
     */
    private void insertWarnValue(String taskType, DynamicDict datainfo) throws BaseAppException {
        datainfo.set("inst_state", 2);
        SliDataTableDAO slidata = (SliDataTableDAO) GeneralDAOFactory.create(SliDataTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            if (Integer.parseInt(taskType) == 0) {
                // insert into sliT1/sloT1/slaT1
                slidata.insertCaculateData(datainfo);
            }
            else {
                // insert into sliT1/sloT1/slaT1/sliT2/sloT2/slaT2
                slidata.insertStateData(datainfo);
            }
            // sloTask.upadateSloTaskState(list);
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

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskType <br>
     * @param datainfo <br>
     * @throws BaseAppException <br>
     */
    private void insertObjValue(String taskType, DynamicDict datainfo) throws BaseAppException {
        datainfo.set("inst_state", 3);
        SliDataTableDAO slidata = (SliDataTableDAO) GeneralDAOFactory.create(SliDataTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            if (Integer.parseInt(taskType) == 0) {
                // insert into sliT1/sloT1/slaT1
                slidata.insertCaculateData(datainfo);
            }
            else {
                // insert into sliT1/sloT1/slaT1/sliT2/sloT2/slaT2
                slidata.insertStateData(datainfo);
            }
            // sloTask.upadateSloTaskState(list);
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

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskType <br>
     * @param datainfo <br>
     * @throws BaseAppException <br>
     */
    private void insertValue(String taskType, DynamicDict datainfo) throws BaseAppException {
        datainfo.set("inst_state", 1);
        SliDataTableDAO slidata = (SliDataTableDAO) GeneralDAOFactory.create(SliDataTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            if (Integer.parseInt(taskType) == 0) {
                // insert into sliT1/sloT1/slaT1
                slidata.insertCaculateData(datainfo);
            }
            else {
                // insert into sliT1/sloT1/slaT1/sliT2/sloT2/slaT2
                slidata.insertStateData(datainfo);
            }
            // sloTask.upadateSloTaskState(list);
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

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskType <br>
     * @param datainfo <br>
     * @throws BaseAppException <br>
     */
    private void insertNoVaule(String taskType, DynamicDict datainfo) throws BaseAppException {
        SliDataTableDAO slidata = (SliDataTableDAO) GeneralDAOFactory.create(SliDataTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            if (Integer.parseInt(taskType) == 0) {
                // insert into sliT1/sloT1/slaT1
                slidata.insertTimeOutCaculateData(datainfo);
            }
            else {
                // insert into sliT1/sloT1/slaT1/sliT2/sloT2/slaT2
                slidata.insertTimeOutStateData(datainfo);
            }
            // sloTask.upadateSloTaskState(list);
            ses.commitTrans();

        }
        catch (BaseAppException e) {
            log.error("execute insertNoVaule error!", e);
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

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @throws BaseAppException <br>
     */
    private void updateTaskState(String taskId) throws BaseAppException {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss.SSS");
        Date end = new Date();
        taskExcuteDuration = new Timestamp(end.getTime());
        long duration = taskExcuteDuration.getTime() - taskExcuteTime.getTime();
        HashMap<String, String> list = new HashMap<String, String>();
        Session ses = null;
        list.put("taskid", taskId);
        list.put("duration", duration + "");
        list.put("taskexcutetime", dateFormat.format(taskExcuteTime).toString());
        list.put("taskexcuteduration", dateFormat.format(taskExcuteDuration).toString());
        SliTaskTableDAO slitask = (SliTaskTableDAO) GeneralDAOFactory.create(SliTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            // insert into sliT1/sloT1/slaT1
            slitask.updateExcuteTaskState(list);
            ses.commitTrans();

        }
        catch (BaseAppException e) {
            log.error("execute updateTaskState error!", e);
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

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param slaInstId <br>
     * @return <br>
     */
    private int getScItemFlag(String slaInstId) {
        int ScItemFlag = 0;
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            log.info("the slainstid is :" + slaInstId);
            SlaScItemTableDAO sst = (SlaScItemTableDAO) GeneralDAOFactory.create(SlaScItemTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
            ScItemFlag = sst.selectDataBySlaNo(slaInstId);
            log.info("the scitemflag is : " + ScItemFlag);
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
        return ScItemFlag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param context <br>
     * @return <br>
     */
    private List<HashMap<String, String>> getTableData(JobExecutionContext context) {
        JobDataMap dataJobMap = context.getJobDetail().getJobDataMap();
        int ScItemFlag = 0;
        Session ses = null;
        List<HashMap<String, String>> listmap = null;
        // FIND dataJobMap then insert few slidata to sliTable,a slo and sla dataJobMap to their table

        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            SliDataTableDAO slidata = (SliDataTableDAO) GeneralDAOFactory.create(SliDataTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
            List<HashMap<String, String>> tableList = slidata.getTableName(dataJobMap.getString("taskId"));
            String sli_formula = slidata.getSliFormula(dataJobMap.getString("sloNo").toUpperCase());
            log.info("the slainstid is :" + dataJobMap.getString("slaInstId"));
            log.info("the sli_formula is :" + sli_formula);
            ScItemFlag = getScItemFlag(dataJobMap.getString("slaInstId"));

            log.info("the scitemflag is : " + ScItemFlag);
            if (ScItemFlag > 0) {
                listmap = slidata.selectDataBySliNameY(dataJobMap.getString("sloNo"), dataJobMap.getString("stTable"), dataJobMap.getString("btime"),
                    dataJobMap.getString("etime"));
            }
            else {
                listmap = slidata.selectDataBySliNameN(dataJobMap.getString("slaInstId"), dataJobMap.getString("sloNo"), tableList,
                    dataJobMap.getString("btime"), dataJobMap.getString("etime"), dataJobMap.getString("timepattern_id"),
                    dataJobMap.getString("daypattern_id"), sli_formula);
            }
            // sloTask.upadateSloTaskState(list);
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
        return listmap;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param value <br>
     * @param objvalue <br>
     * @param warnvalue <br>
     * @param taskType <br>
     * @param datainfo <br>
     */
    private void getBigVale(double value, double objvalue, double warnvalue, String taskType, DynamicDict datainfo) {
        try {
            if (value > objvalue) {

                insertObjValue(taskType, datainfo);

            }
            else if (value > warnvalue) {
                insertWarnValue(taskType, datainfo);
            }
            else {
                insertValue(taskType, datainfo);
            }
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param value <br>
     * @param objvalue <br>
     * @param warnvalue <br>
     * @param taskType <br>
     * @param datainfo <br>
     */
    private void getSmallValue(double value, double objvalue, double warnvalue, String taskType, DynamicDict datainfo) {
        try {
            if (value < objvalue) {

                insertObjValue(taskType, datainfo);

            }
            else if (value < warnvalue) {
                insertWarnValue(taskType, datainfo);
            }
            else {
                insertValue(taskType, datainfo);
            }
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param value <br>
     * @param objvalue <br>
     * @param warnvalue <br>
     * @param taskType <br>
     * @param datainfo <br>
     */
    private void getEqualValue(double value, double objvalue, double warnvalue, String taskType, DynamicDict datainfo) {
        try {
            if (value == objvalue) {
                insertObjValue(taskType, datainfo);
            }
            else {
                insertValue(taskType, datainfo);
            }
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param value <br>
     * @param objvalue <br>
     * @param warnvalue <br>
     * @param taskType <br>
     * @param datainfo <br>
     */
    private void getBigEaqulValue(double value, double objvalue, double warnvalue, String taskType, DynamicDict datainfo) {
        try {
            if (value >= objvalue) {

                insertObjValue(taskType, datainfo);

            }
            else if (value < warnvalue) {
                insertWarnValue(taskType, datainfo);
            }
            else {
                insertValue(taskType, datainfo);
            }
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param value <br>
     * @param objvalue <br>
     * @param warnvalue <br>
     * @param taskType <br>
     * @param datainfo <br>
     */
    private void getSmallEqualVaule(double value, double objvalue, double warnvalue, String taskType, DynamicDict datainfo) {
        try {
            if (value <= objvalue) {

                insertObjValue(taskType, datainfo);

            }
            else if (value > warnvalue) {
                insertWarnValue(taskType, datainfo);
            }
            else {
                insertValue(taskType, datainfo);
            }
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param oper <br>
     * @param value <br>
     * @param objvalue <br>
     * @param warnvalue <br>
     * @param taskType <br>
     * @param datainfo <br>
     */
    private void generateDataToDB(String oper, double value, double objvalue, double warnvalue, String taskType, DynamicDict datainfo) {

        if (">".equals(oper)) {
            getBigVale(value, objvalue, warnvalue, taskType, datainfo);
        }
        else if ("<".equals(oper)) {
            getSmallValue(value, objvalue, warnvalue, taskType, datainfo);
        }
        else if ("=".equals(oper)) {
            getEqualValue(value, objvalue, warnvalue, taskType, datainfo);
        }
        else if (">=".equals(oper)) {
            getBigEaqulValue(value, objvalue, warnvalue, taskType, datainfo);
        }
        else if ("<=".equals(oper)) {
            getSmallEqualVaule(value, objvalue, warnvalue, taskType, datainfo);
        }
        else {
            log.error("operator error! this operator is: " + oper);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param context <br>
     * @throws JobExecutionException <br>
     */
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap dataJobMap = context.getJobDetail().getJobDataMap();
        Date begin = new Date();
        taskExcuteTime = new Timestamp(begin.getTime());
        dataJobMap.put("taskExcuteTime", taskExcuteTime);
        // 遗漏未处理服务实例
        int ScItemFlag = getScItemFlag(dataJobMap.getString("slaInstId"));
        List<HashMap<String, String>> listmap = getTableData(context);
        try {
            if (listmap != null && listmap.size() != 0) {
                log.info("------------SLI TASK find data ready to caculate the taskId is : " + dataJobMap.getString("taskId") + "--------------");

                for (int i = 0; i < listmap.size(); i++) {
                    DynamicDict datainfo = new DynamicDict();
                    datainfo.set("taskId", dataJobMap.getString("taskId"));
                    datainfo.set("btime", dataJobMap.getString("btime"));
                    datainfo.set("etime", dataJobMap.getString("etime"));
                    datainfo.set("objValue", dataJobMap.getString("objValue"));
                    datainfo.set("warnValue", dataJobMap.getString("warnValue"));
                    datainfo.set("slaInstId", dataJobMap.getString("slaInstId"));
                    datainfo.set("sloInstId", dataJobMap.getString("sloInstId"));
                    datainfo.set("sliInstId", dataJobMap.getString("sliInstId"));
                    datainfo.set("stTable", dataJobMap.getString("stTable"));
                    datainfo.set("sloNo", dataJobMap.getString("sloNo"));
                    datainfo.set("evaluate_cycle", dataJobMap.getString("evaluateCycle"));
                    // datainfo.set("operator", dataJobMap.getString("operator"));

                    if (ScItemFlag > 0) {
                        datainfo.set("sc_item_inst_type", listmap.get(i).get("sc_item_inst_type"));
                        datainfo.set("sc_item_inst_id", listmap.get(i).get("sc_item_inst_id"));
                    }
                    else {
                        datainfo.set("sc_item_inst_type", "");
                        datainfo.set("sc_item_inst_id", 0);
                    }
                    datainfo.set("sli_value", listmap.get(i).get(dataJobMap.getString("sloNo")));

                    log.info("----------------find data num is: " + i + "----------------------");
                    log.debug("the slainstid is :" + dataJobMap.getString("slaInstId"));
                    log.debug("datainfo.taskId: " + dataJobMap.getString("taskId"));
                    log.debug("datainfo.btime: " + dataJobMap.getString("btime"));
                    log.debug("datainfo.etime: " + dataJobMap.getString("etime"));
                    log.debug("datainfo.slaInstId: " + dataJobMap.getString("slaInstId"));
                    log.debug("datainfo.sloInstId: " + dataJobMap.getString("sloInstId"));
                    log.debug("datainfo.sliInstId: " + dataJobMap.getString("sliInstId"));
                    log.debug("datainfo.sloNo: " + dataJobMap.getString("sloNo"));
                    log.debug("datainfo.operator: " + dataJobMap.getString("operator"));
                    log.info("listmap.get(i).get(sliName): " + listmap.get(i).get(dataJobMap.getString("sloNo").toUpperCase()));

                    double value = Double.parseDouble(listmap.get(i).get(dataJobMap.getString("sloNo").toUpperCase()));
                    double objvalue = Double.parseDouble(dataJobMap.getString("objValue"));
                    double warnvalue = Double.parseDouble(dataJobMap.getString("warnValue"));
                    String taskType = dataJobMap.getString("taskType");
                    String oper = dataJobMap.getString("operator");

                    log.info("sli value is : " + value);
                    log.info("datainfo.objValue: " + dataJobMap.getString("objValue"));
                    log.info("datainfo.warnValue: " + dataJobMap.getString("warnValue"));

                    generateDataToDB(oper, value, objvalue, warnvalue, taskType, datainfo);
                    // 删除slo超时job
                    try {
                        SchedulerServer.getInstance().deleteJob("sloJob_" + dataJobMap.getString("taskId"), "SLOGROUP");
                    }
                    catch (SchedulerException e) {
                        // TODO Auto-generated catch block <br>
                        log.error(e.toString());
                    }
                }
            }
            else if (listmap.size() == 0) {
                log.info("------------SLI TASK NOT FIND  DATA  to INSERT TIMEOUT DATA  IN TABLE THE taskId is : " + dataJobMap.getString("taskId")
                    + "--------------");
                log.debug("datainfo.taskId: " + dataJobMap.getString("taskId"));
                log.debug("datainfo.btime: " + dataJobMap.getString("btime"));
                log.debug("datainfo.etime: " + dataJobMap.getString("etime"));
                log.debug("can not find any data ,insert timeout data");

                DynamicDict datainfo = new DynamicDict();
                datainfo.set("taskId", dataJobMap.getString("taskId"));
                datainfo.set("btime", dataJobMap.getString("btime"));
                datainfo.set("etime", dataJobMap.getString("etime"));
                datainfo.set("objValue", dataJobMap.getString("objValue"));
                datainfo.set("warnValue", dataJobMap.getString("warnValue"));
                datainfo.set("slaInstId", dataJobMap.getString("slaInstId"));
                datainfo.set("sloInstId", dataJobMap.getString("sloInstId"));
                datainfo.set("sliInstId", dataJobMap.getString("sliInstId"));
                datainfo.set("stTable", dataJobMap.getString("stTable"));
                datainfo.set("sloNo", dataJobMap.getString("sloNo"));
                datainfo.set("sc_item_inst_id", 1);
                datainfo.set("inst_state", 0);

                insertNoVaule(dataJobMap.getString("taskType"), datainfo);
            }
            else {
                log.error("TABLE NOT EXIST OR FIND DATA SQL ERROR!");
            }

            updateTaskState(dataJobMap.getString("taskId"));
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.info(e.getMessage());
        }
    }
}
