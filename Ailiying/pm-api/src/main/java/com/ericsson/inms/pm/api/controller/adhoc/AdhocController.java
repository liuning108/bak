/***************************************************************************************** 
 * Copyright © 2003-2020 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ericsson.inms.pm.api.controller.adhoc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ericsson.inms.pm.api.service.adhoc.IAdhocSrv;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-5 <br>
 * @since V7.0<br>
 * @see com.ericsson.core.pm.adhoc.service <br>
 */
@RestController
//@IgnoreSession
@RequestMapping("adhoc")
public class AdhocController {
    
    /**
     * adhocSrv <br>
     */
    @Autowired
    private IAdhocSrv adhocSrv;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "cacheOperUser", method = RequestMethod.GET)
    @PublicServ
    public List<Map<String, Object>> cacheOperUser() throws BaseAppException {
        return adhocSrv.cacheOperUser();
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "cacheMapType", method = RequestMethod.GET)
    @PublicServ
    public List<Map<String, Object>> cacheMapType() throws BaseAppException {
        return adhocSrv.cacheMapType();
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "loadSharedTopicList", method = RequestMethod.GET)
    @PublicServ
    public List<Map<String, Object>> loadSharedTopicList() throws BaseAppException {
        return adhocSrv.loadSharedTopicList();
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "qryPluginList", method = RequestMethod.GET)
    @PublicServ
    public List<Map<String, Object>> qryPluginList() throws BaseAppException {
        return adhocSrv.qryPluginList();
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "addCatalog", method = RequestMethod.POST)
    @PublicServ
    public String addTemplate(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.addTopicClass(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "expressionCheck", method = RequestMethod.POST)
    @PublicServ
    public String expressionCheck(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.expressionCheck(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "qryCatalogAndTopic", method = RequestMethod.POST)
    @PublicServ
    public Map<String, Object> qryCatalogAndTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.qryCatalogAndTopic(params);
    }    
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "delCatalog", method = RequestMethod.POST)
    @PublicServ
    public String delCatalog(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.delCatalog(params);
    }    
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "delTopic", method = RequestMethod.POST)
    @PublicServ
    public String delTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.delTopic(params);
    }   
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "modCatalog", method = RequestMethod.POST)
    @PublicServ
    public String modCatalog(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.modCatalog(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "favTopic", method = RequestMethod.POST)
    @PublicServ
    public String favTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.favTopic(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "moveTopic", method = RequestMethod.POST)
    @PublicServ
    public String moveTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.moveTopic(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "shareTopic", method = RequestMethod.POST)
    @PublicServ
    public void shareTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        adhocSrv.shareTopic(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "saveTopic", method = RequestMethod.POST)
    @PublicServ
    public String saveTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.saveTopic(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "saveSharedTopic", method = RequestMethod.POST)
    @PublicServ
    public String saveSharedTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.saveSharedTopic(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "loadTopic", method = RequestMethod.POST)
    @PublicServ
    public Map<String, Object> loadTopic(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.loadTopic(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map 
     */ 
    @RequestMapping(value = "loadData", method = RequestMethod.POST)
    @PublicServ
    public Map<String, Object> loadData(@RequestBody Map<String, Object> params) {
        Map<String, Object> ret = new HashMap<String, Object>();
        try {
            ret = adhocSrv.loadData(params);
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
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "gridExport", method = RequestMethod.POST)
    @PublicServ
    public Map<String, Object> gridExport(@RequestBody Map<String, Object> params) throws BaseAppException {
        return adhocSrv.gridExport(params);
    }
    
    /*private void topicOperation(DynamicDict dict) throws BaseAppException {
        if ("searchContent".equals(sActionType)) {
            dmo.searchContent(dict);
        }
        else if ("dataExport".equals(sActionType)) {
            dmo.dataExport(dict);
        }
    }*/
}


