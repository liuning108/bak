package com.ztesoft.zsmart.oss.core.pm.meta.util.dao;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * KPIRELADAO <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.util.dao <br>
 */
public abstract class KPIRELADAO extends GeneralDAO<DynamicDict> {

    /**
     * getKPIRELAInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public abstract void getKPIRELAInfo(DynamicDict dict) throws BaseAppException;
    
    /**
     * getMOPluginInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void getMOPluginInfo(DynamicDict dict) throws BaseAppException;

}
