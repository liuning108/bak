package com.ericsson.inms.pm.api.controller.config.task;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ericsson.inms.pm.api.service.config.task.TaskService;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月25日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.controller <br>
 */
@RestController
@RequestMapping("task")
public class TaskController {

    /**
     * taskServ <br>
     */
    @Resource
    private TaskService taskServ;

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(TaskController.class);

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "taskinfo", method = RequestMethod.POST)
    public JSONObject getTaskInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter TaskController--getTaskInfo");
        return this.taskServ.getTaskInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "taskdetail", method = RequestMethod.POST)
    public JSONObject getTaskDetail(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter TaskController--getTaskDetail");
        return this.taskServ.getTaskDetail(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "addtaskinfo", method = RequestMethod.POST)
    public JSONObject addTaskInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter TaskController--addTaskInfo");
        return this.taskServ.addTaskInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "edittaskinfo", method = RequestMethod.POST)
    public JSONObject editTaskInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter TaskController--editTaskInfo");
        return this.taskServ.editTaskInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "deltaskinfo", method = RequestMethod.POST)
    public JSONObject delTaskInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter TaskController--delTaskInfo");
        return this.taskServ.delTaskInfo(dict);
    }
}
