/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.domain;

import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年8月12日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.dashboard.domain <br>
 */

public abstract class AbstractDashBoardMgr {

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
    public abstract Map<String, Object> saveUpdateDashBoard(Map<String, Object> param) throws BaseAppException;

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
     * @throws BaseAppException <br>
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
     * @throws BaseAppException <br> 
     */
    public abstract Map<String, Object> changeDashBoardClassNameByID(Map<String, String> param) throws BaseAppException;

     
    
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
    public abstract Map<String, Object> queryDashBoardById(Map<String, String> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public  abstract Map<String,Object> addSysClass(Map<String, String> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String,Object> querySysClassTopList(Map<String, String> param)throws BaseAppException;
    

}
