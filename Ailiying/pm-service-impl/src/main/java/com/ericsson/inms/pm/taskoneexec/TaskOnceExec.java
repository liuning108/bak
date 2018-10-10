package com.ericsson.inms.pm.taskoneexec;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.ericsson.inms.pm.schedule.jobsys.TaskBase;
import com.ericsson.inms.pm.schedule.jobsys.model.JobResult;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.taskoneexec.model.OnceExecArg;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月14日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.taskoneexec <br>
 */
public class TaskOnceExec implements TaskBase {

    /**
     * logger <br>
     */
    private final static OpbLogger logger = OpbLogger.getLogger(TaskOnceExec.class, "PM");

    /**
     * [方法描述] 无需规格参数<br>
     * 
     * @author [作者名]<br>
     * @param listTaskNo ArrayList<String>
     * @return <br>
     */
    @Override
    public Map<String, List<TaskParamVer>> produceSpecParam(ArrayList<String> listTaskNo) {
        return null;
    }

    /**
     * [方法描述] 无实例参数<br>
     * 
     * @author [作者名]<br>
     * @param listTaskInst ArrayList<TaskInst>
     * @param taskParamVer TaskParamVer
     * @return <br>
     */
    @Override
    public List<TaskInst> produceInstParam(ArrayList<TaskInst> listTaskInst, TaskParamVer taskParamVer) {
        return listTaskInst;
    }

    /**
     * [方法描述] 调用一次性实例<br>
     * 
     * @author [作者名]<br>
     * @param taskParamVer TaskParamVer
     * @param taskInst TaskInst
     * @return <br>
     */
    @Override
    public JobResult executeJob(TaskParamVer taskParamVer, TaskInst taskInst) {
        // TODO Auto-generated method stub
        JobResult r = new JobResult();
        OnceExecArg arg = JSON.parseObject(taskInst.getTaskParam(), OnceExecArg.class);
        String classPath = arg.getClassPath();
        OnceExecArg onceExecArg = JSON.parseObject(taskInst.getTaskParam(), OnceExecArg.class);
        try {
            Class<?> xx = ClassLoader.getSystemClassLoader().loadClass(classPath);
            JobResult rs = ((IOnecExecInst) xx.newInstance()).executeInst(taskParamVer, taskInst, onceExecArg);
            return rs;
        }
        catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
            logger.error("ONEEXEC-E-001", " classPath[" + classPath + "] executeAdapter exception:", e);
        }
        return r;
    }

}
