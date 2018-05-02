package com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM元数据-指标管理相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-5 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao <br>
 */
public abstract class KPIDAO extends GeneralDAO<DynamicDict> {

    /**
     * 查询指标的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getKPIInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询指标的公式信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getKPIFormular(DynamicDict dict) throws BaseAppException;

    /**
     * 新建指标的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addKPIInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 修改指标的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editKPIInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 删除指标的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delKPIInfo(DynamicDict dict) throws BaseAppException;

}
