package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.domain;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMBasicStatisticTask;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMEntyExtInfoTask;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMEntyInfo;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.dao.DataStatisticDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月9日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.datastatistic.domain <br>
 */
public class SlaTpl extends AbstractSlaTpl {
    /** 
     * [方法描述] executeCreateSqlTpl<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @param _time 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void executeCreateSqlTpl(SLMEntyExtInfoTask task, Calendar _time) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.executeCreateSqlTpl(task, _time);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void executeStatSqlTpl(SLMBasicStatisticTask task) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.executeStatSqlTpl(task);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> 
     * @param slmEntyInfoMap 
     * @param entyIDDIMInfoMap 
     * @param entyIDKPIInfoMap 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void getSLMEntyInfo(HashMap<String, SLMEntyInfo> slmEntyInfoMap,
            HashMap<String, List<String>> entyIDDIMInfoMap, HashMap<String, List<String>> entyIDKPIInfoMap) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.getSLMEntyInfo(slmEntyInfoMap, entyIDDIMInfoMap, entyIDKPIInfoMap);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param slmEntyExtInfoMap 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void getSLMEntyExtInfo(HashMap<String, SLMEntyExtInfoTask> slmEntyExtInfoMap) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.getSLMEntyExtInfo(slmEntyExtInfoMap);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param statisticTask 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void insertStatisticTaskDB(HashMap<String, SLMBasicStatisticTask> statisticTask) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.insertStatisticTaskDB(statisticTask);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param destTableName 
     * @return true
     * @throws BaseAppException <br>
     */ 
    public boolean isExistTable(String destTableName) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        return dao.isExistTable(destTableName);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliNoEntyTableCodeMap 
     * @param kpiAlgorithmMap 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void getSliNoEntyInfo(HashMap<String, String> sliNoEntyTableCodeMap, 
            HashMap<String, String> kpiAlgorithmMap) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.getSliNoEntyInfo(sliNoEntyTableCodeMap, kpiAlgorithmMap);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sql  <br>
     * @throws BaseAppException 
     */ 
    public void executeSql(String sql) throws BaseAppException {
        DataStatisticDAO dao = (DataStatisticDAO) GeneralDAOFactory.create(DataStatisticDAO.class,
                JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        dao.executeSql(sql);
    }
        
}
