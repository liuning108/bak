package com.ericsson.inms.pm.service.impl.meta.measure.bll;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.meta.measure.dao.MeasureDAO;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.transaction.Timeout;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.meta.measure.bll <br>
 */
@Component
public class MeasureManager {

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
        return this.getDAO().getMeasureInfo(dict);

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
        return this.getDAO().getMeasureField(dict);

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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject addMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().addMeasureInfo(dict);

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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject editMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().editMeasureInfo(dict);

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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject delMeasureInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().delMeasureInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @return <br>
     */
    private MeasureDAO getDAO() {
        MeasureDAO dao = (MeasureDAO) GeneralDAOFactory.create(MeasureDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }
}
