/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.knowledge.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.baidu.ueditor.ActionEnter;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.pm.config.alram.dao.AlramDao;
import com.ztesoft.zsmart.oss.core.pm.knowledge.dao.KnowledgeDao;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

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

public class KnowledgeMgr extends AbstractKnowledgeMgr {

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getRootTree() throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getRootTree();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getTreeUpAndDown(Map<String, String> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getTreeUpAndDown(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> navTree(Map<String, String> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.navTree(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, Object>> filterResult(Map<String, String> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.filterResult(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getDocOpers(Map<String, String> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getDocOpers(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public  HashMap<String, Object> getIndexDocList(Map<String, String> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getIndexDocList(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public HashMap<String, Object> queryDocList(Map<String, Object> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryDocList(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, String> saveOrUpdate(Map<String, Object> param) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.saveOrUpdate(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, Object> queryKnowLedge(String id) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryKnowLedge(id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delKnowLedge(String id) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
         dao.delKnowLedge(id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param tag
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryLikeTags(String tag) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
          return   dao.queryLikeTags(tag);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param no
     * @param sno
     * @param bno
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryAttrValues(String no, String sno, String bno) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return   dao.queryAttrValues(no,sno,bno);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param type
     * @throws BaseAppException <br>
     */ 
    @Override
    public void updownVote(String id, String type) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
         dao.updownVote(id,type);
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param isPublic
     * @param txt
     * @param userId
     * @throws BaseAppException <br>
     */ 
    @Override
    public void addComment(String id, String isPublic, String txt, String userId) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.addComment(id,isPublic,txt,userId);
       
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> queryComments(String id) throws BaseAppException {
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
       return  dao.queryComments(id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delComments(String id) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        KnowledgeDao dao = (KnowledgeDao) GeneralDAOFactory.create(KnowledgeDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
         dao.delComments(id);
        
    }
    


}
