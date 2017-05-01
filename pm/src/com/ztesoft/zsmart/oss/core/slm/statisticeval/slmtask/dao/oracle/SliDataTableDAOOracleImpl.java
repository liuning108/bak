package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliDataTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job.SliJob;

/**
 * [统计表查询] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年8月17日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle <br>
 */
public class SliDataTableDAOOracleImpl extends SliDataTableDAO {
    /**
     * log <br>
     */
    private static Logger log = Logger.getLogger(SliJob.class);

    /**
     * s02 <br>
     */
    private static String s02 = "(9,10,11,12,13,14,15,16,17)";

    /**
     * s03 <br>
     */
    private static String s03 = "(0,1,2,3,4,5,6,7,8,18,19,20,21,22,23,24)";

    /**
     * d02 <br>
     */
    private static String d02 = "(1,2,3,4,5)";

    /**
     * d03 <br>
     */
    private static String d03 = "(6,7)";

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dayspan <br>
     * @param whichTime <br>
     * @param timespan <br>
     * @return <br>
     */
    private String getWhichTime(String dayspan, String whichTime, String timespan) {

        if ("S01".equals(dayspan)) {
            if ("S01".equals(timespan)) {
                whichTime = "";
            }
            else if ("S02".equals(timespan)) {
                whichTime = " and hh in" + s02;
            }
            else if ("S03".equals(timespan)) {
                whichTime = " and hh in" + s03;
            }
        }
        else if ("S02".equals(dayspan)) {
            if ("S01".equals(timespan)) {
                whichTime = " and wk in" + d02;
            }
            else if ("S02".equals(timespan)) {
                whichTime = " and hh in" + s02 + "and wk in" + d02;
            }
            else if ("S03".equals(timespan)) {
                whichTime = " and hh in" + s03 + "and wk in" + d02;
            }
        }
        else if ("S03".equals(dayspan)) {
            if ("S01".equals(timespan)) {
                whichTime = " and wk in" + d02;
            }
            else if ("S02".equals(timespan)) {
                whichTime = " and hh in" + s02 + "and wk in" + d03;
            }
            else if ("S03".equals(timespan)) {
                whichTime = " and hh in" + s03 + "and wk in" + d03;
            }
        }
        return whichTime;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliName <br>
     * @param table <br>
     * @param btime <br>
     * @param etime <br>
     * @param timespan <br>
     * @param dayspan <br>
     * @param sli_formula <br>
     * @param slaid <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    @Override
    public List<HashMap<String, String>> selectDataBySliNameN(String slaid, String sliName, List<HashMap<String, String>> table, String btime,
        String etime, String timespan, String dayspan, String sli_formula) throws BaseAppException {

        // 增加过滤
        // alltable.participant_no in (select participant_no from SLM_SLA_PARTICIPANT_INST where seq = 0)
        log.debug("DB find data the timespan is : " + timespan);
        log.debug("DB find data the dayspan is : " + dayspan);
        log.debug("DB find data the sliName is : " + sliName);
        String subString = "";
        String localtime = "";
        String whichTime = getWhichTime(dayspan, localtime, timespan);
        String whichNo = "alltable.participant_no in (select participant_no from SLM_SLA_PARTICIPANT_INST where seq = 0 and sla_instid =" + slaid
            + " )";
        if (table.size() == 0) {
            return null;
        }

        for (int i = 0; i < table.size(); i++) {
            subString = "select * from " + table.get(i).get("st_table".toUpperCase());
            if (i != 0 && i + 1 <= table.size()) {
                subString = subString + " union all ";
            }
        }

        String selectsql = "select " + sli_formula + " as " + sliName + "  from (" + subString + ") allTable where btime> = ? and etime < = ?"
            + whichTime + " and " + whichNo + "  group by participant_no";

        log.info("GET data sql is: " + selectsql);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        ParamArray paramArr = new ParamArray();

        try {
            paramArr.set("1", sdf.parse(btime));
            paramArr.set("2", sdf.parse(etime));
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return this.queryList(selectsql, paramArr);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public List<HashMap<String, String>> getTableName(String taskId) throws BaseAppException {
        String selectsql = "select taskId,st_table  from slm_sli_task_sttables where taskId = ?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("1", taskId);
        return this.queryList(selectsql, paramArr);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public String getSliFormula(String taskId) throws BaseAppException {
        String selectsql = "select SLI_FORMULA from SLM_SLI_INFO where seq = 0 AND SLI_NO = ?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("1", taskId);
        return this.queryString(selectsql, paramArr);
    }

    /**
     * [查询有服务实例id数据,返回批量数据] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliName <br>
     * @param tableName <br>
     * @param btime <br>
     * @param etime <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public List<HashMap<String, String>> selectDataBySliNameY(String sliName, String tableName, String btime, String etime) throws BaseAppException {
        log.info("btime is: " + btime + "etime is: " + etime);
        String selectsql = "select sum(" + sliName + ") as " + sliName + " sc_item_inst_type,sc_item_inst_id from " + tableName
            + " where btime = ? and etime  = ? ";
        ParamArray paramArr = new ParamArray();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            log.info("btime is: " + sdf.parse(btime).toString() + "etime is: " + sdf.parse(etime));
            paramArr.set("1", sdf.parse(btime));
            paramArr.set("2", sdf.parse(etime));
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return this.queryList(selectsql, paramArr);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public void insertTimeOutCaculateData(DynamicDict sliInfo) throws BaseAppException {
        int year = 2000;
        int mon = 1;
        String sli_eval = "slm_sli_eval_inst";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(sliInfo.getString("btime"));
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            year = cal.get(Calendar.YEAR);
            mon = cal.get(Calendar.MONTH) + 1;
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }

        if (mon < 10) {
            sli_eval = sli_eval + "_" + year + "0" + mon;
        }
        else {
            sli_eval = sli_eval + "_" + year + mon;
        }

        String insertSql = "INSERT INTO " + sli_eval + "(TASK_ID,BTIME,ETIME,OBJECTIVES_VALUE,WARN_VALUE,SLA_INSTID,SLO_INSTID,"
            + "SLI_INSTID,SLI_VALUE,SC_ITEM_INST_TYPE,SC_ITEM_INST_ID,INST_STATE)VALUES"
            + "(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,1,?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("objValue"));
        paramarray.set("", sliInfo.getString("warnValue"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("sli_value"));
        paramarray.set("", sliInfo.getString("sc_item_inst_id"));
        paramarray.set("", sliInfo.getString("inst_state"));
        executeUpdate(insertSql, paramarray);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public void insertTimeOutStateData(DynamicDict sliInfo) throws BaseAppException {
        int year = 2000;
        int mon = 1;
        String sli_eval = "slm_sli_eval_win_inst";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(sliInfo.getString("btime"));
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            year = cal.get(Calendar.YEAR);
            mon = cal.get(Calendar.MONTH) + 1;
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }

        if (mon < 10) {
            sli_eval = sli_eval + "_" + year + "0" + mon;
        }
        else {
            sli_eval = sli_eval + "_" + year + mon;
        }

        String insertSql = "INSERT INTO " + sli_eval + "(TASK_ID,BTIME,ETIME,OBJECTIVES_VALUE,WARN_VALUE,SLA_INSTID,SLO_INSTID,SLI_INSTID,SLI_VALUE,"
            + "SC_ITEM_INST_TYPE,SC_ITEM_INST_ID,INST_STATE)VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),"
            + "TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,1,?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("objValue"));
        paramarray.set("", sliInfo.getString("warnValue"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("sli_value"));
        paramarray.set("", sliInfo.getString("sc_item_inst_id"));
        paramarray.set("", sliInfo.getString("inst_state"));
        executeUpdate(insertSql, paramarray);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    @Override
    public void insertCaculateData(DynamicDict sliInfo) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        int year = 2000;
        int mon = 1;
        int quarter = 1;
        String sli_eval = "slm_sli_eval_inst";
        String slo_eval = "slm_slo_eval_inst";
        String sla_eval = "slm_sla_eval_inst";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(sliInfo.getString("btime"));
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            year = cal.get(Calendar.YEAR);
            mon = cal.get(Calendar.MONTH) + 1;
            quarter = 0;
            if (mon > 0 && mon < 4) {
                quarter = 1;
            }
            if (mon > 3 && mon < 7) {
                quarter = 2;
            }
            if (mon > 6 && mon < 10) {
                quarter = 3;
            }
            if (mon > 9 && mon <= 12) {
                quarter = 4;
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }

        if (mon < 10) {
            sli_eval = sli_eval + "_" + year + "0" + mon;
            slo_eval = slo_eval + "_" + year + "0" + mon;
            sla_eval = sla_eval + "_" + year + "0" + mon;
        }
        else {
            sli_eval = sli_eval + "_" + year + mon;
            slo_eval = slo_eval + "_" + year + mon;
            sla_eval = sla_eval + "_" + year + mon;
        }

        String insertSql = "INSERT INTO " + sli_eval + "(TASK_ID,BTIME,ETIME,OBJECTIVES_VALUE,WARN_VALUE,SLA_INSTID,SLO_INSTID,SLI_INSTID,SLI_VALUE,"
            + "SC_ITEM_INST_TYPE,SC_ITEM_INST_ID,INST_STATE)VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),"
            + "TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,1,?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("objValue"));
        paramarray.set("", sliInfo.getString("warnValue"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("sli_value"));
        paramarray.set("", sliInfo.getString("sc_item_inst_id"));
        paramarray.set("", sliInfo.getString("inst_state"));
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO " + slo_eval + "(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,1)";
        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        executeUpdate(insertSql, paramarray);

        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("inst_state"));
        paramarray.set("", year);
        paramarray.set("", mon);
        paramarray.set("", quarter);
        paramarray.set("", sliInfo.getString("evaluate_cycle"));

        insertSql = "INSERT INTO " + sla_eval
            + "(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE,YEAR,MON,QUARTER,SLA_EVALUATE_CYCLE)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,?,?)";
        executeUpdate(insertSql, paramarray);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public void insertStateData(DynamicDict sliInfo) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        int year = 2000;
        int mon = 1;
        int quarter = 1;
        String sli_eval = "slm_sli_eval_win_inst";
        String slo_eval = "slm_slo_eval_win_inst";
        String sla_eval = "slm_sla_eval_win_inst";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(sliInfo.getString("btime"));
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            year = cal.get(Calendar.YEAR);
            mon = cal.get(Calendar.MONTH) + 1;
            quarter = 0;
            if (mon > 0 && mon < 4) {
                quarter = 1;
            }
            if (mon > 3 && mon < 7) {
                quarter = 2;
            }
            if (mon > 6 && mon < 10) {
                quarter = 3;
            }
            if (mon > 9 && mon <= 12) {
                quarter = 4;
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }

        if (mon < 10) {
            sli_eval = sli_eval + "_" + year + "0" + mon;
            slo_eval = slo_eval + "_" + year + "0" + mon;
            sla_eval = sla_eval + "_" + year + "0" + mon;
        }
        else {
            sli_eval = sli_eval + "_" + year + mon;
            slo_eval = slo_eval + "_" + year + mon;
            sla_eval = sla_eval + "_" + year + mon;
        }

        String insertSql = "INSERT INTO " + sli_eval + "(TASK_ID,BTIME,ETIME,OBJECTIVES_VALUE,WARN_VALUE,SLA_INSTID,SLO_INSTID,SLI_INSTID,SLI_VALUE,"
            + "SC_ITEM_INST_TYPE,SC_ITEM_INST_ID,INST_STATE)VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),"
            + "TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,1,?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("objValue"));
        paramarray.set("", sliInfo.getString("warnValue"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("sli_value"));
        paramarray.set("", sliInfo.getString("sc_item_inst_id"));
        paramarray.set("", sliInfo.getString("inst_state"));
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO " + slo_eval + "(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,1)";
        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("inst_state"));
        executeUpdate(insertSql, paramarray);

        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", sliInfo.getString("inst_state"));
        paramarray.set("", year);
        paramarray.set("", mon);
        paramarray.set("", quarter);
        paramarray.set("", sliInfo.getString("evaluate_cycle"));

        insertSql = "INSERT INTO " + sla_eval + "(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE,"
            + "YEAR,MON,QUARTER,SLA_EVALUATE_CYCLE)VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,?,?)";
        executeUpdate(insertSql, paramarray);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    @Override
    public void insertCaculateSloData(DynamicDict sliInfo) throws BaseAppException {
        int year = 2000;
        int mon = 1;
        int quarter = 1;
        String slo_eval = "slm_slo_eval_inst";
        String sla_eval = "slm_sla_eval_inst";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(sliInfo.getString("btime"));
            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            year = cal.get(Calendar.YEAR);
            mon = cal.get(Calendar.MONTH) + 1;
            quarter = 0;
            if (mon > 0 && mon < 4) {
                quarter = 1;
            }
            if (mon > 3 && mon < 7) {
                quarter = 2;
            }
            if (mon > 6 && mon < 10) {
                quarter = 3;
            }
            if (mon > 9 && mon <= 12) {
                quarter = 4;
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }

        if (mon < 10) {
            slo_eval = slo_eval + "_" + year + "0" + mon;
        }
        else {
            slo_eval = slo_eval + "_" + year + mon;
        }
        // TODO Auto-generated method stub <br>
        String insertSql = "INSERT INTO " + slo_eval + "(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,0)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        executeUpdate(insertSql, paramarray);

        if (mon < 10) {
            sla_eval = sla_eval + "_" + year + "0" + mon;
        }
        else {
            sla_eval = sla_eval + "_" + year + mon;
        }

        insertSql = "INSERT INTO " + sla_eval + "(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE,YEAR,MON,QUARTER)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,0,?,?,?)";
        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        paramarray.set("", year);
        paramarray.set("", mon);
        paramarray.set("", quarter);

        executeUpdate(insertSql, paramarray);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    @Override
    public void insertStateSloData(DynamicDict sliInfo) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String insertSql = "INSERT INTO slm_slo_eval_inst(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,"
            + "INST_STATE)VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,0)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO slm_slo_eval_win_inst(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,0)";
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO slm_sla_eval_inst(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE,YEAR,MON,QUARTER)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,0,?,?,?)";
        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("taskId"));
        paramarray.set("", sliInfo.getString("btime"));
        paramarray.set("", sliInfo.getString("etime"));
        paramarray.set("", sliInfo.getString("slaInstId"));
        paramarray.set("", sliInfo.getString("sloInstId"));
        paramarray.set("", sliInfo.getString("sliInstId"));

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(sliInfo.getString("btime"));

            Calendar cal = Calendar.getInstance();
            cal.setTime(date);
            int year = cal.get(Calendar.YEAR);
            int mon = cal.get(Calendar.MONTH) + 1;
            int quarter = 0;
            if (mon > 0 && mon < 4) {
                quarter = 1;
            }
            if (mon > 3 && mon < 7) {
                quarter = 2;
            }
            if (mon > 6 && mon < 10) {
                quarter = 3;
            }
            if (mon > 9 && mon <= 12) {
                quarter = 4;
            }
            paramarray.set("", year);
            paramarray.set("", mon);
            paramarray.set("", quarter);
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO slm_sla_eval_win_inst(TASK_ID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,SLI_INSTID,INST_STATE,YEAR,MON,QUARTER)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,0,?,?,?)";
        executeUpdate(insertSql, paramarray);
    }

}
