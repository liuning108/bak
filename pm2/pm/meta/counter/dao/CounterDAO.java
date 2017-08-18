package com.ztesoft.zsmart.oss.core.pm.meta.counter.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * PM-Meta Counter相关服务处理类 <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-6-8 <br>
 * @since JDK7.0<br>
 */
public abstract class CounterDAO extends GeneralDAO<DynamicDict> {

    /**
     * getCounterInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getCounterInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * getDimInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getDimInfo(DynamicDict dict) throws BaseAppException;

}
