package com.ztesoft.zsmart.oss.core.pm.meta.counter.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.counter.domain.AbstractCounterInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;


/**
 * PM-Meta Counter相关服务处理类 <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-6-8 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.counter.service <br>
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
        logger.debug("PM call service begin \n" + dict.asXML("utf-8"));
        if ("MPM_META_MO_COUNTER_QUERY".equals(serviceName)) {
            this.getCounterInfo(dict);
        }
        else if ("MPM_META_MO_DIM_QUERY".equals(serviceName)) {
            this.getDimInfo(dict);
        }
        logger.debug("PM call service end \n" + dict.asXML("utf-8"));
        return 0;
    }

    /**
     * getCounterInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getCounterInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getCounterInfo(dict);

    }
    
    /**
     * getDimInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getDimInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getDimInfo(dict);

    }
    
    /**
     * AbstractCounterInfo <br>
     * 
     * @author wen.yongjun <br>
     * @throws BaseAppException <br>
     * @return AbstractCounterInfo 
     */
    private AbstractCounterInfo getDmo() throws BaseAppException {
        return (AbstractCounterInfo) GeneralDMOFactory.create(AbstractCounterInfo.class);
    }

}
