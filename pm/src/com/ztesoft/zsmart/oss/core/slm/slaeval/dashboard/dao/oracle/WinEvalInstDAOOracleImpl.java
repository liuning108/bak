package com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.dao.oracle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.dao.WinEvalInstDAO;
import com.ztesoft.zsmart.oss.core.slm.util.SlmConst;

/**
 * [描述] <br>
 * 
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.dao.oracle <br>
 */
public class WinEvalInstDAOOracleImpl extends WinEvalInstDAO {

    @Override
    public HashMap<String, String> querySlaWinEvalOverview(DynamicDict qryInfo) throws BaseAppException {

        // evaluateCycle 06 Month,07 Quarter,08 Year
        String evaluateCycle = qryInfo.getString("SLA_EVALUATE_CYCLE");
        String year = qryInfo.getString("YEAR");
        String month = qryInfo.getString("MONTH");
        String quarter = qryInfo.getString("QUARTER");

        String fieldCondition = "";
        String whereCondition = "";

        if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_MONTH)) {
            whereCondition = "YEAR = ? AND MON = ? ";
            fieldCondition = "YEAR, MON";
        }
        else if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_QUARTER)) {
            whereCondition = "YEAR = ? AND QUARTER = ? ";
            fieldCondition = "YEAR, QUARTER";
        }
        else if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_YEAR)) {
            whereCondition = "YEAR = ? ";
            fieldCondition = "YEAR";
        }

        String selectSql = "WITH CURR_DATA AS " 
                         + "(" 
                         + " SELECT COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_VIOLATION + " THEN 1 ELSE NULL END) VIOLATION_CNT, "
                         + " COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_NORMAL + " THEN 1 ELSE NULL END) NORMAL_CNT, "
                         + " COUNT(1) ALL_CNT "
                         + " FROM ("
                         + "        SELECT SLA_INSTID, " + fieldCondition + ", MAX(INST_STATE) INST_STATE"
                         + "        FROM SLM_SLA_EVAL_INST "
                         + "        WHERE SLA_EVALUATE_CYCLE = ? "
                         + "        AND " + whereCondition
                         + "        GROUP BY SLA_INSTID, " + fieldCondition
                         + " ) A"
                         + "), LAST_DATA AS " 
                         + "("
                         + " SELECT COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_VIOLATION + " THEN 1 ELSE NULL END) VIOLATION_CNT, "
                         + " COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_NORMAL + " THEN 1 ELSE NULL END) NORMAL_CNT, "
                         + " COUNT(1) ALL_CNT "
                         + " FROM ("
                         + "        SELECT SLA_INSTID, " + fieldCondition + ", MAX(INST_STATE) INST_STATE"
                         + "        FROM SLM_SLA_EVAL_INST "
                         + "        WHERE SLA_EVALUATE_CYCLE = ? "
                         + "        AND " + whereCondition
                         + "        GROUP BY SLA_INSTID, " + fieldCondition
                         + "  ) A"
                         + ")"
                         + "SELECT A.VIOLATION_CNT,A.NORMAL_CNT,A.ALL_CNT, "
                         + "CASE WHEN B.VIOLATION_CNT = 0 THEN '-' " 
                         + "ELSE ROUND((A.VIOLATION_CNT - B.VIOLATION_CNT)*100.0/B.VIOLATION_CNT,2) || '%' END VIOLATION_CNT_PERC, "
                         + "CASE WHEN B.NORMAL_CNT = 0 THEN '-' " 
                         + "ELSE ROUND((A.NORMAL_CNT - B.NORMAL_CNT)*100.0/B.NORMAL_CNT,2) || '%' END NORMAL_CNT_PERC, "
                         + "CASE WHEN B.ALL_CNT = 0 THEN '-' ELSE ROUND((A.ALL_CNT - B.ALL_CNT)*100.0/B.ALL_CNT,2) || '%' END  ALL_CNT_PERC "
                         + "FROM CURR_DATA A,LAST_DATA B";

        List<Integer[]> multiTimes = getMultiTimes(evaluateCycle, year, quarter, month, 2);
        ParamArray paramarray = new ParamArray();
        for (Integer[] intParams : multiTimes) {
            paramarray.set("", evaluateCycle);
            for (Integer intParam : intParams) {
                paramarray.set("", intParam);
            }
        }

        return query(selectSql, paramarray);
    }

    @Override
    public List<HashMap<String, String>> querySlaTrendWinEvalOverview(DynamicDict qryInfo) throws BaseAppException {

        // evaluateCycle 06 Month,07 Quarter,08 Year
        String evaluateCycle = qryInfo.getString("SLA_EVALUATE_CYCLE");
        String year = qryInfo.getString("YEAR");
        String month = qryInfo.getString("MONTH");
        String quarter = qryInfo.getString("QUARTER");

        String timeField = "";
        String fieldCondition = "";
        String whereCondition = "";
        String selectSql = "";

        ParamArray paramarray = new ParamArray();
        paramarray.set("", evaluateCycle);

        if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_MONTH)) {

            timeField = "YEAR||'/'||CASE WHEN MON < 10 THEN '0' ELSE '' END || MON ";
            whereCondition = "YEAR = ? AND MON <= ?";
            fieldCondition = "YEAR, MON";

            paramarray.set("", Integer.parseInt(year));
            paramarray.set("", Integer.parseInt(month));

        }
        else if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_QUARTER)) {

            timeField = "YEAR||'/Q'||QUARTER ";
            whereCondition = "YEAR = ? AND QUARTER <= ?";
            fieldCondition = "YEAR, QUARTER";

            paramarray.set("", Integer.parseInt(year));
            paramarray.set("", Integer.parseInt(quarter));

        }
        else if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_YEAR)) {

            timeField = "YEAR ";
            whereCondition = "YEAR = ?";
            fieldCondition = "YEAR";

            paramarray.set("", Integer.parseInt(year));
        }

        selectSql = "SELECT " + timeField + " TIME, " 
                  + "COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_NORMAL + " THEN 1 ELSE NULL END) COUNT_NORMAL, " 
                  + "COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_VIOLATION + " THEN 1 ELSE NULL END) COUNT_VIOLATION " 
                  + "FROM (" 
                  + "       SELECT SLA_INSTID, " + fieldCondition + ", MAX(INST_STATE) INST_STATE "
                  + "       FROM SLM_SLA_EVAL_INST " 
                  + "       WHERE SLA_EVALUATE_CYCLE = ? " 
                  + "       AND " + whereCondition 
                  + "       GROUP BY SLA_INSTID," + fieldCondition
                  + ") A " + "GROUP BY " + fieldCondition;

        selectSql += " UNION ALL ";

        whereCondition = "YEAR < ?";

        selectSql += "SELECT " + timeField + " TIME, " 
                  + "COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_NORMAL + " THEN 1 ELSE NULL END) COUNT_NORMAL, " 
                  + "COUNT(CASE WHEN INST_STATE = " + SlmConst.INST_STATE_VIOLATION + " THEN 1 ELSE NULL END) COUNT_VIOLATION " 
                  + "FROM (" 
                  + "       SELECT SLA_INSTID, " + fieldCondition + ", MAX(INST_STATE) INST_STATE "
                  + "       FROM SLM_SLA_EVAL_INST " 
                  + "       WHERE SLA_EVALUATE_CYCLE = ? " 
                  + "       AND " + whereCondition 
                  + "       GROUP BY SLA_INSTID," + fieldCondition
                  + ") A " + "GROUP BY " + fieldCondition;

        paramarray.set("", evaluateCycle);
        paramarray.set("", Integer.parseInt(year));

        return queryList(selectSql, paramarray);
    }

    @Override
    public List<HashMap<String, String>> querySlaWinEvalInst(DynamicDict qryInfo) throws BaseAppException {

        // evaluateCycle 06 Month,07 Quarter,08 Year
        String evaluateCycle = qryInfo.getString("SLA_EVALUATE_CYCLE");
        String year = qryInfo.getString("YEAR");
        String month = qryInfo.getString("MONTH");
        String quarter = qryInfo.getString("QUARTER");

        String whereCondition = "";
        String fieldCondition = "";

        if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_MONTH)) {
            whereCondition = "YEAR = ? AND MON = ? ";
            fieldCondition = "YEAR, MON";
        }
        else if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_QUARTER)) {
            whereCondition = "YEAR = ? AND QUARTER = ? ";
            fieldCondition = "YEAR, QUARTER";
        }
        else if (evaluateCycle.equals(SlmConst.EVALUATE_TIME_YEAR)) {
            whereCondition = "YEAR = ? ";
            fieldCondition = "YEAR";
        }

        String selectSql = "SELECT A.*,B.SLA_NAME,B.SLA_TYPE,B.SERVICE_LEVEL," 
                         + "       B.EFF_DATE,B.EXP_DATE,B.SLA_CLASS, "
                         + "       DECODE(B.SLA_TYPE, 0, C.PARTICIPANT_NO, C.PARTICIPANT_NAME) PARTICIPANT_VALUE " 
                         + "FROM ("
                         + "       SELECT MAX(BTIME) BTIME, TO_CHAR(MAX(ETIME),'yyyy-mm-dd hh24:mi:ss') EVALUATE_TIME, " + fieldCondition + ","
                         + "       SLA_EVALUATE_CYCLE, SLA_INSTID, MAX(INST_STATE) INST_STATE " 
                         + "       FROM SLM_SLA_EVAL_INST A " 
                         + "       WHERE SLA_EVALUATE_CYCLE = ? "
                         + "       AND " + whereCondition 
                         + "       GROUP BY SLA_EVALUATE_CYCLE," + fieldCondition + ",SLA_INSTID" 
                         + ") A, "
                         + "SLM_SLA_INST B, SLM_SLA_PARTICIPANT_INST C " 
                         + "WHERE A.SLA_INSTID = B.SLA_INSTID " 
                         + "AND B.SEQ = 0 "
                         + "AND C.SEQ = 0 "
                         + "AND B.STATE = '" + SlmConst.STATE_USING + "' "
                         + "AND B.SLA_INSTID = C.SLA_INSTID ";

        List<Integer[]> multiTimes = getMultiTimes(evaluateCycle, year, quarter, month);
        ParamArray paramarray = new ParamArray();
        for (Integer[] intParams : multiTimes) {
            paramarray.set("", evaluateCycle);
            for (Integer intParam : intParams) {
                paramarray.set("", intParam);
            }
        }

        return queryList(selectSql, paramarray);
    }

    /**
     * [方法描述] <br>
     * 
     * @author lwch <br>
     * @taskId <br>
     * @param evaluateCycle <br>
     * @param yearStr <br>
     * @param quarterStr <br>
     * @param monthStr <br>
     * @return List<Integer[]> <br>
     */
    private List<Integer[]> getMultiTimes(String evaluateCycle, String yearStr, String quarterStr, String monthStr) {
        return getMultiTimes(evaluateCycle, yearStr, quarterStr, monthStr, 1);
    }

    /**
     * [方法描述] <br>
     * 
     * @author lwch <br>
     * @taskId <br>
     * @param evaluateCycle <br>
     * @param yearStr <br>
     * @param quarterStr <br>
     * @param monthStr <br>
     * @param trendCycle <br>
     * @return List<Integer[]> <br>
     */
    private List<Integer[]> getMultiTimes(String evaluateCycle, String yearStr, String quarterStr, String monthStr, int trendCycle) {

        List<Integer[]> times = new ArrayList<Integer[]>(trendCycle);
        int year = Integer.parseInt(yearStr);

        if (SlmConst.EVALUATE_TIME_YEAR.equals(evaluateCycle)) { // Year
            for (int i = 0; i < trendCycle; i++) {
                times.add(new Integer[] {
                    year
                });
                year--;
            }
        }
        else if (SlmConst.EVALUATE_TIME_QUARTER.equals(evaluateCycle)) { // Quarter
            int quarter = Integer.parseInt(quarterStr);
            for (int i = 0; i < trendCycle; i++) {
                times.add(new Integer[] {
                    year, quarter
                });
                quarter--;
                if (quarter == 0) {
                    quarter = 4;
                    year--;
                }
            }
        }
        else if (SlmConst.EVALUATE_TIME_MONTH.equals(evaluateCycle)) { // Month
            int month = Integer.parseInt(monthStr);
            for (int i = 0; i < trendCycle; i++) {
                times.add(new Integer[] {
                    year, month
                });
                month--;
                if (month == 0) {
                    month = 12;
                    year--;
                }
            }
        }
        return times;
    }

}
