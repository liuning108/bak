package com.ztesoft.zsmart.oss.core.slm.config.sli.domain;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * SLI管理的DOMAIN抽象类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sli.domain <br>
 */
public abstract class AbstractSliInfo {

    /**
     * 
     * 新增SLI <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void addSliInfo(DynamicDict sliInfo) throws BaseAppException;

    /**
     * 
     * 删除SLI <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void removeSliInfo(DynamicDict sliInfo) throws BaseAppException;

    /**
     * 
     * 修改SLI <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void modifySliInfo(DynamicDict sliInfo) throws BaseAppException;

    /**
     * 
     * 根据SLI_NO获取引用了该SLI的SLO <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> getSloBySli(String sliNo) throws BaseAppException;

    /**
     * 
     * 根据SLI_NO获取SLI的信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract HashMap<String, String> getSliByNo(String sliNo) throws BaseAppException;
}
