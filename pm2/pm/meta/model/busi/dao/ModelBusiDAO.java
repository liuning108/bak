package com.ztesoft.zsmart.oss.core.pm.meta.model.busi.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM元数据-业务模型管理相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.busi.dao <br>
 */
public abstract class ModelBusiDAO extends GeneralDAO<DynamicDict> {

    /**
     * 查询业务模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelBusiInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询业务模型的公式信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelBusiField(DynamicDict dict) throws BaseAppException;

    /**
     * 新建业务模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addModelBusiInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 修改业务模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editModelBusiInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 删除业务模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delModelBusiInfo(DynamicDict dict) throws BaseAppException;
}
