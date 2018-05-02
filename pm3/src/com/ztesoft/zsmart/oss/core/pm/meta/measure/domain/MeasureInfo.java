package com.ztesoft.zsmart.oss.core.pm.meta.measure.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.measure.dao.MeasureDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * PM元数据-测量对象管理的DOMAIN类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-7 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.measure.domain <br>
 */
public class MeasureInfo extends AbstractMeasureInfo {

    @Override
    public void getMeasureInfo(DynamicDict dict) throws BaseAppException {
        getDao().getMeasureInfo(dict);
    }

    @Override
    public void getMeasureField(DynamicDict dict) throws BaseAppException {
        getDao().getMeasureField(dict);
    }

    @Override
    public void addMeasureInfo(DynamicDict dict) throws BaseAppException {
        getDao().addMeasureInfo(dict);
    }

    @Override
    public void editMeasureInfo(DynamicDict dict) throws BaseAppException {
        getDao().editMeasureInfo(dict);
    }

    @Override
    public void delMeasureInfo(DynamicDict dict) throws BaseAppException {
        getDao().delMeasureInfo(dict);
    }

    /**
     * 获取DAO对象 <br>
     * 
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private MeasureDAO getDao() throws BaseAppException {
        return (MeasureDAO) GeneralDAOFactory.create(MeasureDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
