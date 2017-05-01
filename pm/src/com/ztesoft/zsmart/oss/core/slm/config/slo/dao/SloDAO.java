package com.ztesoft.zsmart.oss.core.slm.config.slo.dao;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * 
 * SLO管理相关的DAO操作抽象类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.slo.dao <br>
 */
public abstract class SloDAO extends GeneralDAO<DynamicDict> {

    @Override
    public int deleteById(String s) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public HashMap<String, String> selectById(String s) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * 
     * 查询出SLO-SC的关联信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectServiceSloCatalog() throws BaseAppException;

    /**
     * 
     * 根据SLO_NO查询出SLO的信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public abstract HashMap<String, String> selectSloInfoByNo(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * 根据SLO_NO查询出关联的SLI信息，以及SLI_RULE信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSloRuleInfoByNo(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * 根据SLO_NO查询出关联的SLA <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloNo <br>
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSlaBySlo(String sloNo) throws BaseAppException;
}
