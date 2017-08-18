package com.ztesoft.zsmart.oss.core.pm.config.task.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM元数据-任务管理管理相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-26 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.dao <br>
 */
public abstract class TaskDAO extends GeneralDAO<DynamicDict> {

    /**
     * 查询任务管理的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getTaskInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询任务管理的公式信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getTaskDetail(DynamicDict dict) throws BaseAppException;

    /**
     * 新建任务管理的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addTaskInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 修改任务管理的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editTaskInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 删除任务管理的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delTaskInfo(DynamicDict dict) throws BaseAppException;
}
