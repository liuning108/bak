package com.ztesoft.zsmart.oss.core.pm.meta.model.busi.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.model.busi.dao.ModelBusiDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * PM元数据-测量对象管理的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.busi.domain <br>
 */
public class ModelBusiInfo extends AbstractModelBusiInfo {

    @Override
    public void getModelBusiInfo(DynamicDict dict) throws BaseAppException {
        getDao().getModelBusiInfo(dict);
    }
    
    @Override
    public void getModelBusiField(DynamicDict dict) throws BaseAppException {
        getDao().getModelBusiField(dict);
    }
    
    @Override
    public void addModelBusiInfo(DynamicDict dict) throws BaseAppException {
        getDao().addModelBusiInfo(dict);
    }
    
    @Override
    public void editModelBusiInfo(DynamicDict dict) throws BaseAppException {
        getDao().editModelBusiInfo(dict);
    }
    
    @Override
    public void delModelBusiInfo(DynamicDict dict) throws BaseAppException {
        getDao().delModelBusiInfo(dict);
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
    private ModelBusiDAO getDao() throws BaseAppException {
        return (ModelBusiDAO) GeneralDAOFactory.create(ModelBusiDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
