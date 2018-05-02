/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.domain;

import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.pm.dashboard.dao.DashBoardMgrDao;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

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

public class DashBoardMgr extends AbstractDashBoardMgr {

    @Override
    public Map<String, Object> addDashBoardClass(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.addDashBoardClass(param);
    }

   
    @Override
    public Map<String, Object> queryDashBoardClassByUserID(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryDashBoardClassByUserID(param);
    }

    
    @Override
    public Map<String, Object> delDashBoardClassByID(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.delDashBoardClassByID(param);
    }

    
    @Override
    public Map<String, Object> changeDashBoardClassNameByID(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.changeDashBoardClassNameByID(param);
    }

  
    @Override
    public Map<String, Object> saveUpdateDashBoard(Map<String, Object> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.saveUpdateDashBoard(param);
    }

    
    @Override
    public Map<String, Object> queryDashBoarListByClassId(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryDashBoarListByClassId(param);
    }

 
    @Override
    public Map<String, Object> queryDashBoardById(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.queryDashBoardById(param);
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
    public Map<String, Object> updateSysClass(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.updateSysClass(param);
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
    public Map<String, Object> querySysClassTopList(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.querySysClassTopList(param);
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
    public Map<String, Object> isExistSysClass(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.isExistSysClass(param);
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
    public Map<String, String> saveOrUpdateSendTopic(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.saveOrUpdateSendTopic(param);
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
    public Map<String, String> querySendTopicByNo(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.querySendTopicByNo(param);
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
    public  boolean isEmailSendOn() throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.isEmailSendOn();
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
    public boolean delSendTopic(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.delSendTopic(param);
        return true;
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
    public Map<String, String> delDashBoardById(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.delDashBoardById(param);
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
    public Map<String, Object> addExportTask(Map<String, Object> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.addExportTask(param);
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
    public Map<String, Object> getExportTaskListByUserId(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getExportTaskListByUserId(param);
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
    public Map<String, Object> getExportTaskListByUserIdAndFilter(Map<String, String> param) throws BaseAppException {
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getExportTaskListByUserIdAndFilter(param);
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
        DashBoardMgrDao dao = (DashBoardMgrDao) GeneralDAOFactory.create(DashBoardMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getTaskParam(taskid);
    }
    



}
