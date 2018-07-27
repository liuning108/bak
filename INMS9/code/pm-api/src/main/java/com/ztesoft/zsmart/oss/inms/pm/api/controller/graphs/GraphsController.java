
package com.ztesoft.zsmart.oss.inms.pm.api.controller.graphs;

import javax.annotation.Resource;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.inms.pm.api.service.graphs.GraphService;
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
    
    

}
