package com.ericsson.inms.pm.service.impl.util;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.util.UtilService;
import com.ericsson.inms.pm.service.impl.util.bll.UtilManager;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.service <br>
 */
@Service("utilServ")
public class UtilServiceImpl implements UtilService {

    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(UtilServiceImpl.class);

    /**
     * utilManager <br>
     */
    @Autowired
    private UtilManager utilManager;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getEMSInfo() throws BaseAppException {
        return this.utilManager.getEMSInfo();
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
        return this.utilManager.getParameter(dict);
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
        return this.utilManager.getParavalue(dict);
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
        return this.utilManager.getDataSource();
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
        return this.utilManager.getPluginSpec(dict);
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
        return this.utilManager.getPluginParam(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */ 
    public void operPluginParam(JSONObject dict) throws BaseAppException {
        this.utilManager.operPluginParam(dict);
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
        return this.utilManager.getScriptResult(dict);
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
        return this.utilManager.getEmailSendStatus();
    }
    
}


