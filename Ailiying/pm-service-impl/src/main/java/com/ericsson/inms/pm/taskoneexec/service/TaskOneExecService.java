package com.ericsson.inms.pm.taskoneexec.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.ericsson.inms.pm.api.service.taskoneexec.ITaskOneExecService;
import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDaoUtil;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.tool.TimeProcess;
import com.ericsson.inms.pm.taskoneexec.model.OnceExecArg;
import com.ericsson.inms.pm.utils.PublicToolUtil;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年10月8日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.taskoneexec.service <br>
 */
@Service("TaskOneExecService")
public class TaskOneExecService implements ITaskOneExecService {
    /**
     * logger <br>
     */
    private final static OpbLogger logger = OpbLogger.getLogger(TaskOneExecService.class, "PM");

    @Override
    public String insertInst(Map<String, Object> mapParam) {
        String execTime = PublicToolUtil.ObjectToStr(mapParam.get("EXEC_TIME"));
        OnceExecArg arg = new OnceExecArg();
        arg.setClassPath(PublicToolUtil.ObjectToStr(mapParam.get("CLASS_PATH")));
        arg.setJsonParam(PublicToolUtil.ObjectToStr(mapParam.get("PARAM")));
        if (execTime.length() == 0 || arg.getClassPath().length() == 0) {
            logger.error("ONE-SERVICE-E-001", "param is error %s|%s|%s", execTime, arg.getClassPath(),
                    arg.getJsonParam());
            return null;
        }
        List<TaskInst> listInst = new ArrayList<TaskInst>();
        String taskID = setInstVale(arg, execTime, listInst);
        if (-1 == SpringContext.getBean(SysJobDaoUtil.class).insertTaskInst(listInst)) return null;
        return taskID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param arg
     * @param execTime
     * @return <br>
     */
    private String setInstVale(OnceExecArg arg, String execTime, List<TaskInst> listInst) {
        TaskInst taskInst = new TaskInst();
        taskInst.setTaskID(TimeProcess.getInstance().getTaskidStr(TimeProcess.getInstance().getStrTime(execTime), 8,
                SeqUtils.getSeq("PM_TASK_SEQ")));
        taskInst.setBtime(execTime);
        taskInst.setEtime(execTime);
        taskInst.setTaskNo("OneExecTask-DEFAULT-TASK-NO");
        taskInst.setTaskNoVer(execTime);
        taskInst.setTaskName("OneExecTask-DEFAULT-TASK-NAME");
        taskInst.setTaskParam(JSONObject.toJSONString(arg, SerializerFeature.WriteMapNullValue));
        taskInst.setTaskType("08");
        taskInst.setTaskCreateDate(execTime);
        taskInst.setTaskExecDate(execTime);
        taskInst.setCycleSchduleType("0");
        listInst.add(taskInst);
        return listInst.get(0).getTaskID();
    }
}
