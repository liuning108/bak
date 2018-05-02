package com.ztesoft.zsmart.oss.core.pm.meta.kpi.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * PM元数据-指标管理的DOMAIN抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-5 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.kpi.domain <br>
 */
public abstract class AbstractKPIInfo {

    /**
     * 查询指标信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getKPIInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询指标信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getKPIFormular(DynamicDict dict) throws BaseAppException;

    /**
     * 新增指标信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addKPIInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 修改指标信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void editKPIInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 删除指标信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void delKPIInfo(DynamicDict dict) throws BaseAppException;
}
