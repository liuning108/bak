package com.ericsson.inms.pm.api.controller.meta.parammgr;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.parammgr.ParamMgrService;
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
 * @see com.ztesoft.zsmart.oss.core.pm.meta.parammgr.controller <br>
 */
@RestController
@RequestMapping("param")
public class ParamMgrController {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ParamMgrController.class);

    /**
     * paramMgrServ <br>
     */
    @Resource
    private ParamMgrService paramMgrServ;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "", method = RequestMethod.GET)
    public List<Map<String, Object>> loadParam() throws BaseAppException {
        LOG.info("Enter ParamMgrController--loadParam");
        return this.paramMgrServ.loadParam();
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param paramList paramList
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "", method = RequestMethod.POST)
    public JSONObject updateParams(@RequestBody List<Map<String, String>> paramList) throws BaseAppException {
        LOG.info("Enter ParamMgrController--updateParams");
        return this.paramMgrServ.updateParams(paramList);
    }

}
