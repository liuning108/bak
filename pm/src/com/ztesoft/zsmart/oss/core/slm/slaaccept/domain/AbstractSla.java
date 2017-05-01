package com.ztesoft.zsmart.oss.core.slm.slaaccept.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaaccept.domain <br>
 */
public abstract class AbstractSla {

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void addSla(DynamicDict dict) throws BaseAppException;
   
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void qrySla(DynamicDict dict) throws BaseAppException;
        
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void delSla(DynamicDict dict) throws BaseAppException;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void editSla(DynamicDict dict) throws BaseAppException;
    
}
