package com.ericsson.inms.pm.service.impl.config.task.bll;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.transaction.Timeout;
import com.ericsson.inms.pm.service.impl.config.task.dao.TaskDAO;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月25日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.bll <br>
 */
@Component
public class TaskManager {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getTaskInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().getTaskInfo(dict);
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
    public JSONObject getTaskDetail(JSONObject dict) throws BaseAppException {
        return this.getDAO().getTaskDetail(dict);
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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject addTaskInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().addTaskInfo(dict);
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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject editTaskInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().editTaskInfo(dict);
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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject delTaskInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().delTaskInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return TaskDAO <br>
     */
    private TaskDAO getDAO() {
        TaskDAO dao = (TaskDAO) GeneralDAOFactory.create(TaskDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }
}
