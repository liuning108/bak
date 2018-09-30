package com.ericsson.inms.pm.api.service.meta.parammgr;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.parammgr.service <br>
 */
public interface ParamMgrService {
    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    List<Map<String, Object>> loadParam() throws BaseAppException;

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param paramList paramList
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    JSONObject updateParams(List<Map<String, String>> paramList) throws BaseAppException;

}
