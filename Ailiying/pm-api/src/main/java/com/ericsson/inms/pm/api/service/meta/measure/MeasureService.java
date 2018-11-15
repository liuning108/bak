package com.ericsson.inms.pm.api.service.meta.measure;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.meta.measure.service <br>
 */
public interface MeasureService {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    JSONObject getMeasureInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    JSONObject getMeasureField(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    JSONObject addMeasureInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    JSONObject editMeasureInfo(JSONObject dict) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    JSONObject delMeasureInfo(JSONObject dict) throws BaseAppException;
}
