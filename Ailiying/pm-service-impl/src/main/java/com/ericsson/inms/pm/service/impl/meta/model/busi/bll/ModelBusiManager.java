package com.ericsson.inms.pm.service.impl.meta.model.busi.bll;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.meta.model.busi.dao.ModelBusiDAO;
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
 * @CreateDate 2018年6月14日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.model.busi.bll <br>
 */
@Component
public class ModelBusiManager {
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().getModelBusiInfo(dict);
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
    public JSONObject getModelBusiField(JSONObject dict) throws BaseAppException {
        return this.getDAO().getModelBusiField(dict);
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
    public JSONObject addModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().addModelBusiInfo(dict);
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
    public JSONObject editModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().editModelBusiInfo(dict);
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
    public JSONObject delModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().delModelBusiInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    private ModelBusiDAO getDAO() {
        ModelBusiDAO dao = (ModelBusiDAO) GeneralDAOFactory.create(ModelBusiDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }

}
