package com.ztesoft.zsmart.oss.core.pm.meta.util.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * AbstractKPIRELAInfo <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.util.domain <br>
 */

public abstract class AbstractKPIRELAInfo {
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
