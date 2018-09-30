
package com.ericsson.inms.pm.api.controller.graphs;

import javax.annotation.Resource;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.graphs.GraphService;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.pot.annotation.IgnoreSession;
import com.ztesoft.zsmart.pot.annotation.PublicServ;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月26日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.api.controller.graphs <br>
 */

@RestController
@RequestMapping("inms/graphs")
public class GraphsController {
    @Resource(name = "graphServiceImpl")
    private GraphService graphService;
    
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "loadKpiData", method = RequestMethod.POST)
    public JSONObject loadKpiData(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.loadKpiData(dict);
    }
    

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getTimeConfig", method = RequestMethod.POST)
    public JSONObject getTimeConfig(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getTimeConfig(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getTemplateCatagorys", method = RequestMethod.POST)
    public JSONObject getTemplateCatagorys(@RequestBody JSONObject dict) throws BaseAppException {
       
        return graphService.getTemplateCatagorys(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getTemplateById", method = RequestMethod.POST)
    public JSONObject getTemplateById(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getTemplateById(dict);
    }
    
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getTemplatesByCatagroyId", method = RequestMethod.POST)
    public JSONObject getTemplatesByCatagroyId(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getTemplatesByCatagroyId(dict);
    }
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getItemsByTemplateId", method = RequestMethod.POST)
    public JSONObject getItemsByTemplateId(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getItemsByTemplateId(dict);
    }
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getGraphsTags", method = RequestMethod.POST)
    public JSONObject getGraphsTags(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getGraphsTags(dict);
    }
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "saveOrUpdateGraphs", method = RequestMethod.POST)
    public JSONObject saveOrUpdateGraphs(@RequestBody JSONObject dict) throws BaseAppException {
       Long userId = PrincipalUtil.getPrincipal().getUserId();
       dict.put("userId", ""+userId);
        return graphService.saveOrUpdateGraphs(dict);
    }
    
    
    
    
    @PublicServ
    @IgnoreSession
    @RequestMapping(value = "updateDash", method = RequestMethod.POST)
    public JSONObject updateDash(@RequestBody JSONObject dict) throws BaseAppException {
    		return graphService.saveOrUpdateDash(dict);
    }
    
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getGraphsByUserID", method = RequestMethod.POST)
    public JSONObject getGraphsByUserID(@RequestBody JSONObject dict) throws BaseAppException {
       Long userId = PrincipalUtil.getPrincipal().getUserId();
       dict.put("userId", ""+userId);
        return graphService.getGraphsByUserID(dict);
    }
    
    
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getDash", method = RequestMethod.POST)
    public JSONObject getDash(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getDash(dict);
    }
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "delGraphs", method = RequestMethod.POST)
    public JSONObject delGraphs(@RequestBody JSONObject dict) throws BaseAppException {
       Long userId = PrincipalUtil.getPrincipal().getUserId();
       dict.put("userId", ""+userId);
        return graphService.delGraphs(dict);
    }
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getGraphsById", method = RequestMethod.POST)
    public JSONObject getGraphsById(@RequestBody JSONObject dict) throws BaseAppException {
       Long userId = PrincipalUtil.getPrincipal().getUserId();
       dict.put("userId", ""+userId);
        return graphService.getGraphsById(dict);
    }
    
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @PublicServ
    @RequestMapping(value = "getItemsByTId", method = RequestMethod.POST)
    public JSONObject getItemsByTId(@RequestBody JSONObject dict) throws BaseAppException {
       Long userId = PrincipalUtil.getPrincipal().getUserId();
       dict.put("userId", ""+userId);
        return graphService.getItemsByTId(dict);
    }
   
    
    @PublicServ
    @RequestMapping(value = "getConfigById", method = RequestMethod.POST)
    public JSONObject getConfigById(@RequestBody JSONObject dict) throws BaseAppException {
        return graphService.getConfigById(dict);
    }
   
    
   
    
    

}
