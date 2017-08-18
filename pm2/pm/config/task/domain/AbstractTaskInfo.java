package com.ztesoft.zsmart.oss.core.pm.config.task.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * 配置管理-任务管理的DOMAIN抽象类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-26 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.domain <br>
 */
public abstract class AbstractTaskInfo {

    /**
     * 
     * 查询任务管理信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getTaskInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 任务管理信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getTaskDetail(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 任务管理信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addTaskInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 任务管理信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editTaskInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 任务管理信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delTaskInfo(DynamicDict dict) throws BaseAppException;
}
