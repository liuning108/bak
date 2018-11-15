package com.ericsson.inms.pm.service.impl.meta.kpi.bll;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.meta.kpi.dao.KPIDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.transaction.Timeout;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.kpi.bll <br>
 */
@Component
public class KPIManager {
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getKPIInfo(JSONObject dict) throws BaseAppException {
        return this.getDao().getKPIInfo(dict);
    }
    
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getCLASSInfo(JSONObject dict) throws BaseAppException {
        return this.getDao().getCLASSInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getKPIFormular(JSONObject dict) throws BaseAppException {
        return this.getDao().getKPIFormular(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject addKPIInfo(JSONObject dict) throws BaseAppException {
        return this.getDao().addKPIInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject editKPIInfo(JSONObject dict) throws BaseAppException {
        return this.getDao().editKPIInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject delKPIInfo(JSONObject dict) throws BaseAppException {
        return this.getDao().delKPIInfo(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @return  <br>
     */ 
    private KPIDAO getDao() {
        KPIDAO dao = (KPIDAO) GeneralDAOFactory.create(KPIDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }

}
