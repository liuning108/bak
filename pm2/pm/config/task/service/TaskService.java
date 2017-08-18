package com.ztesoft.zsmart.oss.core.pm.config.task.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.config.task.domain.AbstractTaskInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 配置管理-任务管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-26 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.service <br>
 */
public class TaskService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_CONFIG_TASK_QUERY".equals(serviceName)) {
            this.getTaskInfo(dict);
        }
        else if ("MPM_CONFIG_TASK_DETAIL_QUERY".equals(serviceName)) {
            this.getTaskDetail(dict);
        }
        else if ("MPM_CONFIG_TASK_OPER".equals(serviceName)) {
            this.operTaskInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_CONFIG_TASK_QUERY:任务管理信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getTaskInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getTaskInfo(dict);

    }

    /**
     * MPM_CONFIG_TASK_DETAIL_QUERY:任务管理详情信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getTaskDetail(DynamicDict dict) throws BaseAppException {

        getDmo().getTaskDetail(dict);
    }

    /**
     * MPM_CONFIG_TASK_OPER:任务管理信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operTaskInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmo().addTaskInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmo().editTaskInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmo().delTaskInfo(dict);
        }
    }

    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractTaskInfo getDmo() throws BaseAppException {
        return (AbstractTaskInfo) GeneralDMOFactory.create(AbstractTaskInfo.class);
    }

}
