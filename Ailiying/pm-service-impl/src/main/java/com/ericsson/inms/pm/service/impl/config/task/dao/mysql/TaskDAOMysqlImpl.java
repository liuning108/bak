package com.ericsson.inms.pm.service.impl.config.task.dao.mysql;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.core.util.DateUtil;
import com.ericsson.inms.pm.service.impl.config.task.dao.TaskDAO;
import com.ericsson.inms.pm.service.impl.meta.constant.Constant;
import com.ericsson.inms.pm.service.impl.util.bll.UtilManager;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;

/**
 * 配置管理-任务管理相关的Mysql DAO操作实现类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-26 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.dao.mysql <br>
 */
public class TaskDAOMysqlImpl extends TaskDAO {

    @Override
    public JSONObject getTaskInfo(JSONObject dict) throws BaseAppException {
        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String taskType = CommonUtil.getStrFromMap(dict, "TASK_TYPE", "");
        String taskName = CommonUtil.getStrFromMap(dict, "TASK_NAME", "");
        String exTaskType = CommonUtil.getStrFromMap(dict, "EX_TASK_TYPE", "");
        if (!StringUtils.isEmpty(exTaskType)) {
            exTaskType = "'" + exTaskType.replaceAll("[',']", "','") + "'";
        }
        String sql = "SELECT a.TASK_NO, \n" + "       a.TASK_NAME, \n" + "       a.SEQ,            \n"
            + "       a.EMS_CODE,    \n" + "       a.EMS_TYPE_REL_ID,    \n" + "       a.EMS_VER_CODE,    \n"
            + "       a.TASK_TYPE,    \n" + "       a.TASK_DESC,    \n" + "       a.STATE,        \n"
            + "       a.OPER_USER,    \n" + "       (SELECT u.USER_NAME    \n" + "          FROM BFM_USER u        \n"
            + "         WHERE u.USER_ID = a.OPER_USER        \n" + "           limit 1) AS OPER_USER_NAME,    \n"
            + "       date_format(a.oper_date, '%Y-%m-%d %H:%i:%S') AS OPER_DATE,    \n" + "       a.BP_ID        \n"
            + "  FROM PM_TASK_INFO a    \n" + " WHERE 1 = 1            \n"
            + PMTool.ternaryExpression(StringUtils.isEmpty(emsRela), "", " AND a.EMS_TYPE_REL_ID = ?    \n")
            + PMTool.ternaryExpression(StringUtils.isEmpty(verCode), "", " AND a.EMS_VER_CODE = ?    \n")
            + PMTool.ternaryExpression(StringUtils.isEmpty(taskType), "", " AND a.TASK_TYPE = ?    \n")
            + PMTool.ternaryExpression(StringUtils.isEmpty(taskName), "",
                " AND UPPER(a.TASK_NAME) LIKE concat_ws('', '%', UPPER(?), '%') \n")
            + PMTool.ternaryExpression(StringUtils.isEmpty(exTaskType), "",
                " AND a.TASK_TYPE NOT IN ( " + exTaskType + " )   \n")
            + " ORDER BY a.TASK_NAME    \n";

        List<String> params = new ArrayList<String>();
        if (!(StringUtils.isEmpty(emsRela))) {
            params.add(emsRela);
        }
        if (!(StringUtils.isEmpty(verCode))) {
            params.add(verCode);
        }
        if (!(StringUtils.isEmpty(taskType))) {
            params.add(taskType);
        }
        if (!(StringUtils.isEmpty(taskName))) {
            params.add(taskName);
        }
        JSONObject result = new JSONObject();

        result.put("taskList", queryForMapList(sql, params.toArray()));
        return result;
    }

    @Override
    public JSONObject getTaskDetail(JSONObject dict) throws BaseAppException {
        String type = CommonUtil.getStrFromMap(dict, "TYPE", "");
        String taskNo = CommonUtil.getStrFromMapWithExc(dict, "TASK_NO");

        List<Object> params = new ArrayList<Object>();
        params.add(taskNo);

        String sql = "";
        if (StringUtils.isEmpty(type) || "schdule".equals(type)) {
            sql = "SELECT a.TASK_NO,    \n" + "       a.SCHDULE_NO,    \n" + "       a.SEQ,        \n"
                + "       a.SCHDULE_TYPE,        \n" + "       a.CYCLE_SCHDULE_TYPE,    \n"
                + "       date_format(a.eff_date, '%Y-%m-%d') AS EFF_DATE,    \n"
                + "       date_format(a.exp_date, '%Y-%m-%d') AS EXP_DATE,    \n"
                + "       date_format(a.trigger_date, '%Y-%m-%d') AS TRIGGER_DATE,    \n"
                + "       a.TRIGGER_TIME,    \n" + "       a.INTERVAL_PERIOD,    \n" + "       a.MW,    \n"
                + "       a.CRON    \n" + "  FROM PM_TASK_SCHDULE a    \n" + " WHERE a.SEQ = 0    \n"
                + "   AND a.TASK_NO = ?    \n";

            dict.put("schduleList", queryForMapList(sql, params.toArray()));
        }

        if (StringUtils.isEmpty(type) || "param".equals(type)) {
            sql = "SELECT a.TASK_NO,    \n" + "       a.SEQ,        \n" + "       a.PARAM_SEQ,    \n"
                + "       a.PARAM_NAME,    \n" + "       a.PARAM_CODE,    \n" + "       a.PARAM_VALUE,    \n"
                + "       a.OPER_USER,    \n"
                + "       date_format(a.oper_date, '%Y-%m-%d %H:%i:%S') as OPER_DATE    \n"
                + "  FROM PM_TASK_PARAM_INFO a    \n" + " WHERE a.SEQ = 0    \n" + "   and a.TASK_NO = ?    \n"
                + " ORDER BY a.PARAM_SEQ    \n";
            dict.put("paramList", queryForMapList(sql, params.toArray()));

            sql = "SELECT a.TASK_NO,             \n" + "       a.SEQ,                 \n"
                + "       a.PARAM_SEQ,           \n" + "       a.PARAM_CODE,          \n"
                + "       a.ATTR_TYPE,           \n" + "       a.ATTR_CODE,           \n"
                + "       a.ATTR_SEQ,            \n" + "       a.ATTR_VALUE           \n"
                + "  FROM PM_TASK_PARAM_ATTR a   \n" + " WHERE a.SEQ = 0              \n"
                + "   AND a.TASK_NO = ?          \n" + " ORDER BY a.PARAM_SEQ, a.ATTR_SEQ    \n";
            dict.put("paramAttrList", queryForMapList(sql, params.toArray()));

            sql = "SELECT A.TASK_NO,    \n" + "       A.TASK_STEP_ID,    \n" + "       A.STEP_NO,    \n"
                + "       A.TASK_STEP_NAME,    \n" + "       A.SEQ,    \n" + "       A.STEP_SEQ,    \n"
                + "       A.TASK_STEP_SEQ    \n" + "  FROM PM_TASK_STEP A    \n" + " WHERE A.SEQ = 0    \n"
                + "   AND A.TASK_NO = ?    \n" + " ORDER BY A.STEP_SEQ, A.TASK_STEP_SEQ    \n";
            dict.put("stepList", queryForMapList(sql, params.toArray()));

            sql = "SELECT A.TASK_STEP_ID,    \n" + "       A.TASK_NO,    \n" + "       A.STEP_NO,    \n"
                + "       A.SEQ,        \n" + "       A.GROUP_NO,    \n" + "       A.GROUP_SEQ,    \n"
                + "       A.PARAM_SEQ,    \n" + "       A.PARAM_CODE,    \n" + "       A.PARAM_VALUE,    \n"
                + "       A.PARAM_VALUE1,\n" + "       A.PARAM_VALUE2,\n" + "       A.PARAM_VALUE3,\n"
                + "       A.PARAM_VALUE4,\n" + "       A.PARAM_VALUE5    \n" + "  FROM PM_TASK_STEP_PARAM A    \n"
                + " WHERE A.SEQ = 0        \n" + "   AND A.TASK_NO = ?    \n"
                + " ORDER BY A.STEP_NO,A.GROUP_NO,A.GROUP_SEQ,A.PARAM_SEQ \n";
            dict.put("stepParamList", queryForMapList(sql, params.toArray()));

            String pluginType = CommonUtil.getStrFromMap(dict, "PLUGIN_TYPE", "");
            String paramCode = CommonUtil.getStrFromMap(dict, "PARAM_CODE", "");
            if (!StringUtils.isEmpty(pluginType)) {
                pluginType = "'" + pluginType.replaceAll("[',']", "','") + "'";

                if (!StringUtils.isEmpty(paramCode)) {
                    paramCode = "'" + paramCode.replaceAll("[',']", "','") + "'";
                }

                String conSql = " AND a.PLUGIN IN "
                    + "(SELECT concat_ws('',PARAM_VALUE, PARAM_VALUE1, PARAM_VALUE2, PARAM_VALUE3, PARAM_VALUE4, PARAM_VALUE5)"
                    + " AS PARAM_VALUE     \n" + "                 FROM PM_TASK_STEP_PARAM           \n"
                    + "                WHERE TASK_NO = '" + taskNo + "'   \n"
                    + PMTool.ternaryExpression(StringUtils.isEmpty(paramCode), "",
                        " AND PARAM_CODE IN (" + paramCode + ") \n")
                    + " UNION ALL " + " SELECT PARAM_VALUE FROM PM_TASK_PARAM_INFO        \n"
                    + "                WHERE TASK_NO = '" + taskNo + "'   \n"
                    + PMTool.ternaryExpression(StringUtils.isEmpty(paramCode), "",
                        " AND PARAM_CODE IN (" + paramCode + ") \n")
                    + "    )      \n";

                sql = "SELECT A.PLUGIN_NO,          \n" + "       A.SEQ,                \n"
                    + "       A.PLUGIN_TYPE,        \n" + "       A.PLUGIN_CLASSPATH,   \n"
                    + "       A.PLUGIN_NAME,        \n" + "       A.PLUGIN_SPEC_NO,     \n"
                    + "       A.BP_ID               \n" + "  FROM PM_PLUGINSERV A       \n"
                    + " WHERE A.SEQ = 0             \n" + "   AND A.PLUGIN_TYPE IN (" + pluginType + ")     \n"
                    + conSql;

                dict.put("pluginList", queryForMapList(sql, new Object[0]));

                dict.put("CONDITION", conSql);
                dict.put("pluginParam", SpringContext.getBean(UtilManager.class).getPluginParam(dict));
                dict.remove("CONDITION");
            }
        }
        return dict;
    }

    @Override
    public JSONObject addTaskInfo(JSONObject dict) throws BaseAppException {

        String codePrefix = (CommonUtil.getStrFromMap(dict, "CODE_PREFIX", "")) + "PMS";

        StringBuffer seq = new StringBuffer(CommonUtil.getSeq("PM_TASK_SEQ"));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String taskNo = codePrefix + "_"
            + DateUtil.formatString(new Date(), com.ztesoft.zsmart.core.util.DateUtil.DateConstants.DATETIME_FORMAT_2)
            + "_" + seq;

        String sql = "insert into pm_task_info    \n" + "  (task_no,    \n" + "   task_name,    \n"
            + "   seq,        \n" + "   ems_code,    \n" + "   ems_type_rel_id,    \n" + "   ems_ver_code,        \n"
            + "   task_type,    \n" + "   task_desc,    \n" + "   state,        \n" + "   oper_user,    \n"
            + "   oper_date,    \n" + "   bp_id)    \n" + "values    \n"
            + "  (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, sysdate(), ?)    \n";
        List<Object> params = new ArrayList<Object>();
        params.add(taskNo);
        params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_NAME"));
        params.add(dict.getString("EMS_CODE"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_VER_CODE"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_TYPE"));
        params.add(dict.getString("TASK_DESC"));
        params.add(dict.getString("STATE"));
        params.add(CommonUtil.getCurrentUserId());
        params.add(dict.getString("BP_ID"));

        update(sql, params.toArray());

        dict.put("TASK_NO", taskNo);
        dict.put("OPER_USER_NAME", CommonUtil.getCurrentUserName());
        sql = "select date_format(oper_date, '%Y-%m-%d %H:%i:%S') as OPER_DATE " + "from pm_task_info where task_no = '"
            + taskNo + "'";
        List<Map<String, Object>> operDateList = this.queryForMapList(sql);
        if (CollectionUtils.isNotEmpty(operDateList)) {
            dict.put("OPER_DATE", operDateList.get(0).get("OPER_DATE"));
        }

        this.batchAddDetail(dict);

        this.redoTaskInst(taskNo);

        return dict;
    }

    @Override
    public JSONObject editTaskInfo(JSONObject dict) throws BaseAppException {
        String sql = "";
        List<Object> params = new ArrayList<Object>();
        String isOnlyTaskDate = CommonUtil.getStrFromMap(dict, "isOnlyTaskDate", "");
        if ("1".equals(isOnlyTaskDate)) {
            sql = "update pm_task_info            \n" + "   set oper_user       = ?,    \n"
                + "       oper_date       = sysdate(),    \n" + "       bp_id           = ?    \n"
                + " where task_no = ?    \n";

            params.add(CommonUtil.getCurrentUserId());
            params.add(dict.getString("BP_ID"));
            params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_NO"));

            update(sql, params.toArray());
        }
        else {
            sql = "update pm_task_info            \n" + "   set task_name       = ?,    \n"
                + "       seq             = 0,    \n" + "       ems_code        = ?,    \n"
                + "       ems_type_rel_id = ?,    \n" + "       ems_ver_code    = ?,    \n"
                + "       task_type       = ?,    \n" + "       task_desc       = ?,    \n"
                + "       state           = ?,    \n" + "       oper_user       = ?,    \n"
                + "       oper_date       = sysdate(),    \n" + "       bp_id           = ?    \n"
                + " where task_no = ?    \n";
            params.clear();
            params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_NAME"));
            params.add(dict.getString("EMS_CODE"));
            params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
            params.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_VER_CODE"));
            params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_TYPE"));
            params.add(dict.getString("TASK_DESC"));
            params.add(dict.getString("STATE"));
            params.add(CommonUtil.getCurrentUserId());
            params.add(dict.getString("BP_ID"));
            params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_NO"));

            update(sql, params.toArray());

            this.batchAddDetail(dict);

            this.redoTaskInst(CommonUtil.getStrFromMapWithExc(dict, "TASK_NO"));
        }

        return dict;
    }

    @Override
    public JSONObject delTaskInfo(JSONObject dict) throws BaseAppException {
        List<Object> params = new ArrayList<Object>();
        params.add(CommonUtil.getStrFromMapWithExc(dict, "TASK_NO"));

        String sql = "delete from pm_task_schdule where task_no = ?    \n";
        update(sql, params.toArray());

        this.delParamPlugin(dict);
        sql = "delete from pm_task_param_info where task_no = ?    \n";
        update(sql, params.toArray());

        this.delStepParamPlugin(dict);

        sql = "delete from pm_task_step_param where task_no = ?    \n";
        update(sql, params.toArray());

        sql = "delete from pm_task_step where task_no = ?    \n";
        update(sql, params.toArray());

        sql = "delete from pm_task_info where task_no = ? \n";
        update(sql, params.toArray());

        this.redoTaskInst(CommonUtil.getStrFromMapWithExc(dict, "TASK_NO"));

        JSONObject result = new JSONObject();
        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);

        return result;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict JSONObject
     * @throws BaseAppException <br>
     */
    public void batchAddDetail(JSONObject dict) throws BaseAppException {
        String taskNo = CommonUtil.getStrFromMapWithExc(dict, "TASK_NO");

        List<Object> params = new ArrayList<Object>();

        params.add(taskNo);

        String sql = "delete from pm_task_schdule where task_no = ?    \n";
        update(sql, params.toArray());

        this.delParamPlugin(dict);

        sql = "delete from pm_task_param_attr where task_no = ?    \n";
        update(sql, params.toArray());

        sql = "delete from pm_task_param_info where task_no = ?    \n";
        update(sql, params.toArray());

        this.delStepParamPlugin(dict);

        sql = "delete from pm_task_step_param where task_no = ?    \n";
        update(sql, params.toArray());

        sql = "delete from pm_task_step where task_no = ?    \n";
        update(sql, params.toArray());

        sql = "insert into pm_task_schdule    \n" + "  (task_no,        \n" + "   schdule_no,    \n"
            + "   seq,            \n" + "   schdule_type,    \n" + "   cycle_schdule_type,\n" + "   eff_date,        \n"
            + "   exp_date,        \n" + "   trigger_date,    \n" + "   trigger_time,    \n" + "   interval_period, \n"
            + "   mw,    \n" + "   cron)    \n" + "values    \n" + "  (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";

        JSONArray schduleList = dict.getJSONArray("schduleList");
        if (null != schduleList) {
            int schduleListSize = schduleList.size();
            for (int i = 0; i < schduleListSize; i++) {
                JSONObject schduleDict = schduleList.getJSONObject(i);
                String schduleType = schduleDict.getString("SCHDULE_TYPE");
                Date effDate = schduleDict.getDate("EFF_DATE");
                Date expDate = schduleDict.getDate("EXP_DATE");
                Date trigDate = schduleDict.getDate("TRIGGER_DATE");
                if (schduleType == null || StringUtils.isEmpty(schduleType)) {
                    schduleType = "00";
                }
                List<Object> sParams = new ArrayList<Object>();
                sParams.add(taskNo);
                sParams.add(CommonUtil.getStrFromMapWithExc(schduleDict, "CYCLE_SCHDULE_TYPE"));
                sParams.add(schduleType);
                sParams.add(CommonUtil.getStrFromMapWithExc(schduleDict, "CYCLE_SCHDULE_TYPE"));
                sParams.add(PMTool.ternaryExpression((effDate == null), trigDate, effDate));
                sParams.add(PMTool.ternaryExpression((expDate == null), trigDate, expDate));
                sParams.add(trigDate);
                sParams.add(schduleDict.getString("TRIGGER_TIME"));
                sParams.add(schduleDict.getString("INTERVAL_PERIOD"));
                sParams.add(schduleDict.getString("MW"));
                sParams.add(schduleDict.getString("CRON"));
                update(sql, sParams.toArray());
            }
        }

        sql = "insert into pm_task_param_info    \n" + "  (task_no,    \n" + "   seq,        \n" + "   param_seq,  \n"
            + "   param_name, \n" + "   param_code, \n" + "   param_value,   \n" + "   oper_user,     \n"
            + "   oper_date)     \n" + "values    \n" + "  (?, 0, ?, ?, ?, ?, ?, sysdate())    \n";

        JSONArray paramList = dict.getJSONArray("paramList");
        if (null != paramList) {
            int paramListSize = paramList.size();
            for (int i = 0; i < paramListSize; i++) {
                JSONObject paramDict = paramList.getJSONObject(i);
                if (null != paramDict.get("plugin")) {
                    JSONObject pluginDict = paramDict.getJSONObject("plugin");
                    pluginDict.put("OPER_TYPE", "add");

                    SpringContext.getBean(UtilManager.class).operPluginParam(pluginDict);
                    String paramValue = CommonUtil.getStrFromMap(pluginDict, "PLUGIN_NO", "");
                    paramDict.put("PARAM_VALUE", paramValue);
                }

                List<Object> param = new ArrayList<Object>();
                param.add(taskNo);
                param.add(i);
                param.add(paramDict.getString("PARAM_NAME"));
                param.add(CommonUtil.getStrFromMapWithExc(paramDict, "PARAM_CODE"));
                param.add(CommonUtil.getStrFromMapWithExc(paramDict, "PARAM_VALUE"));
                param.add(CommonUtil.getCurrentUserId());
                update(sql, param.toArray());

                JSONArray attrParamArr = paramDict.getJSONArray("attrParam");
                if (null != attrParamArr) {
                    int attrParamSize = attrParamArr.size();
                    if (attrParamSize > 0) {
                        String attrSql = "insert into pm_task_param_attr   \n" + "  (task_no,                      \n"
                            + "   seq,                          \n" + "   param_seq,                    \n"
                            + "   param_code,                   \n" + "   attr_type,                    \n"
                            + "   attr_code,                    \n" + "   attr_seq,                     \n"
                            + "   attr_value)                   \n" + "values                           \n"
                            + "  (?, 0, ?, ?, ?, ?, ?, ?)       \n";
                        for (int t = 0; t < attrParamSize; t++) {
                            JSONObject attrDict = attrParamArr.getJSONObject(t);

                            List<Object> attrParam = new ArrayList<Object>();
                            attrParam.add(taskNo);
                            attrParam.add(i);
                            attrParam.add(CommonUtil.getStrFromMapWithExc(paramDict, "PARAM_CODE"));
                            attrParam.add(CommonUtil.getStrFromMapWithExc(attrDict, "ATTR_TYPE"));
                            attrParam.add(CommonUtil.getStrFromMapWithExc(attrDict, "ATTR_CODE"));
                            attrParam.add(t);
                            attrParam.add(attrDict.getString("ATTR_VALUE"));
                            update(attrSql, attrParam.toArray());
                        }
                    }
                }
            }
        }

        String codePrefix = (CommonUtil.getStrFromMap(dict, "CODE_PREFIX", "")) + "PMS";
        sql = "insert into pm_task_step    \n" + "  (task_no,        \n" + "   task_step_id,   \n"
            + "   step_no,        \n" + "   task_step_name, \n" + "   seq,            \n" + "   step_seq,       \n"
            + "   task_step_seq)  \n" + "values    \n" + "  (?, ?, ?, ?, 0, ?, ?)    \n";

        JSONArray stepList = dict.getJSONArray("stepList");
        Map<String, String> stepMap = new HashMap<String, String>();
        if (null != stepList) {
            int stepCont = stepList.size();
            for (int i = 0; i < stepCont; i++) {
                JSONObject stepDict = stepList.getJSONObject(i);
                String stepId = CommonUtil.getStrFromMapWithExc(stepDict, "TASK_STEP_ID");

                if (stepId.length() >= 16 && "________".equals(stepId.substring(0, 8))
                    && "________".equals(stepId.substring(stepId.length() - 8, stepId.length()))) { // 前后各8位下划线的step_id是前台临时生成id
                    StringBuffer seq = new StringBuffer(CommonUtil.getSeq("PM_TASK_SEQ"));
                    while (seq.length() < 6) {
                        seq.insert(0, "0");
                    }
                    stepMap.put(stepId, (codePrefix + "_"
                        + DateUtil.formatString(new Date(), DateUtil.DateConstants.DATETIME_FORMAT_2) + "_" + seq));
                }

                List<Object> param = new ArrayList<Object>();
                param.add(taskNo);

                param.add(PMTool.ternaryExpression((stepMap.get(stepId) != null), stepMap.get(stepId), stepId));
                param.add(CommonUtil.getStrFromMapWithExc(stepDict, "STEP_NO"));
                param.add(stepDict.getString("TASK_STEP_NAME"));
                param.add(CommonUtil.getStrFromMapWithExc(stepDict, "STEP_SEQ"));
                param.add(CommonUtil.getStrFromMapWithExc(stepDict, "TASK_STEP_SEQ"));
                update(sql, param.toArray());
            }
        }

        sql = "insert into pm_task_step_param    \n" + "  (task_step_id,    \n" + "   task_no,    \n"
            + "   step_no,    \n" + "   seq,    \n" + "   group_no,    \n" + "   group_seq,    \n"
            + "   param_seq,    \n" + "   param_code,    \n" + "   param_value,    \n" + "   param_value1,    \n"
            + "   param_value2,    \n" + "   param_value3,    \n" + "   param_value4,    \n" + "   param_value5)    \n"
            + "values    \n" + "  (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        int split = 2000;

        JSONArray stepParamList = dict.getJSONArray("stepParamList");
        if (null != stepParamList) {
            int stepParamListSize = stepParamList.size();
            for (int i = 0; i < stepParamListSize; i++) {
                JSONObject stepParamDict = stepParamList.getJSONObject(i);

                String stepId = CommonUtil.getStrFromMapWithExc(stepParamDict, "TASK_STEP_ID");
                String paramValue = CommonUtil.getStrFromMap(stepParamDict, "PARAM_VALUE", "");
                JSONObject pluginDict = stepParamDict.getJSONObject("plugin");

                if (null != pluginDict) {
                    pluginDict.put("OPER_TYPE", "add");
                    SpringContext.getBean(UtilManager.class).operPluginParam(pluginDict);
                    paramValue = CommonUtil.getStrFromMap(pluginDict, "PLUGIN_NO", "");
                }

                List<Object> param = new ArrayList<Object>();

                param.add(PMTool.ternaryExpression((stepMap.get(stepId) != null), stepMap.get(stepId), stepId));
                param.add(taskNo);
                param.add(CommonUtil.getStrFromMapWithExc(stepParamDict, "STEP_NO"));
                param.add(stepParamDict.getString("GROUP_NO"));
                param.add(stepParamDict.getString("GROUP_SEQ"));
                param.add(i);
                param.add(CommonUtil.getStrFromMapWithExc(stepParamDict, "PARAM_CODE"));

                int sl = paramValue.length();
                int no = (int) Math.ceil((sl * 100) / (split * 100.0));
                for (int k = 0; k < no; k++) {

                    param.add(paramValue.substring(k * split,
                        PMTool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
                }
                for (int s = 0; s < 6 - no; s++) {
                    param.add("");
                }
                update(sql, param.toArray());
            }

        }

    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject delParamPlugin(JSONObject dict) throws BaseAppException {
        String taskNo = CommonUtil.getStrFromMap(dict, "TASK_NO", "");
        String pluginType = CommonUtil.getStrFromMap(dict, "PLUGIN_TYPE", "");
        if (!StringUtils.isEmpty(pluginType)) {
            List<Object> pluginParam = new ArrayList<Object>();
            // pluginParam.set("", plugintype);
            pluginType = "'" + pluginType.replaceAll("[',']", "','") + "'";
            pluginParam.add(taskNo);
            String paramCode = CommonUtil.getStrFromMap(dict, "PARAM_CODE", "");
            if (!StringUtils.isEmpty(paramCode)) {
                paramCode = "'" + paramCode.replaceAll("[',']", "','") + "'";
            }
            String pluginSql = "delete from pm_pluginserv_param where plugin_type in (" + pluginType + ")    \n"
                + " and plugin_no in (select param_value     \n" + "                 from pm_task_param_info    \n"
                + "                where task_no = ?           \n" + PMTool
                    .ternaryExpression(StringUtils.isEmpty(paramCode), "", " and param_code in (" + paramCode + ") \n")
                + "                  )           \n";
            update(pluginSql, pluginParam.toArray());

            pluginSql = "delete from pm_pluginserv where plugin_type in (" + pluginType + ")    \n"
                + " and plugin_no in (select param_value    \n" + "                 from pm_task_param_info   \n"
                + "                where task_no = ?          \n" + PMTool
                    .ternaryExpression(StringUtils.isEmpty(paramCode), "", " and param_code in (" + paramCode + ") \n")
                + "                  )           \n";
            update(pluginSql, pluginParam.toArray());
        }

        return dict;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject delStepParamPlugin(JSONObject dict) throws BaseAppException {
        String taskNo = CommonUtil.getStrFromMap(dict, "TASK_NO", "");
        String pluginType = CommonUtil.getStrFromMap(dict, "PLUGIN_TYPE", "");
        if (!StringUtils.isEmpty(pluginType)) {
            List<Object> pluginParam = new ArrayList<Object>();
            // pluginParam.set("", plugintype);
            pluginType = "'" + pluginType.replaceAll("[',']", "','") + "'";
            pluginParam.add(taskNo);
            String paramCode = CommonUtil.getStrFromMap(dict, "PARAM_CODE", "");
            if (!StringUtils.isEmpty(paramCode)) {
                paramCode = "'" + paramCode.replaceAll("[',']", "','") + "'";
            }
            String pluginSql = "delete from pm_pluginserv_param where plugin_type in (" + pluginType + ")   \n"
                + " and plugin_no in "
                + "(select concat_ws('', param_value, param_value1, param_value2, param_value3, param_value4, param_value5) "
                + "     as param_value      \n" + "                 from pm_task_step_param                   \n"
                + "                where task_no = ?           \n" + PMTool
                    .ternaryExpression(StringUtils.isEmpty(paramCode), "", " and param_code in (" + paramCode + ") \n")
                + "                  )           \n";
            update(pluginSql, pluginParam.toArray());

            pluginSql = "delete from pm_pluginserv where plugin_type in (" + pluginType + ")                \n"
                + " and plugin_no in "
                + "(select concat_ws('', param_value, param_value1, param_value2, param_value3, param_value4, param_value5)   "
                + "   as param_value      \n" + "                 from pm_task_step_param                   \n"
                + "                where task_no = ?           \n" + PMTool
                    .ternaryExpression(StringUtils.isEmpty(paramCode), "", " and param_code in (" + paramCode + ") \n")
                + "                  )           \n";
            update(pluginSql, pluginParam.toArray());
        }

        return dict;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param taskNo String
     * @throws BaseAppException <br>
     */
    public void redoTaskInst(String taskNo) throws BaseAppException {
        if (StringUtils.isEmpty(taskNo)) {
            return;
        }

        Map<String, String> taskMap = new HashMap<String, String>();
        taskMap.put("TASK_NO", taskNo);
        List<Map<String, String>> taskList = new ArrayList<Map<String, String>>();
        taskList.add(taskMap);

        // TODO

        // DynamicDict taskListDict = new DynamicDict();
        // taskListDict.set("taskList", taskList);
        // taskListDict.setServiceName("MPM_KPIREDEFINE_SERVER");
        // ServiceFlow.callService(taskListDict, true);

    }
}
