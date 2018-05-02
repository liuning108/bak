package com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * [描述] <br>
 * 
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao <br>
 */
public abstract class ParamMgrDAO extends GeneralDAO {

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void saveParam(DynamicDict dict) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void loadParam(DynamicDict dict) throws BaseAppException;

}