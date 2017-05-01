package com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.dao;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * 
 * [描述] <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.dao <br>
 */
public abstract class WinEvalInstDAO extends GeneralDAO<DynamicDict> {

    @Override
    public int delete(DynamicDict arg0) throws BaseAppException {
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        return 0;
    }

    @Override
    public void insert(DynamicDict arg0) throws BaseAppException {
    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        return null;
    }

    @Override
    public int update(DynamicDict arg0) throws BaseAppException {
        return 0;
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param qryInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract HashMap<String, String> querySlaWinEvalOverview(DynamicDict qryInfo) throws BaseAppException;

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
    public abstract List<HashMap<String, String>> querySlaTrendWinEvalOverview(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param qryInfo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> querySlaWinEvalInst(DynamicDict qryInfo) throws BaseAppException;

}
