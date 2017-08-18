package com.ztesoft.zsmart.oss.core.pm.config.adapter.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.config.adapter.dao.AdapterDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * PM元数据-测量对象管理的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-16 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.adapter.domain <br>
 */
public class AdapterInfo extends AbstractAdapterInfo {

    @Override
    public void getAdapterInfo(DynamicDict dict) throws BaseAppException {
        getDao().getAdapterInfo(dict);
    }
    
    @Override
    public void getAdapterMapping(DynamicDict dict) throws BaseAppException {
        getDao().getAdapterMapping(dict);
    }
    
    @Override
    public void addAdapterInfo(DynamicDict dict) throws BaseAppException {
        getDao().addAdapterInfo(dict);
    }
    
    @Override
    public void editAdapterInfo(DynamicDict dict) throws BaseAppException {
        getDao().editAdapterInfo(dict);
    }
    
    @Override
    public void delAdapterInfo(DynamicDict dict) throws BaseAppException {
        getDao().delAdapterInfo(dict);
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
    private AdapterDAO getDao() throws BaseAppException {
        return (AdapterDAO) GeneralDAOFactory.create(AdapterDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
