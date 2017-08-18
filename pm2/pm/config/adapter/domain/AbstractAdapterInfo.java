package com.ztesoft.zsmart.oss.core.pm.config.adapter.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * PM配置管理-适配器管理的DOMAIN抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-16 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.adapter.domain <br>
 */
public abstract class AbstractAdapterInfo {

    /**
     * 查询适配器信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getAdapterInfo(DynamicDict dict) throws BaseAppException;
    /**
     * 
     * 查询适配器映射关系信息 <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getAdapterMapping(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 新增适配器 <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addAdapterInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * 修改适配器 <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editAdapterInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * 删除适配器 <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delAdapterInfo(DynamicDict dict) throws BaseAppException;
}
