package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * [kpi统计表抽象类] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年8月17日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao <br>
 */
public abstract class SliDataTableDAO extends GeneralDAO<Object> {

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliName <br>
     * @param table <br>
     * @param btime <br>
     * @param etime <br>
     * @param timespan <br>
     * @param dayspan <br>
     * @param slaid <br>
     * @param sli_formula <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectDataBySliNameN(String slaid, String sliName, List<HashMap<String, String>> table,
        String btime, String etime, String timespan, String dayspan, String sli_formula) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliName <br>
     * @param tableName <br>
     * @param btime <br>
     * @param etime <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectDataBySliNameY(String sliName, String tableName, String btime, String etime)
        throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertCaculateData(DynamicDict sliInfo) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertStateData(DynamicDict sliInfo) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertCaculateSloData(DynamicDict sliInfo) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertStateSloData(DynamicDict sliInfo) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertTimeOutStateData(DynamicDict sliInfo) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliInfo <br>
     * @throws BaseAppException <br>
     */
    public abstract void insertTimeOutCaculateData(DynamicDict sliInfo) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> getTableName(String taskId) throws BaseAppException;

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract String getSliFormula(String taskId) throws BaseAppException;

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
