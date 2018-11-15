package com.ericsson.inms.pm.service.impl.meta.dim.dao;

import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.dto.meta.dim.DimDto;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.dim.dao <br>
 */
public abstract class DimDAO extends GeneralDAO<Map<String, String>> {

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param params params
     * @return JSONObject JSONObject
     * @throws BaseAppException <br>
     */
    public abstract JSONObject getDimInfo(JSONObject params) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    public abstract void addDimInfo(DimDto dim) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    public abstract void editDimInfo(DimDto dim) throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dimCode dimCode
     * @throws BaseAppException <br>
     */
    public abstract void delDimInfo(String dimCode) throws BaseAppException;
}
