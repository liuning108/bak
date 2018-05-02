package com.ztesoft.zsmart.oss.core.pm.meta.dim.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * PM元数据-维度管理的DOMAIN抽象类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-3 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.domain <br>
 */
public abstract class AbstractDimInfo {

    /**
     * 
     * 查询维度信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getDimInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 新增维度信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addDimInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 修改维度信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editDimInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 删除维度信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delDimInfo(DynamicDict dict) throws BaseAppException;
}
