/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.service.impl.meta.vdim;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ericsson.inms.pm.api.service.meta.vdim.IVdimSrv;
import com.ericsson.inms.pm.service.impl.meta.vdim.dao.VdimDAO;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.vdim.service.impl <br>
 */
@Service("vdim")
public class VdimSrv implements IVdimSrv {
       
    @Override
    public Map<String, Object> loadVdimList() throws BaseAppException {
        VdimDAO dao = (VdimDAO) GeneralDAOFactory.create(VdimDAO.class, JdbcUtil.OSS_KDO);
        return dao.loadVdimList();
    }
    
    @Override
    public void saveVdim(Map<String, Object> params) throws BaseAppException {
        VdimDAO dao = (VdimDAO) GeneralDAOFactory.create(VdimDAO.class, JdbcUtil.OSS_KDO);
        dao.saveVdim(params);
    }
    
    @Override
    public void deleteVdim(Map<String, Object> params) throws BaseAppException {
        VdimDAO dao = (VdimDAO) GeneralDAOFactory.create(VdimDAO.class, JdbcUtil.OSS_KDO);
        dao.deleteVdim(params);
    }
    
}