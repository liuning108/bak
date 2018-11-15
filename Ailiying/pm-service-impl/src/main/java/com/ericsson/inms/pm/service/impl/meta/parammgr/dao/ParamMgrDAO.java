package com.ericsson.inms.pm.service.impl.meta.parammgr.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;
/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.parammgr.dao <br>
 */
public abstract class ParamMgrDAO extends GeneralDAO<Map<String, String>> {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param paramList paramList
     * @throws BaseAppException <br>
     */
    public abstract void updateParams(List<Map<String, String>> paramList) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public abstract List<Map<String, Object>> loadParam() throws BaseAppException;

}