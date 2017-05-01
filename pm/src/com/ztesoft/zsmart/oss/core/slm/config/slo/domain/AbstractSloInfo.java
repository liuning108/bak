package com.ztesoft.zsmart.oss.core.slm.config.slo.domain;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * SLO管理的DOMAIN抽象类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.slo.domain <br>
 */
public abstract class AbstractSloInfo {

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> getServiceAndSloCatalog() throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract HashMap<String, String> getSloInfoByNo(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> getSloRuleInfoByNo(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloDict <br>
     * @throws BaseAppException <br>
     */
    public abstract void addSloInfo(DynamicDict sloDict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloDict <br>
     * @throws BaseAppException <br>
     */
    public abstract void modifySloInfo(DynamicDict sloDict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloDict <br>
     * @throws BaseAppException <br>
     */
    public abstract void removeSloInfo(DynamicDict sloDict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> getSlaBySlo(String sloNo) throws BaseAppException;

}
