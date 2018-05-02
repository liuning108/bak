package com.ztesoft.zsmart.oss.core.pm.meta.parammgr.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao.ParamMgrDAO;
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
public class ParamMgr extends AbstractParamMgr {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    @Override
    public void saveParam(DynamicDict dict) throws BaseAppException {
        ParamMgrDAO dao = (ParamMgrDAO) GeneralDAOFactory.create(ParamMgrDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.saveParam(dict);
    }

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    @Override
    public void loadParam(DynamicDict dict) throws BaseAppException {
        ParamMgrDAO dao = (ParamMgrDAO) GeneralDAOFactory.create(ParamMgrDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.loadParam(dict);
    }

}