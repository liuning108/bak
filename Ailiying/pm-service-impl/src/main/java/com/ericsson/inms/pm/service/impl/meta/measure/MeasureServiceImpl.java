package com.ericsson.inms.pm.service.impl.meta.measure;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.measure.MeasureService;
import com.ericsson.inms.pm.service.impl.meta.measure.bll.MeasureManager;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.meta.measure.service <br>
 */
@Service("measureServ")
public class MeasureServiceImpl implements MeasureService {

    /**
     * measureManager <br>
     */
    @Autowired
    private MeasureManager measureManager;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.measureManager.getMeasureInfo(dict);

    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getMeasureField(JSONObject dict) throws BaseAppException {
        return this.measureManager.getMeasureField(dict);

    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject addMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.measureManager.addMeasureInfo(dict);

    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject editMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.measureManager.editMeasureInfo(dict);

    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject delMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.measureManager.delMeasureInfo(dict);
    }
}
