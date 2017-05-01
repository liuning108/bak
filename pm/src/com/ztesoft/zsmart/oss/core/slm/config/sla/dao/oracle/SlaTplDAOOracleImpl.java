package com.ztesoft.zsmart.oss.core.slm.config.sla.dao.oracle;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.slm.config.sla.dao.SlaTplDAO;
import com.ztesoft.zsmart.oss.core.slm.config.sla.model.SlaTplModel;
import com.ztesoft.zsmart.oss.core.slm.util.SlmSeqUtil;

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
public class SlaTplDAOOracleImpl extends SlaTplDAO {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
 
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param model 
     * @return slaNo 
     * @throws BaseAppException <br>
     */ 
    public String addSlaTpl(SlaTplModel model) throws BaseAppException {
        String slaNo = model.getSlaNo();
        if ("".equals(slaNo)) {
            slaNo = this.qrySlaNo(); 
        }
        insertSlaTplInst(slaNo, model);
        insertSlaTplSpecificDayInst(slaNo, model);
        insertSlaTplRepainstInst(slaNo, model);
        insertSlaTplMsgPushInst(slaNo, model);
        //SLA服务项列表信息
        ArrayList<DynamicDict> scItems = model.getScItem();
        String sql = "INSERT INTO SLM_SLA_SC_ITEM("
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SC_ITEM_NAME,"
            + "SEQ"
            + ")VALUES (?,?,?,?)";
        for (int i = 0; i < scItems.size(); i++) {
            DynamicDict scItem = scItems.get(i);
            if (!"SC".equals(scItem.getString("type"))) {
                continue;
            }
            ParamArray scItemPa = new ParamArray();
            scItemPa.set("", slaNo);
            scItemPa.set("", "" + (scItems.get(i).get("id")));
            scItemPa.set("", "" + (scItems.get(i).get("name")));
            scItemPa.set("", 0);
            int insertNum = executeUpdate(sql, scItemPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + scItemPa);
                ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
                break;
            }                
        }
        //服务级别目标列表
        sql = "INSERT INTO SLM_SLA_SLO("
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SLO_NO,"
            + "SEQ"
            + ")VALUES (?,?,?,?)";
        String ruleInstSql = "INSERT INTO SLM_SLA_SLO_SLI_INST("
            + "SLA_NO,"
            + "SLO_NO,"
            + "SLI_NO,"
            + "RULE_ID,"
            + "OBJECTIVES_VALUE,"
            + "WARN_VALUE,"
            + "SEQ"
            + ")VALUES (?,?,?,?,?,?,?)";        
        ArrayList<DynamicDict> slos = model.getSlo();
        for (int i = 0; i < slos.size(); i++) {
            DynamicDict slo = slos.get(i);
            String sc_item_no = "" + (slo.get("SC_ITEM_NO"));
            String slo_no = "" + (slo.get("SLO_NO"));
            ParamArray sloPa = new ParamArray();
            sloPa.set("", slaNo);
            sloPa.set("", sc_item_no);
            sloPa.set("", slo_no);
            sloPa.set("", 0);
            int insertNum = executeUpdate(sql, sloPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + sloPa);
                ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
                break;
            }   
            ArrayList<DynamicDict> ruleList = (ArrayList<DynamicDict>) (slo.getList("RULE"));
            for (int j = 0; j < ruleList.size(); j++) {
                ParamArray rulePa = new ParamArray();
                rulePa.set("", slaNo);
                rulePa.set("", slo_no);
                rulePa.set("", "" + (ruleList.get(j).get("sli_no")));
                rulePa.set("", "" + (ruleList.get(j).get("rule_id")));
                rulePa.set("", new BigDecimal((String) (ruleList.get(j).get("objectives_value"))));
                rulePa.set("", new BigDecimal((String) (ruleList.get(j).get("warn_value"))));
                rulePa.set("", 0);
                int insertRuleNum = executeUpdate(ruleInstSql, rulePa);
                if (insertRuleNum == 0) {
                    logger.error("Insert SLM_SLA_SLO_SLI_INST fail\n  insertSQL IS " + ruleInstSql + " ParamList is " + rulePa);
                    ExceptionHandler.publish("Insert SLM_SLA_SLO_SLI_INST fail ", ExceptionHandler.BUSS_ERROR);
                    break;
                }     
            }
        }
        return slaNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlaTplInst(String slaNo, SlaTplModel model) throws BaseAppException {
        //SLA/OLA模板信息
        String sql = "INSERT INTO SLM_SLA_INFO("
            + "SLA_NO,"
            + "SLA_NAME,"
            + "SEQ,"
            + "SLA_TYPE,"
            + "SLA_CLASS,"
            + "SERVICE_LEVEL,"
            + "EVALUATE_CYCLE,"
            + "EFF_DATE,"
            + "EXP_DATE,"
            + "STATE,"
            + "DESCRIPTION"
            + ")VALUES(?,?,?,?,?,?,?,to_date(?,'yyyy-MM-dd hh24:mi:ss'),to_date(?,'yyyy-MM-dd hh24:mi:ss'),?,?)";  
        ParamArray pa = new ParamArray();
        pa.set("", slaNo);
        pa.set("", model.getSlaName());
        pa.set("", 0);
        pa.set("", model.getSlaType());
        pa.set("", model.getSlaClass());
        pa.set("", model.getServiceLevel());
        pa.set("", model.getEvaluateCycle());
        pa.set("", model.getEffDate());
        pa.set("", model.getExpDate());
        pa.set("", model.getState());
        pa.set("", model.getDescription());
        int insertNum = executeUpdate(sql, pa);
        if (insertNum == 0) {
            logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlaTplSpecificDayInst(String slaNo, SlaTplModel model) throws BaseAppException {
      //特殊日期信息
        ArrayList<DynamicDict> specificDay = model.getSpecificDay();
        if (specificDay.size() > 0) {
            String sql = "INSERT INTO SLM_SLA_SPECIFIC_DAY("
                + "SLA_NO,"
                + "SEQ,"
                + "INCLUDED,"
                + "SPECIFIC_DAY,"
                + "SPECIFIC_DAY_NAME"
                + ")VALUES (?,?,?,to_date(?,'yyyy-MM-dd hh24:mi:ss'),?)";
            for (int i = 0; i < specificDay.size(); i++) {
                ParamArray specificDayPa = new ParamArray();
                specificDayPa.set("", slaNo);
                specificDayPa.set("", 0);
                specificDayPa.set("", (String) (specificDay.get(i).get("INCLUDED")));
                specificDayPa.set("", (String) (specificDay.get(i).get("SPECIFIC_DAY")));
                specificDayPa.set("", (String) (specificDay.get(i).get("SPECIFIC_DESC")));
                int insertNum = executeUpdate(sql, specificDayPa);
                if (insertNum == 0) {
                    logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + specificDayPa);
                    ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
                    break;
                }                
            }
        }
    }    
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br> 
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlaTplRepainstInst(String slaNo, SlaTplModel model) throws BaseAppException {
        //奖惩信息
        String rewardInfo = model.getRewardInfo();
        String punishInfo = model.getPunishInfo();
        if (!"".equals(rewardInfo) || !"".equals(punishInfo)) {
            String sql = "INSERT INTO SLM_SLA_REPAINST("
                + "SLA_NO,"
                + "SEQ,"
                + "REWARD_INFO,"
                + "PUNISH_INFO"
                + ")VALUES (?,?,?,?)";
            ParamArray repainstPa = new ParamArray();
            repainstPa.set("", slaNo);
            repainstPa.set("", 0);
            repainstPa.set("", rewardInfo);
            repainstPa.set("", punishInfo);
            int insertNum = executeUpdate(sql, repainstPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + repainstPa);
                ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
            }  
        }
    }  
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */
    public void insertSlaTplMsgPushInst(String slaNo, SlaTplModel model) throws BaseAppException {
        //违约推送
        ArrayList<DynamicDict> pushAction = model.getPushAction();
        if (pushAction.size() > 0) {
            String sql = "INSERT INTO SLM_SLA_ACTION("
                + "SLA_NO,"
                + "SEQ,"
                + "ACTION_ID,"
                + "EVENT_TYPE,"
                + "ACTION_TIME,"
                + "ACTION_TIME2,"
                + "ACTION_TYPE"
                + ")VALUES (?,?,?,?,?,?,?)";
            for (int i = 0; i < pushAction.size(); i++) {
                DynamicDict actionItem = pushAction.get(i);
                ParamArray pa = new ParamArray();
                pa.set("", slaNo);
                pa.set("", 0);
                pa.set("", this.qrySlaPushActionSeq());
                pa.set("", (String) (actionItem.get("EVENT_TYPE")));
                pa.set("", (String) (actionItem.get("ACTION_TIME")));
                pa.set("", (String) (actionItem.get("ACTION_TIME2")));
                pa.set("", (String) (actionItem.get("ACTION_TYPE")));
                int insertNum = executeUpdate(sql, pa);
                if (insertNum == 0) {
                    logger.error("Insert SLM_SLA_ACTION fail\n  insertSQL IS " + sql + " ParamList is " + pa);
                    ExceptionHandler.publish("Insert SLM_SLA_ACTION fail ", ExceptionHandler.BUSS_ERROR);
                    break;
                }                
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
    public void qrySlaTpl(DynamicDict dict) throws BaseAppException {
        String slaNo = dict.getString("SLA_NO");
        ParamArray pa = new ParamArray();
        pa.set("", slaNo);
        //SLA/OLA模板信息
        String sql = "SELECT "
            + "SLA_NO,"
            + "SLA_NAME,"
            + "SEQ,"
            + "SLA_TYPE,"
            + "SLA_CLASS,"
            + "SERVICE_LEVEL,"
            + "EVALUATE_CYCLE,"
            + "EFF_DATE,"
            + "EXP_DATE,"
            + "STATE,"
            + "DESCRIPTION "
            + "FROM SLM_SLA_INFO WHERE SLA_NO=? AND SEQ=0";
        List<HashMap<String, String>> slaList = this.queryList(sql, pa);
        if (slaList.size() < 1) {
            logger.error("Query SLM_SLA_TPL fail\n  qrySQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Query SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
        }
        dict.set("slaInfo", slaList.get(0));
        //特殊日期信息
        sql = "SELECT "
            + "SLA_NO,"
            + "SEQ,"
            + "INCLUDED,"
            + "SPECIFIC_DAY,"
            + "SPECIFIC_DAY_NAME "
            + "FROM SLM_SLA_SPECIFIC_DAY WHERE SLA_NO=? AND SEQ=0";
        List<HashMap<String, String>> specificDayList = this.queryList(sql, pa);
        dict.set("specificDayList", specificDayList);
        //奖惩信息
        sql = "SELECT "
            + "SLA_NO,"
            + "SEQ,"
            + "REWARD_INFO,"
            + "PUNISH_INFO "
            + "FROM SLM_SLA_REPAINST WHERE SLA_NO=? AND SEQ=0";        
        List<HashMap<String, String>> rewardAndPunishList = this.queryList(sql, pa);
        if (rewardAndPunishList.size() > 0) {
            dict.set("rewardInfo", rewardAndPunishList.get(0).get("REWARD_INFO")); 
            dict.set("punishInfo", rewardAndPunishList.get(0).get("PUNISH_INFO")); 
        }
        else {
            dict.set("rewardInfo", ""); 
            dict.set("punishInfo", "");
        }        
        //SLA服务项列表信息
        sql = "SELECT "
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SEQ "
            + "FROM SLM_SLA_SC_ITEM WHERE SLA_NO=? AND SEQ=0";        
        List<HashMap<String, String>> scItemList = this.queryList(sql, pa);
        dict.set("scItemList", scItemList);
        //服务级别目标列表
        sql = "SELECT "
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SLO_NO,"
            + "SEQ "
            + "FROM SLM_SLA_SLO WHERE SLA_NO=? AND SEQ=0";      
        List<HashMap<String, String>> sloList = this.queryList(sql, pa);
        dict.set("sloList", sloList);
        //SLA-SLO-SLI实例信息
        sql = "SELECT "
            + "SLA_NO,"
            + "SLO_NO,"
            + "SLI_NO,"
            + "RULE_ID,"
            + "OBJECTIVES_VALUE,"
            + "WARN_VALUE "
            + "FROM SLM_SLA_SLO_SLI_INST WHERE SLA_NO=? AND SEQ=0";
        List<HashMap<String, String>> ruleList = this.queryList(sql, pa);
        dict.set("ruleList", ruleList);
        //违约推送
        sql = "SELECT "
            + "SLA_NO,"
            + "EVENT_TYPE,"
            + "ACTION_TIME,"
            + "ACTION_TIME2,"
            + "ACTION_TYPE "
            + "FROM SLM_SLA_ACTION WHERE SLA_NO=? AND SEQ=0";
        List<HashMap<String, String>> pushActionList = this.queryList(sql, pa);
        dict.set("pushActionList", pushActionList);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void delSlaTpl(DynamicDict dict) throws BaseAppException {
        String slaNo = dict.getString("SLA_NO");
        String seq = qrySlaMaxSeq(slaNo);
        ParamArray pa = new ParamArray();
        pa.set("", seq);
        pa.set("", slaNo);
        //SLA/OLA模板信息
        String sql = "UPDATE SLM_SLA_INFO SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
        executeUpdate(sql, pa);
        //特殊日期信息
        sql = "UPDATE SLM_SLA_SPECIFIC_DAY SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
        executeUpdate(sql, pa);
        //奖惩信息
        sql = "UPDATE SLM_SLA_REPAINST SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
        executeUpdate(sql, pa);    
        //SLA服务项列表信息
        sql = "UPDATE SLM_SLA_SC_ITEM SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
        executeUpdate(sql, pa); 
        //服务级别目标列表
        sql = "UPDATE SLM_SLA_SLO SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
        executeUpdate(sql, pa);
        //规则实例
        sql = "UPDATE SLM_SLA_SLO_SLI_INST SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
        executeUpdate(sql, pa);
        //违约推送
        sql = "UPDATE SLM_SLA_ACTION SET SEQ=? WHERE SLA_NO=? AND SEQ=0";
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
    public int delete(SlaTplModel arg0) throws BaseAppException {
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
    public void insert(SlaTplModel arg0) throws BaseAppException {
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
    public int update(SlaTplModel arg0) throws BaseAppException {
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
    public String qrySlaNo() throws BaseAppException {
        String slaNo = SlmSeqUtil.getSlmSeq("SLA", "S", 6, "SLM_SLA_NO");
        return slaNo;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaNo 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qrySlaMaxSeq(String slaNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM SLM_SLA_INFO WHERE SLA_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", slaNo);
        String seq = queryString(sql, pa);
        return seq;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qrySlaPushActionSeq() throws BaseAppException {
        String sql = "SELECT S_SLM_ACTION_ID_SEQ.NEXTVAL FROM DUAL";
        ParamArray pa = new ParamArray();
        String seq = queryString(sql, pa);
        return seq;
    }
    
}