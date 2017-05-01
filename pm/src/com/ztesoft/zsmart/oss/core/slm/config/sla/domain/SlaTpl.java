package com.ztesoft.zsmart.oss.core.slm.config.sla.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.config.sla.dao.SlaTplDAO;
import com.ztesoft.zsmart.oss.core.slm.config.sla.model.SlaTplModel;
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
public class SlaTpl extends AbstractSlaTpl {
    
    /**
     * Description:查询技能目录 <br> 
     *  
     * @author Crayon<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
      
    public void querySkillCatalog(DynamicDict dict) throws BaseAppException {
        SkillCatalogDAO dao = (SkillCatalogDAO) GeneralDAOFactory.create(SkillCatalogDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_WFM));
        
        List<HashMap<String, String>> list = dao.querySkillCatalog();
        for (HashMap<String, String> map : list) {
            DynamicDict rDict = new DynamicDict();
            rDict.valueMap.putAll(map);
            dict.setValueByName("RETURN_LIST", rDict, 1);
        }
    }*/

    @Override
    public void addSlaTpl(DynamicDict dict) throws BaseAppException {
        SlaTplModel model = new SlaTplModel();
        model.init(dict);
        SlaTplDAO dao = (SlaTplDAO) GeneralDAOFactory.create(SlaTplDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        String slaNo = dao.addSlaTpl(model);
        dict.set("SLA_NO", slaNo);
    }
    
    @Override
    public void qrySlaTpl(DynamicDict dict) throws BaseAppException {
        SlaTplDAO dao = (SlaTplDAO) GeneralDAOFactory.create(SlaTplDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.qrySlaTpl(dict);
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
    public void delSlaTpl(DynamicDict dict) throws BaseAppException {
        SlaTplDAO dao = (SlaTplDAO) GeneralDAOFactory.create(SlaTplDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.delSlaTpl(dict);
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
    public void editSlaTpl(DynamicDict dict) throws BaseAppException {
        SlaTplModel model = new SlaTplModel();
        model.init(dict);
        SlaTplDAO dao = (SlaTplDAO) GeneralDAOFactory.create(SlaTplDAO.class,
            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.delSlaTpl(dict);
        dao.addSlaTpl(model);
        
    }
}
