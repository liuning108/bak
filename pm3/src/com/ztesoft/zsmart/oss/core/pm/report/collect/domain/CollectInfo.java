package com.ztesoft.zsmart.oss.core.pm.report.collect.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;
import com.ztesoft.zsmart.oss.core.pm.report.collect.dao.CollectDAO;

/**
 * 
 * 网元健康度专题的DOMAIN类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-8-31 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.report.collect.domain <br>
 */
public class CollectInfo extends AbstractCollectInfo {

    @Override
    public void getCollectInfo(DynamicDict dict) throws BaseAppException {
        getDao().getCollectInfo(dict);
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
    private CollectDAO getDao() throws BaseAppException {
        return (CollectDAO) GeneralDAOFactory.create(CollectDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
