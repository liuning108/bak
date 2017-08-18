package com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM元数据-物理模型管理相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-10 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao <br>
 */
public abstract class ModelPhyDAO extends GeneralDAO<DynamicDict> {

    /**
     * 查询物理模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelPhyInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询物理模型的脚本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelPhyScript(DynamicDict dict) throws BaseAppException;

    /**
     * 查询物理模型的数据源信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getModelPhyDataSource(DynamicDict dict) throws BaseAppException;

    /**
     * 新建物理模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addModelPhyInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 新建物理模型的数据源信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addModelPhyDataSource(DynamicDict dict) throws BaseAppException;

    /**
     * 修改物理模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editModelPhyInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 删除物理模型的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delModelPhyInfo(DynamicDict dict) throws BaseAppException;
}
