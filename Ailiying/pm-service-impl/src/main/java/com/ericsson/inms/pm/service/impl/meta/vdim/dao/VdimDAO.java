package com.ericsson.inms.pm.service.impl.meta.vdim.dao;

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
 * @see com.ericsson.inms.pm.service.impl.meta.vdim.dao <br>
 */
public abstract class VdimDAO extends GeneralDAO<Map<String, String>> {
        
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public abstract Map<String, Object> loadVdimList() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public abstract void saveVdim(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public abstract void deleteVdim(Map<String, Object> params) throws BaseAppException;
}