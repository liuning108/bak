package com.ericsson.inms.pm.service.impl.alarmtemplate;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.alarmtemplate.IAlarmTemplateSrv;
import com.ericsson.inms.pm.service.impl.alarmtemplate.dao.AlarmTemplateDAO;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月27日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.service.impl.alarmtemplate <br>
 */
@Service("alarmTemplate")
public class AlarmTemplateSrv implements IAlarmTemplateSrv {
       
    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(AlarmTemplateSrv.class);
        
    @Override
    public List<Map<String, Object>> qryNeIconList(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.qryNeIconList(params);
    }
    
    @Override
    public JSONObject getFieldInModel(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.getFieldInModel(params);
    }
    
    @Override
    public List<Map<String, Object>> qryTemplate(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.qryTemplate(params);
    }
    
    @Override
    public List<Map<String, Object>> searchTemplate(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.searchTemplate(params);
    }
    
    @Override
    public Map<String, Object> qryTemplateDetail(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.qryTemplateDetail(params);
    }
    
    @Override
    public String addTemplate(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.addTemplate(params);
    }
    
    @Override
    public String delTemplate(Map<String, Object> params) throws BaseAppException {
        AlarmTemplateDAO dao = (AlarmTemplateDAO) GeneralDAOFactory.create(AlarmTemplateDAO.class, JdbcUtil.OSS_KDO);
        return dao.delTemplate(params);
    }
}


