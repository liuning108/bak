package com.ericsson.inms.pm.api.controller.meta.kpi;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.kpi.KPIService;
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
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.kpi.controller <br>
 */
@RestController
@RequestMapping("kpi")
public class KPIController {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(KPIController.class);

    /**
     * kpiServ <br>
     */
    @Resource
    private KPIService kpiServ;

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
    @RequestMapping(value = "kpiinfo", method = RequestMethod.POST)
    public JSONObject getKPIInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter KPIController--getKPIInfo");
        return this.kpiServ.getKPIInfo(dict);
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
    @RequestMapping(value = "classinfo", method = RequestMethod.POST)
    public JSONObject getCLASSInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter KPIController--getCLASSInfo");
        return this.kpiServ.getCLASSInfo(dict);
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
    @RequestMapping(value = "kpiformular", method = RequestMethod.POST)
    public JSONObject getKPIFormular(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter KPIController--getKPIFormular");
        return this.kpiServ.getKPIFormular(dict);
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
    @RequestMapping(value = "add", method = RequestMethod.POST)
    public JSONObject addKPIInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter KPIController--addKPIInfo");
        try {
        	 JSONObject result =  this.kpiServ.addKPIInfo(dict);
        	 if(result == null) {
        		 result = new JSONObject();
        		 result.put("", "OBJECT IS NULL");
        	 }
        	 return  result;
        }
        catch (Exception e) {
        	JSONObject error = new JSONObject();
        	error.put("error", e.getMessage());
            //throw new BaseAppException("S-PM-KPI-0002","The indicator formula is not correct.[" + formularDict.getString("EMS_VER_NAME") + "]");
        	return error;
        }
     
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
    @RequestMapping(value = "edit", method = RequestMethod.POST)
    public JSONObject editKPIInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter KPIController--editKPIInfo");
        return this.kpiServ.editKPIInfo(dict);
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
    @RequestMapping(value = "del", method = RequestMethod.POST)
    public JSONObject delKPIInfo(@RequestBody JSONObject dict) throws BaseAppException {
        LOG.info("Enter KPIController--delKPIInfo");
        return this.kpiServ.delKPIInfo(dict);
    }

}
