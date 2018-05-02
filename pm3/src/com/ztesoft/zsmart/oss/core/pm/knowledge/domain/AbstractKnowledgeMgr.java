/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.knowledge.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月14日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.knowledge.domain <br>
 */

public abstract class AbstractKnowledgeMgr {
    public abstract List<HashMap<String,String>> getRootTree()  throws BaseAppException;
    
    public abstract HashMap<String,Object> getIndexDocList(Map<String, Object> param)   throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>>  getTreeUpAndDown(Map<String, String> param)   throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>>   navTree(Map<String, String> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract   List<HashMap<String,Object>> filterResult(Map<String, String> param)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>>  getDocOpers(Map<String, String> param)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract HashMap<String,Object>  queryDocList(Map<String, Object> param)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String,String> saveOrUpdate(Map<String, Object> param) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract Map<String,Object> queryKnowLedge(String id) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract void  delKnowLedge(String id) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param tag
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>> queryLikeTags(String tag) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param no
     * @param sno
     * @param bno
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>> queryAttrValues(String no, String sno, String bno)  throws BaseAppException;

   
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param type <br>
     */ 
    public abstract void updownVote(String id, String type) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param isPublic
     * @param txt
     * @param userId <br>
     */ 
    public  abstract void addComment(String id, String isPublic, String txt, String userId)  throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract List<HashMap<String,String>>  queryComments(String id) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id <br>
     */ 
    public abstract void delComments(String id) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param filePath
     * @param fileName
     * @param state
     * @param type <br>
     */ 
    public abstract  String addAttach(String id, String filePath, String fileName, String state, String type,String userId) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param filePath <br>
     */ 
    public  abstract void delAttachById(String id, String filePath) throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param docId
     * @return <br>
     */ 
    public abstract List<HashMap<String, String>> queryAttachByDocId(String docId)   throws BaseAppException;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public abstract List<HashMap<String, String>> getSubTypeList()  throws BaseAppException;
   
}
