package com.ztesoft.zsmart.oss.core.pm.bscreen.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.domain <br>
 */
public abstract class AbstractBScreenMgr {
    
     
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @return List<HashMap<String,String>>
     * @throws BaseAppException  <br> 
     */
    public  abstract List<HashMap<String, String>> getSource() throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    public abstract Map<String, Object> getServerSkeleton(Map<String, String> param) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */
    public abstract void saveOrUpdate(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException
     *             <br>
     */

    public abstract void queryBScreenById(DynamicDict dict) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br> 
     * @param userId 
     * @return list
     * @throws BaseAppException
     *             <br>
     */

    public abstract List<Map<String, Object>> queryBScreenListByUserID(Long userId) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param id 
     * @return boolean
     * @throws BaseAppException
     *             <br>
     */
    public abstract boolean deleteBScreenById(String id) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    public abstract Map<String, Object> getAPIField(Map<String, String> param) throws BaseAppException;
    
    
    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    public abstract Map<String, Object> getFields(Map<String, String> param) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @return map 
     * @throws BaseAppException 
     *             <br>
     */
    public abstract Map<String, Object> saveOrUpdateSourceService(Map<String, String> map) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    public abstract Map<String, Object> getSourceServiceList(Map<String, String> param) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    public abstract Map<String, Object> getSourceServiceById(Map<String, String> param) throws BaseAppException;

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    public abstract Map<String, Object> delSourceServiceById(Map<String, String> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public abstract List<HashMap<String, String>> getApiSource()  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public abstract List<Map<String, Object>> queryBScreenList() throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskid
     * @return <br>
     */ 
    public abstract String getTaskParam(String taskid)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param filename
     * @param filePath
     * @param json <br>
     */ 
    public abstract String addMap(String filename, String filePath, String json) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract String  getMap(String id)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id <br>
     */ 
    public  abstract void delMap(String id)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>> getMapList()  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param name <br>
     */ 
    public abstract void renameMap(String id, String name) throws BaseAppException;

}
