package com.ericsson.inms.pm.api.controller.resourceinfo;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.resourceinfo.IResourceInfoSrv;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年10月15日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.api.controller.oss <br>
 */
@RestController
@RequestMapping("resourceInfo")
public class ResourceInfoController {

    /**
     * LOG <br>
     */
	
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ResourceInfoController.class);


    /**
     * modelBusiServ <br>
     */
    @Resource
    private IResourceInfoSrv resourceInfoServ;

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
    public JSONObject getResourceInfo(@RequestBody JSONObject dict) throws BaseAppException {
    	LOG.info("Enter ResourceInfoController--getResourceInfo");
        return this.resourceInfoServ.getResourceInfo(dict);
    }
    
}