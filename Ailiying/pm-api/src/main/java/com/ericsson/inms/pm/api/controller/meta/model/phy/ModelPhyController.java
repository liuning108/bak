package com.ericsson.inms.pm.api.controller.meta.model.phy;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.model.phy.ModelPhyService;
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
 * @CreateDate 2018年6月13日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.controller <br>
 */
@RestController
@RequestMapping("phymodel")
public class ModelPhyController {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ModelPhyController.class);

    /**
     * modelPhyServ <br>
     */
    @Resource
    private ModelPhyService modelPhyServ;

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
    @RequestMapping(value = "modelinfo", method = RequestMethod.POST)
    public JSONObject getModelPhyInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--getModelPhyInfo");
        return this.modelPhyServ.getModelPhyInfo(dict);
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
    @RequestMapping(value = "scriptinfo", method = RequestMethod.POST)
    public JSONObject getModelPhyScript(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--getModelPhyScript");
        return this.modelPhyServ.getModelPhyScript(dict);
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
    @RequestMapping(value = "datasourceinfo", method = RequestMethod.POST)
    public JSONObject getModelPhyDataSource(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--getModelPhyDataSource");
        return this.modelPhyServ.getModelPhyDataSource(dict);
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
    public JSONObject delModelPhyInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--delModelPhyInfo");
        return this.modelPhyServ.delModelPhyInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "datasourceadd", method = RequestMethod.POST)
    public void addModelPhyDataSource(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--addModelPhyDataSource");
        this.modelPhyServ.addModelPhyDataSource(dict);
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
    public JSONObject editModelPhyInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--editModelPhyInfo");
        return this.modelPhyServ.editModelPhyInfo(dict);
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
    public JSONObject addModelPhyInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter ModelPhyController--addModelPhyInfo");
        return this.modelPhyServ.addModelPhyInfo(dict);
    }
}
