/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.api.service.adhoc;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月3日 <br>
 * @since V7.0<br>
 * @see com.ericsson.itnms.templatemgr.service <br>
 */
public interface IAdhocSrv {

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String addTopicClass(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String saveTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String saveSharedTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> cacheOperUser() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> cacheMapType() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> qryPluginList() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> loadSharedTopicList() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public Map<String, Object> qryCatalogAndTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String delCatalog(Map<String, Object> params) throws BaseAppException;
 
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String delTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String modCatalog(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String favTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String moveTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String expressionCheck(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return
     * @throws BaseAppException <br>
     */ 
    public void shareTopic(Map<String, Object> params) throws BaseAppException;
 
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public Map<String, Object> loadTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public Map<String, Object> loadData(Map<String, Object> params) throws BaseAppException;
     
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public Map<String, Object> gridExport(Map<String, Object> params) throws BaseAppException;
    
}