package com.ericsson.inms.pm.schedule.jobsys.dao;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.jobsys.dao <br>
 */
public abstract class SysJobDao extends GeneralDAO<Map<String, String>> {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    /**
     * [方法描述] 获取job 注册类信息<br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public abstract List<Map<String, Object>> getJobRegisterInfo();

    /**
     * [方法描述] 获取state 有效的task_no 的调度信息<br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public abstract List<Map<String, Object>> getValidTaskNoScheduleInfo(String type);

    /**
     * [方法描述] 获取task_no 的已经创建的时间<br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public abstract Date getTaskCreateTableInfo(String taskNo, String taskVer, String cycle);

    /**
     * [方法描述] 删除规格信息<br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer
     * @return  <br>
     */
    public abstract void deleteParamVer(TaskParamVer taskParamVer);

    /**
     * [方法描述] 插入规格信息<br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer
     * @return  <br>
     */
    public abstract void insertParamVer(TaskParamVer taskParamVer);

    /**
     * [方法描述] 清理任务结束时间之后的实例<br> 
     * @author [作者名]<br>
     * @param taskNo
     * @param taskNoVer
     * @param taskType
     * @param btime
     * @param etime <br>
     */
    public abstract void deleteTaskInstTime(String taskNo, String taskNoVer, String taskType, String btime,
            String etime);

    /**
     * [方法描述] 更新任务创建信息<br> 
     *  
     * @author [作者名]<br>
     * @param insertListTaskInst  <br>
     */
    public abstract void updateTaskCreatTable(Map<String, String> instData4creat);

    /**
     * [方法描述] 批量入实例表<br>   
     * @author [作者名]<br>
     * @param listInstSuf
     * @return  <br>
     */
    public abstract int insertTaskInst(List<TaskInst> listInstSuf);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listInst  <br>
     */
    public abstract void deleteTaskInst(List<TaskInst> listInst);

    /**
     * [方法描述] 获取执行时间 < deadline的所有实例 <br> 
     *  
     * @author [作者名]<br>
     * @param deadline
     * @return  <br>
     */
    public abstract List<TaskInst> getWaitAssignInst(String deadline);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst  <br>
     */
    public abstract int updateTaskInstPiece(List<TaskInst> listTaskInst);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst
     * @return  <br>
     */
    public abstract int updateTaskInstAllField(List<TaskInst> listTaskInst);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param pieceSeq  <br>
     */
    public abstract List<Map<String, Object>> getExecuTaskInst(int pieceSeq);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskID
     * @return <br>
     */
    public abstract List<Map<String, Object>> getExecuTaskInstByTaskID(String taskID);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskIds
     * @return  <br>
     */
    public abstract List<Map<String, Object>> getExecuTaskInstExtParam(String taskIds);

    /**
     * [方法描述] 更新一条任务实例 状态<br> 
     *  
     * @author [作者名]<br>
     * @param inst
     * @return  <br>
     */
    public abstract int updateOneTaskInst(TaskInst inst);

    /**
     * [方法描述] 更新一条任务实例 执行后状态<br> 
     *  
     * @author [作者名]<br>
     * @param inst
     * @return  <br>
     */
    public abstract int updateAfterExecuTaskInst(TaskInst inst);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public abstract List<Map<String, Object>> getMapTaskParamVer();

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public abstract int updateSql(String sql);
}
