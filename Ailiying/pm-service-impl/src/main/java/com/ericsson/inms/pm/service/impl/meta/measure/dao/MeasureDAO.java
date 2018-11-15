package com.ericsson.inms.pm.service.impl.meta.measure.dao;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.meta.measure.dao <br>
 */
public abstract class MeasureDAO extends GeneralDAO {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getMeasureInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getMeasureField(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject addMeasureInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject editMeasureInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject delMeasureInfo(JSONObject dict) throws BaseAppException;
}
