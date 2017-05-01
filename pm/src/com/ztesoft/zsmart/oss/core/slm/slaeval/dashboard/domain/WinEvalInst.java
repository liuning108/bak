package com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.domain;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.dao.WinEvalInstDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * [描述] <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.domain <br>
 */
public class WinEvalInst extends AbstractWinEvalInst {

    @Override
    public HashMap<String, String> getSlaWinEvalOverview(DynamicDict dict) throws BaseAppException {
        return getWinEvalInstDao().querySlaWinEvalOverview(dict);
    }

    @Override
    public List<HashMap<String, String>> getSlaWinEvalInst(DynamicDict dict) throws BaseAppException {
        return getWinEvalInstDao().querySlaWinEvalInst(dict);
    }

    @Override
    public List<HashMap<String, String>> getSlaTrendWinEvalOverview(DynamicDict dict) throws BaseAppException {
        return getWinEvalInstDao().querySlaTrendWinEvalOverview(dict);
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private WinEvalInstDAO getWinEvalInstDao() throws BaseAppException {
        return (WinEvalInstDAO) GeneralDAOFactory.create(WinEvalInstDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
    }

}
