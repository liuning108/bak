package com.ericsson.inms.pm.api.controller.meta.model.busi;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.model.busi.ModelBusiService;
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
 * @CreateDate 2018年6月14日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.model.busi.controller <br>
 */
@RestController
@RequestMapping("busimodel")
public class ModelBusiController {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ModelBusiController.class);

    /**
     * modelBusiServ <br>
     */
    @Resource
    private ModelBusiService modelBusiServ;

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
    @RequestMapping(value = "info", method = RequestMethod.POST)
    public JSONObject getModelBusiInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelBusiController--getModelBusiInfo");
        return this.modelBusiServ.getModelBusiInfo(dict);
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
    @RequestMapping(value = "field", method = RequestMethod.POST)
    public JSONObject getModelBusiField(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelBusiController--getModelBusiField");
        return this.modelBusiServ.getModelBusiField(dict);
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
    @RequestMapping(value = "add", method = RequestMethod.POST)
    public JSONObject addModelBusiInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelBusiController--addModelBusiInfo");
        return this.modelBusiServ.addModelBusiInfo(dict);
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
    @RequestMapping(value = "edit", method = RequestMethod.POST)
    public JSONObject editModelBusiInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelBusiController--editModelBusiInfo");
        return this.modelBusiServ.editModelBusiInfo(dict);
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
    @RequestMapping(value = "del", method = RequestMethod.POST)
    public JSONObject delModelBusiInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelBusiController--delModelBusiInfo");
        return this.modelBusiServ.delModelBusiInfo(dict);
    }
}
