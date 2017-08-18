package com.ztesoft.zsmart.oss.core.pm.meta.model.busi.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * PM元数据-测量对象管理的DOMAIN抽象类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.busi.domain <br>
 */
public abstract class AbstractModelBusiInfo {

    /**
     * 
     * 查询业务模型信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelBusiInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 查询业务模型字段信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelBusiField(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 新增业务模型信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addModelBusiInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 修改业务模型信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editModelBusiInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 删除业务模型信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delModelBusiInfo(DynamicDict dict) throws BaseAppException;
    
}
