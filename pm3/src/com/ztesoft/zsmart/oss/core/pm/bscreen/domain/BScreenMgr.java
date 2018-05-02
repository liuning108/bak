package com.ztesoft.zsmart.oss.core.pm.bscreen.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

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
public class BScreenMgr extends AbstractBScreenMgr {
   
    @Override
    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.saveOrUpdate(dict);
    }

    @Override
    public void queryBScreenById(DynamicDict dict) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.queryBScreenById(dict);

    }

    @Override
    public List<Map<String, Object>> queryBScreenListByUserID(Long userId) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryBScreenListByUserID(userId);
    }

  
    @Override
    public boolean deleteBScreenById(String id) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.deleteBScreenById(id);
    }

    @Override
    public Map<String, Object> getFields(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getFields(param);
    }

   
    @Override
    public Map<String, Object> saveOrUpdateSourceService(Map<String, String> map) throws BaseAppException {
        // TODO Auto-generated method stub
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.saveOrUpdateSourceService(map);
    }

   
    @Override
    public Map<String, Object> getSourceServiceList(Map<String, String> param) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getSourceServiceList(param);
    }

  
    @Override
    public Map<String, Object> getSourceServiceById(Map<String, String> param) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getSourceServiceById(param);
    }

 
    @Override 
    public Map<String, Object> delSourceServiceById(Map<String, String> param) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.delSourceServiceById(param);
    }

  
    @Override
    public Map<String, Object> getServerSkeleton(Map<String, String> param) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getServerSkeleton(param);

    }

 
    @Override
    public List<HashMap<String, String>> getSource() throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getSource();
    }
   
    @Override
    public List<HashMap<String, String>> getApiSource() throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getApiSource();
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
    public Map<String, Object> getAPIField(Map<String, String> param) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getAPIField(param);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<Map<String, Object>> queryBScreenList() throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryBScreenList();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskid
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public String getTaskParam(String taskid) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getTaskParam(taskid);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param filename
     * @param filePath
     * @param json
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public String addMap(String filename, String filePath, String json) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.addMap(filename,filePath,json);
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
    public String getMap(String id) throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getMap(id);
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
    public void delMap(String id) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.delMap(id);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public List<HashMap<String, String>> getMapList() throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return  dao.getMapList();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param id
     * @param name
     * @throws BaseAppException <br>
     */ 
    @Override
    public void renameMap(String id, String name) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
          dao.renameMap(id,name);
    }


    
}
