package com.ztesoft.zsmart.oss.core.pm.util.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * PM-Util的DOMAIN抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-3-28 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.domain <br>
 */
public abstract class AbstractUtilInfo {

    /**
     * 查询出EMS相关的信息(EMS、专业、版本) <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getEMSInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * PM系统多值参数查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getParavalue(DynamicDict dict) throws BaseAppException;
    
    /**
     * PM系统唯一值参数查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getParameter(DynamicDict dict) throws BaseAppException;

    /**
     * PM系统DB数据源查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getDataSource(DynamicDict dict) throws BaseAppException;
    
    /**
     * PM系统插件规格查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getPluginSpec(DynamicDict dict) throws BaseAppException;
    
    /**
     * PM系统插件参数查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getPluginParam(DynamicDict dict) throws BaseAppException;
    
    /**
     * PM系统插件参数操作服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void operPluginParam(DynamicDict dict) throws BaseAppException;
    
    /**
     * PM系统SQL脚本查询结果服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getScriptResult(DynamicDict dict) throws BaseAppException;

}
