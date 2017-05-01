package com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.dao.oracle;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.dao.EvalInstDAO;
import com.ztesoft.zsmart.oss.core.slm.util.SlmConst;

/**
 * SLA监控相关的Oracle DAO操作实现类 <br>
 * 
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.dao.oracle <br>
 */
public class EvalInstDAOOracleImpl extends EvalInstDAO {

    @Override
    public List<HashMap<String, String>> selectSlaEvalInst() throws BaseAppException {

        String[] slaEvalTables = getEvalQueryTables("SLM_SLA_EVAL_INST");

        /**
         * 需要将当前月以及上月的数据UNION取最大的ETIME的SLA_INSTID。
         * 当前处于月初时，部分SLA还没有在当月产生计算实例的情况下，需要从上月取SLA的计算实例。
         * SLO的计算周期必须是月以下粒度，才能保证两个月SLM_SLA_EVAL_INST表中必然能取到一条SLA的计算实例
         */
        String selectSql = "WITH SLM_SLA_EVAL_INST_2_MONTH AS " 
                         + "(" 
                         + " SELECT MAX(ETIME) ETIME,SLA_INSTID FROM "
                         + "     (SELECT MAX(ETIME) ETIME,SLA_INSTID FROM " + slaEvalTables[0]
                         + "      GROUP BY SLA_INSTID "
                         + "      UNION ALL "
                         + "      SELECT MAX(ETIME) ETIME,SLA_INSTID FROM " + slaEvalTables[1]
                         + "      GROUP BY SLA_INSTID "
                         + "     ) A GROUP BY SLA_INSTID "
                         + "), SLM_SLA_EVAL_INST_MAXTEMP AS " 
                         + "("
                         + " SELECT A.BTIME,A.ETIME,A.YEAR,A.MON,A.QUARTER,A.SLA_INSTID,MAX(INST_STATE) INST_STATE "
                         + " FROM " + slaEvalTables[0] + " A, SLM_SLA_EVAL_INST_2_MONTH B  "
                         + " WHERE A.ETIME = B.ETIME "
                         + " AND A.SLA_INSTID = B.SLA_INSTID "
                         + " GROUP BY A.BTIME,A.ETIME,A.YEAR,A.MON,A.QUARTER,A.SLA_INSTID "
                         + " UNION ALL "
                         + " SELECT A.BTIME,A.ETIME,A.YEAR,A.MON,A.QUARTER,A.SLA_INSTID,MAX(INST_STATE) INST_STATE "
                         + " FROM " + slaEvalTables[1] + " A, SLM_SLA_EVAL_INST_2_MONTH B "
                         + " WHERE A.ETIME = B.ETIME "
                         + " AND A.SLA_INSTID = B.SLA_INSTID "
                         + " GROUP BY A.BTIME,A.ETIME,A.YEAR,A.MON,A.QUARTER,A.SLA_INSTID "
                         + ")"
                         + "SELECT TO_CHAR(A.BTIME,'yyyy-mm-dd hh24:mi:ss') BTIME,TO_CHAR(A.ETIME,'yyyy-mm-dd hh24:mi:ss') ETIME, "
                         + "       A.SLA_INSTID,A.INST_STATE,A.YEAR,A.MON,A.QUARTER, "
                         + "       B.SLA_NO,B.SLA_NAME,B.SLA_TYPE,B.SLA_CLASS,B.SERVICE_LEVEL, "
                         + "       B.EVALUATE_CYCLE,B.EFF_DATE,B.EXP_DATE,B.STATE,B.DESCRIPTION, "
                         + "       DECODE(B.SLA_TYPE, 0, C.PARTICIPANT_NO, C.PARTICIPANT_NAME) PARTICIPANT_VALUE "
                         + "FROM SLM_SLA_EVAL_INST_MAXTEMP A "
                         + "INNER JOIN SLM_SLA_INST B ON A.SLA_INSTID = B.SLA_INSTID "
                         + "INNER JOIN SLM_SLA_PARTICIPANT_INST C ON A.SLA_INSTID = C.SLA_INSTID "
                         + "WHERE B.SEQ = 0 " 
                         + "AND C.SEQ = 0 "
                         + "AND A.INST_STATE != 0 "
                         + "AND B.STATE = '" + SlmConst.STATE_USING + "' ";
        return queryList(selectSql, null);
    }

    @Override
    public List<HashMap<String, String>> selectSlaEvalServiceInst(DynamicDict slaInstInfo) throws BaseAppException {
        String selectSql = "SELECT SLA_INSTID,SC_ITEM_NO,SC_ITEM_NAME FROM SLM_SLA_SC_ITEM_INST WHERE SLA_INSTID = ? AND SEQ = 0";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", slaInstInfo.getString("SLA_INSTID"));
        return queryList(selectSql, paramarray);
    }

    @Override
    public List<HashMap<String, String>> selectSloEvalInst(DynamicDict slaInstInfo) throws BaseAppException {

        // 目前SLO的评估周期最大的为月，因此暂时不考虑跨月的情况
        String[] sloEvalTables = getEvalQueryTables("SLM_SLO_EVAL_INST", slaInstInfo.getString("BTIME"));
        String[] sliEvalTables = getEvalQueryTables("SLM_SLI_EVAL_INST", slaInstInfo.getString("BTIME"));

        String selectSql = "WITH SLM_SLO_EVAL_INST_MAXTEMP AS " 
                         + "(" 
                         + " SELECT MAX(A.BTIME) BTIME,MAX(A.ETIME) ETIME,A.SLA_INSTID,A.SLO_INSTID "
                         + " FROM " + sloEvalTables[0] + " A "
                         + " WHERE A.SLA_INSTID = ? "
                         + " GROUP BY A.SLA_INSTID,A.SLO_INSTID "
                         + "), SLM_SLO_SLI_EVAL_INST_CNTTEMP AS " 
                         + "("
                         + " SELECT A.BTIME,A.SLA_INSTID,A.SLO_INSTID,COUNT(1) VIOLATION_CNT "
                         + " FROM " + sliEvalTables[0] + " A, "
                         + "   (SELECT MAX(ETIME) ETIME,SLI_INSTID FROM " + sliEvalTables[0] + " WHERE SLA_INSTID = ? GROUP BY SLI_INSTID) B"
                         + " WHERE A.INST_STATE = " + SlmConst.INST_STATE_VIOLATION
                         + " AND A.ETIME = B.ETIME "
                         + " AND A.SLI_INSTID = B.SLI_INSTID "
                         + " AND A.SLA_INSTID = ? "
                         + " GROUP BY A.BTIME,A.SLA_INSTID,A.SLO_INSTID "
                         + ") "
                         + "SELECT TO_CHAR(A.BTIME,'yyyy-mm-dd hh24:mi:ss') BTIME,A.SLA_INSTID,A.SLO_INSTID,"
                         + "       B.SC_ITEM_NO,B.SLO_NO,B.SLO_NAME,B.CAL_CYCLE,B.CYCLE_UNITS,B.TIME_WIN,B.STATE,"
                         + "       B.DESCRIPTION,DECODE(C.VIOLATION_CNT, NULL, 0, VIOLATION_CNT) VIOLATION_CNT "
                         + "FROM SLM_SLO_EVAL_INST_MAXTEMP A "
                         + "INNER JOIN SLM_SLO_INST B "
                         + "ON A.SLO_INSTID = B.SLO_INSTID "
                         + "LEFT JOIN SLM_SLO_SLI_EVAL_INST_CNTTEMP C "
                         + "ON A.BTIME = C.BTIME "
                         + "AND A.SLO_INSTID = C.SLO_INSTID "
                         + "AND A.SLA_INSTID = C.SLA_INSTID "
                         + "WHERE B.SEQ = 0 " 
                         + "AND B.STATE = '" + SlmConst.STATE_USING + "' ";

        ParamArray paramarray = new ParamArray();
        paramarray.set("", slaInstInfo.getString("SLA_INSTID"));
        paramarray.set("", slaInstInfo.getString("SLA_INSTID"));
        paramarray.set("", slaInstInfo.getString("SLA_INSTID"));
        return queryList(selectSql, paramarray);
    }

    @Override
    public List<HashMap<String, String>> selectSliRuleEvalInst(DynamicDict sloInstInfo) throws BaseAppException {

        String[] sliEvalTables = getEvalQueryTables("SLM_SLI_EVAL_INST", sloInstInfo.getString("BTIME"));

        String selectSql = "SELECT TO_CHAR(A.BTIME,'yyyy-mm-dd hh24:mi:ss') BTIME,"
                         + "       TO_CHAR(A.ETIME,'yyyy-mm-dd hh24:mi:ss') ETIME,A.SLA_INSTID," 
                         + "       A.SLO_INSTID,A.SLI_INSTID,A.SLI_VALUE,A.INST_STATE "
                         + "FROM " + sliEvalTables[0] + " A " 
                         + "WHERE A.SLA_INSTID = ? " + "AND A.SLO_INSTID = ? "
                         + "AND BTIME = TO_DATE(?,'yyyy-mm-dd hh24:mi:ss') " 
                         + "ORDER BY SLA_INSTID,ETIME ";

        ParamArray paramarray = new ParamArray();
        paramarray.set("", sloInstInfo.getString("SLA_INSTID"));
        paramarray.set("", sloInstInfo.getString("SLO_INSTID"));
        paramarray.set("", sloInstInfo.getString("BTIME"));
        return queryList(selectSql, paramarray);
    }

    @Override
    public List<HashMap<String, String>> selectSliRuleInst(DynamicDict sloInstInfo) throws BaseAppException {

        String[] sliEvalTables = getEvalQueryTables("SLM_SLI_EVAL_INST", sloInstInfo.getString("BTIME"));

        String selectSql = "WITH SLM_SLO_SLI_EVAL_INST_CNTTEMP AS ( " 
                         + " SELECT A.BTIME, A.SLA_INSTID, A.SLO_INSTID, A.SLI_INSTID,"
                         + "        SUM(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_WARNING + " THEN 1 ELSE 0 END) WARNING_CNT,"
                         + "        SUM(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_VIOLATION + " THEN 1 ELSE 0 END) VIOLATION_CNT "
                         + " FROM " + sliEvalTables[0] + " A "
                         + " WHERE A.SLA_INSTID = ? "
                         + " AND A.SLO_INSTID = ? "
                         + " AND A.BTIME = TO_DATE(?,'yyyy-mm-dd hh24:mi:ss') "
                         + " GROUP BY A.BTIME,A.SLA_INSTID,A.SLO_INSTID,A.SLI_INSTID" 
                         + ") "
                         + "SELECT A.RULE_ID,A.SLI_INSTID,A.SLI_NO,B.SLI_NAME,B.UNITS,A.SLO_INSTID,A.SLO_NO, "
                         + "       A.DAYPATTERN_ID,A.TIMEPATTERN_ID,A.OPERATOR,A.OBJECTIVES_VALUE,A.WARN_VALUE, "
                         + "       DECODE(C.WARNING_CNT, NULL, 0, WARNING_CNT) WARNING_CNT, "
                         + "       DECODE(C.VIOLATION_CNT, NULL, 0, VIOLATION_CNT) VIOLATION_CNT "
                         + "FROM SLM_SLO_SLI_INST A "
                         + "LEFT JOIN SLM_SLI_INFO B "
                         + "ON A.SLI_NO = B.SLI_NO "
                         + "LEFT JOIN SLM_SLO_SLI_EVAL_INST_CNTTEMP C "
                         + "ON A.SLO_INSTID = C.SLO_INSTID "
                         + "AND A.SLI_INSTID = C.SLI_INSTID "
                         + "WHERE A.SLO_INSTID = ? "
                         + "AND A.SEQ = 0 "
                         + "AND B.SEQ = 0 "
                         + "AND B.STATE = '" + SlmConst.STATE_USING + "' " 
                         + "ORDER BY SLI_NO";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sloInstInfo.getString("SLA_INSTID"));
        paramarray.set("", sloInstInfo.getString("SLO_INSTID"));
        paramarray.set("", sloInstInfo.getString("BTIME"));
        paramarray.set("", sloInstInfo.getString("SLO_INSTID"));
        return queryList(selectSql, paramarray);
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param tableName <br>
     * @param time <br>
     * @return <br>
     */
    private String[] getEvalQueryTables(String tableName, String time) {
        // 计算周期必须小于一个月
        // 计算实例表示按月分表，此方法返回当前月和上个月的table。查询两个月中正在进行计算的SLA
        String[] tables = new String[2];
        Calendar cal = Calendar.getInstance();

        if (time != null) {
            cal.setTime(DateUtil.string2Date(time));
        }
        else {
            cal.setTime(new Date());
        }

        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        String monthStr = "";
        if (month < 10) {
            monthStr = "0" + month;
        } 
        else {
            monthStr = "" + month;
        }
        tables[0] = tableName + "_" + year + monthStr;

        cal.add(Calendar.MONTH, -1);
        year = cal.get(Calendar.YEAR);
        month = cal.get(Calendar.MONTH) + 1;
        if (month < 10) {
            monthStr = "0" + month;
        } 
        else {
            monthStr = "" + month;
        }
        tables[1] = tableName + "_" + year + monthStr;

        return tables;
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param tableName <br>
     * @return <br>
     */
    private String[] getEvalQueryTables(String tableName) {
        return getEvalQueryTables(tableName, null);
    }
}
