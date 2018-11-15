package com.ericsson.inms.pm.api.controller.meta.dim;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.dim.DimService;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.dim.controller <br>
 */
@RestController
@RequestMapping("dim")
public class DimController {

    /**
     * dimServ <br>
     */
    @Resource
    private DimService dimServ;

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(DimController.class);

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "diminfo", method = RequestMethod.POST)
    public JSONObject getDimInfo(@RequestBody JSONObject param) throws BaseAppException {
        LOG.info("Enter DimController--getDimInfo");
        return this.dimServ.getDimInfo(param);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "dimdel", method = RequestMethod.POST)
    public JSONObject delDimInfo(@RequestBody JSONObject param) throws BaseAppException {
        LOG.info("Enter DimController--delDimInfo");
        return this.dimServ.delDimInfo(param.getString("DIM_CODE"));
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "dimadd", method = RequestMethod.POST)
    public JSONObject addDimInfo(@RequestBody JSONObject param) throws BaseAppException {
        LOG.info("Enter DimController--addDimInfo");
        return this.dimServ.addDimInfo(param);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "dimedit", method = RequestMethod.POST)
    public JSONObject editDimInfo(@RequestBody JSONObject param) throws BaseAppException {
        LOG.info("Enter DimController--editDimInfo");
        return this.dimServ.editDimInfo(param);
    }
}
