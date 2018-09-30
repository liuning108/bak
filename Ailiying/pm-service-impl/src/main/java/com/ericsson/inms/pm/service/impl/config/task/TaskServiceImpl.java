package com.ericsson.inms.pm.service.impl.config.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ericsson.inms.pm.api.service.config.task.TaskService;
import com.ericsson.inms.pm.service.impl.config.task.bll.TaskManager;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月25日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.service.impl <br>
 */
@Service("taskServ")
public class TaskServiceImpl implements TaskService {

    /**
     * taskManager <br>
     */
    @Autowired
    private TaskManager taskManager;

    @Override
    public JSONObject getTaskInfo(JSONObject dict) throws BaseAppException {
        return this.taskManager.getTaskInfo(dict);
    }

    @Override
    public JSONObject getTaskDetail(JSONObject dict) throws BaseAppException {
        return this.taskManager.getTaskDetail(dict);
    }

    @Override
    public JSONObject addTaskInfo(JSONObject dict) throws BaseAppException {
        return this.taskManager.addTaskInfo(dict);
    }

    @Override
    public JSONObject editTaskInfo(JSONObject dict) throws BaseAppException {
        return this.taskManager.editTaskInfo(dict);
    }

    @Override
    public JSONObject delTaskInfo(JSONObject dict) throws BaseAppException {
        return this.taskManager.delTaskInfo(dict);
    }

}
