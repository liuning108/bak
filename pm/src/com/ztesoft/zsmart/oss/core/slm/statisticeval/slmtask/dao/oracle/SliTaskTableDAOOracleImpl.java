package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliTaskTableDAO;

/**
 * [调度任务表查询] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年8月12日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle <br>
 *      查询sli任务表 修改sli任务表 插入sli任务表
 */
public class SliTaskTableDAOOracleImpl extends SliTaskTableDAO {
    /**
     * [查询未调度状态任务] <br>
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
            + "to_char(etime,'yyyy-mm-dd hh24:mi:ss') as etime,sla_instid,slo_instid,sli_instid,sli_no,task_type,"
            + "st_table,evaluate_cycle,cal_cycle,warn_value,objectives_value,delaytime,"
            + "operator,daypattern_id,timepattern_id,cycle_units from slm_sli_task where state = 1 and etime < ?";
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
        String selectsql = "insert into slm_sli_task_his(taskId,btime,etime,sla_instid,slo_instid,"
            + "sli_instid,sli_no,task_type,st_table,evaluate_cycle,warn_value,objectives_value,delayTime,"
            + "taskcreatetime,taskExceTime,exceptinfo,taskExceDuration,finishTime,DAYPATTERN_ID,TIMEPATTERN_ID,STATE)"
            + "select taskId,btime,etime,sla_instid,slo_instid,sli_instid,sli_no,task_type,"
            + "st_table,evaluate_cycle,warn_value,objectives_value,delayTime,taskcreatetime,"
            + "taskexcetime,exceptinfo,taskExceDuration,finishtime,DAYPATTERN_ID,TIMEPATTERN_ID,STATE from slm_sli_task where state = 0 OR state =4";
        String selectsql2 = "delete from slm_sli_task where state = 0 OR state =4";

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
    @Override
    public int updateExcuteTaskState(HashMap<String, String> list) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String selectsql = "update slm_sli_task set taskexcetime = to_timestamp(?,'yyyy-MM-dd HH24:mi:ss.ff3') ,"
            + "taskExceDuration = ? ,state=0,finishTime=to_timestamp(?,'yyyy-MM-dd HH24:mi:ss.ff3') where taskid=?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("", list.get("taskexcutetime"));
        paramArr.set("", list.get("duration"));
        paramArr.set("", list.get("taskexcuteduration"));
        paramArr.set("", list.get("taskid"));
        return this.executeUpdate(selectsql, paramArr);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @param list <br>
     * @throws BaseAppException <br>
     */
    public void insertTableNameData(String taskId, List<String> list) throws BaseAppException {
        String insertSql = "INSERT INTO slm_sli_task_sttables (taskid,st_table)VALUES(?,?)";

        for (int i = 0; i < list.size(); i++) {
            ParamArray paramarray = new ParamArray();
            paramarray.set("", taskId);
            paramarray.set("", list.get(i));
            executeUpdate(insertSql, paramarray);
        }
    }

    @Override
    public int updateTaskState(String taskid) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String selectsql = "update slm_sli_task set state=2 where taskid=?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("", taskid);
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

    /**
     * [任务分解插入未调度新任务] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0 <br>
     * @throws BaseAppException <br>
     */
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
}
