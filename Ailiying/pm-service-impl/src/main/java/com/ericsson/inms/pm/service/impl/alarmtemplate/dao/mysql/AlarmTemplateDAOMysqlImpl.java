/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.service.impl.alarmtemplate.dao.mysql;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.alarmtemplate.dao.AlarmTemplateDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.core.util.DateUtil;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.service.impl.alarmtemplate.dao.mysql <br>
 */
public class AlarmTemplateDAOMysqlImpl extends AlarmTemplateDAO {

    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(AlarmTemplateDAOMysqlImpl.class);
    
    @Override
    public List<Map<String, Object>> qryNeIconList(Map<String, Object> params) throws BaseAppException {
        List<Map<String, Object>> neIconList = queryForMapList("SELECT ICON_ID,ICON_TYPE,ICON_URL FROM PM_ICON_INFO", new Object[] {});
        return neIconList;
    }
    
    @Override
    public JSONObject getFieldInModel(Map<String, Object> params) throws BaseAppException {
        JSONObject ret = new JSONObject();
        String model_phy_code = CommonUtil.getStrFromMap(params, "MODEL_PHY_CODE", "");
        String sql = "SELECT DISTINCT B.FIELD_CODE,B.FIELD_NAME,B.FIELD_TYPE "
            + "FROM PM_MODEL_BUSI A,PM_MODEL_BUSI_DETAIL B "
            + "WHERE A.MODEL_BUSI_CODE=B.MODEL_BUSI_CODE AND A.MODEL_PHY_CODE=?";
        List<Map<String, Object>> fieldList = queryForMapList(sql, new Object[] {model_phy_code});
        ret.put("fieldList", fieldList);
        return ret;
    }
    
    @Override
    public List<Map<String, Object>> qryTemplate(Map<String, Object> params) throws BaseAppException {
        String ems_type_rel_id = CommonUtil.getStrFromMap(params, "EMS_TYPE_REL_ID", "");
        List<Map<String, Object>> tplList = queryForMapList(
            "SELECT EMS_TYPE_REL_ID,TEMPLATE_ID,TEMPLATE_NAME,UP_TEMPLATE_ID,NE_TYPE,TEMPLATE_DESC,MODEL_PHY_CODE,MODEL_BUSI_CODE FROM PM_NE_TEMPLATE WHERE EMS_TYPE_REL_ID=?", 
            new Object[] {ems_type_rel_id});
        return tplList;
    }
    
    @Override
    public List<Map<String, Object>> searchTemplate(Map<String, Object> params) throws BaseAppException {
        String search_content = CommonUtil.getStrFromMap(params, "SEARCH_CONTENT", "");
        String sql = "SELECT "
            + "EMS_TYPE_REL_ID,"
            + "TEMPLATE_ID,"
            + "TEMPLATE_NAME,"
            + "UP_TEMPLATE_ID,"
            + "NE_TYPE,"
            + "NE_ICON,"
            + "MODEL_PHY_CODE,"
            + "FIELD_CODE,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "TEMPLATE_DESC "
            + "FROM PM_NE_TEMPLATE WHERE UPPER(TEMPLATE_NAME) LIKE '%" + search_content + "%' "
            + "OR UPPER(TEMPLATE_DESC) LIKE '%" + search_content + "%'";
        List<Map<String, Object>> tplList = queryForMapList(sql, new Object[] {});
        return tplList;
    }
    
    @Override
    public String delTemplate(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        update("DELETE FROM PM_NE_TEMPLATE_WARN_DETIAL WHERE RULE_ID IN " + 
            "(SELECT A.RULE_ID FROM PM_NE_TEMPLATE_ALARM_RULE A,PM_NE_TEMPLATE_ALARM B WHERE A.RULE_ID=B.RULE_ID " + 
            "AND B.TEMPLATE_ID=?)", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE_ALARM_RULE WHERE RULE_ID IN " + 
            "(SELECT RULE_ID FROM PM_NE_TEMPLATE_ALARM WHERE TEMPLATE_ID=?)", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE WHERE TEMPLATE_ID=?", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE_KPI WHERE TEMPLATE_ID=?", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE_ALARM WHERE TEMPLATE_ID=?", new Object[] {template_id});
        // 级联删除子模板
        update("DELETE FROM PM_NE_TEMPLATE_WARN_DETIAL WHERE RULE_ID IN " + 
            "(SELECT A.RULE_ID FROM PM_NE_TEMPLATE_ALARM_RULE A,PM_NE_TEMPLATE_ALARM B,PM_NE_TEMPLATE C " + 
            "WHERE A.RULE_ID=B.RULE_ID AND B.TEMPLATE_ID=C.TEMPLATE_ID AND C.UP_TEMPLATE_ID=?)", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE_ALARM_RULE WHERE RULE_ID IN " + 
            "(SELECT A.RULE_ID FROM PM_NE_TEMPLATE_ALARM A,PM_NE_TEMPLATE B WHERE A.TEMPLATE_ID=B.TEMPLATE_ID " + 
            "AND B.UP_TEMPLATE_ID=?)", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE_KPI WHERE TEMPLATE_ID IN (SELECT TEMPLATE_ID FROM PM_NE_TEMPLATE " +
            "WHERE UP_TEMPLATE_ID=?)", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE_ALARM WHERE TEMPLATE_ID IN (SELECT TEMPLATE_ID FROM PM_NE_TEMPLATE " +
            "WHERE UP_TEMPLATE_ID=?)", new Object[] {template_id});
        update("DELETE FROM PM_NE_TEMPLATE WHERE UP_TEMPLATE_ID=?", new Object[] {template_id});
        return template_id;
    }
    
    @Override
    public Map<String, Object> qryTemplateDetail(Map<String, Object> params) throws BaseAppException {
        // 网元模板管理
        loadPmNeTemplate(params);
        // 网元模板指标
        loadPmNeTemplateKpi(params);
        // 模板告警信息
        loadPmNeTemplateAlarm(params);
        // 模板告警规则以及告警规则详情
        loadPmNeTemplateAlarmRule(params);
        return params;
    }
        
    @Override
    public String addTemplate(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        if ("".equals(template_id)) {
            // 网元模板管理
            template_id = insertPmNeTemplate(params, template_id);
            params.put("TEMPLATE_ID", template_id);
        } 
        else {
            delTemplate(params);
            insertPmNeTemplate(params, template_id);
        }
        // 网元模板指标
        insertPmNeTemplateKpi(params);
        // 模板告警信息
        ArrayList<HashMap> rule_list =  (ArrayList<HashMap>) params.get("RULE_LIST");
        for (int i = 0; i < rule_list.size(); i++) {
            HashMap ruleParams = rule_list.get(i);
            ruleParams.put("TEMPLATE_ID", template_id);
            insertPmNeTemplateAlarm(ruleParams);
            // 模板告警规则以及告警规则详情
            insertPmNeTemplateAlarmRule(ruleParams);
        }
        return template_id;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmNeTemplateKpi(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        String sql = "SELECT "
            + "TEMPLATE_ID,"
            + "KPI_CODE "
            + "FROM PM_NE_TEMPLATE_KPI WHERE TEMPLATE_ID=?";
        List<Map<String, Object>> kpi_list = queryForMapList(sql, new Object[] {template_id});
        params.put("kpi_list", kpi_list);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmNeTemplateAlarmRule(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        String sql = "SELECT "
            + "A.RULE_ID,"
            + "A.RULE_TYPE,"
            + "A.ALARM_LEVEL,"
            + "A.CONDI_TYPE,"
            + "A.TIME_WINDOW,"
            + "A.TIME_WINDOW_VALUE "
            + "FROM PM_NE_TEMPLATE_ALARM_RULE A,PM_NE_TEMPLATE_ALARM B WHERE A.RULE_ID=B.RULE_ID AND B.TEMPLATE_ID=?";
        List<Map<String, Object>> alarm_rule_list = queryForMapList(sql, new Object[] {template_id});
        params.put("alarm_rule_list", alarm_rule_list);
        //
        String detailSql = "SELECT "
            + "A.RULE_ID,"
            + "A.RULE_DT_ID,"
            + "A.RULE_TYPE,"
            + "A.ALARM_LEVEL,"
            + "A.KPI_CODE,"
            + "A.KPI_MATH,"
            + "A.OPER_TYPE,"
            + "A.THRESHOLD_TYPE,"
            + "A.THRESHOLD_VALUE,"
            + "A.THRESHOLD_VALUE2,"
            + "A.THRESHOLD_VALUE3,"
            + "A.THRESHOLD_VALUE4,"
            + "A.THRESHOLD_VALUE5 "
            + "FROM PM_NE_TEMPLATE_WARN_DETIAL A,PM_NE_TEMPLATE_ALARM B WHERE A.RULE_ID=B.RULE_ID AND B.TEMPLATE_ID=?";
        List<Map<String, Object>> warn_detial_list = queryForMapList(detailSql, new Object[] {template_id});
        params.put("warn_detial_list", warn_detial_list);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmNeTemplate(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        String sql = "SELECT "
            + "EMS_TYPE_REL_ID,"
            + "TEMPLATE_ID,"
            + "TEMPLATE_NAME,"
            + "UP_TEMPLATE_ID,"
            + "NE_TYPE,"
            + "NE_ICON,"
            + "MODEL_PHY_CODE,"
            + "MODEL_BUSI_CODE,"
            + "FIELD_CODE,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "TEMPLATE_DESC "
            + "FROM PM_NE_TEMPLATE WHERE TEMPLATE_ID=?";
        List<Map<String, Object>> templateList = queryForMapList(sql, new Object[] {template_id});
        params.put("template", (templateList.size() > 0 ? templateList.get(0) : null));
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @param template_id 
     * @return template_id
     * @throws BaseAppException <br>
     */ 
    public String insertPmNeTemplate(Map<String, Object> params, String template_id) throws BaseAppException {
        if ("".equals(template_id)) {
            String codePrefix = "PMS";
            StringBuffer seq = new StringBuffer(CommonUtil.getSeq("PM_TASK_SEQ"));
            while (seq.length() < 6) {
                seq.insert(0, "0");
            }
            template_id = codePrefix + "_"
                + DateUtil.formatString(new Date(), com.ztesoft.zsmart.core.util.DateUtil.DateConstants.DATETIME_FORMAT_2)
                + "_TP" + seq;
        }
        String ems_type_rel_id = CommonUtil.getStrFromMap(params, "EMS_TYPE_REL_ID", "");
        String template_name = CommonUtil.getStrFromMap(params, "TEMPLATE_NAME", "");
        String up_template_id = CommonUtil.getStrFromMap(params, "UP_TEMPLATE_ID", "");
        String ne_type = CommonUtil.getStrFromMap(params, "NE_TYPE", "");
        String ne_icon = CommonUtil.getStrFromMap(params, "NE_ICON", "");
        String model_phy_code = CommonUtil.getStrFromMap(params, "MODEL_PHY_CODE", "");
        String model_busi_code = CommonUtil.getStrFromMap(params, "MODEL_BUSI_CODE", "");
        String field_code = CommonUtil.getStrFromMap(params, "FIELD_CODE", "");
        String state = CommonUtil.getStrFromMap(params, "STATE", "");
        String template_desc = CommonUtil.getStrFromMap(params, "TEMPLATE_DESC", "");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        //
        String sql = "INSERT INTO PM_NE_TEMPLATE("
            + "EMS_TYPE_REL_ID,"
            + "TEMPLATE_ID,"
            + "TEMPLATE_NAME,"
            + "UP_TEMPLATE_ID,"
            + "NE_TYPE,"
            + "NE_ICON,"
            + "MODEL_PHY_CODE,"
            + "MODEL_BUSI_CODE,"
            + "FIELD_CODE,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "TEMPLATE_DESC"
            + ")VALUES (?,?,?,?,?,?,?,?,?,?,?,now(),?)";
        update(sql, new Object[] {ems_type_rel_id, template_id, template_name, up_template_id, ne_type,
            ne_icon, model_phy_code, model_busi_code, field_code, state, operUser, template_desc});
        return template_id;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmNeTemplateAlarm(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        String sql = "SELECT "
            + "TEMPLATE_ID,"
            + "RULE_ID,"
            + "RULE_NAME,"
            + "STATE,"
            + "ALARM_TITLE,"
            + "ALARM_BODY,"
            + "ALARM_CODE,"
            + "ENABLE_ACTION,"
            + "TRIGGER_DATE,"
            + "TRIGGER_TIME,"
            + "PLUGIN_TYPE,"
            + "PLUGIN_NO,"
            + "PLUGIN_PARAM,"
            + "CREATE_DATE "
            + "FROM PM_NE_TEMPLATE_ALARM WHERE TEMPLATE_ID=?";
        List<Map<String, Object>> alarmList = queryForMapList(sql, new Object[] {template_id});
        params.put("template_alarm", alarmList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertPmNeTemplateAlarm(Map<String, Object> params) throws BaseAppException {
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        String rule_id = CommonUtil.getStrFromMap(params, "RULE_ID", "");
        if ("".equals(rule_id)) {
            String codePrefix = "PMS";
            StringBuffer seq = new StringBuffer(CommonUtil.getSeq("PM_TASK_SEQ"));
            while (seq.length() < 6) {
                seq.insert(0, "0");
            }
            rule_id = codePrefix + "_"
                + DateUtil.formatString(new Date(), com.ztesoft.zsmart.core.util.DateUtil.DateConstants.DATETIME_FORMAT_2)
                + "_RL" + seq;
            params.put("RULE_ID", rule_id);
        }
        String rule_name = CommonUtil.getStrFromMap(params, "RULE_NAME", ""); 
        String alarm_code = CommonUtil.getStrFromMap(params, "ALARM_CODE", ""); 
        String state = CommonUtil.getStrFromMap(params, "STATE", ""); 
        String alarm_title = CommonUtil.getStrFromMap(params, "ALARM_TITLE", ""); 
        String alarm_body = CommonUtil.getStrFromMap(params, "ALARM_BODY", ""); 
        String enable_action = CommonUtil.getStrFromMap(params, "ENABLE_ACTION", ""); 
        String trigger_date = CommonUtil.getStrFromMap(params, "TRIGGER_DATE", ""); 
        String trigger_time = CommonUtil.getStrFromMap(params, "TRIGGER_TIME", ""); 
        String plugin_type = CommonUtil.getStrFromMap(params, "PLUGIN_TYPE", ""); 
        String plugin_no = CommonUtil.getStrFromMap(params, "PLUGIN_NO", ""); 
        String plugin_param = CommonUtil.getStrFromMap(params, "PLUGIN_PARAM", "");
        //
        String sql = "INSERT INTO PM_NE_TEMPLATE_ALARM("
            + "TEMPLATE_ID,"
            + "RULE_ID,"
            + "RULE_NAME,"
            + "STATE,"
            + "ALARM_TITLE,"
            + "ALARM_BODY,"
            + "ALARM_CODE,"
            + "ENABLE_ACTION,"
            + "TRIGGER_DATE,"
            + "TRIGGER_TIME,"
            + "PLUGIN_TYPE,"
            + "PLUGIN_NO,"
            + "PLUGIN_PARAM,"
            + "CREATE_DATE"
            + ")VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,now())";
        update(sql, new Object[] {template_id, rule_id, rule_name, state, alarm_title, alarm_body, alarm_code, enable_action, 
            trigger_date, trigger_time, plugin_type, plugin_no, plugin_param});
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertPmNeTemplateKpi(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> kpi_list =  (ArrayList<HashMap>) params.get("KPI_LIST");
        String template_id = CommonUtil.getStrFromMap(params, "TEMPLATE_ID", "");
        //
        String sql = "INSERT INTO PM_NE_TEMPLATE_KPI("
            + "TEMPLATE_ID,"
            + "KPI_CODE"
            + ")VALUES (?,?)";
        for (int i = 0; i < kpi_list.size(); i++) {
            HashMap kpiDict = kpi_list.get(i);
            String kpi_code = CommonUtil.getStrFromMap(kpiDict, "KPI_CODE", "");
            update(sql, new Object[] {template_id, kpi_code});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertPmNeTemplateAlarmRule(Map<String, Object> params) throws BaseAppException {
        String rule_id = CommonUtil.getStrFromMap(params, "RULE_ID", "");
        ArrayList<HashMap> alarm_rule_list =  (ArrayList<HashMap>) params.get("ALARM_RULE_LIST");
        //
        String sql = "INSERT INTO PM_NE_TEMPLATE_ALARM_RULE("
            + "RULE_ID,"
            + "RULE_TYPE,"
            + "ALARM_LEVEL,"
            + "CONDI_TYPE,"
            + "TIME_WINDOW,"
            + "TIME_WINDOW_VALUE"
            + ")VALUES (?,?,?,?,?,?)";
        String detailSql = "INSERT INTO PM_NE_TEMPLATE_WARN_DETIAL("
            + "RULE_ID,"
            + "RULE_DT_ID,"
            + "RULE_TYPE,"
            + "ALARM_LEVEL,"
            + "KPI_CODE,"
            + "KPI_MATH,"
            + "OPER_TYPE,"
            + "THRESHOLD_TYPE,"
            + "THRESHOLD_VALUE,"
            + "THRESHOLD_VALUE2,"
            + "THRESHOLD_VALUE3,"
            + "THRESHOLD_VALUE4,"
            + "THRESHOLD_VALUE5"
            + ")VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        //
        for (int i = 0; i < alarm_rule_list.size(); i++) {
            HashMap ruleDict = alarm_rule_list.get(i);
            String rule_type = CommonUtil.getStrFromMap(ruleDict, "RULE_TYPE", "");
            String alarm_level = CommonUtil.getStrFromMap(ruleDict, "ALARM_LEVEL", "");
            String condi_type = CommonUtil.getStrFromMap(ruleDict, "CONDI_TYPE", "");
            String time_window = CommonUtil.getStrFromMap(ruleDict, "TIME_WINDOW", "");
            String time_window_value = CommonUtil.getStrFromMap(ruleDict, "TIME_WINDOW_VALUE", "");
            // 告警规则详情
            ArrayList<HashMap> detail_list =  (ArrayList<HashMap>) ruleDict.get("DETAIL_LIST");
            if (detail_list.size() > 0) {
                update(sql, new Object[] {rule_id, rule_type, alarm_level, condi_type, time_window , time_window_value});
            }
            for (int j = 0; j < detail_list.size(); j++) {
                HashMap detailDict = detail_list.get(j);
                String rule_dt_id = CommonUtil.getStrFromMap(detailDict, "RULE_DT_ID", "");
                String kpi_code = CommonUtil.getStrFromMap(detailDict, "KPI_CODE", "");
                String kpi_math = CommonUtil.getStrFromMap(detailDict, "KPI_MATH", "");
                String oper_type = CommonUtil.getStrFromMap(detailDict, "OPER_TYPE", "");
                String threshold_type = CommonUtil.getStrFromMap(detailDict, "THRESHOLD_TYPE", "");
                String threshold_value = CommonUtil.getStrFromMap(detailDict, "THRESHOLD_VALUE", "");
                String threshold_value2 = CommonUtil.getStrFromMap(detailDict, "THRESHOLD_VALUE2", "");
                String threshold_value3 = CommonUtil.getStrFromMap(detailDict, "THRESHOLD_VALUE3", "");
                String threshold_value4 = CommonUtil.getStrFromMap(detailDict, "THRESHOLD_VALUE4", "");
                String threshold_value5 = CommonUtil.getStrFromMap(detailDict, "THRESHOLD_VALUE5", "");
                update(detailSql, new Object[] {rule_id, rule_dt_id, rule_type, alarm_level, kpi_code, kpi_math, oper_type, threshold_type, 
                    threshold_value, threshold_value2, threshold_value3, threshold_value4, threshold_value5});
            }
        }
    }

}


