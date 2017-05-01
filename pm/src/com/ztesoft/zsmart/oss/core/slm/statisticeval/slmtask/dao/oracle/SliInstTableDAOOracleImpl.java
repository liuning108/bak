package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliInstTableDAO;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月27日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle <br>
 */
public class SliInstTableDAOOracleImpl extends SliInstTableDAO {

    @Override
    public List<HashMap<String, String>> selectSliInst() throws BaseAppException {

        String selectsql = "select A.SLI_INSTID,A.SLO_INSTID,B.SLA_INSTID,A.SLO_NO,A.SLI_NO,A.DAYPATTERN_ID,A.TIMEPATTERN_ID,"
            + "A.OPERATOR,A.OBJECTIVES_VALUE,A.WARN_VALUE,C.CAL_CYCLE,C.TIME_WIN,C.CYCLE_UNITS"
            + " from SLM_SLO_SLI_INST A,SLM_SLO_INST C,SLM_SLA_SLO_INST B ,slm_sla_inst D where A.SLO_NO = B.SLO_NO AND A.SLO_INSTID=B.SLO_INSTID "
            + "AND A.SLO_INSTID = C.SLO_INSTID AND A.SLO_NO=C.SLO_NO AND C.CYCLE_UNITS is not null "
            + "and D.SLA_INSTID = B.SLA_INSTID and D.SEQ=0 AND sysdate between  D.EFF_DATE AND EXP_DATE";
        ParamArray paramArr = new ParamArray();
        return this.queryList(selectsql, paramArr);
    }

    @Override
    public void insertSliTaskList(HashMap<String, String> list) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String insertSql = "INSERT INTO slm_sli_task(TASKID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,"
            + "SLI_INSTID,SLI_NO,TASK_TYPE,st_table,EVALUATE_CYCLE,CAL_CYCLE,CYCLE_UNITS,OPERATOR,"
            + "DAYPATTERN_ID,TIMEPATTERN_ID,WARN_VALUE,OBJECTIVES_VALUE,DELAYTIME,TASKCREATETIME,STATE)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss')," + "TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"
            + "TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", list.get("taskId"));
        paramarray.set("", list.get("btime"));
        paramarray.set("", list.get("etime"));
        paramarray.set("", list.get("sla_instid"));
        paramarray.set("", list.get("slo_instid"));
        paramarray.set("", list.get("sli_instid"));
        paramarray.set("", list.get("sli_no"));
        paramarray.set("", list.get("task_type"));
        paramarray.set("", list.get("st_table"));
        paramarray.set("", list.get("evaluate_cycle"));
        paramarray.set("", list.get("cal_cycle"));
        paramarray.set("", list.get("cycle_units"));
        paramarray.set("", list.get("operator"));
        paramarray.set("", list.get("daypattern_id"));
        paramarray.set("", list.get("timepattern_id"));
        paramarray.set("", list.get("warn_value"));
        paramarray.set("", list.get("objectives_value"));
        paramarray.set("", list.get("delayTime"));
        paramarray.set("", list.get("taskcreatetime"));
        paramarray.set("", list.get("state"));
        executeUpdate(insertSql, paramarray);
    }

    @Override
    public void insertSloTaskList(HashMap<String, String> list) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String insertSql = "INSERT INTO slm_sla_slo_task(TASKID,BTIME,ETIME,SLA_INSTID,SLO_INSTID,"
            + "SLI_INSTID,SLA_EVALUATE_CYCLE,TASK_TYPE,DELAYTIME,TASKCREATETIME,STATE,CYCLE_UNITS)"
            + "VALUES(?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?,?,?,?,?,TO_DATE(?,'yyyy-MM-dd HH24:mi:ss'),?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", list.get("taskId"));
        paramarray.set("", list.get("btime"));
        paramarray.set("", list.get("etime"));
        paramarray.set("", list.get("sla_instid"));
        paramarray.set("", list.get("slo_instid"));
        paramarray.set("", list.get("sli_instid"));
        paramarray.set("", list.get("evaluate_cycle"));
        paramarray.set("", list.get("task_type"));
        paramarray.set("", list.get("delayTimeSlo"));
        paramarray.set("", list.get("taskcreatetime"));
        paramarray.set("", list.get("state"));
        paramarray.set("", list.get("cycle_units"));
        executeUpdate(insertSql, paramarray);
    }

}
