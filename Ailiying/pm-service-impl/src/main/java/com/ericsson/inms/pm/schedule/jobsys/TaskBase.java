package com.ericsson.inms.pm.schedule.jobsys;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.job <br>
 */
public interface TaskBase {

    /**
     * [方法描述] 根据传入的task_no 返回规格参数表所需要的 jsonStr参数(计算为2条)，提供给后续实例任务执行<br> 
     *  
     * @author [作者名]<br>
     * @param taskNo 一组task_no
     * @return key=taskNo,value=[] 多条规格数据(仅需回填TaskParamVer.paramType TaskParamVer.taskParam))<br>
     */
    public Map<String, List<TaskParamVer>> produceSpecParam(ArrayList<String> listTaskNo);

    /**
     * [方法描述] 回填 list<TaskInst> set TaskInst.instParam 无设为""<br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst 一个task_no 下的一段时间的分片
     * @param taskParamVer  task_no规格参数<br>
     * @return  回填后的值 listTaskInst<br>
     */
    public List<TaskInst> produceInstParam(ArrayList<TaskInst> listTaskInst, TaskParamVer taskParamVer);

    /**
     * [方法描述] job被调度中心拉起后需要执行的业务逻辑<br> 
     *  
     * @author [作者名]<br>
     * @param taskParamVer  规格参数
     * @param taskInst        实例信息
     * @return 执行结果 <br>
     */
    public JobResult executeJob(TaskParamVer taskParamVer, TaskInst taskInst);

}
