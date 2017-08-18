package com.ztesoft.zsmart.oss.core.pm.config.task.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.config.task.dao.TaskDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * 配置管理-任务管理的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-26 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.domain <br>
 */
public class TaskInfo extends AbstractTaskInfo {

    @Override
    public void getTaskInfo(DynamicDict dict) throws BaseAppException {
        getDao().getTaskInfo(dict);
    }
    
    @Override
    public void getTaskDetail(DynamicDict dict) throws BaseAppException {
        getDao().getTaskDetail(dict);
    }
    
    @Override
    public void addTaskInfo(DynamicDict dict) throws BaseAppException {
        getDao().addTaskInfo(dict);
    }
    
    @Override
    public void editTaskInfo(DynamicDict dict) throws BaseAppException {
        getDao().editTaskInfo(dict);
    }
    
    @Override
    public void delTaskInfo(DynamicDict dict) throws BaseAppException {
        getDao().delTaskInfo(dict);
    }
    /**
     * 
     * 获取DAO对象 <br> 
     *  
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private TaskDAO getDao() throws BaseAppException {
        return (TaskDAO) GeneralDAOFactory.create(TaskDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
