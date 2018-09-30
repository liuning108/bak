/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.service.impl.adhoc.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ericsson.itnms.templatemgr.dao <br>
 */
public abstract class AdhocDAO extends GeneralDAO<Map<String, String>> {
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String addTopicClass(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String saveTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String saveSharedTopic(Map<String, Object> params) throws BaseAppException;
        
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> cacheOperUser() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> cacheMapType() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> qryPluginList() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public abstract Map<String, Object> qryCatalogAndTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String delCatalog(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @throws BaseAppException <br>
     */ 
    public abstract void delTopic(String topicNo) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @throws BaseAppException <br>
     */ 
    public abstract void delTopicFromTopicSysclass(String topicNo) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param operUser 
     * @throws BaseAppException <br>
     */ 
    public abstract void delLinkedTopic(String topicNo, String operUser) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String favTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String expressionCheck(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String moveTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public abstract void shareTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return List
     * @throws BaseAppException <br>
     */ 
    public abstract List<Map<String, Object>> loadSharedTopicList() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public abstract Map<String, Object> loadTopic(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public abstract Map<String, Object> loadData(Map<String, Object> params) throws BaseAppException;
        
}