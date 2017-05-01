package com.ztesoft.zsmart.oss.core.slm.config.slo.domain;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.config.slo.dao.SloDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * SLO管理的DOMAIN类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.slo.domain <br>
 */
public class SloInfo extends AbstractSloInfo {

    @Override
    public List<HashMap<String, String>> getServiceAndSloCatalog() throws BaseAppException {
        return getDao().selectServiceSloCatalog();
    }

    @Override
    public HashMap<String, String> getSloInfoByNo(DynamicDict dict) throws BaseAppException {
        return getDao().selectSloInfoByNo(dict);
    }

    @Override
    public List<HashMap<String, String>> getSloRuleInfoByNo(DynamicDict dict) throws BaseAppException {
        return getDao().selectSloRuleInfoByNo(dict);
    }

    @Override
    public void addSloInfo(DynamicDict sloDict) throws BaseAppException {
        getDao().insert(sloDict);
    }

    @Override
    public void modifySloInfo(DynamicDict sloDict) throws BaseAppException {
        getDao().update(sloDict);
    }

    @Override
    public void removeSloInfo(DynamicDict sloDict) throws BaseAppException {
        getDao().delete(sloDict);
    }

    @Override
    public List<HashMap<String, String>> getSlaBySlo(String sloNo) throws BaseAppException {
        return getDao().selectSlaBySlo(sloNo);
    }
    
   /**
    * 
    * [方法描述] <br> 
    *  
    * @author lwch <br>
    * @taskId <br>
    * @throws BaseAppException <br>
    * @return SloDAO
    */
    private SloDAO getDao() throws BaseAppException {
        return (SloDAO) GeneralDAOFactory.create(SloDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
    }

}
