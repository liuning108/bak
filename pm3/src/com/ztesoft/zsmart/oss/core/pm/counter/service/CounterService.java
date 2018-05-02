package com.ztesoft.zsmart.oss.core.pm.counter.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.counter.domain.AbstractCounterInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 网元健康度专题相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-8-31 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.counter.service <br>
 */
public class CounterService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_COUNTER_DATA_QUERY".equals(serviceName)) {
            this.getCounterData(dict);
        }
        else if ("MPM_COUNTER_BASE_QUERY".equals(serviceName)) {
            this.getCounterBase(dict);
        }
        else if ("MPM_COUNTER_LIST_QUERY".equals(serviceName)) {
            this.getCounterList(dict);
        }
        return 0;
    }

    /**
     * 健康度-得分查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getCounterData(DynamicDict dict) throws BaseAppException {

        getDmo().getCounterData(dict);

    }

    /**
     * 健康度-基本信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getCounterBase(DynamicDict dict) throws BaseAppException {

        getDmo().getCounterBase(dict);

    }

    /**
     * 健康度-KPI查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getCounterList(DynamicDict dict) throws BaseAppException {

        getDmo().getCounterList(dict);
    }    
    
    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractCounterInfo getDmo() throws BaseAppException {
        return (AbstractCounterInfo) GeneralDMOFactory.create(AbstractCounterInfo.class);
    }
    
}
