package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao;

import java.util.HashMap;
import java.util.List;

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
public abstract class SliInstTableDAO extends GeneralDAO<Object> {

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSliInst() throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param list <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertSliTaskList(HashMap<String, String> list) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param list <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertSloTaskList(HashMap<String, String> list) throws BaseAppException;

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
