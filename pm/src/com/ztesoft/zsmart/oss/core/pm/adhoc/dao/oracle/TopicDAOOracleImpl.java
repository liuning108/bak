package com.ztesoft.zsmart.oss.core.pm.adhoc.dao.oracle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.adhoc.dao.TopicDAO;
import com.ztesoft.zsmart.oss.core.pm.adhoc.model.TopicClassModel;
import com.ztesoft.zsmart.oss.core.pm.adhoc.model.TopicModel;
import com.ztesoft.zsmart.oss.core.pm.adhoc.util.AdhocSeqUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sla.dao.oracle <br>
 */
public class TopicDAOOracleImpl extends TopicDAO {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
 
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
        ParamArray pa = new ParamArray();
        String sql = "SELECT USER_ID,USER_NAME FROM BFM_USER";
        List<HashMap<String, String>> userList = this.queryList(sql, pa);
        dict.set("userList", userList);
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
    public void qryTopic(DynamicDict dict) throws BaseAppException {
        String operUser = dict.getString("OPER_USER");
        ParamArray pa = new ParamArray();
        String sql = "SELECT "
            + "CLASS_NO,"
            + "TOPIC_NO,"
            + "TOPIC_NAME,"
            + "SEQ,"
            + "MODEL_CODE,"
            + "DATE_GRAN,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID "
            + "FROM PM_TOPIC_LIST WHERE STATE=1 AND SEQ=0";
        List<HashMap<String, String>> topicList = this.queryList(sql, pa);
        dict.set("topicList", topicList);
        // 查询当前用户收藏主题及最近浏览主题
        sql = "SELECT "
            + "CLASS_TYPE,"
            + "TOPIC_NO "
            + "FROM PM_TOPIC_SYSCLASS WHERE OPER_USER=? AND SEQ=0 ORDER BY OPER_DATE DESC";
        pa.set("", operUser);
        List<HashMap<String, String>> favAndViewedList = this.queryList(sql, pa);
        dict.set("favAndViewedList", favAndViewedList);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param model 
     * @return String
     * @throws BaseAppException <br>
     */ 
    @Override
    public String addTopicClass(TopicClassModel model) throws BaseAppException {
        String classNo = model.getClassNO();
        if (null == classNo || "".equals(classNo)) {
            classNo = this.qryClassNo();
        }
        String sql = "INSERT INTO PM_TOPIC_CLASS("
            + "CLASS_NO,"
            + "CLASS_NAME,"
            + "SEQ,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID"
            + ")VALUES (?,?,0,?,sysdate,null)";
        ParamArray pa = new ParamArray();
        pa.set("", classNo);
        pa.set("", model.getClassName());
        pa.set("", model.getOperUser());
        int insertNum = executeUpdate(sql, pa);
        if (insertNum == 0) {
            logger.error("Insert PM_TOPIC_CLASS fail\n  insertSQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Insert PM_TOPIC_CLASS fail ", ExceptionHandler.BUSS_ERROR);
        }           
        return classNo;
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
        ParamArray pa = new ParamArray();
        String sql = "SELECT "
            + "CLASS_NO,"
            + "CLASS_NAME,"
            + "OPER_USER,"
            + "OPER_DATE "
            + "FROM PM_TOPIC_CLASS WHERE SEQ=0";
        List<HashMap<String, String>> topicClassList = this.queryList(sql, pa);
        dict.set("topicClassList", topicClassList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param model 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void delTopicClass(TopicClassModel model) throws BaseAppException {
        String classNo = model.getClassNO();
        String seq = qryClassNoMaxSeq(classNo);
        ParamArray pa = new ParamArray();
        pa.set("", seq);
        pa.set("", classNo);
        String sql = "UPDATE PM_TOPIC_CLASS SET SEQ=? WHERE CLASS_NO=? AND SEQ=0";
        executeUpdate(sql, pa);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return int
     * @throws BaseAppException <br>
     */ 
    public int delete(TopicModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return int 
     * @throws BaseAppException <br>
     */ 
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @throws BaseAppException <br>
     */ 
    public void insert(TopicModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return HashMap
     * @throws BaseAppException <br>
     */ 
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return null;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return int
     * @throws BaseAppException <br>
     */ 
    public int update(TopicModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryClassNo() throws BaseAppException {
        String classNo = AdhocSeqUtil.getAdhocSeq("PMS", "TC", 8, "PM_ADHOC_SEQ");
        return classNo;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param classNo 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qryClassNoMaxSeq(String classNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_CLASS WHERE CLASS_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", classNo);
        String seq = queryString(sql, pa);
        return seq;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param classType 
     * @param operUser 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryTopicSysclassMaxSeq(String topicNo, String classType, String operUser) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_SYSCLASS WHERE TOPIC_NO=? AND CLASS_TYPE=? AND OPER_USER=?";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        pa.set("", classType);
        pa.set("", operUser);
        String seq = queryString(sql, pa);
        return seq;
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
        String topicNo = dict.getString("TOPIC_NO");
        String classType = dict.getString("CLASS_TYPE");
        String operUser = dict.getString("OPER_USER");
        String fav = dict.getString("FAV");  
        //
        String seq = qryTopicSysclassMaxSeq(topicNo, classType, operUser);
        String sql = "UPDATE PM_TOPIC_SYSCLASS SET SEQ=? WHERE TOPIC_NO=? AND CLASS_TYPE=? AND OPER_USER=? AND SEQ=0";
        ParamArray noFavPa = new ParamArray();
        noFavPa.set("", seq);
        noFavPa.set("", topicNo);
        noFavPa.set("", classType);
        noFavPa.set("", operUser);
        executeUpdate(sql, noFavPa);
        // 1-收藏主题 0-取消收藏
        if ("1".equals(fav)) {
            sql = "INSERT INTO PM_TOPIC_SYSCLASS(CLASS_TYPE,TOPIC_NO,SEQ,OPER_USER,OPER_DATE) VALUES(?,?,?,?,sysdate)";
            ParamArray favPa = new ParamArray();
            favPa.set("", classType);
            favPa.set("", topicNo);
            favPa.set("", 0);
            favPa.set("", operUser);
            int insertNum = executeUpdate(sql, favPa);
            if (insertNum == 0) {
                logger.error("Insert PM_TOPIC_SYSCLASS fail\n  insertSQL IS " + sql + " ParamList is " + favPa);
                ExceptionHandler.publish("Insert PM_TOPIC_SYSCLASS fail ", ExceptionHandler.BUSS_ERROR);
            }           
        } 
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
        // 指标
        String sql = "SELECT KPI_NAME AS NAME,KPI_CODE AS ID FROM PM_KPI";
        ParamArray pa = new ParamArray();
        //List<HashMap<String, String>> kpiList = this.queryList(sql, pa);
        HashMap<String, String> kpiMap1 = new HashMap<String, String>();
        kpiMap1.put("ID", "PB0001");
        kpiMap1.put("NAME", "附着成功次数");
        kpiMap1.put("EMS_TYPE_CODE", "1");
        //
        HashMap<String, String> kpiMap2 = new HashMap<String, String>();
        kpiMap2.put("ID", "PB0002");
        kpiMap2.put("NAME", "附着失败次数");
        kpiMap1.put("EMS_TYPE_CODE", "1");
        //
        HashMap<String, String> kpiMap3 = new HashMap<String, String>();
        kpiMap3.put("ID", "PB0003");
        kpiMap3.put("NAME", "附着总次数");
        kpiMap1.put("EMS_TYPE_CODE", "1");
        //
        List<HashMap<String, String>> kpiList = new ArrayList<HashMap<String, String>>();
        kpiList.add(kpiMap1);
        kpiList.add(kpiMap2);
        kpiList.add(kpiMap3);      
        dict.set("kpiList", kpiList);
        // 维度
        sql = "SELECT DIM_NAME AS NAME,DIM_CODE AS ID FROM PM_DIM";
        //List<HashMap<String, String>> dimList = this.queryList(sql, pa);
        HashMap<String, String> dimMap1 = new HashMap<String, String>();
        dimMap1.put("ID", "STTIME");
        dimMap1.put("NAME", "统计时间");
        //
        HashMap<String, String> dimMap2 = new HashMap<String, String>();
        dimMap2.put("ID", "SGSN");
        dimMap2.put("NAME", "SGSN");
        //
        HashMap<String, String> dimMap3 = new HashMap<String, String>();
        dimMap3.put("ID", "CELL");
        dimMap3.put("NAME", "小区");
        //
        List<HashMap<String, String>> dimList = new ArrayList<HashMap<String, String>>();
        dimList.add(dimMap1);
        dimList.add(dimMap2);
        dimList.add(dimMap3);   
        dict.set("dimList", dimList);
    }
    
}
