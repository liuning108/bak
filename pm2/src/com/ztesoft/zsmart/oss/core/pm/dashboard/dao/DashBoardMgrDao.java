/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.dao;

import java.util.HashMap;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年8月12日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.dashboard.dao <br>
 */

public abstract class DashBoardMgrDao extends GeneralDAO<Object> {

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return  Map<String, Object>
     * @throws BaseAppException <br>
     */
    public abstract Map<String, Object> queryDashBoardById(Map<String, String> param) throws BaseAppException;
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return Map<String, Object>
     * @throws BaseAppException <br>
     */
    public abstract Map<String, Object> queryDashBoarListByClassId(Map<String, String> param) throws BaseAppException;
    
     /**
      * 
      * [方法描述] <br> 
      *  
      * @author [刘宁]<br>
      * @taskId <br>
      * @param param 
      * @return Map<String, Object>
      * @throws BaseAppException <br>
      */
    public abstract Map<String, Object> addDashBoardClass(Map<String, String> param) throws BaseAppException;
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return Map<String, Object>
     * @throws BaseAppException <br>
     */
    public abstract Map<String, Object> queryDashBoardClassByUserID(Map<String, String> param) throws BaseAppException;
    
     /**
      * 
      * [方法描述] <br> 
      *  
      * @author [刘宁]<br>
      * @taskId <br>
      * @param param 
      * @return Map<String, Object> 
      * @throws BaseAppException  <br>
      */
    public abstract Map<String, Object> delDashBoardClassByID(Map<String, String> param) throws BaseAppException;
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return Map<String, Object>
     * @throws BaseAppException  <br>
     */
    public abstract Map<String, Object> changeDashBoardClassNameByID(Map<String, String> param) throws BaseAppException;
    
    
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String, Object> updateSysClass(Map<String, String> param)  throws BaseAppException;
   /**
    *  
    * [方法描述] <br> 
    *  
    * @author [刘宁]<br>
    * @taskId <br>
    * @param param 
    * @return Map<String, Object> 
    * @throws BaseAppException <br>
    */
    public abstract Map<String, Object> saveUpdateDashBoard(Map<String, Object> param) throws BaseAppException;

    @Override
    public int delete(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public void insert(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        return null;
    }

    @Override
    public int update(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String, Object> querySysClassTopList(Map<String, String> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public  abstract Map<String, Object> isExistSysClass(Map<String, String> param)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String,String> saveOrUpdateSendTopic(Map<String, String> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String, String> querySendTopicByNo(Map<String, String> param) throws BaseAppException;
  
   

}
