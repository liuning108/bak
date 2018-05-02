package com.ztesoft.zsmart.oss.core.pm.meta.dim.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM元数据-维度管理相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-3 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.dao <br>
 */
public abstract class DimDAO extends GeneralDAO<DynamicDict> {

    

    /**
     * 查询维度的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getDimInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 新建维度的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addDimInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 修改维度的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editDimInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * 删除维度的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delDimInfo(DynamicDict dict) throws BaseAppException;
}
