package com.ztesoft.zsmart.oss.core.pm.util.dao;

import java.util.ArrayList;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM-Util相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-3-28 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.dao <br>
 */
public abstract class UtilDAO extends GeneralDAO<DynamicDict> {

    /**
     * 查询出EMS相关的信息(EMS、专业、版本) <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */

    public abstract void getEMSInfo(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出PM的配置参数信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getParavalue(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出PM的配置参数信息 <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getParameter(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出PM的DB数据源信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getDataSource(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出插件的规格信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getPluginSpec(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出插件的配置参数信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getPluginParam(DynamicDict dict) throws BaseAppException;

    /**
     * 操作出插件的配置参数信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void operPluginParam(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出SQL脚本的结果信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getScriptResult(DynamicDict dict) throws BaseAppException;

    /**
     * 查询出SQL脚本的结果信息 <br>
     * 
     * @author Srd <br>
     * @param colModel <br>
     * @param runSql <br>
     * @param params <br>
     * @return String <br>
     * @throws BaseAppException <br>
     */
    public abstract String exportExcel(ArrayList<DynamicDict> colModel, String runSql, ParamArray params) throws BaseAppException;

}
