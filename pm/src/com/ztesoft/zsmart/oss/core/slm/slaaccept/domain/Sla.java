package com.ztesoft.zsmart.oss.core.slm.slaaccept.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.dao.SlaDAO;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.model.SlaModel;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

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
public class Sla extends AbstractSla {
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void addSla(DynamicDict dict) throws BaseAppException {
        SlaModel model = new SlaModel();
        model.init(dict);
        SlaDAO dao = (SlaDAO) GeneralDAOFactory.create(SlaDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        String slaInstId = dao.addSla(model);
        dict.set("SLA_INSTID", slaInstId);
    }
    
    @Override
    public void qrySla(DynamicDict dict) throws BaseAppException {
        SlaDAO dao = (SlaDAO) GeneralDAOFactory.create(SlaDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.qrySla(dict);
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
    public void delSla(DynamicDict dict) throws BaseAppException {
        SlaDAO dao = (SlaDAO) GeneralDAOFactory.create(SlaDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.delSla(dict);
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
    public void editSla(DynamicDict dict) throws BaseAppException {
        SlaModel model = new SlaModel();
        model.init(dict);
        SlaDAO dao = (SlaDAO) GeneralDAOFactory.create(SlaDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.delSla(dict);
        dao.addSla(model);
    }
}
