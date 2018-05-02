package com.ztesoft.zsmart.oss.core.pm.counter.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;
import com.ztesoft.zsmart.oss.core.pm.counter.dao.CounterDAO;

/**
 * 
 * 网元健康度专题的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-8-31 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.counter.domain <br>
 */
public class CounterInfo extends AbstractCounterInfo {

    @Override
    public void getCounterData(DynamicDict dict) throws BaseAppException {
        getDao().getCounterData(dict);
    }
    
    @Override
    public void getCounterBase(DynamicDict dict) throws BaseAppException {
        getDao().getCounterBase(dict);
    }
    
    @Override
    public void getCounterList(DynamicDict dict) throws BaseAppException {
        getDao().getCounterList(dict);
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
    private CounterDAO getDao() throws BaseAppException {
        return (CounterDAO) GeneralDAOFactory.create(CounterDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
