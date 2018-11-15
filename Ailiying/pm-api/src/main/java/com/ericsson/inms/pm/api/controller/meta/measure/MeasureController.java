package com.ericsson.inms.pm.api.controller.meta.measure;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.measure.MeasureService;

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
 * @see com.ericsson.inms.pm.meta.measure.controller <br>
 */
@RestController
@RequestMapping("measure")
public class MeasureController {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(MeasureController.class);

    /**
     * measureServ <br>
     */
    @Resource
    private MeasureService measureServ;

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
    @RequestMapping(value = "measureinfo", method = RequestMethod.POST)
    public JSONObject getMeasureInfo(@RequestBody JSONObject dict) throws BaseAppException {

        LOG.info("Enter MeasureController--getMeasureInfo");
        return this.measureServ.getMeasureInfo(dict);

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
    @RequestMapping(value = "measurefield", method = RequestMethod.POST)
    public JSONObject getMeasureField(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter MeasureController--getMeasureField");

        return this.measureServ.getMeasureField(dict);

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
    @RequestMapping(value = "measureadd", method = RequestMethod.POST)
    public JSONObject addMeasureInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter MeasureController--addMeasureInfo");

        return this.measureServ.addMeasureInfo(dict);

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
    @RequestMapping(value = "measureedit", method = RequestMethod.POST)
    public JSONObject editMeasureInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter MeasureController--editMeasureInfo");

        return this.measureServ.editMeasureInfo(dict);

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
    @RequestMapping(value = "measuredel", method = RequestMethod.POST)
    public JSONObject delMeasureInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter MeasureController--delMeasureInfo");

        return this.measureServ.delMeasureInfo(dict);
    }
}
