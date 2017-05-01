package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月27日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao <br>
 */
public abstract class SlaScItemTableDAO extends GeneralDAO<Object> {
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param slaNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */ 
    public abstract int selectDataBySlaNo(String slaNo) throws BaseAppException;
    
    @Override
    public int delete(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    @Override
    public void insert(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        
    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return null;
    }

    @Override
    public int update(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

}
