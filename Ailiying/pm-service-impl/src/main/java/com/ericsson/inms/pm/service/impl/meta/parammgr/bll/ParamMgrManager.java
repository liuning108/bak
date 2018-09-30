package com.ericsson.inms.pm.service.impl.meta.parammgr.bll;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.ericsson.inms.pm.service.impl.meta.parammgr.dao.ParamMgrDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.transaction.Timeout;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.parammgr.bll <br>
 */
@Component
public class ParamMgrManager {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public List<Map<String, Object>> loadParam() throws BaseAppException {
        ParamMgrDAO dao = this.getDAO();
        return dao.loadParam();
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param paramList paramList
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void updateParams(List<Map<String, String>> paramList) throws BaseAppException {
        ParamMgrDAO dao = this.getDAO();
        dao.updateParams(paramList);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return ParamMgrDAO
     */
    private ParamMgrDAO getDAO() {
        ParamMgrDAO dao = (ParamMgrDAO) GeneralDAOFactory.create(ParamMgrDAO.class, JdbcUtil.OSS_PM);

        return dao;
    }

}
