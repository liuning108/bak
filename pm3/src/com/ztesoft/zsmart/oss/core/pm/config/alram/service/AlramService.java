/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.config.alram.service;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.config.alram.domain.AbstractAlramMgr;
import com.ztesoft.zsmart.oss.core.pm.config.machine.domain.AbstractMachineMgr;
import com.ztesoft.zsmart.oss.core.pm.dashboard.service.DashBoardService;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年11月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.alram.service <br>
 * MPM_ALRAM_MANAGE_SERVICE
 */

public class AlramService implements IAction {

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
            SessionManage.putSession(dict);
            String methodName = dict.getString("method");
            try {
                Method method = this.getClass().getMethod(methodName, DynamicDict.class);
                method.invoke(this, dict);
            }
            catch (Exception e) {
                e.printStackTrace();
                throw new BaseAppException(e.getMessage());
            }
            return 0;
    }
    public void queryAlramList(DynamicDict dict) throws BaseAppException{
        AbstractAlramMgr dmo = (AbstractAlramMgr) GeneralDMOFactory.create(AbstractAlramMgr.class);
        Map<String,String>  param = new HashMap<String,String>();
        param.put("time",dict.getString("time"));
        param.put("level",dict.getString("level"));
        param.put("page",dict.getString("page"));
        param.put("rowNums",dict.getString("rowNums"));
       Map<String,Object> result = dmo.queryAlramList( param);

        dict.add("result",result);
    }
    public static void main(String[] args) throws BaseAppException {
        AlramService s = new AlramService();
        DynamicDict dict = new DynamicDict();
        dict.set("method", "queryAlramList");
        dict.set("time","24");
        dict.set("level","0,1,2,3,4,5");
        dict.set("page","50");
        dict.set("rowNums",20);
        s.perform(dict);
        System.err.println(dict);
    }

}
