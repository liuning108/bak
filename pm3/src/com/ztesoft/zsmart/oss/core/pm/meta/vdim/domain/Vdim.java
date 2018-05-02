package com.ztesoft.zsmart.oss.core.pm.meta.vdim.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.vdim.dao.VdimDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.vdim.domain <br>
 */
public class Vdim extends AbstractVdim {
    
    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void saveVdim(DynamicDict dict) throws BaseAppException {
        VdimDAO dao = (VdimDAO) GeneralDAOFactory.create(VdimDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.saveVdim(dict);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void loadVdimList(DynamicDict dict) throws BaseAppException {
        VdimDAO dao = (VdimDAO) GeneralDAOFactory.create(VdimDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.loadVdimList(dict);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void deleteVdim(DynamicDict dict) throws BaseAppException {
        VdimDAO dao = (VdimDAO) GeneralDAOFactory.create(VdimDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.deleteVdim(dict);
    }
    
}