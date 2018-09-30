package com.ztesoft.zsmart.oss.inms.pm.jobsys.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl.JobAssignTaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.inms.pm.utils.PublicToolUtil;
import com.ztesoft.zsmart.oss.opb.base.exception.BaseAppRuntimeException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

@Component
public class SysJobDaoUtil {

    /**
     * logger <br>
     */
    public Logger logger = LoggerFactory.getLogger(SysJobDaoUtil.class);

    /**
     * dao <br>
     */
    public SysJobDao dao = (SysJobDao) GeneralDAOFactory.create(SysJobDao.class, JdbcUtil.OSS_KDO);

    public SysJobDaoUtil() {
        System.out.println("==============================================");
    }

    /**
     * [方法描述] 获取job注册信息<br> 
     *  
     * @author [作者名]<br>  <br>
     */
    public void getJobRegisterInfo() {
        List<Map<String, Object>> _slist = dao.getJobRegisterInfo();
        for (Map<String, Object> _smap : _slist) {
            Object taskType = _smap.get("JOB_TASK_TYPE");
            Object jobClasspath = _smap.get("JOB_CLASS_PATH");
            if (taskType == null || taskType.equals("") || jobClasspath == null || jobClasspath.equals("")) continue;
            JobProduceSpecInstInfo.mapTaskTypeClass.put(String.valueOf(taskType), String.valueOf(jobClasspath));
        }
        logger.info("getJobRegisterInfo size:" + JobProduceSpecInstInfo.mapTaskTypeClass.size());
    }

    /**
     * [方法描述] 获取所有任务调度信息<br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public List<Map<String, Object>> getValidTaskNoScheduleInfo() {
        return dao.getValidTaskNoScheduleInfo();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNo
     * @param taskNoVer
     * @param cycle
     * @return  <br>
     */
    public Date getTaskCreateTableInfo(String taskNo, String taskNoVer, String cycle) {
        return dao.getTaskCreateTableInfo(taskNo, taskNoVer, cycle);
    }

    /**
     * [方法描述] 更新一条数据至 PM_TASK_PARAM_VER <br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer
     * @return  <br>
     */
    @Transactional(timeout = 90)
    public int insertEachTaskParamVer(TaskParamVer taskParamVer) {
        try {
            dao.deleteParamVer(taskParamVer);
            dao.insertParamVer(taskParamVer);
            return 0;
        }
        catch (BaseAppRuntimeException e) {
            logger.error("insertEachTaskParamVer exception [" + e + "]");
            return 1;
        }
    }

    @Transactional(timeout = 90)
    public void insertListTaskInst(List<TaskInst> listInstSuf, String taskNo, String taskNoVer, String taskType,
            String endTime, Map<String, String> instData4creat) {
        try {
            dao.deleteTaskInstTime(taskNo, taskNoVer, taskType, endTime);
            dao.updateTaskCreatTable(instData4creat);
            int cnt = dao.insertTaskInst(listInstSuf);
            logger.info("insertListTaskInst success size :" + cnt + " listInstSuf size:" + listInstSuf.size());
        }
        catch (BaseAppRuntimeException e) {
            logger.error("insertListInstParam exception [" + e + "]");
        }
    }

    /**
     * [方法描述] 获取等待分配的实例<br> 
     *  
     * @author [作者名]<br>
     * @param deadline
     * @return  <br>
     */
    public List<TaskInst> getWaitAssignInst(String deadline) {
        try {
            return dao.getWaitAssignInst(deadline);
        }
        catch (Exception e) {
            return new ArrayList<TaskInst>();
        }
    }

    @Transactional(timeout = 90)
    public void updateTaskInstPiece(Map<String, List<TaskInst>> mapTaskNoListInst) {
        try {
            int cnt = 0;
            for (Entry<String, List<TaskInst>> en : mapTaskNoListInst.entrySet()) {
                cnt += dao.updateTaskInstPiece(en.getValue());
            }
            logger.info("updateTaskInstPiece update pieceSeq size:" + cnt);
        }
        catch (BaseAppRuntimeException e) {
            logger.error("updateTaskInstPiece exception [" + e + "]");
        }
    }

    @Transactional(timeout = 30)
    public int updateOneTaskInst(TaskInst inst) {
        try {
            return dao.updateOneTaskInst(inst);
        }
        catch (BaseAppRuntimeException e) {
            logger.error("updateOneTaskInst exception [" + e + "]");
            return 0;
        }
    }

    @Transactional(timeout = 30)
    public int updateAfterExecuTaskInst(TaskInst inst) {
        try {
            return dao.updateAfterExecuTaskInst(inst);
        }
        catch (BaseAppRuntimeException e) {
            logger.error("updateAfterExecuTaskInst exception [" + e + "]");
            return 0;
        }
    }

    public List<TaskInst> getExecuTaskInst(int pieceSeq) {
        List<TaskInst> listTaskInst = new ArrayList<TaskInst>();

        try {
            String taskIds = "";
            List<Map<String, Object>> _list = dao.getExecuTaskInst(pieceSeq);
            if (_list.size() == 0) return listTaskInst;
            for (Map<String, Object> data : _list) {
                listTaskInst.add(mapToInst(data));

                taskIds = taskIds + "'" + PublicToolUtil.ObjectToStr(data.get("TASK_ID")) + "',";
            }
            taskIds = "(" + taskIds.substring(0, taskIds.length() - 1) + ")";

            List<Map<String, Object>> _listExtParam = dao.getExecuTaskInstExtParam(taskIds);
            Map<String, String> mapTaskIDParam = preduceExtParam(_listExtParam);

            for (TaskInst inst : listTaskInst) {
                String param = mapTaskIDParam.get(inst.getTaskID());
                inst.setTaskParam((param == null) ? "" : param);
            }
        }
        catch (BaseAppRuntimeException e) {
            logger.error("getExecuTaskInst exception [" + e + "]");
        }
        finally {
            logger.info("getExecuTaskInst by pieceSeq:" + pieceSeq + " size:" + listTaskInst.size());
        }
        return listTaskInst;
    }

    private Map<String, String> preduceExtParam(List<Map<String, Object>> _listExtParam) {
        Map<String, String> mapTaskIDParam = new HashMap<String, String>();
        for (Map<String, Object> ret : _listExtParam) {
            String taskID = PublicToolUtil.ObjectToStr(ret.get("TASK_ID"));
            String taskParam = PublicToolUtil.ObjectToStr(ret.get("TASK_PARAM"));
            String param = mapTaskIDParam.get(taskID);
            if (param == null) mapTaskIDParam.put(taskID, taskParam);
            else mapTaskIDParam.put(taskID, param + taskParam);
        }
        return mapTaskIDParam;
    }

    private TaskInst mapToInst(Map<String, Object> data) {
        TaskInst inst = new TaskInst();
        inst.setBtime(PublicToolUtil.ObjectToStr(data.get("BTIME")));
        inst.setEtime(PublicToolUtil.ObjectToStr(data.get("ETIME")));
        inst.setTaskNo(PublicToolUtil.ObjectToStr(data.get("TASK_NO")));
        inst.setTaskID(PublicToolUtil.ObjectToStr(data.get("TASK_ID")));
        inst.setTaskName(PublicToolUtil.ObjectToStr(data.get("TASK_NAME")));
        inst.setTaskType(PublicToolUtil.ObjectToStr(data.get("TASK_TYPE")));
        // inst.setTaskServIP((String) data.get("TASK_SERV_IP"));
        // inst.setTaskServUser((String) data.get("TASK_SERV_USER"));
        inst.setTaskState(PublicToolUtil.ObjectToStr(data.get("TASK_STATE")));
        inst.setDelayTime(PublicToolUtil.ObjectToInt(data.get("DELAY_TIME")));
        inst.setTaskCreateDate(PublicToolUtil.ObjectToStr(data.get("TASK_CREATE_DATE")));
        inst.setTaskExecDate(PublicToolUtil.ObjectToStr(data.get("TASK_EXEC_DATE")));
        // inst.setTaskFinishDate((String) data.get("TASK_FINISH_DATE"));
        // inst.setTaskExecDuration((Integer) data.get("TASK_EXEC_DURATION"));
        inst.setTaskExecTimes(PublicToolUtil.ObjectToInt(data.get("TASK_EXEC_TIMES")));
        // inst.setTaskExceptInfo((String) data.get("TASK_EXCEPT_INFO"));
        inst.setTaskNoVer(PublicToolUtil.ObjectToStr(data.get("TASK_NO_VER")));
        inst.setCycleSchduleType(PublicToolUtil.ObjectToStr(data.get("CYCLE_SCHDULE_TYPE")));
        inst.setMachineNo(PublicToolUtil.ObjectToStr(data.get("MACHINE_NO")));
        inst.setExtParamFlag(PublicToolUtil.ObjectToStr(data.get("EXT_PARAMFLAG")));
        inst.setPieceSeq(PublicToolUtil.ObjectToInt(data.get("PIECE_SEQ")));
        inst.setTaskAssignDate(PublicToolUtil.ObjectToStr(data.get("TASK_ASSIGN_DATE")));
        return inst;
    }

    public Map<String, TaskParamVer> getMapTaskParamVer() {

        Map<String, TaskParamVer> mapTaskParamVer = new HashMap<String, TaskParamVer>();
        try {
            List<Map<String, Object>> listData = dao.getMapTaskParamVer();
            for (Map<String, Object> data : listData) {
                String taskNo = PublicToolUtil.ObjectToStr(data.get("TASK_NO"));
                String taskNoVer = PublicToolUtil.ObjectToStr(data.get("TASK_NO_VER"));
                String param = PublicToolUtil.ObjectToStr(data.get("TASK_PARAM"));
                if (mapTaskParamVer.containsKey(taskNo + taskNoVer)) {
                    TaskParamVer ver = mapTaskParamVer.get(taskNo + taskNoVer);
                    ver.setTaskParam(ver.getTaskParam() + param);
                    mapTaskParamVer.put(taskNo + taskNoVer, ver);
                }
                else mapTaskParamVer.put(taskNo + taskNoVer,
                        new TaskParamVer(PublicToolUtil.ObjectToStr(data.get("PARAM_TYPE")), taskNo, taskNoVer,
                                PublicToolUtil.ObjectToInt(data.get("PARAM_SEQ")), param,
                                PublicToolUtil.ObjectToStr(data.get("RECTIME")),
                                PublicToolUtil.ObjectToStr(data.get("CYCLE_SCHDULE_TYPE"))));

            }
            logger.info("getMapTaskParamVer size:" + mapTaskParamVer.size());
        }
        catch (BaseAppRuntimeException e) {
            logger.error("getMapTaskParamVer exception [" + e + "]");
        }
        return mapTaskParamVer;
    }
}
