/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.knowledge.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月14日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.knowledge.dao <br>
 */

public  abstract class KnowledgeDao  extends GeneralDAO<Object> {




    public abstract List<HashMap<String,String>> getRootTree()  throws BaseAppException;
    public abstract List<HashMap<String, String>> getTreeUpAndDown(Map<String, String> param)  throws BaseAppException;
    public abstract List<HashMap<String, String>> navTree(Map<String, String> param) throws BaseAppException;
    public abstract List<HashMap<String, Object>> filterResult(Map<String, String> param) throws BaseAppException;
    public abstract List<HashMap<String, String>> getDocOpers(Map<String, String> param)  throws BaseAppException;
    public abstract  HashMap<String, Object>  getIndexDocList(Map<String, String> param)  throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public int delete(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @throws BaseAppException <br>
     */ 
    @Override
    public void insert(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return null;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public int update(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
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
    public  abstract  HashMap<String, Object> queryDocList(Map<String, Object> param) throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    public abstract Map<String, String> saveOrUpdate(Map<String, Object> param) throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract Map<String, Object> queryKnowLedge(String id) throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract void delKnowLedge(String id) throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param tag
     * @return <br>
     */ 
    public  abstract List<HashMap<String, String>> queryLikeTags(String tag)   throws BaseAppException;
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
    public  abstract List<HashMap<String, String>> queryAttrValues(String no, String sno, String bno)   throws BaseAppException;
    
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
    public abstract void addComment(String id, String isPublic, String txt, String userId)  throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public  abstract List<HashMap<String, String>> queryComments(String id) throws BaseAppException;
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return <br>
     */ 
    public abstract void delComments(String id) throws BaseAppException;
  
  

  





}
