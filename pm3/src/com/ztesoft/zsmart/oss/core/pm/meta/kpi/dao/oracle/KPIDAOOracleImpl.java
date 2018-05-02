package com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao.oracle;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.ServiceFlow;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao.KPIDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/**
 * PM元数据-指标管理相关的Oracle DAO操作实现类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-5 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao.oracle <br>
 */
public class KPIDAOOracleImpl extends KPIDAO {
    /**
     * sql
     */
    String sql = "";

    /**
     * tool
     */
    PMTool tool = new PMTool();

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

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
    public void getKPIInfo(DynamicDict dict) throws BaseAppException {

        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String kpiCode = (String) dict.getValueByName("KPI_CODE", "");
        String kpiType = (String) dict.getValueByName("KPI_TYPE", "");
        String isAnalysis = (String) dict.getValueByName("IS_ANALYSIS", "");
        String kpiCodes = (String) dict.getValueByName("KPI_CODE_S", "");
        String kpiName = (String) dict.getValueByName("KPI_NAME", "");

        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }

        sql = "select a.kpi_name,    \n" + "       a.kpi_code,    \n" + "       a.ems_type_rel_id,    \n"
            + "       to_char(a.eff_time,'yyyy-mm-dd') as eff_time,    \n" + "       to_char(a.exp_time,'yyyy-mm-dd') as exp_time,    \n"
            + "       a.dirt,        \n" + "       a.kpi_type,    \n" + "       a.data_type,    \n" + "       a.unit,        \n"
            + "       a.prec,        \n" + "       a.def_value,    \n" + "       a.kpi_aname,    \n" + "       a.is_analysis,    \n"
            + "       a.comments,    \n" + "       a.bp_id        \n" + "  from pm_kpi a        \n" + " where 1 = 1            \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(kpiCode), "", " and a.kpi_code = ?   \n")
            + tool.ternaryExpression("".equals(kpiType), "", " and a.kpi_type = ?   \n")
            + tool.ternaryExpression("".equals(isAnalysis), "", " and a.is_analysis = ?   \n")
            + tool.ternaryExpression("".equals(kpiCodes), "", " and a.kpi_code in (" + kpiCodes + ")   \n")
            + tool.ternaryExpression("".equals(kpiName), "", " and upper(a.kpi_name) like upper('%'||?||'%')   \n")
            + " order by a.kpi_name, a.kpi_code    \n";

        ParamArray params = new ParamArray();
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(kpiCode))) {
            params.set("", kpiCode);
        }
        if (!("".equals(kpiType))) {
            params.set("", kpiType);
        }
        if (!("".equals(isAnalysis))) {
            params.set("", isAnalysis);
        }
        if (!("".equals(kpiName))) {
            params.set("", kpiName);
        }
        dict.set("kpiList", queryList(sql, params));
    }

    @Override
    public void getKPIFormular(DynamicDict dict) throws BaseAppException {
        String kpiCode = (String) dict.getValueByName("KPI_CODE", "");
        String kpiCodes = (String) dict.getValueByName("KPI_CODE_S", "");
        String isCounterMoRela = (String) dict.getValueByName("isCounterMoRela", "");
        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }
        sql = "select a.kpi_code,    \n" + "       a.ems_ver_code,\n" + "       a.kpi_agg,        \n" + "       a.kpi_form,    \n"
            + "       a.kpi_cond,    \n" + "       a.kpi_version,    \n" + "       a.bp_id,        \n" + "       b.kpi_name,    \n"
            + "       b.kpi_type,    \n" + "       b.data_type,    \n" + "       b.def_value,    \n" + "       b.unit,        \n"
            + "       b.dirt,        \n" + "       b.prec            \n" + "  from pm_kpi_form a ,pm_kpi b    \n"
            + " where a.kpi_code = b.kpi_code     \n" + tool.ternaryExpression("".equals(kpiCode), "", " and a.kpi_code = ?   \n")
            + tool.ternaryExpression("".equals(kpiCodes), "", " and a.kpi_code in (" + kpiCodes + ")   \n");

        ParamArray params = new ParamArray();
        params.clear();
        if (!("".equals(kpiCode))) {
            params.set("", kpiCode);
        }
        dict.set("kpiFormular", queryList(sql, params));

        if ("1".equals(isCounterMoRela)) {
            sql = "select kpi_code,       \n" + "       ems_ver_code,   \n" + "       ems_code,       \n" + "       mo_code,        \n"
                + "       counter_code,   \n" + "       kpi_version,    \n" + "       bp_id           \n" + "  from pm_kpi_cm_rela  \n"
                + " where 1 = 1           \n" + tool.ternaryExpression("".equals(kpiCode), "", " and kpi_code = ?   \n")
                + tool.ternaryExpression("".equals(kpiCodes), "", " and kpi_code in (" + kpiCodes + ")   \n") + " order by kpi_code     \n";
            params.clear();
            if (!("".equals(kpiCode))) {
                params.set("", kpiCode);
            }
            dict.set("kpiCounterMo", queryList(sql, params));
        }

    }

    @Override
    public void addKPIInfo(DynamicDict dict) throws BaseAppException {

        isOnlyCheck = (String) dict.getValueByName("isOnlyCheck", "");
        kpiType = dict.getString("KPI_TYPE");
        isAnalysis = dict.getString("IS_ANALYSIS");

        if ("1".equals(isOnlyCheck)) {
            this.checkKpiForm(dict);
            return;
        }

        String customKpiMode = (String) dict.getValueByName("customKpiMode", "");
        if ("1".equals(customKpiMode)) { // 客户自定义模式
            this.checkKpiForm(dict); // 客户自定义模式 强制检测
            if ("1".equals(kpiType)) { // 基础KPI && 分析类指标
                dict.set("KPI_CODE", this.addBaseKpiCode(dict));
            }
            else { // 组合KPI
                dict.set("KPI_CODE", this.addCompositeKpiCode(dict));
            }
        }

        String kpiCode = dict.getString("KPI_CODE", true);
        if (kpiCode == null || "".equals(kpiCode)) {
            throw new BaseAppException("S-PM-KPI-0001", "No proper kpi code was found.");
        }

        ParamArray params = new ParamArray();
        sql = "select count(1) as count from pm_kpi where kpi_code = ?";
        params.set("", dict.getString("KPI_CODE", true));
        int count = queryInt(sql, params);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "Code already existed.");
        }

        sql = "insert into pm_kpi    \n" + "  (kpi_name,            \n" + "   kpi_code,            \n" + "   ems_type_rel_id,    \n"
            + "   eff_time,            \n" + "   exp_time,            \n" + "   dirt,                \n" + "   kpi_type,            \n"
            + "   data_type,            \n" + "   unit,                \n" + "   prec,                \n" + "   def_value,            \n"
            + "   kpi_aname,            \n" + "   is_analysis,        \n" + "   comments,            \n" + "   bp_id)                \n"
            + "values                \n" + "  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        params.clear();
        params.set("", dict.getString("KPI_NAME", true));
        params.set("", dict.getString("KPI_CODE", true));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("DIRT"));
        params.set("", dict.getString("KPI_TYPE"));
        params.set("", dict.getString("DATA_TYPE"));
        params.set("", dict.getString("UNIT"));
        params.set("", dict.getString("PREC"));
        params.set("", dict.getString("DEF_VALUE"));
        params.set("", dict.getString("KPI_ANAME"));
        params.set("", dict.getString("IS_ANALYSIS"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("BP_ID"));

        executeUpdate(sql, params);
        this.batchAddFormular(dict);
    }

    @Override
    public void editKPIInfo(DynamicDict dict) throws BaseAppException {

        String customKpiMode = (String) dict.getValueByName("customKpiMode", "");
        kpiType = dict.getString("KPI_TYPE");
        isAnalysis = dict.getString("IS_ANALYSIS");

        if ("1".equals(customKpiMode)) { // 客户自定义模式 && 分析类指标(组合指标不受是否分析控制)
            this.checkKpiForm(dict);
            if ("1".equals(kpiType)) {
                this.editBaseKpiCode(dict);
            }
            else {
                this.editCompositeKpiCode(dict);
            }
        }

        sql = "update pm_kpi    \n" + "   set kpi_name        = ?,    \n" + "       ems_type_rel_id = ?,    \n" + "       eff_time        = ?,    \n"
            + "       exp_time        = ?,    \n" + "       dirt            = ?,    \n" + "       kpi_type        = ?,    \n"
            + "       data_type       = ?,    \n" + "       unit            = ?,    \n" + "       prec            = ?,    \n"
            + "       def_value       = ?,    \n" + "       kpi_aname       = ?,    \n" + "       is_analysis     = ?,    \n"
            + "       comments        = ?,    \n" + "       bp_id           = ?    \n" + " where kpi_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("KPI_NAME", true));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("DIRT"));
        params.set("", dict.getString("KPI_TYPE"));
        params.set("", dict.getString("DATA_TYPE"));
        params.set("", dict.getString("UNIT"));
        params.set("", dict.getString("PREC"));
        params.set("", dict.getString("DEF_VALUE"));
        params.set("", dict.getString("KPI_ANAME"));
        params.set("", dict.getString("IS_ANALYSIS"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("KPI_CODE", true));

        executeUpdate(sql, params);

        this.batchAddFormular(dict);
    }

    @Override
    public void delKPIInfo(DynamicDict dict) throws BaseAppException {
        isOnlyCheck = "";
        String customKpiMode = (String) dict.getValueByName("customKpiMode", "");

        if ("1".equals(customKpiMode)) { // 客户自定义模式 && 分析类指标(组合指标不受是否分析控制)
            DynamicDict kDict = new DynamicDict();
            String kpiCode = dict.getString("KPI_CODE", true);
            kDict.set("KPI_CODE", kpiCode);
            this.getKPIInfo(kDict);

            DynamicDict kpiDict = tool.getDict(kDict, "kpiList", 0);
            kpiType = kpiDict.getString("KPI_TYPE");
            kpiDict.set("OPER_TYPE", "del");
            if (!"1".equals(kpiType)) { // 非基础指标
                this.getKPIFormular(dict);
                kpiDict.set("kpiFormular", tool.getDict(dict, "kpiFormular", 0));
                this.editBusiModel("", kpiCode, dict);
            }
            else {
                this.editBaseKpiCode(kpiDict);
            }

        }

        sql = "delete from pm_kpi_form where kpi_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("KPI_CODE", true));
        executeUpdate(sql, params);

        sql = "delete from pm_kpi where kpi_code = ? \n";
        executeUpdate(sql, params);

    }

    /**
     * batchAddFormular <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void batchAddFormular(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String kpiCode = dict.getString("KPI_CODE", true);
        sql = "delete from pm_kpi_form where kpi_code = ?    \n";
        params.clear();
        params.set("", kpiCode);
        executeUpdate(sql, params);

        sql = "delete from pm_kpi_cm_rela where kpi_code = ?    \n";
        params.clear();
        params.set("", kpiCode);
        executeUpdate(sql, params);

        sql = "insert into pm_kpi_form    \n" + "  (kpi_code, ems_code, ems_ver_code, kpi_agg, kpi_form, kpi_cond, kpi_version, bp_id)    \n"
            + "values    \n" + "  (?, ?, ?, ?, ?, ?, ?, ?)    \n";
        int count = dict.getCount("kpiFormular");
        for (int i = 0; i < count; i++) {
            DynamicDict formularDict = dict.getBO("kpiFormular", i);
            ParamArray param = new ParamArray();
            param.set("", kpiCode);
            param.set("", formularDict.getString("EMS_CODE", true));
            param.set("", formularDict.getString("EMS_VER_CODE", true));
            param.set("", formularDict.getString("KPI_AGG"));
            param.set("", formularDict.getString("KPI_FORM"));
            param.set("", formularDict.getString("KPI_COND"));
            param.set("", formularDict.getString("KPI_VERSION"));
            param.set("", formularDict.getString("BP_ID"));
            executeUpdate(sql, param);

            String counterSql = "insert into pm_kpi_cm_rela  \n" + "  (kpi_code,                \n" + "   ems_code,                \n"
                + "   ems_ver_code,            \n" + "   mo_code,                 \n" + "   counter_code,            \n"
                + "   kpi_version,             \n" + "   bp_id)                   \n" + "values                      \n"
                + "  (?, ?, ?, ?, ?, ?, ?)     \n";
            for (int c = 0; c < formularDict.getCount("counterList"); c++) {
                DynamicDict cDict = tool.getDict(formularDict, "counterList", c);
                param.clear();
                param.set("", kpiCode);
                param.set("", formularDict.getString("EMS_CODE", true));
                param.set("", formularDict.getString("EMS_VER_CODE", true));
                param.set("", cDict.getString("MO_CODE", true));
                param.set("", cDict.getString("COUNTER_CODE", true));
                param.set("", formularDict.getString("KPI_VERSION"));
                param.set("", formularDict.getString("BP_ID"));
                executeUpdate(counterSql, param);
            }

        }
    }

    /**
     * editBaseKpiCode <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void editBaseKpiCode(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();

        String kpiCode = (String) dict.getValueByName("KPI_CODE", true);
        String operType = (String) dict.getValueByName("OPER_TYPE", "");
        if (kpiCode == null || "".equals(kpiCode)) {
            return;
        }
        String emsRela = dict.getString("EMS_TYPE_REL_ID");
        List<HashMap<String, String>> phyModelList = this.getPhyModelList(emsRela);
        Iterator phyModelListIter = phyModelList.iterator();
        String modelPhyCodeStr = "";
        while (phyModelListIter.hasNext()) {
            HashMap phyModelMap = (HashMap) phyModelListIter.next();
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
        sql = "select model_phy_code, script                    \n" + "  from pm_model_phy_script                       \n"
            + " where model_phy_code in(" + modelPhyCodeStr + ")    \n" + " and script_type='o' order by script_no          \n";
        params.clear();
        List<HashMap<String, String>> scriptList = queryList(sql, params);
        Iterator scriptIter = scriptList.iterator();

        HashMap modelScriptMap = new HashMap();

        while (scriptIter.hasNext()) { // 将竖表存放的Script字段 转到HashMap中存放
            HashMap scriptMap = (HashMap) scriptIter.next();
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
                listColumn = tool.getColumnNameBySql(script);
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
            sql = "select distinct a.task_no                      \n" + "  from pm_task_info a, pm_task_step_param b    \n"
                + " where a.task_no = b.task_no                   \n" + "   and a.task_type = '01'                      \n"
                + "   and b.param_code = 'BUSINESS_MODEL'         \n" + "   and b.param_value || b.param_value1         \n"
                + "       || b.param_value2 || b.param_value3 ||  \n" + "       b.param_value4 || b.param_value5 in (" + phyModelStr + ")  \n";
            params.clear();
            List<HashMap<String, String>> taskList = queryList(sql, params);
            Iterator taskIter = taskList.iterator();
            while (taskIter.hasNext()) {
                HashMap taskMap = (HashMap) taskIter.next();
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
    public void editCompositeKpiCode(DynamicDict dict) throws BaseAppException {

        String kpiCode = (String) dict.getValueByName("KPI_CODE", true);
        String emsRela = dict.getString("EMS_TYPE_REL_ID");

        String kpiForm = "";
        int count = dict.getCount("kpiFormular");
        if (count > 0) {
            DynamicDict formularDict = dict.getBO("kpiFormular", 0);
            kpiForm = formularDict.getString("KPI_FORM");
        }
        List<HashMap<String, String>> phyModelList = this.getPhyModelList(emsRela);
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
    public String addCompositeKpiCode(DynamicDict dict) throws BaseAppException {
        StringBuffer seq = new StringBuffer(SeqUtil.getSeq("PM_CONFIG_SEQ"));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String kpiCode = "CC__" + DateUtil.date2String(new Date(), DateUtil.DATE_FORMAT_2) + "_" + seq;
        String kpiForm = "";
        String emsRela = dict.getString("EMS_TYPE_REL_ID");
        int count = dict.getCount("kpiFormular");
        if (count > 0) {

            DynamicDict formularDict = dict.getBO("kpiFormular", 0);
            kpiForm = formularDict.getString("KPI_FORM");
        }
        List<HashMap<String, String>> phyModelList = this.getPhyModelList(emsRela);
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
    public void checkKpiForm(DynamicDict dict) throws BaseAppException {
        int count = dict.getCount("kpiFormular");
        if ("1".equals(kpiType)) {
            for (int i = 0; i < count; i++) {
                DynamicDict formularDict = dict.getBO("kpiFormular", i);

                formularDict.set("EMS_TYPE_REL_ID", dict.getString("EMS_TYPE_REL_ID"));
                formularDict.set("KPI_TYPE", dict.getString("KPI_TYPE"));

                List<HashMap<String, String>> tasks = this.getTaskList(formularDict);
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

                DynamicDict formularDict = dict.getBO("kpiFormular", 0);
                kpiForm = formularDict.getString("KPI_FORM");
            }
            List<HashMap<String, String>> phyModelList = this.getPhyModelList(emsRela);
            String phyModelStr = this.getPhyModelStr(phyModelList, kpiForm);
            if (phyModelStr == null || "".equals(phyModelStr)) {
                throw new BaseAppException("S-PM-KPI-0002", "The indicator formula is not correct.");
            }
        }
    }

    /**
     * addBaseKpiCode <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param dict <br>
     * @return String
     * @throws BaseAppException <br>
     */
    public String addBaseKpiCode(DynamicDict dict) throws BaseAppException {

        int count = dict.getCount("kpiFormular");

        List<HashMap<String, String>> taskList = new ArrayList();
        for (int i = 0; i < count; i++) {
            DynamicDict formularDict = dict.getBO("kpiFormular", i);

            formularDict.set("EMS_TYPE_REL_ID", dict.getString("EMS_TYPE_REL_ID"));
            formularDict.set("KPI_TYPE", dict.getString("KPI_TYPE"));

            List<HashMap<String, String>> tasks = this.getTaskList(formularDict);
            if (tasks == null || tasks.size() < 1) {
                throw new BaseAppException("S-PM-KPI-0002", "No proper model was found.[" + formularDict.getString("EMS_VER_NAME") + "]");
            }
            taskList.addAll(tasks);
        }
        String kpiCode = this.getKpiCode(taskList, dict);
        this.redoTaskInst(taskList);
        return kpiCode;
    }

    /**
     * getPhyModelList <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param emsRela <br>
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public List<HashMap<String, String>> getPhyModelList(String emsRela) throws BaseAppException {
        sql = "select model_phy_code, granu_mode     \n" + "  from pm_model_phy                   \n" + " where model_type = 1                 \n"
            + "   and ems_type_rel_id = ?            \n";
        ParamArray params = new ParamArray();
        params.set("", emsRela);
        List<HashMap<String, String>> phyModelList = queryList(sql, params);
        return phyModelList;
    }

    /**
     * getPhyModelStr <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param phyModelList <br>
     * @param kpiForm <br>
     * @return String <br>
     * @throws BaseAppException <br>
     */
    public String getPhyModelStr(List<HashMap<String, String>> phyModelList, String kpiForm) throws BaseAppException {
        if (kpiForm == null || "".equals(kpiForm)) {
            return "";
        }
        ParamArray params = new ParamArray();
        Iterator phyModelListIter = phyModelList.iterator();
        String phyModelStr = "";
        while (phyModelListIter.hasNext()) {
            HashMap phyModelMap = (HashMap) phyModelListIter.next();
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
                    params.clear();
                    queryString("select " + kpiForm + " as kpi from " + phyModel + granu + " where 1=2 ", params);
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
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public List<HashMap<String, String>> getTaskList(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String kpiForm = dict.getString("KPI_FORM");
        params.clear();

        String counterSql = "select ? as counter_code,( " + "   select m.mo_code                      \n"
            + "          from pm_mo_detail t, pm_mo m   \n" + "         where t.mo_code = m.mo_code     \n"
            + "           and m.mo_code = ?             \n" + "           and t.field_code = ?          \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and m.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression(("".equals(verCode) || "-1".equals(verCode)), "", " and m.ems_ver_code = ?   \n")
            + " and rownum < 2 ) as mo_code from dual \n";
        sql = "";
        for (int i = 0; i < dict.getCount("counterList"); i++) {
            DynamicDict cDict = tool.getDict(dict, "counterList", i);
            String counterCode = cDict.getString("COUNTER_CODE");
            if ("".equals(sql)) {
                sql = counterSql;
            }
            else {
                sql += " union all \n" + counterSql;
            }
            params.set("", counterCode);
            params.set("", cDict.getString("MO_CODE"));
            params.set("", counterCode);
            if (!"".equals(emsRela)) {
                params.set("", emsRela);
            }
            if (!"".equals(verCode) && !"-1".equals(verCode)) {
                params.set("", verCode);
            }
        }

        List<HashMap<String, String>> moList = queryList("select distinct s.mo_code from (" + sql + ") s", params);

        if (moList.size() > 0) {

            Iterator moIter = moList.iterator();
            String moStr = "";
            while (moIter.hasNext()) {
                HashMap moMap = (HashMap) moIter.next();
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
            sql = "select t.task_no                   \n" + "  from (select s.task_no, s.param_value      \n"
                + "          from (select a.task_no,            \n"
                + "                       b.param_value || b.param_value1 || b.param_value2 ||             \n"
                + "                       param_value3 || b.param_value4 || b.param_value5 as param_value  \n"
                + "                  from pm_task_info a, pm_task_step_param b                             \n"
                + "                 where a.task_no = b.task_no                                            \n"
                + "                   and a.task_type = '01'                                               \n"
                + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?   \n")
                + tool.ternaryExpression(("".equals(verCode) || "-1".equals(verCode)), "", " and a.ems_ver_code = ?   \n")
                + "                   and b.param_code = 'MO_NO') s                                        \n" + "         where s.param_value in ("
                + moStr + ")) t                                          \n"
                + " group by t.task_no                                                                     \n" + "having count(1) = " + moList.size()
                + "                                                   \n";

            params.clear();
            if (!"".equals(emsRela)) {
                params.set("", emsRela);
            }
            if (!"".equals(verCode) && !"-1".equals(verCode)) {
                params.set("", verCode);
            }

            List<HashMap<String, String>> taskList = queryList(sql, params);
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
    public void editTaskDate(String taskNo, DynamicDict dict) throws BaseAppException {
        if (taskNo == null) {
            return;
        }

        DynamicDict taskDict = new DynamicDict();

        taskDict.set("OPER_TYPE", "edit");
        taskDict.set("isOnlyTaskDate", "1");
        taskDict.set("TASK_NO", taskNo);
        taskDict.set("BP_ID", dict.getString("BP_ID"));
        taskDict.setServiceName("MPM_CONFIG_TASK_OPER");
        ServiceFlow.callService(taskDict, true);
    }

    /**
     * redoTaskInst <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param taskList <br>
     * @throws BaseAppException <br>
     */
    public void redoTaskInst(List<HashMap<String, String>> taskList) throws BaseAppException {
        if (taskList == null) {
            return;
        }

        DynamicDict taskListDict = new DynamicDict();
        taskListDict.set("taskList", taskList);
        taskListDict.setServiceName("MPM_KPIREDEFINE_SERVER");
        ServiceFlow.callService(taskListDict, true);

    }

    /**
     * getKpiCode <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param taskList <br>
     * @param dict <br>
     * @return String <br>
     * @throws BaseAppException <br>
     */
    public String getKpiCode(List<HashMap<String, String>> taskList, DynamicDict dict) throws BaseAppException {
        String kpiCode = "";
        ParamArray params = new ParamArray();
        String kpiName = dict.getString("KPI_NAME");

        Iterator taskIter = taskList.iterator();
        String taskNoStr = "";
        while (taskIter.hasNext()) {
            HashMap taskMap = (HashMap) taskIter.next();
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

        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        sql = "select upper(kpi_code) as kpi_code   \n" + "  from pm_kpi    \n" + " where 1=1   \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and ems_type_rel_id = ?   \n");
        params.clear();
        if (!"".equals(emsRela)) {
            params.set("", emsRela);
        }
        List<String> listKpi = new ArrayList<String>();
        List<HashMap<String, String>> kpiCodeList = queryList(sql, params);
        Iterator kpiCodeIter = kpiCodeList.iterator();
        while (kpiCodeIter.hasNext()) {
            HashMap kpiCodeMap = (HashMap) kpiCodeIter.next();
            listKpi.add((String) kpiCodeMap.get("KPI_CODE"));
        }

        // 获得物理模型列表
        sql = "select model_phy_code, script                    \n" + "  from pm_model_phy_script                       \n"
            + " where model_phy_code in                         \n" + "       (select param_value || param_value1 ||    \n"
            + "                param_value2 || param_value3 ||  \n" + "               param_value4 || param_value5      \n"
            + "               as param_value                    \n" + "          from pm_task_step_param                \n"
            + "         where task_no in (" + taskNoStr + ")        \n" + "           and param_code = 'BUSINESS_MODEL')    \n"
            + "   and script_type = 'o'                         \n" + " order by script_no                              \n";
        params.clear();
        List<HashMap<String, String>> scriptList = queryList(sql, params);
        Iterator scriptIter = scriptList.iterator();

        HashMap modelScriptMap = new HashMap();

        while (scriptIter.hasNext()) { // 将竖表存放的Script字段 转到HashMap中存放
            HashMap scriptMap = (HashMap) scriptIter.next();
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
                listColumn = tool.getColumnNameBySql(script);
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
     * getTaskList <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param phyModelStr <br>
     * @param kpiCode <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void editBusiModel(String phyModelStr, String kpiCode, DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        sql = "delete from pm_model_busi_detail where  field_code = ?  \n";
        params.clear();
        params.set("", kpiCode);
        executeUpdate(sql, params);

        if (phyModelStr != null && !"".equals(phyModelStr) && (("1".equals(kpiType) && "1".equals(isAnalysis)) || !"".equals(kpiType))) {
            String operType = dict.getString("OPER_TYPE");

            // 获得业务模型列表
            sql = "select a.model_busi_code, a.model_phy_code,      \n" + "     max(b.field_no) + 1 as field_no             \n"
                + "  from pm_model_busi a, pm_model_busi_detail b   \n" + " where a.model_phy_code in (" + phyModelStr + ")     \n"
                + "   and a.model_busi_code = b.model_busi_code     \n" + " group by a.model_busi_code, a.model_phy_code    \n";
            params.clear();
            List<HashMap<String, String>> busiModelList = queryList(sql, params);

            SimpleDateFormat simpleDateFormat;
            simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = new Date();
            String sysdate = simpleDateFormat.format(date);

            Iterator busiModelIter = busiModelList.iterator();
            while (busiModelIter.hasNext()) { // 将竖表存放的Script字段 转到HashMap中存放
                HashMap busiModelMap = (HashMap) busiModelIter.next();

                if (!"del".equals(operType)) {
                    sql = "insert into pm_model_busi_detail    \n" + "  (model_busi_code,\n" + "   field_name,    \n" + "   field_code,    \n"
                        + "   eff_time,        \n" + "   field_type,    \n" + "   data_type,    \n" + "   dim_code,    \n" + "   phy_col,    \n"
                        + "   field_no,    \n" + "   bp_id)        \n" + "values        \n"
                        + "  (?, ?, ?, to_date(?,'yyyy-mm-dd'), ?, ?, ?, ?, ?, ?)    \n";
                    ParamArray param = new ParamArray();
                    param.set("", (String) busiModelMap.get("MODEL_BUSI_CODE"));
                    param.set("", dict.getString("KPI_NAME"));
                    param.set("", kpiCode);
                    param.set("", sysdate);
                    param.set("", "1");
                    param.set("", "1");
                    param.set("", "");
                    param.set("", kpiCode);
                    param.set("", (String) busiModelMap.get("FIELD_NO"));
                    param.set("", dict.getString("BP_ID"));
                    executeUpdate(sql, param);
                }

            }
        }
    }

    @Override
    public void insert(DynamicDict paramT) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    @Override
    public int update(DynamicDict paramT) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int delete(DynamicDict paramT) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int deleteById(String paramString) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public HashMap<String, String> selectById(String paramString) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }
}
