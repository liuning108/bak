package com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.domain;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.dao.EvalInstDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * [描述] <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.domain <br>
 */
public class EvalInst extends AbstractEvalInst {

    @Override
    public List<HashMap<String, String>> getSlaEvalInst() throws BaseAppException {
        return getEvalInstDao().selectSlaEvalInst();
    }

    @Override
    public List<HashMap<String, String>> getSlaEvalServiceInst(DynamicDict slaInstInfo) throws BaseAppException {
        return getEvalInstDao().selectSlaEvalServiceInst(slaInstInfo);
    }

    @Override
    public List<HashMap<String, String>> getSloEvalInst(DynamicDict slaInstInfo) throws BaseAppException {
        return getEvalInstDao().selectSloEvalInst(slaInstInfo);
    }

    @Override
    public List<HashMap<String, String>> getSliRuleEvalInst(DynamicDict sloInstInfo) throws BaseAppException {
        return getEvalInstDao().selectSliRuleEvalInst(sloInstInfo);
    }

    @Override
    public List<HashMap<String, String>> getSliRuleInst(DynamicDict sloInstInfo) throws BaseAppException {
        return getEvalInstDao().selectSliRuleInst(sloInstInfo);
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
    private EvalInstDAO getEvalInstDao() throws BaseAppException {
        return (EvalInstDAO) GeneralDAOFactory.create(EvalInstDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
    }

}
