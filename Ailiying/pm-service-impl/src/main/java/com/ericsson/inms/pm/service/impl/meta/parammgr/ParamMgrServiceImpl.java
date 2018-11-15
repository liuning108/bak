/***************************************************************************************** 
 * Copyright © 2003-2020 ericsson Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ericsson.inms.pm.service.impl.meta.parammgr;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.parammgr.ParamMgrService;
import com.ericsson.inms.pm.service.impl.meta.constant.Constant;
import com.ericsson.inms.pm.service.impl.meta.parammgr.bll.ParamMgrManager;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.parammgr.service <br>
 */
@Service("paramMgrServ")
public class ParamMgrServiceImpl implements ParamMgrService {

    /**
     * paramMgrManager <br>
     */
    @Autowired
    private ParamMgrManager paramMgrManager;

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public List<Map<String, Object>> loadParam() throws BaseAppException {
        return this.paramMgrManager.loadParam();
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param paramList paramList
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject updateParams(List<Map<String, String>> paramList) throws BaseAppException {
        this.paramMgrManager.updateParams(paramList);
        JSONObject result = new JSONObject();
        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);
        return result;
    }

}