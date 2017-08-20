package com.ztesoft.zsmart.oss.core.pm.adhoc.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.adhoc.dao.TopicDAO;
import com.ztesoft.zsmart.oss.core.pm.adhoc.model.TopicClassModel;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sla.domain <br>
 */
public class Topic extends AbstractTopic {
    
    /*
    @Override
    public void addSlaTpl(DynamicDict dict) throws BaseAppException {
        SlaTplModel model = new SlaTplModel();
        model.init(dict);
        SlaTplDAO dao = (SlaTplDAO) GeneralDAOFactory.create(SlaTplDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        String slaNo = dao.addSlaTpl(model);
        dict.set("SLA_NO", slaNo);
    }
    */
    
    @Override
    public void qryTopic(DynamicDict dict) throws BaseAppException {
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.qryTopic(dict);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void addTopicClass(DynamicDict dict) throws BaseAppException {
        TopicClassModel model = new TopicClassModel();
        model.init(dict);
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        String classNo = dao.addTopicClass(model);
        dict.set("CLASS_NO", classNo);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void modTopicClass(DynamicDict dict) throws BaseAppException {
        TopicClassModel model = new TopicClassModel();
        model.init(dict);
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.delTopicClass(model);
        dao.addTopicClass(model);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delTopicClass(DynamicDict dict) throws BaseAppException {
        TopicClassModel model = new TopicClassModel();
        model.init(dict);
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.delTopicClass(model);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void qryTopicClass(DynamicDict dict) throws BaseAppException {
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.qryTopicClass(dict);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void favTopic(DynamicDict dict) throws BaseAppException {
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.favTopic(dict);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void cacheOperUser(DynamicDict dict) throws BaseAppException {
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.cacheOperUser(dict);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void cacheMetaData(DynamicDict dict) throws BaseAppException {
        // 通过接口获取元数据
        TopicDAO dao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.cacheMetaData(dict);
    }
    
}
