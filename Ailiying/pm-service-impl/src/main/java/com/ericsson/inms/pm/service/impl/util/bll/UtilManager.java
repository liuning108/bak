package com.ericsson.inms.pm.service.impl.util.bll;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.util.dao.UtilDAO;
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
 * @see com.ztesoft.zsmart.oss.core.pm.util.bll <br>
 */
@Component
public class UtilManager {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getEMSInfo() throws BaseAppException {
        UtilDAO dao = this.getDAO(UtilDAO.class);
        return this.getDAO().getEMSInfo();
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public List<Map<String, Object>> getParameter(JSONObject dict) throws BaseAppException {
        return this.getDAO().getParameter(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public List<Map<String, Object>> getParavalue(JSONObject dict) throws BaseAppException {
        return this.getDAO().getParavalue(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getDataSource() throws BaseAppException {
        return this.getDAO().getDataSource();
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
    public JSONObject getPluginSpec(JSONObject dict) throws BaseAppException {
        return this.getDAO().getPluginSpec(dict);
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
    public JSONObject getPluginParam(JSONObject dict) throws BaseAppException {
        return this.getDAO().getPluginParam(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void operPluginParam(JSONObject dict) throws BaseAppException {
        this.getDAO().operPluginParam(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public JSONObject getScriptResult(JSONObject dict) throws BaseAppException {
        return this.getDAO().getScriptResult(dict);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return boolean
     * @throws BaseAppException <br>
     */ 
    public boolean getEmailSendStatus() throws BaseAppException {
        return this.getDAO().getEmailSendStatus();
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return UtilDAO
     */
    private UtilDAO getDAO() {
        UtilDAO dao = (UtilDAO) GeneralDAOFactory.create(UtilDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param cls cls
     * @param <T> t
     * @return T
     */
    private <T> T getDAO(Class<T> cls) {
        @SuppressWarnings("unchecked")
        T dao = (T) GeneralDAOFactory.create(cls, JdbcUtil.OSS_PM);
        return dao;
    }
}
