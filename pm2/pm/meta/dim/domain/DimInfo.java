package com.ztesoft.zsmart.oss.core.pm.meta.dim.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.dim.dao.DimDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * PM元数据-维度管理的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-3 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.domain <br>
 */
public class DimInfo extends AbstractDimInfo {

    @Override
    public void getDimInfo(DynamicDict dict) throws BaseAppException {
        getDao().getDimInfo(dict);
    }
    
    @Override
    public void addDimInfo(DynamicDict dict) throws BaseAppException {
        getDao().addDimInfo(dict);
    }
    
    @Override
    public void editDimInfo(DynamicDict dict) throws BaseAppException {
        getDao().editDimInfo(dict);
    }
    
    @Override
    public void delDimInfo(DynamicDict dict) throws BaseAppException {
        getDao().delDimInfo(dict);
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
    private DimDAO getDao() throws BaseAppException {
        return (DimDAO) GeneralDAOFactory.create(DimDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
