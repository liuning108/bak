package com.ztesoft.zsmart.oss.core.pm.meta.measure.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * PM元数据-测量对象管理的DOMAIN抽象类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-7 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.measure.domain <br>
 */
public abstract class AbstractMeasureInfo {

    /**
     * 
     * 查询测量对象信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getMeasureInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 查询测量对象字段信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getMeasureField(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 新增测量对象信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addMeasureInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 修改测量对象信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editMeasureInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 
     * 删除测量对象信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delMeasureInfo(DynamicDict dict) throws BaseAppException;
}
