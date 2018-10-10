package com.ericsson.inms.pm.schedule.jobsys.dao.mysql;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDao;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.schedule.jobsys.tool.TimeProcess;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.jobsys.dao.mysql <br>
 */
public class SysJobDaoMysqlImpl extends SysJobDao {
    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(SysJobDaoMysqlImpl.class, "PM");

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    @Override
    public List<Map<String, Object>> getJobRegisterInfo() {
        String sql = "SELECT JOB_TASK_TYPE, JOB_CLASS_PATH FROM PM_JOB_REGISTER_INFO";
        logger.debug("getJobRegisterInfo sql[" + sql + "]");
        return this.queryForList(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    @Override
    public List<Map<String, Object>> getValidTaskNoScheduleInfo(String type) {
        String sql = "select A.TASK_NO,A.SCHDULE_TYPE,A.CYCLE_SCHDULE_TYPE,"
                + "date_format(A.EFF_DATE,'%Y-%m-%d %H:%i:%S') AS EFF_DATE,"
                + "date_format(A.EXP_DATE,'%Y-%m-%d %H:%i:%S') AS EXP_DATE,"
                + "date_format(A.TRIGGER_DATE,'%Y-%m-%d %H:%i:%S') AS TRIGGER_DATE,"
                + "A.TRIGGER_TIME AS TRIGGER_TIME,A.INTERVAL_PERIOD AS INTERVAL_PERIOD,"
                + "A.MW AS MW,B.TASK_TYPE AS TASK_TYPE,date_format(B.OPER_DATE,'%Y-%m-%d %H:%i:%S') as OPER_DATE ,B.TASK_NAME as TASK_NAME,"
                + "B.STATE AS STATE,B.EMS_CODE,B.EMS_TYPE_REL_ID,B.EMS_VER_CODE"
                + " from PM_TASK_SCHDULE  A,PM_TASK_INFO B where A.TASK_NO = B.TASK_NO AND B.STATE=1  AND A.EXP_DATE > A.EFF_DATE";
        if (type.length() != 0) sql = sql + " AND B.TASK_TYPE = '" + type + "'";
        logger.debug("getValidTaskNoScheduleInfo sql[" + sql + "]");
        return this.queryForList(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNo 
     * @param taskVer 
     * @param cycle 
     * @return <br>
     */
    @Override
    public Date getTaskCreateTableInfo(String taskNo, String taskVer, String cycle) {
        String sql = "select date_format(TASK_TRRIGER_DATE,'%Y-%m-%d %H:%i:%S') TASK_TRRIGER_DATE from PM_TASK_CREATE_INFO where TASK_NO = '"
                + taskNo + "' and TASK_NO_VER= '" + taskVer + "' and CYCLE_SCHDULE_TYPE = '" + cycle + "'";
        logger.debug("getTaskCreateTableInfo sql[" + sql + "]");
        Map<String, Object> map = this.queryForMap(sql);
        if (map != null && map.containsKey("TASK_TRRIGER_DATE")) {
            return TimeProcess.getInstance().getStrTime(String.valueOf(map.get("TASK_TRRIGER_DATE")));
        }
        return null;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer <br>
     */
    @Override
    public void deleteParamVer(TaskParamVer taskParamVer) {
        String sql = "delete from PM_TASK_PARAM_VER where TASK_NO='" + taskParamVer.getTaskNo() + "' and TASK_NO_VER='"
                + taskParamVer.getTaskNoVer() + "' and CYCLE_SCHDULE_TYPE = '" + taskParamVer.getCycleSchduleType()
                + "'";
        if ("L".equals(taskParamVer.getParamType()) || "C".equals(taskParamVer.getParamType())) {
            String ext = sql + " AND PARAM_TYPE = ''";
            this.update(ext);
            sql = sql + " AND PARAM_TYPE = '" + taskParamVer.getParamType() + "'";
        }
        logger.debug("deleteParamVer sql[" + sql + "]");
        this.update(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer <br>
     */
    @Override
    public void insertParamVer(TaskParamVer taskParamVer) {
        String TASK_PARAM = taskParamVer.getTaskParam();
        for (int len = 0, i = 0; i < TASK_PARAM.length() / 3000 + 1; i++, len = len + 3000) {
            String str = "";
            if (len + 3000 > TASK_PARAM.length()) {
                str = TASK_PARAM.substring(len, TASK_PARAM.length());
            }
            else {
                str = TASK_PARAM.substring(len, len + 3000);
            }
            if (str.length() > 0 && str.charAt(str.length() - 1) == '\\') {
                str = str.substring(0, str.length() - 1);
                len = len - 1;
            }
            String sql = "INSERT INTO  PM_TASK_PARAM_VER(PARAM_TYPE,TASK_NO,TASK_NO_VER,PARAM_SEQ,TASK_PARAM,RECTIME,CYCLE_SCHDULE_TYPE"
                    + ") VALUES('" + taskParamVer.getParamType() + "','" + taskParamVer.getTaskNo() + "','"
                    + taskParamVer.getTaskNoVer() + "'," + i + ",'" + str.replace("'", "''") + "',str_to_date('"
                    + taskParamVer.getRectime() + "','%Y-%m-%d %H:%i:%S'),'" + taskParamVer.getCycleSchduleType()
                    + "')";

            logger.debug("insertParamVer taskNo[" + taskParamVer.getTaskNo() + "] PARAM_TYPE["
                    + taskParamVer.getParamType() + "] seq[" + i + "] ");
            this.update(sql);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNo 
     * @param taskNoVer 
     * @param taskType 
     * @param btime 
     * @param etime <br> 
     */
    @Override
    public void deleteTaskInstTime(String taskNo, String taskNoVer, String taskType, String btime, String etime) {

        String sql = "PM_TASK_INST WHERE TASK_NO='" + taskNo + "' AND TASK_NO_VER = '" + taskNoVer
                + "' AND BTIME >= str_to_date('" + btime + "','%Y-%m-%d %H:%i:%S') AND BTIME <= str_to_date('" + etime
                + "','%Y-%m-%d %H:%i:%S')";
        String sql1 = "PM_TASK_INST WHERE TASK_NO='" + taskNo + "' AND TASK_STATE ='L'";

        String extSql = "DELETE FROM PM_TASK_INST_EXT_PARAM WHERE TASK_ID IN ";
        if (taskType.equals("09")) {
            logger.debug("deleteTaskInstTime sql[" + extSql + "(SELECT TASK_ID FROM " + sql1 + ")" + "]");
            this.update(extSql + "(SELECT TASK_ID FROM " + sql1 + ")");

            logger.debug("deleteTaskInstTime sql[DELETE FROM " + sql1 + "]");
            this.update("DELETE " + sql1);
        }
        else {
            logger.debug("deleteTaskInstTime sql[" + extSql + "(SELECT TASK_ID FROM " + sql + ")" + "]");
            this.update(extSql + "(SELECT TASK_ID FROM " + sql + ")");
            logger.debug("deleteTaskInstTime [DELETE FROM " + sql + "]");
            this.update("DELETE FROM " + sql);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param instData4creat <br>
     */
    @Override
    public void updateTaskCreatTable(Map<String, String> instData4creat) {
        String deleteSql = "delete from PM_TASK_CREATE_INFO where TASK_NO = '" + instData4creat.get("TASK_NO")
                + "' and TASK_NO_VER= '" + instData4creat.get("TASK_NO_VER") + "' and CYCLE_SCHDULE_TYPE = '"
                + instData4creat.get("CYCLE_SCHDULE_TYPE") + "'";
        logger.debug("updateTaskCreatTable deleteSql[" + deleteSql + "]");
        this.update(deleteSql);

        String insertSql = "insert into PM_TASK_CREATE_INFO(TASK_NO,TASK_NO_VER,TASK_TRRIGER_DATE,OPERATE_DATE,CYCLE_SCHDULE_TYPE) VALUES('"
                + instData4creat.get("TASK_NO") + "','" + instData4creat.get("TASK_NO_VER") + "',str_to_date('"
                + instData4creat.get("TASK_TRRIGER_DATE") + "','%Y-%m-%d %H:%i:%S'),str_to_date('"
                + instData4creat.get("OPERATE_DATE") + "','%Y-%m-%d %H:%i:%S'),'"
                + instData4creat.get("CYCLE_SCHDULE_TYPE") + "')";
        logger.debug("updateTaskCreatTable insertSql[" + insertSql + "]");
        this.update(insertSql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listInst <br>
     */
    @Override
    public void deleteTaskInst(List<TaskInst> listInst) {
        if (listInst.size() == 0) return;
        String taskIds = "(";
        for (TaskInst inst : listInst)
            taskIds = taskIds + "'" + inst.getTaskID() + "',";
        taskIds = taskIds.substring(0, taskIds.length() - 1) + ")";
        String sql = "DELETE FROM PM_TASK_INST WHERE TASK_ID IN " + taskIds;
        logger.debug("deleteTaskInst sql [" + sql + "]");
        this.update(sql);

        sql = "DELETE FROM PM_TASK_INST_EXT_PARAM WHERE TASK_ID IN " + taskIds;
        logger.debug("deleteTaskInst sql [" + sql + "]");
        this.update(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listInstSuf
     * @return <br>
     */
    @Override
    public int insertTaskInst(List<TaskInst> listInstSuf) {
        int cnt = 0;
        String sql = "INSERT INTO PM_TASK_INST(BTIME, ETIME, TASK_NO, TASK_ID, TASK_NAME, TASK_TYPE, TASK_SERV_IP, TASK_SERV_USER, "
                + "TASK_STATE, DELAY_TIME, TASK_CREATE_DATE, TASK_EXEC_DATE, TASK_FINISH_DATE, TASK_EXEC_DURATION, TASK_EXEC_TIMES, "
                + "TASK_EXCEPT_INFO, TASK_NO_VER, CYCLE_SCHDULE_TYPE, MACHINE_NO, EXT_PARAMFLAG, PIECE_SEQ)"
                + "  VALUES(str_to_date(?,'%Y-%m-%d %H:%i:%S'), str_to_date(?,'%Y-%m-%d %H:%i:%S'), ?, ?, ?, ?, ?, ?, ?, ?, "
                + "str_to_date(?,'%Y-%m-%d %H:%i:%S'), str_to_date(?,'%Y-%m-%d %H:%i:%S'), "
                + "str_to_date(?,'%Y-%m-%d %H:%i:%S'), ?, ?, ?, ?, ?, ?, ?, ?)" + "";
        List<Object[]> batchArgs = new ArrayList<Object[]>();
        for (TaskInst inst : listInstSuf) {
            Object[] obj = new Object[21];
            obj[0] = inst.getBtime();
            obj[1] = inst.getEtime();
            obj[2] = inst.getTaskNo();
            obj[3] = inst.getTaskID();
            obj[4] = inst.getTaskName();
            obj[5] = inst.getTaskType();
            obj[6] = inst.getTaskServIP();
            obj[7] = inst.getTaskServUser();
            obj[8] = inst.getTaskState();
            obj[9] = inst.getDelayTime();
            obj[10] = inst.getTaskCreateDate();
            obj[11] = inst.getTaskExecDate();
            obj[12] = inst.getTaskFinishDate();
            obj[13] = inst.getTaskExecDuration();
            obj[14] = inst.getTaskExecTimes();
            obj[15] = inst.getTaskExceptInfo();
            obj[16] = inst.getTaskNoVer();
            obj[17] = inst.getCycleSchduleType();
            obj[18] = inst.getMachineNo();
            obj[19] = inst.getExtParamFlag();
            obj[20] = inst.getPieceSeq();
            batchArgs.add(obj);
        }
        int t[] = this.batchUpdate(sql, batchArgs);
        for (int a : t) {
            cnt += ((-2 == a) ? 1 : 0);
        }
        insertTaskInstExtParam(listInstSuf);
        return cnt;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listInstSuf  <br>
     */
    private void insertTaskInstExtParam(List<TaskInst> listInstSuf) {
        String sql = "INSERT INTO PM_TASK_INST_EXT_PARAM(TASK_ID,PARAM_FLAG,PARAM_SEQ,TASK_PARAM) VALUES(?,?,?,?)";
        List<Object[]> batchArgs = new ArrayList<Object[]>();

        for (TaskInst inst : listInstSuf) {
            String param = inst.getTaskParam();
            if (param.length() < 3500) {
                Object[] obj = new Object[4];
                obj[0] = inst.getTaskID();
                obj[1] = "0";
                obj[2] = 0;
                obj[3] = inst.getTaskParam().replace("'", "''");
                batchArgs.add(obj);
                Object[] objOld = new Object[4];
                objOld[0] = inst.getTaskID();
                objOld[1] = "1";
                objOld[2] = 0;
                objOld[3] = inst.getTaskParam().replace("'", "''");
                batchArgs.add(objOld);
            }
            else {
                for (int len = 0, i = 0; i < param.length() / 3500 + 1; i++, len = len + 3500) {
                    Object[] obj = new Object[4];
                    obj[0] = inst.getTaskID();
                    obj[1] = "0";
                    obj[2] = i;
                    if (len + 3500 > param.length()) {
                        obj[3] = param.substring(len, param.length()).replace("'", "''");
                    }
                    else {
                        obj[3] = param.substring(len, len + 3500).replace("'", "''");
                    }
                    batchArgs.add(obj);

                    Object[] objOld = new Object[4];
                    objOld[0] = inst.getTaskID();
                    objOld[1] = "1";
                    objOld[2] = i;
                    if (len + 3500 > param.length()) {
                        objOld[3] = param.substring(len, param.length()).replace("'", "''");
                    }
                    else {
                        objOld[3] = param.substring(len, len + 3500).replace("'", "''");
                    }
                    batchArgs.add(objOld);
                }
            }
        }
        int t[] = this.batchUpdate(sql, batchArgs);
        int cnt = 0;
        for (int a : t) {
            cnt += ((-2 == a) ? 1 : 0);
        }
        logger.debug(
                "insertTaskInstExtParam batchArgs size :" + batchArgs.size() + " cnt :" + cnt + " sql[" + sql + "]");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param deadline
     * @return <br>
     */
    @Override
    public List<TaskInst> getWaitAssignInst(String deadline) {
        String sql = "SELECT TASK_NO, TASK_ID, TASK_TYPE, TASK_STATE, TASK_NO_VER FROM PM_TASK_INST WHERE "
                + " (TASK_STATE ='1' or TASK_STATE ='4') AND TASK_EXEC_DATE <= str_to_date('" + deadline
                + "', '%Y-%m-%d %H:%i:%S')";
        List<Map<String, Object>> _list = this.queryForList(sql);
        List<TaskInst> listInst = new ArrayList<TaskInst>();
        for (Map<String, Object> data : _list) {
            TaskInst inst = new TaskInst();
            inst.setTaskNo((String) data.get("TASK_NO"));
            inst.setTaskID((String) data.get("TASK_ID"));
            inst.setTaskType((String) data.get("TASK_TYPE"));
            inst.setTaskState((String) data.get("TASK_STATE"));
            inst.setTaskNoVer((String) data.get("TASK_NO_VER"));
            listInst.add(inst);
        }
        logger.debug("getWaitAssignInst size: " + _list.size() + " sql [" + sql + "]");
        return listInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst
     * @return <br>
     */
    @Override
    public int updateTaskInstPiece(List<TaskInst> listTaskInst) {
        String sql = "UPDATE PM_TASK_INST SET TASK_STATE = ? ,TASK_ASSIGN_DATE=str_to_date(?,'%Y-%m-%d %H:%i:%S'),PIECE_SEQ=? WHERE TASK_ID = ?";
        List<Object[]> batchArgs = new ArrayList<Object[]>();
        for (TaskInst inst : listTaskInst) {
            Object[] obj = new Object[4];
            obj[0] = inst.getTaskState();
            obj[1] = inst.getTaskAssignDate();
            obj[2] = inst.getPieceSeq();
            obj[3] = inst.getTaskID();
            batchArgs.add(obj);
        }

        int t[] = this.batchUpdate(sql, batchArgs);
        int cnt = 0;
        for (int a : t) {
            cnt += ((-2 == a) ? 1 : 0);
        }
        return cnt;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst
     * @return <br>
     */
    @Override
    public int updateTaskInstAllField(List<TaskInst> listTaskInst) {
        String sql = "UPDATE PM_TASK_INST SET TASK_STATE = ? ,TASK_ASSIGN_DATE=str_to_date(?,'%Y-%m-%d %H:%i:%S'),PIECE_SEQ=? WHERE TASK_ID = ?";
        List<Object[]> batchArgs = new ArrayList<Object[]>();
        for (TaskInst inst : listTaskInst) {
            Object[] obj = new Object[4];
            obj[0] = inst.getTaskState();
            obj[1] = inst.getTaskAssignDate();
            obj[2] = inst.getPieceSeq();
            obj[3] = inst.getTaskID();
            batchArgs.add(obj);
        }

        int t[] = this.batchUpdate(sql, batchArgs);
        int cnt = 0;
        for (int a : t) {
            cnt += ((-2 == a) ? 1 : 0);
        }
        return cnt;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param pieceSeq 
     * @return <br>
     */
    @Override
    public List<Map<String, Object>> getExecuTaskInst(int pieceSeq) {
        String sql = "SELECT date_format(BTIME,'%Y-%m-%d %H:%i:%S') BTIME, date_format(ETIME,'%Y-%m-%d %H:%i:%S') ETIME, "
                + "TASK_NO, TASK_ID, TASK_NAME, TASK_TYPE, TASK_SERV_IP, TASK_SERV_USER, "
                + "TASK_STATE, DELAY_TIME, date_format(TASK_CREATE_DATE,'%Y-%m-%d %H:%i:%S') TASK_CREATE_DATE, "
                + "date_format(TASK_EXEC_DATE,'%Y-%m-%d %H:%i:%S') TASK_EXEC_DATE, "
                + "date_format(TASK_FINISH_DATE,'%Y-%m-%d %H:%i:%S') TASK_FINISH_DATE, TASK_EXEC_DURATION, TASK_EXEC_TIMES, "
                + "TASK_EXCEPT_INFO, TASK_NO_VER, CYCLE_SCHDULE_TYPE, MACHINE_NO, EXT_PARAMFLAG, PIECE_SEQ, "
                + "date_format(TASK_ASSIGN_DATE,'%Y-%m-%d %H:%i:%S') TASK_ASSIGN_DATE FROM PM_TASK_INST WHERE "
                + "TASK_STATE = 'A' AND PIECE_SEQ = " + pieceSeq;
        logger.debug("getExecuTaskInst sql[" + sql + "]");
        return this.queryForList(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskID
     * @return <br>
     */
    @Override
    public List<Map<String, Object>> getExecuTaskInstByTaskID(String taskID) {
        String sql = "SELECT date_format(BTIME,'%Y-%m-%d %H:%i:%S') BTIME, date_format(ETIME,'%Y-%m-%d %H:%i:%S') ETIME, "
                + "TASK_NO, TASK_ID, TASK_NAME, TASK_TYPE, TASK_SERV_IP, TASK_SERV_USER, "
                + "TASK_STATE, DELAY_TIME, date_format(TASK_CREATE_DATE,'%Y-%m-%d %H:%i:%S') TASK_CREATE_DATE, "
                + "date_format(TASK_EXEC_DATE,'%Y-%m-%d %H:%i:%S') TASK_EXEC_DATE, "
                + "date_format(TASK_FINISH_DATE,'%Y-%m-%d %H:%i:%S') TASK_FINISH_DATE, TASK_EXEC_DURATION, TASK_EXEC_TIMES, "
                + "TASK_EXCEPT_INFO, TASK_NO_VER, CYCLE_SCHDULE_TYPE, MACHINE_NO, EXT_PARAMFLAG, PIECE_SEQ, "
                + "date_format(TASK_ASSIGN_DATE,'%Y-%m-%d %H:%i:%S') TASK_ASSIGN_DATE FROM PM_TASK_INST WHERE "
                + "TASK_ID = '" + taskID + "'";
        logger.debug("getExecuTaskInst sql[" + sql + "]");
        return this.queryForList(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskIds 
     * @return <br>
     */
    @Override
    public List<Map<String, Object>> getExecuTaskInstExtParam(String taskIds) {
        String sql = "SELECT TASK_ID,PARAM_SEQ,TASK_PARAM  FROM PM_TASK_INST_EXT_PARAM WHERE PARAM_FLAG = 0 AND TASK_ID in "
                + taskIds + " ORDER BY TASK_ID,PARAM_SEQ ASC";
        logger.debug("getExecuTaskInstExtParam sql[" + sql + "]");
        return this.queryForList(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param inst 
     * @return <br>
     */
    @Override
    public int updateOneTaskInst(TaskInst inst) {
        String sql = "update PM_TASK_INST set TASK_STATE = '" + inst.getTaskState() + "', TASK_EXCEPT_INFO = '"
                + inst.getTaskExceptInfo() + "' where task_id = '" + inst.getTaskID() + "'";
        return this.update(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param inst  
     * @return <br>
     */
    @Override
    public int updateAfterExecuTaskInst(TaskInst inst) {
        String sql = "UPDATE PM_TASK_INST SET TASK_STATE = ? ,TASK_EXEC_DATE=str_to_date(?,'%Y-%m-%d %H:%i:%S'),"
                + " TASK_FINISH_DATE=str_to_date(?,'%Y-%m-%d %H:%i:%S'),TASK_EXEC_DURATION=?,TASK_EXEC_TIMES=?,"
                + "TASK_EXCEPT_INFO=? WHERE TASK_ID = ?";
        return this.update(sql, inst.getTaskState(), inst.getTaskExecDate(), inst.getTaskFinishDate(),
                inst.getTaskExecDuration(), inst.getTaskExecTimes(), inst.getTaskExceptInfo(), inst.getTaskID());
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    @Override
    public List<Map<String, Object>> getMapTaskParamVer() {
        String sql = "select PARAM_TYPE,TASK_NO,TASK_NO_VER,PARAM_SEQ,TASK_PARAM,RECTIME,CYCLE_SCHDULE_TYPE from PM_TASK_PARAM_VER where param_type <> 'L' order by TASK_NO,PARAM_SEQ ASC";
        return this.queryForList(sql);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param sql
     * @return <br>
     */
    @Override
    public int updateSql(String sql) {
        return this.update(sql);
    }
}
