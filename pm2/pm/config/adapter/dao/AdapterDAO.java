package com.ztesoft.zsmart.oss.core.pm.config.adapter.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM配置管理-适配器管理相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-16 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.adapter.dao <br>
 */
public abstract class AdapterDAO extends GeneralDAO<DynamicDict> {

    /**
     * 查询适配器的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getAdapterInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询适配器的公式信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getAdapterMapping(DynamicDict dict) throws BaseAppException;

    /**
     * 新建适配器的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addAdapterInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 修改适配器的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editAdapterInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 删除适配器的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delAdapterInfo(DynamicDict dict) throws BaseAppException;
}
