package com.ericsson.inms.pm.api.controller.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.util.UtilService;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.controller <br>
 */
@RestController
@RequestMapping("util")
public class UtilController {

    /**
     * utilServ <br>
     */
    @Resource
    private UtilService utilServ;

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(UtilController.class);

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "ems", method = RequestMethod.POST)
    public JSONObject getEmsInfo(@RequestBody JSONObject param) throws BaseAppException {
        LOG.info("Enter UtilController--getEms");
        return this.utilServ.getEMSInfo();
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
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "parameter", method = RequestMethod.POST)
    public List<Map<String, Object>> getParameter(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter UtilController--getParameter");
        return this.utilServ.getParameter(dict);
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
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "paravalue", method = RequestMethod.POST)
    public List<Map<String, Object>> getParavalue(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter UtilController--getParavalue");
        return this.utilServ.getParavalue(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "datasource", method = RequestMethod.POST)
    public JSONObject getDataSource() throws BaseAppException {
        LOG.info("Enter UtilController--getDataSource");
        return this.utilServ.getDataSource();
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
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "pluginspec", method = RequestMethod.POST)
    public JSONObject getPluginSpec(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter UtilController--getPluginSpec");
        return this.utilServ.getPluginSpec(dict);
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
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "pluginparam", method = RequestMethod.POST)
    public JSONObject getPluginParam(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter UtilController--getPluginParam");
        return this.utilServ.getPluginParam(dict);
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
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "scriptresult", method = RequestMethod.POST)
    public JSONObject getScriptResult(@RequestBody JSONObject dict) {
        JSONObject ret = new JSONObject();
        try {
            ret = this.utilServ.getScriptResult(dict);
            ret.put("result", "1");
        }
        catch (BaseAppException e) {
            ret.put("result", "0");
        }
        finally {
            return ret;
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "emailSendStatus", method = RequestMethod.GET)
    public boolean getEmailSendStatus() throws BaseAppException {
        return this.utilServ.getEmailSendStatus();
    }
    
}


