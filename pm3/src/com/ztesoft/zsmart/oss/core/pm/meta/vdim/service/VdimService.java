/***************************************************************************************** 
 * Copyright © 2003-2020 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.meta.vdim.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.meta.vdim.domain.AbstractVdim;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017-10-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.vdim.service <br>
 */
public class VdimService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);
        String serviceName = dict.serviceName;
        if ("MPM_META_VDIM_SERVICE".equals(serviceName)) {
            this.vdimOperation(dict);
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
    private void vdimOperation(DynamicDict dict) throws BaseAppException {
        AbstractVdim dmo = (AbstractVdim) GeneralDMOFactory.create(AbstractVdim.class);
        String sActionType = (String) dict.getValueByName("ACTION_TYPE");
        if ("saveVdim".equals(sActionType)) {
            dmo.saveVdim(dict);
        }
        else if ("loadVdimList".equals(sActionType)) {
            dmo.loadVdimList(dict);
        }
        else if ("deleteVdim".equals(sActionType)) {
            dmo.deleteVdim(dict);
        }
    }
    
}