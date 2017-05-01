/***************************************************************************************** 
 * Copyright © 2003-2020 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.slm.slaaccept.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.domain.AbstractSla;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaaccept.service <br>
 */
public class SlaService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);
        String serviceName = dict.serviceName;
        
        if ("MSLM_SLA_SERVICE".equals(serviceName)) {
            this.slaOperation(dict);
        }
        return 0;
    }
    
    /**
     * Description: <br> 
     *  
     * @author Crayon<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */ 
    private void slaOperation(DynamicDict dict) throws BaseAppException {
        AbstractSla dmo = (AbstractSla) GeneralDMOFactory.create(AbstractSla.class);
        String sActionType = (String) dict.getValueByName("ACTION_TYPE");
        if ("add".equals(sActionType)) {
            dmo.addSla(dict);
        } 
        else if ("qry".equals(sActionType)) {
            dmo.qrySla(dict);
        }
        else if ("del".equals(sActionType)) {
            dmo.delSla(dict);
        }
        else if ("edit".equals(sActionType)) {
            dmo.editSla(dict);
        }
    }
    
    /**
     * Description:查询所有技能信息 <br> 
     *  
     * @author Crayon<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     
    private void queryAllSkill(DynamicDict dict) throws BaseAppException {
        AbstractSkillConfig dmo = (AbstractSkillConfig) GeneralDMOFactory.create(AbstractSkillConfig.class);
        List<HashMap<String, String>> list = dmo.queryAllSkill(dict);
        for (HashMap<String, String> map : list) {
            DynamicDict rDict = new DynamicDict();
            rDict.valueMap.putAll(map);
            dict.setValueByName("RETURN_LIST", rDict, 1);
        }
    }*/
}
