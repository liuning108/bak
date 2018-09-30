package com.ericsson.inms.pm.service.impl.meta.model.phy.bll;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.meta.constant.Constant;
import com.ericsson.inms.pm.service.impl.meta.model.phy.dao.ModelPhyDAO;
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
 * @CreateDate 2018年6月13日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.bll <br>
 */
@Component
public class ModelPhyManager {
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().getModelPhyInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelPhyScript(JSONObject dict) throws BaseAppException {
        return this.getDAO().getModelPhyScript(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelPhyDataSource(JSONObject dict) throws BaseAppException {
        return this.getDAO().getModelPhyDataSource(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject delModelPhyInfo(JSONObject dict) throws BaseAppException {
        this.getDAO().delModelPhyInfo(dict);

        JSONObject result = new JSONObject();

        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);

        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */
    public void addModelPhyDataSource(JSONObject dict) throws BaseAppException {
        this.getDAO().addModelPhyDataSource(dict);
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
    public JSONObject editModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().editModelPhyInfo(dict);
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
    public JSONObject addModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.getDAO().addModelPhyInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @return <br>
     */
    private ModelPhyDAO getDAO() {
        ModelPhyDAO dao = (ModelPhyDAO) GeneralDAOFactory.create(ModelPhyDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }
}
