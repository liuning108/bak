package com.ericsson.inms.pm.api.service.meta.vdim;

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
 * @see com.ericsson.inms.pm.api.service.meta.vdim <br>
 */
public interface IVdimSrv {
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return Map
     * @throws BaseAppException <br>
     */ 
    public Map<String, Object> loadVdimList() throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void saveVdim(Map<String, Object> params) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void deleteVdim(Map<String, Object> params) throws BaseAppException;
    
}