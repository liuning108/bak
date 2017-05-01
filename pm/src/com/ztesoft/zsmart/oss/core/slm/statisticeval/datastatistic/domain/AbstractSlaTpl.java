package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.domain;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMBasicStatisticTask;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMEntyExtInfoTask;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMEntyInfo;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月9日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.datastatistic.domain <br>
 */
public abstract class AbstractSlaTpl {

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @param _time 
     * @throws BaseAppException <br>
     */ 
    public abstract void executeCreateSqlTpl(SLMEntyExtInfoTask task, Calendar _time) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @throws BaseAppException <br>
     */ 
    public abstract void executeStatSqlTpl(SLMBasicStatisticTask task) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param slmEntyInfoMap 
     * @param entyIDDIMInfoMap 
     * @param entyIDKPIInfoMap 
     * @throws BaseAppException  <br>
     */ 
    public abstract void getSLMEntyInfo(HashMap<String, SLMEntyInfo> slmEntyInfoMap,
            HashMap<String, List<String>> entyIDDIMInfoMap, HashMap<String, List<String>> entyIDKPIInfoMap) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param slmEntyExtInfoMap 
     * @throws BaseAppException <br>
     */ 
    public abstract void getSLMEntyExtInfo(HashMap<String, SLMEntyExtInfoTask> slmEntyExtInfoMap) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> 
     * @param statisticTask 
     * @throws BaseAppException  <br>
     */ 
    public abstract void insertStatisticTaskDB(HashMap<String, SLMBasicStatisticTask> statisticTask) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param destTableName 
     * @return r
     * @throws BaseAppException <br>
     */ 
    public abstract boolean isExistTable(String destTableName) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliNoEntyTableCodeMap 
     * @param kpiAlgorithmMap 
     * @throws BaseAppException <br>
     */ 
    public abstract void getSliNoEntyInfo(HashMap<String, String> sliNoEntyTableCodeMap,
            HashMap<String, String> kpiAlgorithmMap) throws BaseAppException;
    

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sql 
     * @throws BaseAppException  <br>
     */ 
    public abstract void executeSql(String sql)  throws BaseAppException;
    
}
