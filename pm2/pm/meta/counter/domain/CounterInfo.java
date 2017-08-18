package com.ztesoft.zsmart.oss.core.pm.meta.counter.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.counter.dao.CounterDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * PM-Meta Counter相关服务处理类 <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-6-8 <br>
 * @since JDK7.0<br>
 */
public class CounterInfo extends AbstractCounterInfo {

    @Override
    public void getCounterInfo(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        getDao().getCounterInfo(dict);
    }

    @Override
    public void getDimInfo(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        getDao().getDimInfo(dict);
    }
    
    /**
     * CounterDAO <br>
     * 
     * @author wen.yongjun <br>
     * @throws BaseAppException <br>
     * @return CounterDAO
     */
    private CounterDAO getDao() throws BaseAppException {
        return (CounterDAO) GeneralDAOFactory.create(CounterDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
