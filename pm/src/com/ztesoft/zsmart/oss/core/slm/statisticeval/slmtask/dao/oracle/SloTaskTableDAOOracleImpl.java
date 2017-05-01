package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SloTaskTableDAO;

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
public class SloTaskTableDAOOracleImpl extends SloTaskTableDAO {

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public List<HashMap<String, String>> selectTaskInfoByStat() throws BaseAppException {
        Date dt = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        dt = calendar.getTime();
        String selectsql = "select taskid,to_char(btime,'yyyy-mm-dd hh24:mi:ss') as btime,"
            + "to_char(etime,'yyyy-mm-dd hh24:mi:ss') as etime,sla_instid,slo_instid,sli_instid,delayTime,"
            + "task_type,cycle_units from slm_sla_slo_task where state = 1 and etime < ?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("", dt);
        return this.queryList(selectsql, paramArr);
    }

    /**
     * [定时备份调度完成数据] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public int moveTaskInfoByStat() throws BaseAppException {
        String selectsql = "insert into slm_sla_slo_task_his(taskId,BTIME,ETIME,sla_instid,slo_instid,sli_instid,"
            + "SLA_EVALUATE_CYCLE,TASK_TYPE,taskCreateTime,delayTime,taskExceTime,exceptinfo,taskExceDuration,finishTime,STATE)"
            + "select taskId,BTIME,ETIME,sla_instid,slo_instid,sli_instid,SLA_EVALUATE_CYCLE,TASK_TYPE,taskCreateTime,delayTime,"
            + "taskExceTime,exceptinfo,taskExceDuration,finishTime" + ",STATE from slm_sla_slo_task where state = 0 or state=4";
        String selectsql2 = "delete from slm_sla_slo_task  where state = 0 or state=4";
        ParamArray paramArr = new ParamArray();
        this.executeUpdate(selectsql, paramArr);
        return this.executeUpdate(selectsql2, paramArr);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param list <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public int upadateSloTaskState(HashMap<String, String> list) throws BaseAppException {
        String selectsql = "update slm_sla_slo_task set taskexcetime = "
            + "to_timestamp(?,'yyyy-MM-dd HH24:mi:ss.ff3') ,taskExceDuration = ? ,state=4,"
            + "finishTime=to_timestamp(?,'yyyy-MM-dd HH24:mi:ss.ff3') where taskid=?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("", list.get("taskexcutetime"));
        paramArr.set("", list.get("duration"));
        paramArr.set("", list.get("taskexcuteduration"));
        paramArr.set("", list.get("taskid"));
        return this.executeUpdate(selectsql, paramArr);
    }

    @Override
    public int delete(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    @Override
    public void insert(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>

    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return null;
    }

    @Override
    public int update(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    @Override
    public int selectMax() throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Date date = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int year = cal.get(Calendar.YEAR);
        int mon = cal.get(Calendar.MONTH);
        String tableName = "slm_sla_eval_win_inst_";
        if (mon < 10) {
            tableName = tableName + year + "0" + mon;
        }
        else {
            tableName = tableName + year + mon;
        }
        String selectsql = "insert into SLM_SLA_EVAL_INST(task_id,INST_STATE,BTIME,ETIME,SLA_EVALUATE_CYCLE,YEAR,MON,QUARTER,SLA_INSTID) "
            + "select max(task_id),max(INST_STATE),min(BTIME),max(ETIME),max(SLA_EVALUATE_CYCLE),"
            + "max(YEAR),max(MON),max(QUARTER),SLA_INSTID from " + tableName + "group by SLA_INSTID";
        ParamArray paramArr = new ParamArray();
        return this.executeUpdate(selectsql, paramArr);
    }
}
