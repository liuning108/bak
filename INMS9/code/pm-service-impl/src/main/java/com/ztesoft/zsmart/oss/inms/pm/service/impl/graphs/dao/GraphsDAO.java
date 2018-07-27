package com.ztesoft.zsmart.oss.inms.pm.service.impl.graphs.dao;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月26日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.service.impl.graphs.dao <br>
 */
public abstract class GraphsDAO extends GeneralDAO {

    private static final long serialVersionUID = 4350745893368358496L;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getTemplateCatagorys(JSONObject dict) throws BaseAppException;
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    public abstract  JSONObject getTemplateById(JSONObject dict) throws BaseAppException;
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    public  abstract JSONObject getTemplatesByCatagroyId(JSONObject dict) throws BaseAppException;

}
