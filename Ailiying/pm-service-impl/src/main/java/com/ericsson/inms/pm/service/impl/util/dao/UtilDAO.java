package com.ericsson.inms.pm.service.impl.util.dao;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/**
 * PM-Util相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-3-28 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.dao <br>
 */
public abstract class UtilDAO extends GeneralDAO {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getEMSInfo() throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public abstract List<Map<String, Object>> getParavalue(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict 入参
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public abstract List<Map<String, Object>> getParameter(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getDataSource() throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getPluginSpec(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getPluginParam(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */ 
    public abstract void operPluginParam(JSONObject dict) throws BaseAppException;
    //
    // /**
    // * 查询出SQL脚本的结果信息 <br>
    // *
    // * @author Srd <br>
    // * @param dict <br>
    // * @throws BaseAppException <br>
    // */
    // public abstract void getScriptResult(DynamicDict dict) throws BaseAppException;
    //
    // /**
    // * 查询出SQL脚本的结果信息 <br>
    // *
    // * @author Srd <br>
    // * @param colModel <br>
    // * @param runSql <br>
    // * @param params <br>
    // * @return String <br>
    // * @throws BaseAppException <br>
    // */
    // public abstract String exportExcel(ArrayList<DynamicDict> colModel, String runSql, ParamArray params) throws
    // BaseAppException;

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public abstract JSONObject getScriptResult(JSONObject dict) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return boolean
     * @throws BaseAppException <br>
     */ 
    public abstract boolean getEmailSendStatus() throws BaseAppException;
    
}
