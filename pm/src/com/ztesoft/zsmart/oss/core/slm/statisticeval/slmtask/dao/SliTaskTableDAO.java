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
public abstract class SliTaskTableDAO extends GeneralDAO<Object> {
    
    /**
     * [查询未调度任务] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param staffId
     * @return <br>
     * @throws BaseAppException <br>
     */ 
    public abstract List<HashMap<String, String>> selectTaskInfoByStat() throws BaseAppException;
    
    
    
    /**
     * [定时备份调度完成数据] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */ 
    public abstract int moveTaskInfoByStat() throws BaseAppException;
    
    


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param list <br>
     * @return <br>
     * @throws BaseAppException <br>
     */ 
    public abstract int updateExcuteTaskState(HashMap<String, String> list) throws BaseAppException;
    

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskid <br>
     * @return <br>
     * @throws BaseAppException <br>
     */ 
    public abstract int updateTaskState(String taskid) throws BaseAppException;
    

    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskId <br>
     * @param list <br>
     * @throws BaseAppException <br>
     */ 
    public abstract void insertTableNameData(String taskId, List<String> list) throws BaseAppException;
       
}
