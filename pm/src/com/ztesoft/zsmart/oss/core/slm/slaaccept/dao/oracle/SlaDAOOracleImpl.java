package com.ztesoft.zsmart.oss.core.slm.slaaccept.dao.oracle;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.dao.SlaDAO;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.model.SlaModel;
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
public class SlaDAOOracleImpl extends SlaDAO {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaInstId 
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlmSlaInst(String slaInstId, String slaNo, SlaModel model) throws BaseAppException {
        //SLA/OLA受理实例
        String sql = "INSERT INTO SLM_SLA_INST("
            + "SLA_INSTID,"
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
            + "DESCRIPTION,"
            + "SLA_AMOUNT"
            + ")VALUES(?,?,?,?,?,?,?,?,to_date(?,'yyyy-MM-dd hh24:mi:ss'),to_date(?,'yyyy-MM-dd hh24:mi:ss'),?,?,?)";  
        ParamArray pa = new ParamArray();
        pa.set("", slaInstId);
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
        pa.set("", model.getSlaAmount());
        int insertNum = executeUpdate(sql, pa);
        if (insertNum == 0) {
            logger.error("Insert SLM_SLA_INST fail\n  insertSQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Insert SLM_SLA_INST fail ", ExceptionHandler.BUSS_ERROR);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaInstId 
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlmSlaSpecificDayInst(String slaInstId, String slaNo, SlaModel model) throws BaseAppException {
        //特殊日期实例信息
        ArrayList<DynamicDict> specificDay = model.getSpecificDay();
        if (specificDay.size() > 0) {
            String sql = "INSERT INTO SLM_SLA_SPECIFIC_DAY_INST("
                + "SLA_INSTID,"
                + "SLA_NO,"
                + "SEQ,"
                + "INCLUDED,"
                + "SPECIFIC_DAY,"
                + "SPECIFIC_DAY_NAME"
                + ")VALUES (?,?,?,?,to_date(?,'yyyy-MM-dd hh24:mi:ss'),?)";
            for (int i = 0; i < specificDay.size(); i++) {
                ParamArray specificDayPa = new ParamArray();
                specificDayPa.set("", slaInstId);
                specificDayPa.set("", slaNo);                        
                specificDayPa.set("", 0);
                specificDayPa.set("", (String) (specificDay.get(i).get("INCLUDED")));
                specificDayPa.set("", (String) (specificDay.get(i).get("SPECIFIC_DAY")));
                specificDayPa.set("", (String) (specificDay.get(i).get("SPECIFIC_DESC")));
                int insertNum = executeUpdate(sql, specificDayPa);
                if (insertNum == 0) {
                    logger.error("Insert SLM_SLA_SPECIFIC_DAY_INST fail\n  insertSQL IS " + sql + " ParamList is " + specificDayPa);
                    ExceptionHandler.publish("Insert SLM_SLA_SPECIFIC_DAY_INST fail ", ExceptionHandler.BUSS_ERROR);
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
     * @param slaInstId 
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlmSlaRepainstInst(String slaInstId, String slaNo, SlaModel model) throws BaseAppException {
        //奖惩信息
        String rewardInfo = model.getRewardInfo();
        String punishInfo = model.getPunishInfo();
        if (!"".equals(rewardInfo) || !"".equals(punishInfo)) {
            String sql = "INSERT INTO SLM_SLA_REPAINST_INST("
                + "SLA_INSTID,"
                + "SLA_NO,"
                + "SEQ,"
                + "REWARD_INFO,"
                + "PUNISH_INFO"
                + ")VALUES (?,?,?,?,?)";
            ParamArray repainstPa = new ParamArray();
            repainstPa.set("", slaInstId);
            repainstPa.set("", slaNo);    
            repainstPa.set("", 0);
            repainstPa.set("", rewardInfo);
            repainstPa.set("", punishInfo);
            int insertNum = executeUpdate(sql, repainstPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_REPAINST_INST fail\n  insertSQL IS " + sql + " ParamList is " + repainstPa);
                ExceptionHandler.publish("Insert SLM_SLA_REPAINST_INST fail ", ExceptionHandler.BUSS_ERROR);
            }  
        }
    }    
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaInstId 
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */ 
    public void insertSlmSlaParticipantInst(String slaInstId, String slaNo, SlaModel model) throws BaseAppException {
        //SLA参与人列表
        String sql = "INSERT INTO SLM_SLA_PARTICIPANT_INST("
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "SEQ,"
            + "PARTICIPANT_NAME,"
            + "PARTICIPANT_NO,"
            + "DESCRIPTION"
            + ")VALUES(?,?,?,?,?,?)";  
        ParamArray participantPa = new ParamArray();
        participantPa.set("", slaInstId);
        participantPa.set("", slaNo);
        participantPa.set("", 0);
        participantPa.set("", model.getParticipantName());
        participantPa.set("", model.getParticipantNo());
        participantPa.set("", "");
        int insertNum = executeUpdate(sql, participantPa);
        if (insertNum == 0) {
            logger.error("Insert SLM_SLA_PARTICIPANT_INST fail\n  insertSQL IS " + sql + " ParamList is " + participantPa);
            ExceptionHandler.publish("Insert SLM_SLA_PARTICIPANT_INST fail ", ExceptionHandler.BUSS_ERROR);
        }        
    }    
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaInstId 
     * @param slaNo 
     * @param model 
     * @throws BaseAppException <br>
     */
    public void insertSlmSlaMsgPushInst(String slaInstId, String slaNo, SlaModel model) throws BaseAppException {
        //违约推送
        ArrayList<DynamicDict> pushAction = model.getPushAction();
        if (pushAction.size() > 0) {
            String sql = "INSERT INTO SLM_SLA_ACTION_INST("
                + "SLA_INSTID,"
                + "SLA_NO,"
                + "SEQ,"
                + "ACTION_ID,"
                + "EVENT_TYPE,"
                + "ACTION_TIME,"
                + "ACTION_TIME2,"
                + "ACTION_TYPE,"
                + "SENDTO"
                + ")VALUES (?,?,?,?,?,?,?,?,?)";
            for (int i = 0; i < pushAction.size(); i++) {
                DynamicDict actionItem = pushAction.get(i);
                ParamArray pa = new ParamArray();
                pa.set("", slaInstId);
                pa.set("", slaNo);
                pa.set("", 0);
                pa.set("", this.qrySlaPushActionSeq());
                pa.set("", (String) (actionItem.get("EVENT_TYPE")));
                pa.set("", (String) (actionItem.get("ACTION_TIME")));
                pa.set("", (String) (actionItem.get("ACTION_TIME2")));
                pa.set("", (String) (actionItem.get("ACTION_TYPE")));
                pa.set("", (String) (actionItem.get("SENDTO")));
                int insertNum = executeUpdate(sql, pa);
                if (insertNum == 0) {
                    logger.error("Insert SLM_SLA_ACTION_INST fail\n  insertSQL IS " + sql + " ParamList is " + pa);
                    ExceptionHandler.publish("Insert SLM_SLA_ACTION_INST fail ", ExceptionHandler.BUSS_ERROR);
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
     * @param model 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String addSla(SlaModel model) throws BaseAppException {
        String slaInstId = model.getSlaInstId();
        if ("".equals(slaInstId)) {
            slaInstId = this.qrySlaInstId();
        }
        String slaNo = model.getSlaNo();
        if ("".equals(slaNo)) {
            slaNo = slaInstId;
        }
        insertSlmSlaInst(slaInstId, slaNo, model);
        insertSlmSlaSpecificDayInst(slaInstId, slaNo, model);
        insertSlmSlaRepainstInst(slaInstId, slaNo, model);
        insertSlmSlaParticipantInst(slaInstId, slaNo, model); 
        insertSlmSlaMsgPushInst(slaInstId, slaNo, model);
        //SLA服务项实例
        ArrayList<DynamicDict> scItems = model.getScItem();
        String sql = "INSERT INTO SLM_SLA_SC_ITEM_INST("
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SC_ITEM_NAME,"
            + "SEQ"
            + ")VALUES (?,?,?,?,?)";
        for (int i = 0; i < scItems.size(); i++) {
            DynamicDict scItem = scItems.get(i);
            if (!"SC".equals(scItem.getString("type"))) {
                continue;
            }
            ParamArray scItemPa = new ParamArray();
            scItemPa.set("", slaInstId);
            scItemPa.set("", slaNo);
            scItemPa.set("", "" + (scItems.get(i).get("id")));
            scItemPa.set("", "" + (scItems.get(i).get("name")));
            scItemPa.set("", 0);
            int insertNum = executeUpdate(sql, scItemPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_SC_ITEM_INST fail\n  insertSQL IS " + sql + " ParamList is " + scItemPa);
                ExceptionHandler.publish("Insert SLM_SLA_SC_ITEM_INST fail ", ExceptionHandler.BUSS_ERROR);
                break;
            }                
        }
        //SLA-SLO关系实例列表
        sql = "INSERT INTO SLM_SLA_SLO_INST("
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SLO_NO,"
            + "SLO_INSTID,"
            + "SEQ"
            + ")VALUES (?,?,?,?,?,?)";
        //服务级别目标实例
        String sloInstSql = "INSERT INTO SLM_SLO_INST("
            + "SLO_INSTID,"
            + "SC_ITEM_NO,"
            + "SLO_NO,"
            + "SLO_NAME,"
            + "SEQ,"
            + "CAL_CYCLE,"
            + "CYCLE_UNITS,"
            + "TIME_WIN,"
            + "STATE,"
            + "DESCRIPTION"
            + ")VALUES (?,?,?,?,?,?,?,?,?,?)"; 
        //SLO-SLI关系实例
        String ruleInstSql = "INSERT INTO SLM_SLO_SLI_INST("
            + "RULE_ID,"
            + "SLI_INSTID,"
            + "SLO_INSTID,"
            + "SLO_NO,"
            + "SLI_NO,"
            + "SEQ,"
            + "DAYPATTERN_ID,"
            + "TIMEPATTERN_ID,"
            + "OPERATOR,"
            + "THREADSHOLDTYPE,"
            + "OBJECTIVES_VALUE,"
            + "WARN_VALUE"
            + ")VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";        
        ArrayList<DynamicDict> slos = model.getSlo();
        for (int i = 0; i < slos.size(); i++) {
            DynamicDict slo = slos.get(i);
            String sc_item_no = "" + (slo.get("SC_ITEM_NO"));
            String slo_no = "" + (slo.get("SLO_NO"));
            String sloInstId = this.qrySloInstId();
            ParamArray sloPa = new ParamArray();
            sloPa.set("", slaInstId);
            sloPa.set("", slaNo);
            sloPa.set("", sc_item_no);
            sloPa.set("", slo_no);
            sloPa.set("", sloInstId);
            sloPa.set("", 0);
            int insertNum = executeUpdate(sql, sloPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + sloPa);
                ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
                break;
            }   
            //sloInstSql
            ParamArray sloInstPa = new ParamArray();
            sloInstPa.set("", sloInstId);
            sloInstPa.set("", sc_item_no);
            sloInstPa.set("", slo_no);
            sloInstPa.set("", (String) slo.get("SLO_NAME"));
            sloInstPa.set("", 0);
            sloInstPa.set("", (String) slo.getValueByName("CAL_CYCLE", ""));
            sloInstPa.set("", (String) slo.getValueByName("CYCLE_UNITS", ""));
            sloInstPa.set("", (String) slo.getValueByName("TIME_WIN", ""));
            sloInstPa.set("", (String) slo.getValueByName("STATE", ""));
            sloInstPa.set("", (String) slo.getValueByName("DESCRIPTION", ""));            
            insertNum = executeUpdate(sloInstSql, sloInstPa);
            if (insertNum == 0) {
                logger.error("Insert SLM_SLA_TPL fail\n  insertSQL IS " + sql + " ParamList is " + sloPa);
                ExceptionHandler.publish("Insert SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
                break;
            }   
            //ruleInstSql
            ArrayList<DynamicDict> ruleList = (ArrayList<DynamicDict>) (slo.getList("RULE"));
            for (int j = 0; j < ruleList.size(); j++) {
                String sliInstId = this.qrySliInstId();
                ParamArray rulePa = new ParamArray();
                rulePa.set("", "" + (ruleList.get(j).get("rule_id")));
                rulePa.set("", sliInstId);
                rulePa.set("", sloInstId);
                rulePa.set("", slo_no);
                rulePa.set("", "" + (ruleList.get(j).get("sli_no")));
                rulePa.set("", 0);
                rulePa.set("", (String) (ruleList.get(j).get("daypattern_id")));
                rulePa.set("", (String) (ruleList.get(j).get("timepattern_id")));
                rulePa.set("", (String) (ruleList.get(j).get("operator")));
                rulePa.set("", (String) (ruleList.get(j).get("threadsholdtype")));
                rulePa.set("", new BigDecimal((String) (ruleList.get(j).get("objectives_value"))));
                rulePa.set("", new BigDecimal((String) (ruleList.get(j).get("warn_value"))));
                int insertRuleNum = executeUpdate(ruleInstSql, rulePa);
                if (insertRuleNum == 0) {
                    logger.error("Insert SLM_SLA_SLO_SLI_INST fail\n  insertSQL IS " + ruleInstSql + " ParamList is " + rulePa);
                    ExceptionHandler.publish("Insert SLM_SLA_SLO_SLI_INST fail ", ExceptionHandler.BUSS_ERROR);
                    break;
                }     
            }
        }
        return slaInstId;
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
    public void qrySla(DynamicDict dict) throws BaseAppException {
        String slaInstId = dict.getString("SLA_INSTID");
        ParamArray pa = new ParamArray();
        pa.set("", slaInstId);
        //SLA/OLA模板信息
        String sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "SLA_NAME,"
            + "SLA_TYPE,"
            + "SLA_CLASS,"
            + "SERVICE_LEVEL,"
            + "EVALUATE_CYCLE,"
            + "EFF_DATE,"
            + "EXP_DATE,"
            + "SYSDATE,"
            + "STATE,"
            + "DESCRIPTION,"
            + "SLA_AMOUNT "
            + "FROM SLM_SLA_INST WHERE SLA_INSTID=? AND SEQ=0";
        List<HashMap<String, String>> slaList = this.queryList(sql, pa);
        if (slaList.size() < 1) {
            logger.error("Query SLM_SLA_TPL fail\n  qrySQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Query SLM_SLA_TPL fail ", ExceptionHandler.BUSS_ERROR);
        }
        dict.set("slaInfo", slaList.get(0));
        //特殊日期信息
        sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "INCLUDED,"
            + "SPECIFIC_DAY,"
            + "SPECIFIC_DAY_NAME "
            + "FROM SLM_SLA_SPECIFIC_DAY_INST WHERE SLA_INSTID=? AND SEQ=0";
        List<HashMap<String, String>> specificDayList = this.queryList(sql, pa);
        dict.set("specificDayList", specificDayList);
        //奖惩信息
        sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "REWARD_INFO,"
            + "PUNISH_INFO "
            + "FROM SLM_SLA_REPAINST_INST WHERE SLA_INSTID=? AND SEQ=0";        
        List<HashMap<String, String>> rewardAndPunishList = this.queryList(sql, pa);
        if (rewardAndPunishList.size() > 0) {
            dict.set("rewardInfo", rewardAndPunishList.get(0).get("REWARD_INFO")); 
            dict.set("punishInfo", rewardAndPunishList.get(0).get("PUNISH_INFO")); 
        }
        else {
            dict.set("rewardInfo", ""); 
            dict.set("punishInfo", "");
        }        
        //参与人信息
        sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "PARTICIPANT_NO "
            + "FROM SLM_SLA_PARTICIPANT_INST WHERE SLA_INSTID=? AND SEQ=0";   
        List<HashMap<String, String>> participantList = this.queryList(sql, pa);
        dict.set("participantList", participantList);
        //SLA服务项列表信息
        sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "SC_ITEM_NO "
            + "FROM SLM_SLA_SC_ITEM_INST WHERE SLA_INSTID=? AND SEQ=0";   
        List<HashMap<String, String>> scItemList = this.queryList(sql, pa);
        dict.set("scItemList", scItemList);
        //服务级别目标列表
        sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "SC_ITEM_NO,"
            + "SLO_NO,"
            + "SLO_INSTID "
            + "FROM SLM_SLA_SLO_INST WHERE SLA_INSTID=? AND SEQ=0";      
        List<HashMap<String, String>> sloList = this.queryList(sql, pa);
        dict.set("sloList", sloList);
        //SLA-SLO-SLI实例信息
        sql = "SELECT "
            + "RULE_ID,"
            + "SLI_INSTID,"
            + "SLI_NO,"
            + "SLOINST.SLO_NO,"
            + "DAYPATTERN_ID,"
            + "TIMEPATTERN_ID,"
            + "OPERATOR,"
            + "THREADSHOLDTYPE,"
            + "OBJECTIVES_VALUE,"
            + "WARN_VALUE "
            + "FROM SLM_SLO_SLI_INST SLIINST,SLM_SLA_SLO_INST SLOINST "
            + "WHERE SLIINST.SLO_INSTID=SLOINST.SLO_INSTID AND SLOINST.SLA_INSTID=? AND SLIINST.SEQ=0 AND SLOINST.SEQ=0";
        List<HashMap<String, String>> ruleList = this.queryList(sql, pa);
        dict.set("ruleList", ruleList);
        //违约推送
        sql = "SELECT "
            + "SLA_INSTID,"
            + "SLA_NO,"
            + "EVENT_TYPE,"
            + "ACTION_TIME,"
            + "ACTION_TIME2,"
            + "ACTION_TYPE,"
            + "SENDTO "
            + "FROM SLM_SLA_ACTION_INST WHERE SLA_INSTID=? AND SEQ=0";
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
    public void delSla(DynamicDict dict) throws BaseAppException {
        String slaInstId = dict.getString("SLA_INSTID");
        String seq = qrySlaMaxSeq(slaInstId);
        ParamArray pa = new ParamArray();
        pa.set("", seq);
        pa.set("", slaInstId);
        //SLA/OLA实例信息
        String sql = "UPDATE SLM_SLA_INST SET STATE='03',EFF_DATE=SYSDATE,EXP_DATE=SYSDATE,SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa);
        //特殊日期信息
        sql = "UPDATE SLM_SLA_SPECIFIC_DAY_INST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa);
        //奖惩信息
        sql = "UPDATE SLM_SLA_REPAINST_INST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa);  
        //参与人列表
        sql = "UPDATE SLM_SLA_PARTICIPANT_INST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa);
        //SLA服务项列表信息
        sql = "UPDATE SLM_SLA_SC_ITEM_INST_LIST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa); 
        sql = "UPDATE SLM_SLA_SC_ITEM_INST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa);
        //服务级别目标实例,SLO-SLI关系实例需要关联slm_sla_slo_inst表进行更新
        sql = "UPDATE SLM_SLO_INST SET SEQ=? WHERE SLO_INSTID IN (SELECT SLO_INSTID FROM SLM_SLA_SLO_INST WHERE SLA_INSTID=? AND SEQ=0)";
        executeUpdate(sql, pa);
        sql = "UPDATE SLM_SLO_SLI_INST SET SEQ=? WHERE SLO_INSTID IN (SELECT SLO_INSTID FROM SLM_SLA_SLO_INST WHERE SLA_INSTID=? AND SEQ=0)";
        executeUpdate(sql, pa);
        //服务级别目标列表
        sql = "UPDATE SLM_SLA_SLO_INST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
        executeUpdate(sql, pa);
        //违约推送
        sql = "UPDATE SLM_SLA_ACTION_INST SET SEQ=? WHERE SLA_INSTID=? AND SEQ=0";
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
    public int delete(SlaModel arg0) throws BaseAppException {
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
    public void insert(SlaModel arg0) throws BaseAppException {
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
    public int update(SlaModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }
    
    /**
     * SLA-YYYYMMDD-I6位序列 <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qrySlaInstId() throws BaseAppException {
        String slaInstId = SlmSeqUtil.getSlmSeq("SLA", "I", 6, "SLM_SLA_INSTID");
        return slaInstId;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qrySloInstId() throws BaseAppException {
        String sloInstId = SlmSeqUtil.getSlmSeq("SLO", "I", 6, "SLM_SLO_INSTID");
        return sloInstId;
    }   
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return sliInstId
     * @throws BaseAppException <br>
     */ 
    public String qrySliInstId() throws BaseAppException {
        String sliInstId = SlmSeqUtil.getSlmSeq("SLI", "I", 6, "SLM_SLI_INSTID");
        return sliInstId;
    }   
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaInstId 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qrySlaMaxSeq(String slaInstId) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM SLM_SLA_INST WHERE SLA_INSTID=?";
        ParamArray pa = new ParamArray();
        pa.set("", slaInstId);
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