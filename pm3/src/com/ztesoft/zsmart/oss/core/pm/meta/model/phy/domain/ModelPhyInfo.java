package com.ztesoft.zsmart.oss.core.pm.meta.model.phy.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao.ModelPhyDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * PM元数据-物理模型管理的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-10 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.domain <br>
 */
public class ModelPhyInfo extends AbstractModelPhyInfo {

    @Override
    public void getModelPhyInfo(DynamicDict dict) throws BaseAppException {
        getDao().getModelPhyInfo(dict);
    }
    
    @Override
    public void getModelPhyScript(DynamicDict dict) throws BaseAppException {
        getDao().getModelPhyScript(dict);
    }
    
    @Override
    public void getModelPhyDataSource(DynamicDict dict) throws BaseAppException {
        getDao().getModelPhyDataSource(dict);
    }
    
    @Override
    public void addModelPhyInfo(DynamicDict dict) throws BaseAppException {
        getDao().addModelPhyInfo(dict);
    }
    
    @Override
    public void editModelPhyInfo(DynamicDict dict) throws BaseAppException {
        getDao().editModelPhyInfo(dict);
    }
    
    @Override
    public void delModelPhyInfo(DynamicDict dict) throws BaseAppException {
        getDao().delModelPhyInfo(dict);
    }
    
    @Override
    public void addModelPhyDataSource(DynamicDict dict) throws BaseAppException {
        getDao().addModelPhyDataSource(dict);
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
    private ModelPhyDAO getDao() throws BaseAppException {
        return (ModelPhyDAO) GeneralDAOFactory.create(ModelPhyDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
