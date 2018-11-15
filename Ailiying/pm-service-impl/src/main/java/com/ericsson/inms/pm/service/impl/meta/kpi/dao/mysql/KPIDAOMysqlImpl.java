package com.ericsson.inms.pm.service.impl.meta.kpi.dao.mysql;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.config.task.bll.TaskManager;
import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ericsson.inms.pm.service.impl.meta.kpi.dao.KPIDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.core.util.DateUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月19日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.kpi.dao.mysql <br>
 */
public class KPIDAOMysqlImpl extends KPIDAO {

    /**
     * isOnlyCheck <br>
     */
    String isOnlyCheck = "";

    /**
     * isAnalysis <br>
     */
    String isAnalysis = "";

    /**
     * kpiType <br>
     */
    String kpiType = "";

    @Override
    public JSONObject getKPIInfo(JSONObject dict) throws BaseAppException {

        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String kpiCode = CommonUtil.getStrFromMap(dict, "KPI_CODE", "");
        String kpiType = CommonUtil.getStrFromMap(dict, "KPI_TYPE", "");
        String isAnalysis = CommonUtil.getStrFromMap(dict, "IS_ANALYSIS", "");
        String kpiCodes = CommonUtil.getStrFromMap(dict, "KPI_CODE_S", "");
        String kpiName = CommonUtil.getStrFromMap(dict, "KPI_NAME", "");
        ArrayList<HashMap> tagList =  (ArrayList<HashMap>) dict.get("TAG_LIST");

        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }

        String tagFilterSql = "";
        if (null != tagList) {
            HashMap<String, String> tagClassMap = new HashMap<String, String>();
            for(int i = 0; i < tagList.size(); i++) {
                HashMap tag = tagList.get(i);
                String class_id = (String) tag.get("CLASS_ID");
                String tag_id = (String) tag.get("TAG_ID");
                if (!tagClassMap.containsKey(class_id)) {
                    String classFilterSql = " AND KPI_CODE IN (SELECT KPI_CODE FROM PM_KPI_CLASS_TAG_RELA WHERE (CLASS_ID,TAG_ID) IN (";
                    classFilterSql += "('" + class_id + "', '" + tag_id + "'), ";
                    tagClassMap.put(class_id, classFilterSql);
                } else {
                    String classFilterSql = tagClassMap.get(class_id);
                    classFilterSql += "('" + class_id + "', '" + tag_id + "'), ";
                    tagClassMap.put(class_id, classFilterSql);
                }
            }
            for (String classFilterSql : tagClassMap.values()) { 
                classFilterSql = classFilterSql.substring(0, classFilterSql.length()-2);
                classFilterSql += ")) ";
                tagFilterSql += classFilterSql;
            }
        }
        
        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }

        String sql = "SELECT a.KPI_NAME,    \n" + "       a.KPI_CODE,    \n" + "       a.EMS_TYPE_REL_ID,    \n"
            + "      date_format(a.eff_time, '%Y-%m-%d') AS EFF_TIME,    \n"
            + "      date_format(a.exp_time, '%Y-%m-%d') AS EXP_TIME,    \n" + "       a.DIRT,        \n"
            + "       a.KPI_TYPE,    \n" + "       a.DATA_TYPE,    \n" + "       a.UNIT,        \n"
            + "       a.PREC,        \n" + "       a.DEF_VALUE,    \n" + "       a.KPI_ANAME,    \n"
            + "       a.IS_ANALYSIS,    \n" + "       a.COMMENTS,    \n" + "       a.BP_ID        \n"
            + "  FROM PM_KPI a        \n" + " WHERE 1 = 1            \n"
            + PMTool.ternaryExpression("".equals(emsRela), "", " AND a.EMS_TYPE_REL_ID = ?   \n")
            + PMTool.ternaryExpression("".equals(kpiCode), "", " AND a.KPI_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(kpiType), "", " AND a.KPI_TYPE = ?   \n")
            + PMTool.ternaryExpression("".equals(isAnalysis), "", " AND a.IS_ANALYSIS = ?   \n")
            + PMTool.ternaryExpression("".equals(kpiCodes), "", " AND a.KPI_CODE IN (" + kpiCodes + ")   \n")
            + PMTool.ternaryExpression("".equals(kpiName), "",
                " AND UPPER(a.kpi_name) LIKE UPPER(concat_ws('','%',?,'%'))   \n")
            + tagFilterSql
            + " ORDER BY a.KPI_NAME, a.KPI_CODE    \n";
        List<String> paramList = new ArrayList<String>();

        if (!("".equals(emsRela))) {
            paramList.add(emsRela);
        }
        if (!("".equals(kpiCode))) {
            paramList.add(kpiCode);
        }
        if (!("".equals(kpiType))) {
            paramList.add(kpiType);
        }
        if (!("".equals(isAnalysis))) {
            paramList.add(isAnalysis);
        }
        if (!("".equals(kpiName))) {
            paramList.add(kpiName);
        }

        JSONObject result = new JSONObject();
        result.put("kpiList", queryForMapList(sql, paramList.toArray()));

        return result;
    }
    
    @Override
    public JSONObject getCLASSInfo(JSONObject dict) throws BaseAppException {
    	String emsType = CommonUtil.getStrFromMap(dict, "EMS_TYPE", "");
    	String sql = "SELECT a.CLASS_ID,    \n" + "a.CLASS_NAME,    \n" + "a.EMS_TYPE_CODE"
                + "  FROM PM_KPI_CLASS a        \n" + " WHERE 1 = 1            \n"
                + PMTool.ternaryExpression("".equals(emsType), "", " AND a.EMS_TYPE_CODE = ?   \n")
                + " ORDER BY a.CLASS_LEVEL    \n";
    	
    	String tagSql = "SELECT CLASS_ID,TAG_ID,TAG_VALUE from PM_KPI_CLASS_TAG"
    			+ " WHERE CLASS_ID in("+"SELECT a.CLASS_ID "
                + "  FROM PM_KPI_CLASS a        \n" + " WHERE 1 = 1  \n"
                + PMTool.ternaryExpression("".equals(emsType), "", " AND a.EMS_TYPE_CODE = ?   \n")+") "
    			+ "ORDER BY TAG_ORDER";
    			
    	
    	List<String> paramList = new ArrayList<String>();
    	if (!("".equals(emsType))) {
            paramList.add(emsType);
        }
    	JSONObject result = new JSONObject();
    	result.put("kpiClassList", queryForMapList(sql, paramList.toArray()));
    	result.put("kpiClassTagList", queryForMapList(tagSql, paramList.toArray()));
        
    	return result;
    }

    @Override
    public JSONObject getKPIFormular(JSONObject dict) throws BaseAppException {
        String kpiCode = CommonUtil.getStrFromMap(dict, "KPI_CODE", "");
        String kpiCodes = CommonUtil.getStrFromMap(dict, "KPI_CODE_S", "");
        String isCounterMoRela = CommonUtil.getStrFromMap(dict, "isCounterMoRela", "");
        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }
        String sql = "SELECT a.KPI_CODE,    \n" + "       a.EMS_VER_CODE,\n" + "       a.KPI_AGG,        \n"
            + "       a.KPI_FORM,    \n" + "       a.KPI_COND,    \n" + "       a.KPI_VERSION,    \n"
            + "       a.BP_ID,        \n" + "       b.KPI_NAME,    \n" + "       b.KPI_TYPE,    \n"
            + "       b.DATA_TYPE,    \n" + "       b.DEF_VALUE,    \n" + "       b.UNIT,        \n"
            + "       b.DIRT,        \n" + "       b.PREC            \n" + "  FROM PM_KPI_FORM a ,PM_KPI b    \n"
            + " WHERE a.KPI_CODE = b.KPI_CODE     \n"
            + PMTool.ternaryExpression("".equals(kpiCode), "", " AND a.KPI_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(kpiCodes), "", " AND a.KPI_CODE IN (" + kpiCodes + ")   \n");
        
        String sqlKpiClass = "SELECT a.KPI_CODE,    \n" + "       a.TAG_ID,\n" + "       a.CLASS_ID,\n"
                + "       b.TAG_VALUE"
                + "  FROM PM_KPI_CLASS_TAG_RELA a ,PM_KPI_CLASS_TAG b    \n"
                + " WHERE a.TAG_ID = b.TAG_ID     \n"
                + PMTool.ternaryExpression("".equals(kpiCode), "", " AND a.KPI_CODE = ?   \n");

        List<String> paramList = new ArrayList<String>();
        
        List<String> paramKpiClassList = new ArrayList<String>();

        if (!("".equals(kpiCode))) {
            paramList.add(kpiCode);
            paramKpiClassList.add(kpiCode);
        }

        JSONObject result = new JSONObject();
        result.put("kpiFormular", queryForMapList(sql, paramList.toArray()));
        if (kpiCode!=null && !("".equalsIgnoreCase(kpiCode))) {
        	result.put("kpiClassList", queryForMapList(sqlKpiClass, paramKpiClassList.toArray()));
        }

        if ("1".equals(isCounterMoRela)) {
            sql = "SELECT KPI_CODE,       \n" + "       EMS_VER_CODE,   \n" + "       EMS_CODE,       \n"
                + "       MO_CODE,        \n" + "       COUNTER_CODE,   \n" + "       KPI_VERSION,    \n"
                + "       BP_ID           \n" + "  FROM PM_KPI_CM_RELA  \n" + " WHERE 1 = 1           \n"
                + PMTool.ternaryExpression("".equals(kpiCode), "", " AND KPI_CODE = ?   \n")
                + PMTool.ternaryExpression("".equals(kpiCodes), "", " AND KPI_CODE IN (" + kpiCodes + ")   \n")
                + " ORDER BY KPI_CODE     \n";
            result.put("kpiCounterMo", queryForMapList(sql, paramList.toArray()));
        }

        return result;
    }

    @Override
    public JSONObject addKPIInfo(JSONObject dict) throws BaseAppException {
        isOnlyCheck = CommonUtil.getStrFromMap(dict, "isOnlyCheck", "");
        kpiType = dict.getString("KPI_TYPE");
        isAnalysis = dict.getString("IS_ANALYSIS");

        if ("1".equals(isOnlyCheck)) {
            this.checkKpiForm(dict);
            return null;
        }

        String customKpiMode = CommonUtil.getStrFromMap(dict, "customKpiMode", "");
        if ("1".equals(customKpiMode)) { // 客户自定义模式
            this.checkKpiForm(dict); // 客户自定义模式 强制检测
            if ("1".equals(kpiType)) { // 基础KPI && 分析类指标
                dict.put("KPI_CODE", this.addBaseKpiCode(dict));
            }
            else { // 组合KPI
                dict.put("KPI_CODE", this.addCompositeKpiCode(dict));
            }
        }

        String kpiCode = CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE");
        if (kpiCode == null || "".equals(kpiCode)) {
            throw new BaseAppException("S-PM-KPI-0001", "No proper kpi code was found.");
        }

        String sql = "select * from pm_kpi where kpi_code = ?";
        int count = queryForCount(sql, kpiCode);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "Code already existed.");
        }

        sql = "insert into pm_kpi \n" + " (kpi_name, \n" + " kpi_code, \n" + " ems_type_rel_id, \n" + " eff_time, \n"
            + " exp_time, \n" + " dirt, \n" + " kpi_type, \n" + " data_type, \n" + " unit, \n" + " kpi_aname, \n"
            + " is_analysis, \n" + " comments, \n";

        String valuesSql =

            " bp_id) \n" + "values \n" + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,";

        String lastSql = " ?) \n";

        List<Object> paramList = new ArrayList<Object>();
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "KPI_NAME"));
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE"));
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        paramList.add(dict.getDate("EFF_TIME"));
        paramList.add(dict.getDate("EXP_TIME"));
        paramList.add(dict.getString("DIRT"));
        paramList.add(dict.getString("KPI_TYPE"));
        paramList.add(dict.getString("DATA_TYPE"));
        paramList.add(dict.getString("UNIT"));
        paramList.add(dict.getString("KPI_ANAME"));
        paramList.add(dict.getString("IS_ANALYSIS"));
        paramList.add(dict.getString("COMMENTS"));
        paramList.add(dict.getString("BP_ID"));

        String prec = dict.getString("PREC");
        if (!StringUtils.isEmpty(prec)) {
            sql += " prec, \n";
            valuesSql += " ?,";
            paramList.add(prec);
        }

        String defValue = dict.getString("DEF_VALUE");
        if (!StringUtils.isEmpty(defValue)) {
            sql += " def_value, \n";
            valuesSql += " ?,";
            paramList.add(defValue);
        }
        
        ArrayList<HashMap<String, Object>> kpiClassInfo = (ArrayList<HashMap<String, Object>>) dict.get("kpiClassInfo");
        try {
	        if (null != kpiClassInfo) {
	            int kpiClassCount = kpiClassInfo.size();
	            for (int i = 0; i < kpiClassCount; i++) {
	            	String counterKpiClassSql = "insert into pm_kpi_class_tag_rela \n" + " (class_id, \n" + " tag_id, \n"
	                        + " kpi_code) \n"
	                        + "values \n" + " (?, ?, ?) \n";
	            	List<Object> paramKpiClassList = new ArrayList<Object>();
	            	String class_id = ((Integer) kpiClassInfo.get(i).get("CLASS_ID")).toString();
	            	String tag_id = (String) kpiClassInfo.get(i).get("TAG_ID");
	            	String kpi_code = (String) kpiClassInfo.get(i).get("KPI_CODE");
	            	paramKpiClassList.add(class_id);
	            	paramKpiClassList.add(tag_id);
	            	paramKpiClassList.add(kpi_code);
	            	update(counterKpiClassSql, paramKpiClassList.toArray());
	            	
	            }
	    	}
	        sql = new StringBuilder(sql).append(valuesSql).append(lastSql).toString();        
        
        	update(sql, paramList.toArray());
            this.batchAddFormular(dict);
        }
        catch (Exception e) {
	        throw new BaseAppException("S-PM-KPI-0002","sql error"+e.getMessage());
	      
        }
        return dict;
    }

    @Override
    public JSONObject editKPIInfo(JSONObject dict) throws BaseAppException {

        String customKpiMode = CommonUtil.getStrFromMap(dict, "customKpiMode", "");
        kpiType = dict.getString("KPI_TYPE");
        isAnalysis = dict.getString("IS_ANALYSIS");
        String kpiCode = CommonUtil.getStrFromMap(dict, "KPI_CODE", "");

        if ("1".equals(customKpiMode)) {
            this.checkKpiForm(dict);
            if ("1".equals(kpiType)) {
                this.editBaseKpiCode(dict);
            }
            else {
                this.editCompositeKpiCode(dict);
            }
        }

        String sql = "update pm_kpi \n" + " set kpi_name = ?, \n" + " ems_type_rel_id = ?, \n" + " eff_time = ?, \n"
            + " exp_time = ?, \n" + " dirt = ?, \n" + " kpi_type = ?, \n" + " data_type = ?, \n" + " unit = ?, \n"
            + " kpi_aname = ?, \n" + " is_analysis = ?, \n" + " comments = ?, \n" + " bp_id = ?, \n";
        
        String delKpiClassSql = "delete from pm_kpi_class_tag_rela where kpi_code = ? \n";
        List<Object> delKpiList = new ArrayList<Object>();
        delKpiList.add(kpiCode);
        update(delKpiClassSql, delKpiList.toArray());
        
        ArrayList<HashMap<String, Object>> kpiClassInfo = (ArrayList<HashMap<String, Object>>) dict.get("kpiClassInfo");
        if (null != kpiClassInfo) {
            int kpiClassCount = kpiClassInfo.size();
            for (int i = 0; i < kpiClassCount; i++) {
                String counterKpiClassSql = "insert into pm_kpi_class_tag_rela \n" + " (class_id, \n" + " tag_id, \n"
                        + " kpi_code) \n"
                        + "values \n" + " (?, ?, ?) \n";
                List<Object> paramKpiClassList = new ArrayList<Object>();
                String class_id = ((Integer) kpiClassInfo.get(i).get("CLASS_ID")).toString();
                String tag_id = (String) kpiClassInfo.get(i).get("TAG_ID");
                String kpi_code = (String) kpiClassInfo.get(i).get("KPI_CODE");
                paramKpiClassList.add(class_id);
                paramKpiClassList.add(tag_id);
                paramKpiClassList.add(kpi_code);
                update(counterKpiClassSql, paramKpiClassList.toArray());
                
            }
        }

        List<Object> params = new ArrayList<Object>();
        params.add(CommonUtil.getStrFromMapWithExc(dict, "KPI_NAME"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        params.add(dict.getDate("EFF_TIME"));
        params.add(dict.getDate("EXP_TIME"));
        params.add(dict.getString("DIRT"));
        params.add(dict.getString("KPI_TYPE"));
        params.add(dict.getString("DATA_TYPE"));
        params.add(dict.getString("UNIT"));
        params.add(dict.getString("KPI_ANAME"));
        params.add(dict.getString("IS_ANALYSIS"));
        params.add(dict.getString("COMMENTS"));
        params.add(dict.getString("BP_ID"));

        String prec = dict.getString("PREC");
        if (StringUtils.isEmpty(prec)) {
            sql += " prec = null, \n";
        }
        else {
            sql += " prec = ?, \n";
            params.add(prec);
        }

        String defValue = dict.getString("DEF_VALUE");
        if (StringUtils.isEmpty(defValue)) {
            sql += " def_value = null \n";
        }
        else {
            sql += " def_value = ? \n";
            params.add(defValue);
        }

        sql += " where kpi_code = ? \n";
        params.add(CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE"));
        update(sql, params.toArray());

        this.batchAddFormular(dict);

        return dict;
    }

    @Override
    public JSONObject delKPIInfo(JSONObject dict) throws BaseAppException {
        String customKpiMode = CommonUtil.getStrFromMap(dict, "customKpiMode", "");

        if ("1".equals(customKpiMode)) { // 客户自定义模式 && 分析类指标(组合指标不受是否分析控制)
            JSONObject kpiParam = new JSONObject();
            String kpiCode = CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE");
            kpiParam.put("KPI_CODE", kpiCode);
            JSONArray kpiInfoArray = this.getKPIInfo(kpiParam).getJSONArray("kpiList");

            if (null == kpiInfoArray || kpiInfoArray.size() == 0) {
                ExceptionHandler.publish(ExceptionConstants.PM_COMMON_PARAM_REQUIRED, "kpiList 为空.", "kpiList");
            }

            JSONObject kpiDict = kpiInfoArray.getJSONObject(0);
            String kpiType = kpiDict.getString("KPI_TYPE");
            kpiDict.put("OPER_TYPE", "del");
            if (!"1".equals(kpiType)) { // 非基础指标
                JSONArray kpiFormularArr = this.getKPIFormular(dict).getJSONArray("kpiFormular");
                dict.put("kpiFormular", kpiFormularArr);
                if (null != kpiFormularArr && kpiFormularArr.size() > 0) {
                    kpiDict.put("kpiFormular", kpiFormularArr.get(0));
                }
                this.editBusiModel("", kpiCode, dict);
            }
            else {
                this.editBaseKpiCode(kpiDict);
            }

        }

        String sql = "delete from pm_kpi_form where kpi_code = ? \n";
        update(sql, dict.getString("KPI_CODE"));

        sql = "delete from pm_kpi where kpi_code = ? \n";
        update(sql, dict.getString("KPI_CODE"));

        return dict;
    }

    /**
     * batchAddFormular <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void batchAddFormular(JSONObject dict) throws BaseAppException {
        String kpiCode = CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE");
        String sql = "delete from pm_kpi_form where kpi_code = ? \n";
        update(sql, kpiCode);

        sql = "delete from pm_kpi_cm_rela where kpi_code = ? \n";
        update(sql, kpiCode);

        sql = "insert into pm_kpi_form \n"
            + " (kpi_code, ems_code, ems_ver_code, kpi_agg, kpi_form, kpi_cond, kpi_version, bp_id) \n" + "values \n"
            + " (?, ?, ?, ?, ?, ?, ?, ?) \n";
        JSONArray kpiFormularArr = dict.getJSONArray("kpiFormular");
        if (null != kpiFormularArr) {
            int formularCount = kpiFormularArr.size();
            for (int i = 0; i < formularCount; i++) {
                JSONObject formularDict = kpiFormularArr.getJSONObject(i);
                List<String> paramList = new ArrayList<String>();

                paramList.add(kpiCode);
                paramList.add(CommonUtil.getStrFromMapWithExc(formularDict, "EMS_CODE"));
                paramList.add(CommonUtil.getStrFromMapWithExc(formularDict, "EMS_VER_CODE"));
                paramList.add(formularDict.getString("KPI_AGG"));
                paramList.add(formularDict.getString("KPI_FORM"));
                paramList.add(formularDict.getString("KPI_COND"));
                paramList.add(formularDict.getString("KPI_VERSION"));
                paramList.add(formularDict.getString("BP_ID"));
                update(sql, paramList.toArray());

                String counterSql = "insert into pm_kpi_cm_rela \n" + " (kpi_code, \n" + " ems_code, \n"
                    + " ems_ver_code, \n" + " mo_code, \n" + " counter_code, \n" + " kpi_version, \n" + " bp_id) \n"
                    + "values \n" + " (?, ?, ?, ?, ?, ?, ?) \n";

                JSONArray counterList = formularDict.getJSONArray("counterList");
                if (null != counterList) {
                    int counterSize = counterList.size();
                    for (int c = 0; c < counterSize; c++) {
                        JSONObject cDict = counterList.getJSONObject(c);
                        paramList.clear();
                        paramList.add(kpiCode);
                        paramList.add(CommonUtil.getStrFromMapWithExc(formularDict, "EMS_CODE"));
                        paramList.add(CommonUtil.getStrFromMapWithExc(formularDict, "EMS_VER_CODE"));
                        paramList.add(CommonUtil.getStrFromMapWithExc(cDict, "MO_CODE"));
                        paramList.add(CommonUtil.getStrFromMapWithExc(cDict, "COUNTER_CODE"));
                        paramList.add(formularDict.getString("KPI_VERSION"));
                        paramList.add(formularDict.getString("BP_ID"));
                        update(counterSql, paramList.toArray());
                    }
                }
            }
        }
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @throws BaseAppException <br>
     */
    private void editBaseKpiCode(JSONObject dict) throws BaseAppException {

        String kpiCode = CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE");
        String operType = CommonUtil.getStrFromMap(dict, "OPER_TYPE", "");
        if (kpiCode == null || "".equals(kpiCode)) {
            return;
        }
        String emsRela = dict.getString("EMS_TYPE_REL_ID");
        List<Map<String, String>> phyModelList = this.getPhyModelList(emsRela);
        Iterator phyModelListIter = phyModelList.iterator();
        String modelPhyCodeStr = "";
        while (phyModelListIter.hasNext()) {
            Map phyModelMap = (Map) phyModelListIter.next();
            String phyModel = (String) phyModelMap.get("MODEL_PHY_CODE");
            // String granuMode = (String) phyModelMap.get("GRANU_MODE");
            if ("".equals(modelPhyCodeStr)) {
                modelPhyCodeStr = "'" + phyModel + "'";
            }
            else {
                modelPhyCodeStr += ",'" + phyModel + "'";
            }
        }

        // 获得物理模型列表
        String phyModelStr = "";
        String sql = "SELECT MODEL_PHY_CODE, SCRIPT \n" + " from pm_model_phy_script \n" + " where model_phy_code in("
            + modelPhyCodeStr + ") \n" + " and script_type='m' order by script_no asc \n";

        List<Map<String, String>> scriptList = queryForMapList(sql, new Object[] {});
        Iterator scriptIter = scriptList.iterator();

        Map modelScriptMap = new HashMap();

        while (scriptIter.hasNext()) { // 将竖表存放的Script字段 转到HashMap中存放
            Map scriptMap = (Map) scriptIter.next();
            String phyModel = (String) scriptMap.get("MODEL_PHY_CODE");
            String script = (String) scriptMap.get("SCRIPT");
            if (script == null) {
                script = "";
            }

            String phyModelScript = (String) modelScriptMap.get(phyModel);

            if (phyModelScript == null || "".equals(phyModelScript)) {
                modelScriptMap.put(phyModel, script);
            }
            else {
                modelScriptMap.put(phyModel, phyModelScript + script);
            }
        }
        Iterator iter = modelScriptMap.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry) iter.next();
            String phyModel = (String) entry.getKey();
            String script = (String) entry.getValue();
            List<String> listColumn = new ArrayList<String>();
            boolean isExist = false;
            if (script != null) {
                listColumn = PMTool.getColumnNameBySql(script);
                Iterator columnIter = listColumn.iterator();
                while (columnIter.hasNext()) {
                    String column = (String) columnIter.next();
                    if (column != null && !"".equals(column) && (column.toUpperCase()).equals(kpiCode.toUpperCase())) {
                        isExist = true;
                        break;
                    }
                }
            }
            if (isExist) {
                if ("".equals(phyModelStr)) {
                    phyModelStr = "'" + phyModel + "'";
                }
                else {
                    phyModelStr += ",'" + phyModel + "'";
                }
            }
        }

        if (!"del".equals(operType) && (phyModelStr == null || "".equals(phyModelStr))) {
            throw new BaseAppException("S-PM-KPI-0002", "No proper model was found.");
        }
        if (phyModelStr != null && !"".equals(phyModelStr)) {
            sql = "select distinct a.task_no AS TASK_NO \n" + " from pm_task_info a, pm_task_step_param b \n"
                + " where a.task_no = b.task_no \n" + " and a.task_type = '01' \n"
                + " and b.param_code = 'BUSINESS_MODEL' \n" + " and concat_ws('', b.param_value, b.param_value1, \n"
                + " b.param_value2, b.param_value3, \n" + " b.param_value4, b.param_value5) in (" + phyModelStr
                + ") \n";
            List<Map<String, String>> taskList = queryForMapList(sql, new Object[] {});
            Iterator taskIter = taskList.iterator();
            while (taskIter.hasNext()) {
                Map taskMap = (Map) taskIter.next();
                String taskNo = (String) taskMap.get("TASK_NO");
                this.editTaskDate(taskNo, dict);
            }
            this.redoTaskInst(taskList);
        }
        this.editBusiModel(phyModelStr, kpiCode, dict);
    }

    /**
     * editCompositeKpiCode <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void editCompositeKpiCode(JSONObject dict) throws BaseAppException {

        String kpiCode = CommonUtil.getStrFromMapWithExc(dict, "KPI_CODE");
        String emsRela = dict.getString("EMS_TYPE_REL_ID");

        String kpiForm = "";
        JSONArray kpiFormularArr = dict.getJSONArray("kpiFormular");
        if (null != kpiFormularArr) {
            int count = kpiFormularArr.size();
            if (count > 0) {
                JSONObject formularDict = kpiFormularArr.getJSONObject(0);
                kpiForm = formularDict.getString("KPI_FORM");
            }
        }

        List<Map<String, String>> phyModelList = this.getPhyModelList(emsRela);
        String phyModelStr = this.getPhyModelStr(phyModelList, kpiForm);

        if (phyModelStr == null || "".equals(phyModelStr)) {
            throw new BaseAppException("S-PM-KPI-0002", "No proper model was found.");
        }

        this.editBusiModel(phyModelStr, kpiCode, dict);

    }

    /**
     * addCompositeKpiCode <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     * @return String
     */
    private String addCompositeKpiCode(JSONObject dict) throws BaseAppException {
        StringBuffer seq = new StringBuffer(CommonUtil.getSeq("PM_CONFIG_SEQ"));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String kpiCode = "CC__" + DateUtil.formatString(new Date(), DateUtil.DateConstants.DATE_FORMAT_2) + "_" + seq;
        String kpiForm = "";
        String emsRela = dict.getString("EMS_TYPE_REL_ID");
        JSONArray kpiFormularArr = dict.getJSONArray("kpiFormular");
        if (null != kpiFormularArr) {
            int count = kpiFormularArr.size();
            if (count > 0) {
                JSONObject formularDict = kpiFormularArr.getJSONObject(0);
                kpiForm = formularDict.getString("KPI_FORM");
            }
        }

        List<Map<String, String>> phyModelList = this.getPhyModelList(emsRela);
        String phyModelStr = this.getPhyModelStr(phyModelList, kpiForm);
        if (phyModelStr != null && !"".equals(phyModelStr)) { // 找到物理模型才可以新建指标
            this.editBusiModel(phyModelStr, kpiCode, dict);
        }
        else {
            throw new BaseAppException("S-PM-KPI-0002", "No proper model was found.");
        }
        return kpiCode;
    }

    /**
     * checkKpiForm <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void checkKpiForm(JSONObject dict) throws BaseAppException {
        JSONArray kpiFormularArr = dict.getJSONArray("kpiFormular");
        int count = 0;
        if (null != kpiFormularArr) {
            count = kpiFormularArr.size();
        }

        if ("1".equals(kpiType)) {
            for (int i = 0; i < count; i++) {
                JSONObject formularDict = kpiFormularArr.getJSONObject(i);

                formularDict.put("EMS_TYPE_REL_ID", dict.getString("EMS_TYPE_REL_ID"));
                formularDict.put("KPI_TYPE", dict.getString("KPI_TYPE"));
                List<Map<String, String>> tasks = null;
                try {
                    tasks = this.getTaskList(formularDict);
                }
                catch (Exception e) {
                    throw new BaseAppException("S-PM-KPI-0002",
                        "The indicator formula is not correct.[" + formularDict.getString("EMS_VER_NAME") + "]");

                }

                if (tasks == null || tasks.size() < 1) {
                    throw new BaseAppException("S-PM-KPI-0002",
                        "The indicator formula is not correct.[" + formularDict.getString("EMS_VER_NAME") + "]");
                }
            }
        }
        else {
            String kpiForm = "";
            String emsRela = dict.getString("EMS_TYPE_REL_ID");
            if (count > 0) {
                JSONObject formularDict = kpiFormularArr.getJSONObject(0);
                kpiForm = formularDict.getString("KPI_FORM");
            }
            List<Map<String, String>> phyModelList = this.getPhyModelList(emsRela);
            String phyModelStr = this.getPhyModelStr(phyModelList, kpiForm);
            if (phyModelStr == null || "".equals(phyModelStr)) {
                throw new BaseAppException("S-PM-KPI-0002", "phyModelStr is null");
            }
        }
    }

    /**
     * addBaseKpiCode <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     * @return String
     */
    private String addBaseKpiCode(JSONObject dict) throws BaseAppException {

        JSONArray kpiFormularArr = dict.getJSONArray("kpiFormular");

        List<Map<String, String>> taskList = new ArrayList<Map<String, String>>();
        if (null != kpiFormularArr) {
            int count = kpiFormularArr.size();
            for (int i = 0; i < count; i++) {

                JSONObject formularDict = kpiFormularArr.getJSONObject(i);
                formularDict.put("EMS_TYPE_REL_ID", dict.getString("EMS_TYPE_REL_ID"));
                formularDict.put("KPI_TYPE", dict.getString("KPI_TYPE"));

                List<Map<String, String>> tasks = this.getTaskList(formularDict);
                if (tasks == null || tasks.size() < 1) {
                    throw new BaseAppException("S-PM-KPI-0002",
                        "No proper model was found.[" + formularDict.getString("EMS_VER_NAME") + "]");
                }
                taskList.addAll(tasks);
            }
        }

        String kpiCode = this.getKpiCode(taskList, dict);
        this.redoTaskInst(taskList);
        return kpiCode;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param emsRela String
     * @return List<Map<String, String>>
     * @throws BaseAppException <br>
     */
    private List<Map<String, String>> getPhyModelList(String emsRela) throws BaseAppException {
        String sql = "SELECT MODEL_PHY_CODE , GRANU_MODE \n" + " FROM PM_MODEL_PHY \n" + " WHERE MODEL_TYPE = 1 \n"
            + " AND EMS_TYPE_REL_ID = ? \n";

        List<Map<String, String>> phyModelList = queryForMapList(sql, new Object[] {emsRela});
        return phyModelList;
    }

    /**
     * getPhyModelStr <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param phyModelList <br>
     * @param kpiForm <br>
     * @throws BaseAppException <br>
     * @return String
     */
    private String getPhyModelStr(List<Map<String, String>> phyModelList, String kpiForm) throws BaseAppException {
        if (kpiForm == null || "".equals(kpiForm)) {
            return "";
        }
        Iterator phyModelListIter = phyModelList.iterator();
        String phyModelStr = "";
        while (phyModelListIter.hasNext()) {
            Map phyModelMap = (Map) phyModelListIter.next();
            String phyModel = (String) phyModelMap.get("MODEL_PHY_CODE");
            String granuMode = (String) phyModelMap.get("GRANU_MODE");

            JSONArray obj = JSONArray.parseArray(granuMode);
            for (int i = 0; i < obj.size(); i++) {
                JSONObject o = JSONObject.parseObject(obj.get(i).toString());
                String granu = o.getString("GRANU");
                String mode = o.getString("TABLE_MODE");
                if (null == granu || granu.length() == 0 || ("None").equals(granu)) {
                    granu = "";
                }
                boolean isSucc = true;
                try {
                    queryForMapList("select " + kpiForm + " as kpi from " + phyModel + granu + " where 1=2 ",
                        new Object[0]);
                }
                catch (Exception e) {
                    isSucc = false;
                }
                if (isSucc) {
                    if (phyModelStr == null || "".equals(phyModelStr)) {
                        phyModelStr = "'" + phyModel + "'";
                    }
                    else {
                        phyModelStr += ",'" + phyModel + "'";
                    }
                    break;
                }
            }
        }
        return phyModelStr;
    }

    /**
     * getTaskList <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     * @return List<HashMap<String, String>>
     */
    private List<Map<String, String>> getTaskList(JSONObject dict) throws BaseAppException {

        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String kpiForm = dict.getString("KPI_FORM");

        String counterSql = "select ? as COUNTER_CODE,( " + " select m.mo_code \n" + " from pm_mo_detail t, pm_mo m \n"
            + " where t.mo_code = m.mo_code \n" + " and m.mo_code = ? \n" + " and t.field_code = ? \n"
            + PMTool.ternaryExpression("".equals(emsRela), "", " and m.ems_type_rel_id = ? \n")
            + PMTool.ternaryExpression(("".equals(verCode) || "-1".equals(verCode)), "", " and m.ems_ver_code = ? \n")
            + " limit 1 ) as MO_CODE from dual \n";
        String sql = "";
        JSONArray counterList = dict.getJSONArray("counterList");
        List<String> paramList = new ArrayList<String>();
        if (null != counterList) {
            int count = counterList.size();
            for (int i = 0; i < count; i++) {
                JSONObject curCounter = counterList.getJSONObject(i);
                String counterCode = curCounter.getString("COUNTER_CODE");
                if ("".equals(sql)) {
                    sql = counterSql;
                }
                else {
                    sql += " union all \n" + counterSql;
                }
                paramList.add(counterCode);
                paramList.add(curCounter.getString("MO_CODE"));
                paramList.add(counterCode);
                if (!"".equals(emsRela)) {
                    paramList.add(emsRela);
                }
                if (!"".equals(verCode) && !"-1".equals(verCode)) {
                    paramList.add(verCode);
                }
            }
        }

        List<Map<String, String>> moList = queryForMapList("select distinct s.mo_code AS MO_CODE from (" + sql + ") s",
            paramList.toArray());

        if (moList.size() > 0) {
            Iterator moIter = moList.iterator();
            String moStr = "";
            while (moIter.hasNext()) {
                Map moMap = (Map) moIter.next();
                String moCode = (String) moMap.get("MO_CODE");
                if (moCode == null || "".equals(moCode)) {
                    return null;
                }
                else {
                    if ("".equals(moStr)) {
                        moStr = "'" + moCode + "'";
                    }
                    else {
                        moStr += ",'" + moCode + "'";
                    }
                }
            }

            // 获得task列表
            sql = "select t.task_no AS TASK_NO \n" + " from (select s.task_no, s.param_value \n"
                + " from (select a.task_no, \n" + " concat_ws('', b.param_value, b.param_value1, b.param_value2, \n"
                + " param_value3, b.param_value4, b.param_value5) as param_value \n"
                + " from pm_task_info a, pm_task_step_param b \n" + " where a.task_no = b.task_no \n"
                + " and a.task_type = '01' \n"
                + PMTool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ? \n")
                + PMTool.ternaryExpression(("".equals(verCode) || "-1".equals(verCode)), "",
                    " and a.ems_ver_code = ? \n")
                + " and b.param_code = 'MO_NO') s \n" + " where s.param_value in (" + moStr + ")) t \n"
                + " group by t.task_no \n" + "having count(1) = " + moList.size() + " \n";

            paramList.clear();
            if (!"".equals(emsRela)) {
                paramList.add(emsRela);
            }
            if (!"".equals(verCode) && !"-1".equals(verCode)) {
                paramList.add(verCode);
            }

            List<Map<String, String>> taskList = queryForMapList(sql, paramList.toArray());
            return taskList;
        }
        else {
            return null;
        }
    }

    /**
     * editTaskDate <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param taskNo <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void editTaskDate(String taskNo, JSONObject dict) throws BaseAppException {
        if (taskNo == null) {
            return;
        }

        JSONObject taskDict = new JSONObject();
        taskDict.put("OPER_TYPE", "edit");
        taskDict.put("isOnlyTaskDate", "1");
        taskDict.put("TASK_NO", taskNo);
        taskDict.put("BP_ID", dict.getString("BP_ID"));
        SpringContext.getBean(TaskManager.class).editTaskInfo(taskDict);
    }

    /**
     * redoTaskInst <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param taskList <br>
     * @throws BaseAppException <br>
     */
    private void redoTaskInst(List<Map<String, String>> taskList) throws BaseAppException {
        if (taskList == null) {
            return;
        }
        // TODO
        // DynamicDict taskListDict = new DynamicDict();
        // taskListDict.set("taskList", taskList);
        // taskListDict.setServiceName("MPM_KPIREDEFINE_SERVER");
        // ServiceFlow.callService(taskListDict, true);

    }

    /**
     * getKpiCode <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param taskList <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     * @return String
     */
    private String getKpiCode(List<Map<String, String>> taskList, JSONObject dict) throws BaseAppException {
        String kpiCode = "";
        String kpiName = dict.getString("KPI_NAME");

        Iterator taskIter = taskList.iterator();
        String taskNoStr = "";
        while (taskIter.hasNext()) {
            Map taskMap = (Map) taskIter.next();
            String taskNo = (String) taskMap.get("TASK_NO");

            if ("".equals(taskNoStr)) {
                taskNoStr = "'" + taskNo + "'";
            }
            else {
                taskNoStr += ",'" + taskNo + "'";
            }
            if ("1".equals(kpiType)) { // 基础指标才需要重新生成任务时间
                this.editTaskDate(taskNo, dict);
            }
        }

        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String sql = "select upper(kpi_code) as KPI_CODE \n" + " from pm_kpi \n" + " where 1=1 \n"
            + PMTool.ternaryExpression("".equals(emsRela), "", " and ems_type_rel_id = ? \n");

        List<String> listKpi = new ArrayList<String>();
        List<Map<String, String>> kpiCodeList = queryForMapList(sql, emsRela);
        Iterator kpiCodeIter = kpiCodeList.iterator();
        while (kpiCodeIter.hasNext()) {
            Map kpiCodeMap = (Map) kpiCodeIter.next();
            listKpi.add((String) kpiCodeMap.get("KPI_CODE"));
        }

        // 获得物理模型列表
        sql = "select model_phy_code AS MODEL_PHY_CODE, script AS SCRIPT \n" + " from pm_model_phy_script \n"
            + " where model_phy_code in \n" + " (select concat_ws('', param_value, param_value1, \n"
            + " param_value2, param_value3, \n" + " param_value4, param_value5) \n" + " as param_value \n"
            + " from pm_task_step_param \n" + " where task_no in (" + taskNoStr + ") \n"
            + " and param_code = 'BUSINESS_MODEL') \n" + " and script_type = 'o' \n" + " order by script_no \n";

        List<Map<String, String>> scriptList = queryForMapList(sql, new Object[] {});
        Iterator scriptIter = scriptList.iterator();

        Map modelScriptMap = new HashMap();

        while (scriptIter.hasNext()) { // 将竖表存放的Script字段 转到HashMap中存放
            Map scriptMap = (Map) scriptIter.next();
            String phyModel = (String) scriptMap.get("MODEL_PHY_CODE");
            String script = (String) scriptMap.get("SCRIPT");
            if (script == null) {
                script = "";
            }

            String phyModelScript = (String) modelScriptMap.get(phyModel);

            if (phyModelScript == null || "".equals(phyModelScript)) {
                modelScriptMap.put(phyModel, script);
            }
            else {
                modelScriptMap.put(phyModel, phyModelScript + script);
            }
        }

        String phyModelStr = "";
        Iterator iter = modelScriptMap.entrySet().iterator();
        while (iter.hasNext()) {
            Map.Entry entry = (Map.Entry) iter.next();
            String phyModel = (String) entry.getKey();
            String script = (String) entry.getValue();
            List<String> listColumn = new ArrayList<String>();

            if (script != null) {
                listColumn = PMTool.getColumnNameBySql(script);
            }
            listColumn.removeAll(listKpi);

            Iterator columnIter = listColumn.iterator();
            if (kpiCode == null || "".equals(kpiCode)) { // 找出一个待占用的列
                while (columnIter.hasNext()) {
                    String column = (String) columnIter.next();
                    if (column != null && !"".equals(column)) {
                        if (column.indexOf("C__") == 0) {
                            kpiCode = column;
                            // phyModelKpi.add(phyModel);
                            if (phyModelStr == null || "".equals(phyModelStr)) {
                                phyModelStr = "'" + phyModel + "'";
                            }
                            else {
                                phyModelStr += ",'" + phyModel + "'";
                            }
                            break;
                        }

                    }
                }
            }
            else { // 判断物理模型中是否存在前面找出的待占用的列
                while (columnIter.hasNext()) {
                    String column = (String) columnIter.next();
                    if (kpiCode.equals(column)) {
                        // phyModelKpi.add(phyModel);
                        if (phyModelStr == null || "".equals(phyModelStr)) {
                            phyModelStr = "'" + phyModel + "'";
                        }
                        else {
                            phyModelStr += ",'" + phyModel + "'";
                        }
                        break;
                    }
                }
            }
        }
        if (phyModelStr == null || "".equals(phyModelStr)) {
            throw new BaseAppException("S-PM-KPI-0002", "No proper model was found.");
        }
        this.editBusiModel(phyModelStr, kpiCode, dict);
        return kpiCode;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param phyModelStr String
     * @param kpiCode String
     * @param dict JSONObject
     * @throws BaseAppException <br>
     */
    private void editBusiModel(String phyModelStr, String kpiCode, JSONObject dict) throws BaseAppException {

        String sql = "delete from pm_model_busi_detail where field_code = ? \n";
        update(sql, kpiCode);

        if (phyModelStr != null && !"".equals(phyModelStr)
            && (("1".equals(kpiType) && "1".equals(isAnalysis)) || !"".equals(kpiType))) {
            String operType = dict.getString("OPER_TYPE");

            // 获得业务模型列表
            sql = "SELECT A.MODEL_BUSI_CODE, A.MODEL_PHY_CODE, \n" + " MAX(B.FIELD_NO) + 1 AS FIELD_NO \n"
                + " FROM PM_MODEL_BUSI A, PM_MODEL_BUSI_DETAIL B \n" + " WHERE A.MODEL_PHY_CODE IN (" + phyModelStr
                + ") \n" + " AND A.MODEL_BUSI_CODE = B.MODEL_BUSI_CODE \n"
                + " GROUP BY A.MODEL_BUSI_CODE, A.MODEL_PHY_CODE \n";

            List<Map<String, String>> busiModelList = queryForMapList(sql, new Object[] {});

            SimpleDateFormat simpleDateFormat;
            simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = new Date();
            String sysdate = simpleDateFormat.format(date);

            Iterator busiModelIter = busiModelList.iterator();
            while (busiModelIter.hasNext()) { // 将竖表存放的Script字段 转到HashMap中存放
                Map busiModelMap = (Map) busiModelIter.next();

                if (!"del".equals(operType)) {
                    sql = "insert into pm_model_busi_detail \n" + " (model_busi_code,\n" + " field_name, \n"
                        + " field_code, \n" + " eff_time, \n" + " field_type, \n" + " data_type, \n" + " dim_code, \n"
                        + " phy_col, \n" + " field_no, \n" + " bp_id) \n" + "values \n"
                        + " (?, ?, ?, date_format(?,'%Y-%m-%d'), ?, ?, ?, ?, ?, ?) \n";
                    List<String> paramList = new ArrayList<String>();
                    paramList.add((String) busiModelMap.get("MODEL_BUSI_CODE"));
                    paramList.add(dict.getString("KPI_NAME"));
                    paramList.add(kpiCode);
                    paramList.add(sysdate);
                    paramList.add("1");
                    paramList.add("1");
                    paramList.add("");
                    paramList.add(kpiCode);
                    paramList.add(String.valueOf(busiModelMap.get("FIELD_NO")));
                    paramList.add(dict.getString("BP_ID"));
                    update(sql, paramList.toArray());
                }
            }
        }
    }

}
