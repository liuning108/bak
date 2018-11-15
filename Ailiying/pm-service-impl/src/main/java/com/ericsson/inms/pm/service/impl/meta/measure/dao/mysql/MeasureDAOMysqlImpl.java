package com.ericsson.inms.pm.service.impl.meta.measure.dao.mysql;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.util.UtilService;
import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ericsson.inms.pm.service.impl.meta.measure.dao.MeasureDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.spring.SpringContext;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.meta.measure.dao.mysql <br>
 */
public class MeasureDAOMysqlImpl extends MeasureDAO {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getMeasureInfo(JSONObject dict) throws BaseAppException {

        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String moCode = CommonUtil.getStrFromMap(dict, "MO_CODE", "");
        String moType = CommonUtil.getStrFromMap(dict, "MO_TYPE", "");
        String moName = CommonUtil.getStrFromMap(dict, "MO_NAME", "");
        String moCodes = CommonUtil.getStrFromMap(dict, "MO_CODE_S", "");
        if (!("".equals(moCodes))) {
            moCodes = "'" + moCodes.replaceAll("[',']", "','") + "'";
        }

        String sql = "SELECT a.EMS_TYPE_REl_ID,    \n" + "       a.EMS_VER_CODE,    \n" + "       a.MO_NAME,        \n"
            + "       a.MO_CODE,        \n" + "       a.EMS_CODE,    \n"
            + "       date_format(a.eff_time, '%Y-%m-%d') AS EFF_TIME,    \n"
            + "       date_format(a.exp_time, '%Y-%m-%d') AS EXP_TIME,    \n" + "       a.MO_TYPE,            \n"
            + "       a.FILENAME_RULE,    \n" + "       a.PROC_RULE,        \n" + "       a.SEPA_STR,        \n"
            + "       a.IS_COL_HEADER,    \n" + "       a.IS_QUOT,        \n" + "       a.COMMENTS,    \n"
            + "       a.MO_NAME_DESC,\n" + "       a.BP_ID,    \n" + "        (SELECT p.PLUGIN_SPEC_NO  \n"
            + "          FROM PM_PLUGINSERV p    \n" + "         WHERE p.PLUGIN_NO = a.FILENAME_RULE      \n"
            + "           AND p.SEQ = 0                          \n"
            + "           AND p.PLUGIN_TYPE = '03'               \n" + "           LIMIT 1) AS FILENAME_RULE_SPEC, \n"
            + "        (SELECT p.PLUGIN_SPEC_NO  \n" + "          FROM PM_PLUGINSERV p    \n"
            + "         WHERE p.PLUGIN_NO = a.PROC_RULE         \n"
            + "           AND p.SEQ = 0                         \n"
            + "           AND p.PLUGIN_TYPE = '04'              \n" + "           LIMIT 1) AS PROC_RULE_SPEC     \n"
            + "  FROM PM_MO a    \n" + " WHERE 1 = 1        \n"
            + PMTool.ternaryExpression("".equals(emsRela), "", " AND a.EMS_TYPE_REL_ID = ?   \n")
            + PMTool.ternaryExpression("".equals(verCode), "", " AND a.EMS_VER_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(moCode), "", " AND a.MO_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(moType), "", " AND a.MO_TYPE = ?   \n")
            + PMTool.ternaryExpression("".equals(moCodes), "", " AND a.MO_CODE IN (" + moCodes + ")   \n")
            + PMTool.ternaryExpression("".equals(moName), "", " AND a.MO_NAME LIKE concat('%',?,'%')   \n")
            + " ORDER BY a.MO_NAME, a.MO_CODE    \n";

        List<String> paramList = new ArrayList<String>();
        if (!("".equals(emsRela))) {
            paramList.add(emsRela);
        }
        if (!("".equals(verCode))) {
            paramList.add(verCode);
        }
        if (!("".equals(moCode))) {
            paramList.add(moCode);
        }
        if (!("".equals(moType))) {
            paramList.add(moType);
        }
        if (!("".equals(moName))) {
            paramList.add(moName);
        }
        JSONObject result = new JSONObject();

        result.put("moList", queryForMapList(sql, paramList.toArray()));
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getMeasureField(JSONObject dict) throws BaseAppException {
        String moCode = CommonUtil.getStrFromMap(dict, "MO_CODE", "");
        String fieldType = CommonUtil.getStrFromMap(dict, "FIELD_TYPE", "");
        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String moCodes = CommonUtil.getStrFromMap(dict, "MO_CODE_S", "");
        String fieldName = CommonUtil.getStrFromMap(dict, "FIELD_NAME", "");
        String fieldCode = CommonUtil.getStrFromMap(dict, "FIELD_CODE", "");
        String fieldCodes = CommonUtil.getStrFromMap(dict, "FIELD_CODES", "");
        if (!("".equals(moCodes))) {
            moCodes = "'" + moCodes.replaceAll("[',']", "','") + "'";
        }
        if (!("".equals(fieldCodes))) {
            fieldCodes = "'" + fieldCodes.replaceAll("[',']", "','") + "'";
        }

        String sql = "SELECT a.MO_CODE,        \n" + "       a.FIELD_NAME,    \n" + "       a.FIELD_CODE,    \n"
            + "       date_format(a.eff_time, '%Y-%m-%d') AS EFF_TIME,    \n" + "       a.FIELD_TYPE,    \n"
            + "       a.DATA_TYPE,    \n" + "       a.VAFIELD,        \n" + "       a.FIELD_NO,    \n"
            + "       a.COMMENTS,    \n" + "       b.MO_NAME,        \n" + "       b.EMS_TYPE_REL_ID,    \n"
            + "       b.EMS_VER_CODE        \n" + "  FROM PM_MO_DETAIL a,PM_MO b    \n"
            + " WHERE a.MO_CODE = b.MO_CODE    \n"
            + PMTool.ternaryExpression("".equals(emsRela), "", " AND b.EMS_TYPE_REL_ID = ?   \n")
            + PMTool.ternaryExpression("".equals(verCode), "", " AND b.EMS_VER_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(moCode), "", " AND a.MO_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(fieldType), "", " AND a.FIELD_TYPE = ?   \n")
            + PMTool.ternaryExpression("".equals(moCodes), "", " AND a.MO_CODE IN (" + moCodes + ")   \n")
            + PMTool.ternaryExpression("".equals(fieldName), "",
                " AND UPPER(a.field_name) LIKE UPPER(concat_ws('','%',?,'%'))   \n")
            + PMTool.ternaryExpression("".equals(fieldCode), "", " AND a.FIELD_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(fieldCodes), "", " AND a.FIELD_CODE IN (" + fieldCodes + ")   \n")
            + " ORDER BY b.MO_NAME, a.FIELD_NO ASC    \n";

        List<String> paramList = new ArrayList<String>();

        if (!("".equals(emsRela))) {
            paramList.add(emsRela);
        }
        if (!("".equals(verCode))) {
            paramList.add(verCode);
        }
        if (!("".equals(moCode))) {
            paramList.add(moCode);
        }
        if (!("".equals(fieldType))) {
            paramList.add(fieldType);
        }
        if (!("".equals(fieldName))) {
            paramList.add(fieldName);
        }
        if (!("".equals(fieldCode))) {
            paramList.add(fieldCode);
        }

        JSONObject result = new JSONObject();
        try {
            result.put("moField", queryForMapList(sql, paramList.toArray()));
        }
        catch (Exception e) {
            throw new BaseAppException("moField", "sql error" + e.getMessage());
        }
        
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject addMeasureInfo(JSONObject dict) throws BaseAppException {

        String sql = "select * from pm_mo where mo_code = ?";

        int count = queryForCount(sql, CommonUtil.getStrFromMapWithExc(dict, "MO_CODE"));

        if (count > 0) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_CODE_EXISTS, "CODE已经存在.", dict.getString("MO_CODE"));
        }

        String fileNameRule = "";
        String procRule = "";
        JSONObject fileNamePlugin = dict.getJSONObject("fileNamePlugin");
        if (fileNamePlugin.size() > 0) {
            ((UtilService) SpringContext.getBean("utilServ")).operPluginParam(fileNamePlugin);
            fileNameRule = CommonUtil.getStrFromMap(fileNamePlugin, "PLUGIN_NO", "");
            dict.put("FILENAME_RULE", fileNameRule);
            dict.put("fileNamePlugin", fileNamePlugin);
        }
        JSONObject procRulePlugin = dict.getJSONObject("procRulePlugin");
        if (procRulePlugin.size() > 0) {
            ((UtilService) SpringContext.getBean("utilServ")).operPluginParam(procRulePlugin);
            procRule = CommonUtil.getStrFromMap(procRulePlugin, "PLUGIN_NO", "");
            dict.put("PROC_RULE", procRule);
            dict.put("procRulePlugin", procRulePlugin);
        }

        sql = "insert into pm_mo \n" + " (ems_type_rel_id, \n" + " ems_ver_code, \n" + " mo_name, \n" + " mo_code, \n"
            + " ems_code, \n" + " eff_time, \n" + " exp_time, \n" + " mo_type, \n" + " filename_rule, \n"
            + " proc_rule, \n" + " sepa_str, \n" + " is_col_header, \n" + " is_quot, \n" + " comments, \n"
            + " mo_name_desc, \n" + " bp_id) \n" + "values \n" + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \n";

        List<Object> moParamList = new ArrayList<Object>();

        moParamList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        moParamList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_VER_CODE"));
        moParamList.add(CommonUtil.getStrFromMapWithExc(dict, "MO_NAME"));
        moParamList.add(CommonUtil.getStrFromMapWithExc(dict, "MO_CODE"));
        moParamList.add(dict.getString("EMS_CODE"));
        moParamList.add(dict.getDate("EFF_TIME"));
        moParamList.add(dict.getDate("EXP_TIME"));
        moParamList.add(dict.getString("MO_TYPE"));
        moParamList.add(fileNameRule);
        moParamList.add(procRule);
        moParamList.add(dict.getString("SEPA_STR"));
        moParamList.add(dict.getString("IS_COL_HEADER"));
        moParamList.add(dict.getString("IS_QUOT"));
        moParamList.add(dict.getString("COMMENTS"));
        moParamList.add(dict.getString("MO_NAME_DESC"));
        moParamList.add(dict.getString("BP_ID"));

        update(sql, moParamList.toArray());

        this.batchAddField(dict);

        return dict;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject editMeasureInfo(JSONObject dict) throws BaseAppException {

        String fileNameRule = "";
        String procRule = "";
        JSONObject fileNamePlugin = dict.getJSONObject("fileNamePlugin");
        if (fileNamePlugin.size() > 0) {
            ((UtilService) SpringContext.getBean("utilServ")).operPluginParam(fileNamePlugin);
            fileNameRule = CommonUtil.getStrFromMap(fileNamePlugin, "PLUGIN_NO", "");
            dict.put("FILENAME_RULE", fileNameRule);
            dict.put("fileNamePlugin", fileNamePlugin);
        }

        JSONObject procRulePlugin = dict.getJSONObject("procRulePlugin");

        if (procRulePlugin.size() > 0) {
            ((UtilService) SpringContext.getBean("utilServ")).operPluginParam(procRulePlugin);
            procRule = CommonUtil.getStrFromMap(procRulePlugin, "PLUGIN_NO", "");
            dict.put("PROC_RULE", procRule);
            dict.put("procRulePlugin", procRulePlugin);
        }

        String sql = "update pm_mo \n" + " set ems_type_rel_id = ?, \n" + " ems_ver_code = ?, \n" + " mo_name = ?, \n"
            + " ems_code = ?, \n" + " eff_time = ?, \n" + " exp_time = ?, \n" + " mo_type = ?, \n"
            + " filename_rule = ?, \n" + " proc_rule = ?, \n" + " sepa_str = ?, \n" + " is_col_header = ?, \n"
            + " is_quot = ?, \n" + " comments = ?, \n" + " mo_name_desc = ?, \n" + " bp_id = ? \n"
            + " where mo_code = ? \n";
        List<Object> params = new ArrayList<Object>();

        params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_VER_CODE"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "MO_NAME"));
        params.add(dict.getString("EMS_CODE"));
        params.add(dict.getDate("EFF_TIME"));
        params.add(dict.getDate("EXP_TIME"));
        params.add(dict.getString("MO_TYPE"));
        params.add(fileNameRule);
        params.add(procRule);
        params.add(dict.getString("SEPA_STR"));
        params.add(dict.getString("IS_COL_HEADER"));
        params.add(dict.getString("IS_QUOT"));
        params.add(dict.getString("COMMENTS"));
        params.add(dict.getString("MO_NAME_DESC"));
        params.add(dict.getString("BP_ID"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "MO_CODE"));

        update(sql, params.toArray());

        this.batchAddField(dict);
        return dict;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject delMeasureInfo(JSONObject dict) throws BaseAppException {

        JSONObject fileNamePlugin = dict.getJSONObject("fileNamePlugin");

        if (fileNamePlugin.size() > 0) {
            ((UtilService) SpringContext.getBean("utilServ")).operPluginParam(fileNamePlugin);
        }
        JSONObject procRulePlugin = dict.getJSONObject("procRulePlugin");

        if (procRulePlugin.size() > 0) {
            ((UtilService) SpringContext.getBean("utilServ")).operPluginParam(procRulePlugin);

        }
        String sql = "delete from pm_mo_detail where mo_code = ? \n";
        String moCode = CommonUtil.getStrFromMapWithExc(dict, "MO_CODE");
        update(sql, moCode);

        sql = "delete from pm_mo where mo_code = ? \n";
        update(sql, moCode);
        
        return dict;
        
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    private JSONObject batchAddField(JSONObject dict) throws BaseAppException {

        String moCode = CommonUtil.getStrFromMapWithExc(dict, "MO_CODE");
        String sql = "delete from pm_mo_detail where mo_code = ? \n";
        update(sql, moCode);

        sql = "insert into pm_mo_detail \n"
            + "(mo_code,field_name,field_code,eff_time,field_type,data_type,vafield,field_no,comments) \n" + "values \n"
            + " (?, ?, ?, ?, ?, ?, ?, ?, ?) \n";
        JSONArray moFieldList = dict.getJSONArray("moField");
        if (null != moFieldList) {
            int count = moFieldList.size();
            for (int i = 0; i < count; i++) {
                JSONObject fieldDict = moFieldList.getJSONObject(i);
                String effTime = CommonUtil.getStrFromMap(fieldDict, "EFF_TIME", "");
                if ("&#160;".equals(effTime)) {
                    effTime = "";
                }
                fieldDict.put("EFF_TIME", effTime.replaceAll("['/']", "-"));
                List<Object> fieldParam = new ArrayList<Object>();

                fieldParam.add(moCode);
                fieldParam.add(CommonUtil.getStrFromMapWithExc(fieldDict, "FIELD_NAME"));
                fieldParam.add(CommonUtil.getStrFromMapWithExc(fieldDict, "FIELD_CODE"));
                fieldParam.add(fieldDict.getDate("EFF_TIME"));
                fieldParam.add(fieldDict.getString("FIELD_TYPE"));
                fieldParam.add(fieldDict.getString("DATA_TYPE"));
                fieldParam.add(fieldDict.getString("VAFIELD"));
                fieldParam.add(i);
                fieldParam.add(fieldDict.getString("COMMENTS"));

                update(sql, fieldParam.toArray());
            }
        }

        return null;
    }
}
