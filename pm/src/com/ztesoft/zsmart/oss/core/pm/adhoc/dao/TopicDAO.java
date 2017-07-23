package com.ztesoft.zsmart.oss.core.pm.adhoc.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.adhoc.model.TopicClassModel;
import com.ztesoft.zsmart.oss.core.pm.adhoc.model.TopicModel;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.adhoc.dao <br>
 */
public abstract class TopicDAO extends GeneralDAO<TopicModel> {
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void qryTopic(DynamicDict dict) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param model 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public abstract String addTopicClass(TopicClassModel model) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public abstract void delTopicClass(TopicClassModel model) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void qryTopicClass(DynamicDict dict) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void favTopic(DynamicDict dict) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void cacheOperUser(DynamicDict dict) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void cacheMetaData(DynamicDict dict) throws BaseAppException;
    
}
