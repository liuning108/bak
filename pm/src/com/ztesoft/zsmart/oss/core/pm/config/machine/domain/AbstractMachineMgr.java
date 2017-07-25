package com.ztesoft.zsmart.oss.core.pm.config.machine.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
/**
 * 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.domain <br>
 */
public abstract class AbstractMachineMgr {
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public abstract void qryCollectMachines(DynamicDict dict) throws BaseAppException;

    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public abstract void saveOrUpdate(DynamicDict dict) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */
    public abstract void deleteCollectMachine(DynamicDict dict) throws BaseAppException;

    /**
     * [查出没有分配的任务] <br>
     * 
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */
    public abstract void queryUndistbutedTask(DynamicDict dict) throws BaseAppException;

    /**
     * [查出采集器上的任务] <br>
     * 
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */
    public abstract void queryCollectMachineTasks(DynamicDict dict) throws BaseAppException;

    /**
     * [是否存在默认的处理机，不包括自己] <br>
     * 
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */
    public abstract void isExistDisposeMachine(DynamicDict dict) throws BaseAppException;

    /**
     * [是否存用户名和IP名相同的] <br>
     * 
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */
    public abstract void isExistUserAndMachineIP(DynamicDict dict) throws BaseAppException;
}
