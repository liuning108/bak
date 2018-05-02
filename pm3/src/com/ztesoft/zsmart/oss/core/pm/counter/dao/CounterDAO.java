package com.ztesoft.zsmart.oss.core.pm.counter.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * 网元健康度专题相关的DAO操作抽象类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-8-31 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.counter.dao <br>
 */
public abstract class CounterDAO extends GeneralDAO<DynamicDict> {
    /**
     * 
     * 查询网元健康度专题信息 <br> 
     *  
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getCounterData(DynamicDict dict) throws BaseAppException;

    /**
     * 查询组的配置信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getCounterBase(DynamicDict dict) throws BaseAppException;
    /**
     * 新建组的基本信息 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public abstract void getCounterList(DynamicDict dict) throws BaseAppException;

    
}
