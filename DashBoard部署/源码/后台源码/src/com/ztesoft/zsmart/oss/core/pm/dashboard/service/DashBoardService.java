/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.service;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.dashboard.domain.AbstractDashBoardMgr;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.DashBoardUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年8月12日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.dashboard.service <br>
 */

public class DashBoardService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);

        String methodName = dict.getString("method");
        try {
            Method method = this.getClass().getMethod(methodName, DynamicDict.class);
            method.invoke(this, dict);
        }
        catch (Exception e) {
            new BaseAppException(e.getMessage());
        }
        return 0;
    }
     
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void addDashBoardClass(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("name", dict.getString("name"));
        param.put("userId", dict.getString("userId"));

        dict.add("result", bsm.addDashBoardClass(param));
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void queryDashBoardClassByUserID(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("userId", dict.getString("userId"));
        dict.add("result", bsm.queryDashBoardClassByUserID(param));
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void delDashBoardClassByID(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("classId", dict.getString("classId"));
        dict.add("result", bsm.delDashBoardClassByID(param));
    }
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void changeDashBoardClassNameByID(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("classId", dict.getString("classId"));
        param.put("name", dict.getString("name"));
        dict.add("result", bsm.changeDashBoardClassNameByID(param));
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void saveUpdateDashBoard(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, Object> param = new HashMap<String, Object>();
        DynamicDict dashboardDict = dict.getBO("json");
        param.put("id", dashboardDict.getString("id"));
        param.put("name", dashboardDict.getString("name"));
        param.put("classNo", dashboardDict.getString("classNo"));
        param.put("isShare", dashboardDict.getString("isShare"));
        param.put("state", dashboardDict.getString("state"));
        param.put("userId", dashboardDict.getString("userId"));
        String canvasAttrs = JSON.toJSONString(DashBoardUtil.dic2Map2((DynamicDict) dashboardDict.get("canvasAttrs")));
        param.put("canvasAttrs", canvasAttrs);
        Map nodesAttrs = DashBoardUtil.dic2Map2((DynamicDict) dashboardDict.get("attrs"));
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) nodesAttrs.get("nodes");
        param.put("nodesAttrs", nodes);
        dict.add("result_input", param);
        dict.add("result", bsm.saveUpdateDashBoard(param));
    }
     /**
      * 
      * [方法描述] <br> 
      *  
      * @author [作者名]<br>
      * @taskId <br>
      * @param dict 
      * @throws BaseAppException <br>
      */
    public void queryDashBoarListByClassId(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("classId", dict.getString("classId"));
        param.put("userId", dict.getString("userId"));
        dict.add("result", bsm.queryDashBoarListByClassId(param));
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void queryDashBoardById(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("id", dict.getString("id"));
        dict.add("result", bsm.queryDashBoardById(param));
    }

}
