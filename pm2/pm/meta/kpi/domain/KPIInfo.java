package com.ztesoft.zsmart.oss.core.pm.meta.kpi.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao.KPIDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * PM元数据-指标管理的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-5 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.kpi.domain <br>
 */
public class KPIInfo extends AbstractKPIInfo {

    @Override
    public void getKPIInfo(DynamicDict dict) throws BaseAppException {
        getDao().getKPIInfo(dict);
    }
    
    @Override
    public void getKPIFormular(DynamicDict dict) throws BaseAppException {
        getDao().getKPIFormular(dict);
    }
    
    @Override
    public void addKPIInfo(DynamicDict dict) throws BaseAppException {
        getDao().addKPIInfo(dict);
    }
    
    @Override
    public void editKPIInfo(DynamicDict dict) throws BaseAppException {
        getDao().editKPIInfo(dict);
    }
    
    @Override
    public void delKPIInfo(DynamicDict dict) throws BaseAppException {
        getDao().delKPIInfo(dict);
    }
    /**
     * 
     * 获取DAO对象 <br> 
     *  
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private KPIDAO getDao() throws BaseAppException {
        return (KPIDAO) GeneralDAOFactory.create(KPIDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
