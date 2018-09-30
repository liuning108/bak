/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.api.service.alarmtemplate;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月27日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.api.service.alarmtemplate <br>
 */
public interface IAlarmTemplateSrv {

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> qryNeIconList(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public JSONObject getFieldInModel(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> qryTemplate(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public List<Map<String, Object>> searchTemplate(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public Map<String, Object> qryTemplateDetail(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public String addTemplate(Map<String, Object> params) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return List
     * @throws BaseAppException <br>
     */ 
    public String delTemplate(Map<String, Object> params) throws BaseAppException;
    
}


