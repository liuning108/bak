package com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.dao;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * 
 * SLA监控相关的DAO操作抽象类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.dao <br>
 */
public abstract class EvalInstDAO extends GeneralDAO<DynamicDict> {

    @Override
    public int delete(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public void insert(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int update(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }
    
    /**
     * 
     * 从SLM_SLA_EVAL_INST_yyyymm 表中获取当前正在执行计算的SLA实例 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSlaEvalInst() throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param slaInstInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSlaEvalServiceInst(DynamicDict slaInstInfo) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param slaInstInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSloEvalInst(DynamicDict slaInstInfo) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloInstInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSliRuleEvalInst(DynamicDict sloInstInfo) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloInstInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSliRuleInst(DynamicDict sloInstInfo) throws BaseAppException;

}
