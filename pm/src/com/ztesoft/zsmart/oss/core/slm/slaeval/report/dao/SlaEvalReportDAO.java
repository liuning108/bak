package com.ztesoft.zsmart.oss.core.slm.slaeval.report.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.model.SlaModel;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaaccept.dao <br>
 */
public abstract class SlaEvalReportDAO extends GeneralDAO<SlaModel> {
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void qrySlaEvalReport(DynamicDict dict) throws BaseAppException;
    
}
