package com.ztesoft.zsmart.oss.core.pm.config.task.dao.oracle;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.core.pm.config.task.dao.TaskDAO;
import com.ztesoft.zsmart.oss.core.pm.util.domain.AbstractUtilInfo;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * 配置管理-任务管理相关的Oracle DAO操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-26 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.task.dao.oracle <br>
 */
public class TaskDAOOracleImpl extends TaskDAO {
    /**
     * sql all
     * 
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();
    @Override
    public void getTaskInfo(DynamicDict dict) throws BaseAppException {
        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String taskType = (String) dict.getValueByName("TASK_TYPE", "");
        String taskName = (String) dict.getValueByName("TASK_NAME", "");
        String exTaskType = (String) dict.getValueByName("EX_TASK_TYPE", "");
        if (!"".equals(exTaskType)) {
            exTaskType = "'" + exTaskType.replaceAll("[',']", "','") + "'";
        }
        sql = "select a.task_no, \n"
            + "       a.task_name, \n"
            + "       a.seq,            \n"
            + "       a.ems_code,    \n"
            + "       a.ems_type_rel_id,    \n"
            + "       a.ems_ver_code,    \n"
            + "       a.task_type,    \n"
            + "       a.task_desc,    \n"
            + "       a.state,        \n"
            + "       a.oper_user,    \n"
            + "       (select u.user_name    \n"
            + "          from bfm_user u        \n"
            + "         where u.user_id = a.oper_user        \n"
            + "           and rownum = 1) as oper_user_name,    \n"
            + "       to_char(a.oper_date, 'yyyy-mm-dd hh24:mi:ss') as oper_date,    \n"
            + "       a.bp_id        \n"
            + "  from pm_task_info a    \n"
            + " where 1 = 1            \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?    \n")
            + tool.ternaryExpression("".equals(verCode), "", " and a.ems_ver_code = ?    \n")
            + tool.ternaryExpression("".equals(taskType), "", " and a.task_type = ?    \n")
            + tool.ternaryExpression("".equals(taskName), "", " and and upper(a.task_name) like '%' || upper(?) || '%' = ?    \n")
            + tool.ternaryExpression("".equals(exTaskType), "", " and a.task_type not in ( " + exTaskType + " )   \n")
            + " order by a.task_name    \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(taskType))) {
            params.set("", taskType);
        }
        if (!("".equals(taskName))) {
            params.set("", taskName);
        }
        
        dict.set("taskList", queryList(sql, params));
        
    }
    
    @Override
    public void getTaskDetail(DynamicDict dict) throws BaseAppException {
        String type = (String) dict.getValueByName("TYPE", "");
        String taskNo = dict.getString("TASK_NO", true);

        ParamArray params = new ParamArray();
        params.set("", taskNo);

        if ("".equals(type) || "schdule".equals(type)) {
            sql = "select a.task_no,    \n"
                + "       a.schdule_no,    \n"
                + "       a.seq,        \n"
                + "       a.schdule_type,        \n"
                + "       a.cycle_schdule_type,    \n"
                + "       to_char(a.eff_date, 'yyyy-mm-dd') as eff_date,    \n"
                + "       to_char(a.exp_date, 'yyyy-mm-dd') as exp_date,    \n"
                + "       to_char(a.trigger_date, 'yyyy-mm-dd') as trigger_date,    \n"
                + "       a.trigger_time,    \n"
                + "       a.interval_period,    \n"
                + "       a.mw,    \n"
                + "       a.cron    \n"
                + "  from pm_task_schdule a    \n"
                + " where a.seq = 0    \n"
                + "   and a.task_no = ?    \n";
            dict.set("schduleList", queryList(sql, params));
        }
        
        if ("".equals(type) || "param".equals(type)) {
            sql = "select a.task_no,    \n"
                + "       a.seq,        \n"
                + "       a.param_seq,    \n"
                + "       a.param_name,    \n"
                + "       a.param_code,    \n"
                + "       a.param_value,    \n"
                + "       a.oper_user,    \n"
                + "       to_char(a.oper_date, 'yyyy-mm-dd hh24:mi:ss') as oper_date    \n"
                + "  from pm_task_param_info a    \n"
                + " where a.seq = 0    \n"
                + "   and a.task_no = ?    \n"
                + " order by a.param_seq    \n";
            dict.set("paramList", queryList(sql, params));
            
            sql = "select a.task_no,    \n"
                + "       a.task_step_id,    \n"
                + "       a.step_no,    \n"
                + "       a.task_step_name,    \n"
                + "       a.seq,    \n"
                + "       a.step_seq,    \n"
                + "       a.task_step_seq    \n"
                + "  from pm_task_step a    \n"
                + " where a.seq = 0    \n"
                + "   and a.task_no = ?    \n"
                + " order by a.step_seq, a.task_step_seq    \n";
            dict.set("stepList", queryList(sql, params));
            
            sql = "select a.task_step_id,    \n"
                + "       a.task_no,    \n"
                + "       a.step_no,    \n"
                + "       a.seq,        \n"
                + "       a.group_no,    \n"
                + "       a.group_seq,    \n"
                + "       a.param_seq,    \n"
                + "       a.param_code,    \n"
                + "       a.param_value,    \n"
                + "       a.param_value1,\n"
                + "       a.param_value2,\n"
                + "       a.param_value3,\n"
                + "       a.param_value4,\n"
                + "       a.param_value5    \n"
                //+ "       (a.param_value || a.param_value1 || a.param_value2 ||             \n"
                //+ "       a.param_value3 || a.param_value4 || a.param_value5) as param_value\n"
                + "  from pm_task_step_param a    \n"
                + " where a.seq = 0        \n"
                + "   and a.task_no = ?    \n"
                + " order by a.step_no,a.group_no,a.group_seq,a.param_seq \n";
            dict.set("stepParamList", queryList(sql, params));
            
            String pluginType = (String) dict.getValueByName("PLUGIN_TYPE", "");
            String paramCode = (String) dict.getValueByName("PARAM_CODE", "");
            if (!"".equals(pluginType)) {
                String conSql = " and a.plugin_no in (select param_value || param_value1 || param_value2 ||             \n"
                      + "                      param_value3 || param_value4 || param_value5 as param_value      \n"
                      + "                 from pm_task_step_param           \n"
                      + "                where task_no = '" + taskNo + "'   \n"
                      + tool.ternaryExpression("".equals(paramCode), "", " and param_code = '" + paramCode + "' \n")
                      + "    )           \n";
                //pluginList
                sql = "select a.plugin_no,          \n"
                    + "       a.seq,                \n"
                    + "       a.plugin_type,        \n"
                    + "       a.plugin_classpath,   \n"
                    + "       a.plugin_name,        \n"
                    + "       a.plugin_spec_no,     \n"
                    + "       a.bp_id               \n"
                    + "  from pm_pluginserv a       \n"
                    + " where a.seq = 0             \n"
                    + "   and a.plugin_type = ?     \n" 
                    + conSql;
                ParamArray pluginParams = new ParamArray();
                pluginParams.set("", pluginType);
                dict.set("pluginList", queryList(sql, pluginParams));

                // pluginParam
                dict.setValueByName("CONDITION", conSql);
                getUtilDmo().getPluginParam(dict);
                dict.remove("CONDITION");
            }
        }
    }

    @Override
    public void addTaskInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        String codePrefix = ((String) dict.getValueByName("CODE_PREFIX", "")) + "PMS";

        StringBuffer seq = new StringBuffer(SeqUtil.getSeq("PM_TASK_SEQ"));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String taskNo = codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq;

        sql = "insert into pm_task_info    \n"
            + "  (task_no,    \n"
            + "   task_name,    \n"
            + "   seq,        \n"
            + "   ems_code,    \n"
            + "   ems_type_rel_id,    \n"
            + "   ems_ver_code,        \n"
            + "   task_type,    \n"
            + "   task_desc,    \n"
            + "   state,        \n"
            + "   oper_user,    \n"
            + "   oper_date,    \n"
            + "   bp_id)    \n"
            + "values    \n"
            + "  (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, sysdate, ?)    \n";
        params.clear();
        params.set("", taskNo);
        params.set("", dict.getString("TASK_NAME", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("TASK_TYPE", true));
        params.set("", dict.getString("TASK_DESC"));
        params.set("", dict.getString("STATE"));
        params.set("", SessionManage.getSession().getUserId());
        params.set("", dict.getString("BP_ID"));
        
        executeUpdate(sql, params);
        
        dict.setValueByName("TASK_NO", taskNo);
        dict.setValueByName("OPER_USER_NAME", SessionManage.getSession().getUserName());
        dict.setValueByName("OPER_DATE", queryString(
                 "select to_char(oper_date, 'yyyy-mm-dd hh24:mi:ss') as oper_date " 
                + "from pm_task_info where task_no = '" + taskNo + "'"));
        
        this.batchAddDetail(dict);
    }

    @Override
    public void editTaskInfo(DynamicDict dict) throws BaseAppException {
        sql = "update pm_task_info            \n"
            + "   set task_name       = ?,    \n"
            + "       seq             = 0,    \n"
            + "       ems_code        = ?,    \n"
            + "       ems_type_rel_id = ?,    \n"
            + "       ems_ver_code    = ?,    \n"
            + "       task_type       = ?,    \n"
            + "       task_desc       = ?,    \n"
            + "       state           = ?,    \n"
            + "       oper_user       = ?,    \n"
            + "       oper_date       = sysdate,    \n"
            + "       bp_id           = ?    \n"
            + " where task_no = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("TASK_NAME", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("TASK_TYPE", true));
        params.set("", dict.getString("TASK_DESC"));
        params.set("", dict.getString("STATE"));
        params.set("", SessionManage.getSession().getUserId());
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("TASK_NO", true));
        
        executeUpdate(sql, params);
        
        this.batchAddDetail(dict);
    }
    
    @Override
    public void delTaskInfo(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        params.set("", dict.getString("TASK_NO", true));

        sql = "delete from pm_task_schdule where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_param_info where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_step_param where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_step where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_info where task_no = ? \n";
        executeUpdate(sql, params);
        
    }
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void batchAddDetail(DynamicDict dict) throws BaseAppException {

        String taskNo = dict.getString("TASK_NO", true);

        ParamArray params = new ParamArray();
        params.set("", taskNo);

        sql = "delete from pm_task_schdule where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_param_info where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_step_param where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "delete from pm_task_step where task_no = ?    \n";
        executeUpdate(sql, params);
        
        sql = "insert into pm_task_schdule    \n"
            + "  (task_no,        \n"
            + "   schdule_no,    \n"
            + "   seq,            \n"
            + "   schdule_type,    \n"
            + "   cycle_schdule_type,\n"
            + "   eff_date,        \n"
            + "   exp_date,        \n"
            + "   trigger_date,    \n"
            + "   trigger_time,    \n"
            + "   interval_period, \n"
            + "   mw,    \n"
            + "   cron)    \n"
            + "values    \n"
            + "  (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        
        for (int i = 0; i < dict.getCount("schduleList"); i++) {
            DynamicDict schduleDict = dict.getBO("schduleList", i);
            String schduleType = schduleDict.getString("SCHDULE_TYPE");
            Date effDate = schduleDict.getDate("EFF_DATE");
            Date expDate = schduleDict.getDate("EXP_DATE");
            Date trigDate = schduleDict.getDate("TRIGGER_DATE");
            if (schduleType == null || "".equals(schduleType)) {
                schduleType = "00";
            }
            ParamArray param = new ParamArray();
            param.set("", taskNo);
            param.set("", schduleDict.getString("CYCLE_SCHDULE_TYPE", true));
            param.set("", schduleType);
            param.set("", schduleDict.getString("CYCLE_SCHDULE_TYPE", true));
            param.set("", tool.ternaryExpression((effDate == null), trigDate, effDate));
            param.set("", tool.ternaryExpression((expDate == null), trigDate, expDate));
            param.set("", trigDate);
            param.set("", schduleDict.getString("TRIGGER_TIME"));
            param.set("", schduleDict.getString("INTERVAL_PERIOD"));
            param.set("", schduleDict.getString("MW"));
            param.set("", schduleDict.getString("CRON"));
            executeUpdate(sql, param);
        }
        
        sql = "insert into pm_task_param_info    \n"
            + "  (task_no,    \n"
            + "   seq,        \n"
            + "   param_seq,        \n"
            + "   param_name,    \n"
            + "   param_code,    \n"
            + "   param_value,    \n"
            + "   oper_user,        \n"
            + "   oper_date)        \n"
            + "values    \n"
            + "  (?, 0, ?, ?, ?, ?, ?, sysdate)    \n";
        
        for (int i = 0; i < dict.getCount("paramList"); i++) {
            DynamicDict paramDict = dict.getBO("paramList", i);
            ParamArray param = new ParamArray();
            param.set("", taskNo);
            param.set("", i);
            param.set("", paramDict.getString("PARAM_NAME"));
            param.set("", paramDict.getString("PARAM_CODE", true));
            param.set("", paramDict.getString("PARAM_VALUE", true));
            param.set("", SessionManage.getSession().getUserId());
            executeUpdate(sql, param);
        }

        String codePrefix = ((String) dict.getValueByName("CODE_PREFIX", "")) + "PMS";
        sql = "insert into pm_task_step    \n"
            + "  (task_no,        \n"
            + "   task_step_id,    \n"
            + "   step_no,        \n"
            + "   task_step_name,\n"
            + "   seq,        \n"
            + "   step_seq,    \n"
            + "   task_step_seq)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?, 0, ?, ?)    \n";
        
        int stepCont = dict.getCount("stepList");
        Map<String, String> stepMap = new HashMap<String, String>(stepCont);

        for (int i = 0; i < stepCont; i++) {

            DynamicDict stepDict = dict.getBO("stepList", i);
            ParamArray param = new ParamArray();

            String stepId = stepDict.getString("TASK_STEP_ID", true);
            
            if (stepId.length() >= 16 && "________".equals(stepId.substring(0, 8))
                && "________".equals(stepId.substring(stepId.length() - 8, stepId.length()))) { // 前后各8位下划线的step_id是前台临时生成id
                StringBuffer seq = new StringBuffer(SeqUtil.getSeq("PM_TASK_SEQ"));
                while (seq.length() < 6) {
                    seq.insert(0, "0");
                }
                stepMap.put(stepId, (codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq));
            }

            param.set("", taskNo);
            
            param.set("", tool.ternaryExpression((stepMap.get(stepId) != null), stepMap.get(stepId), stepId));
            param.set("", stepDict.getString("STEP_NO", true));
            param.set("", stepDict.getString("TASK_STEP_NAME"));
            param.set("", stepDict.getString("STEP_SEQ", true));
            param.set("", stepDict.getString("TASK_STEP_SEQ", true));
            executeUpdate(sql, param);
        }
        
        sql = "insert into pm_task_step_param    \n"
            + "  (task_step_id,    \n"
            + "   task_no,    \n"
            + "   step_no,    \n"
            + "   seq,    \n"
            + "   group_no,    \n"
            + "   group_seq,    \n"
            + "   param_seq,    \n"
            + "   param_code,    \n"
            + "   param_value,    \n"
            + "   param_value1,    \n"
            + "   param_value2,    \n"
            + "   param_value3,    \n"
            + "   param_value4,    \n"
            + "   param_value5)    \n"
            + "values    \n"
            + "  (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        int split = 2000;
        boolean delPlugin = false;
        for (int i = 0; i < dict.getCount("stepParamList"); i++) {
            DynamicDict stepParamDict = dict.getBO("stepParamList", i);
            String stepId = stepParamDict.getString("TASK_STEP_ID", true);
            String paramValue = (String) stepParamDict.getValueByName("PARAM_VALUE", "");
            if (stepParamDict.getCount("plugin") > 0) {
                DynamicDict pluginDict = stepParamDict.getBO("plugin");
                pluginDict.setValueByName("OPER_TYPE", "add");
                if (!delPlugin) {
                    ParamArray pluginParam = new ParamArray();
                    pluginParam.set("", pluginDict.getString("PLUGIN_TYPE", true));
                    String pluginSql = "delete from pm_pluginserv_param a where a.plugin_type = ?    \n"
                        + " and a.plugin_no in (select param_value || param_value1 || param_value2 ||             \n"
                          + "                      param_value3 || param_value4 || param_value5 as param_value      \n"
                          + "                 from pm_task_step_param                   \n"
                          + "                where task_no = '" + taskNo
                          + "'               \n"
                          + "                  and param_code = 'CHECK_SERV')           \n";
                    executeUpdate(pluginSql, pluginParam);
                    delPlugin = true;
                }
                getUtilDmo().operPluginParam(pluginDict);
                paramValue = (String) pluginDict.getValueByName("PLUGIN_NO", "");
            }
            ParamArray param = new ParamArray();
            
            param.set("", tool.ternaryExpression((stepMap.get(stepId) != null), stepMap.get(stepId), stepId));
            param.set("", taskNo);
            param.set("", stepParamDict.getString("STEP_NO", true));
            param.set("", stepParamDict.getString("GROUP_NO"));
            param.set("", stepParamDict.getString("GROUP_SEQ"));
            param.set("", i);
            param.set("", stepParamDict.getString("PARAM_CODE", true));

            int sl = paramValue.length();
            int no = (int) Math.ceil((sl * 100) / (split * 100.0));
            for (int k = 0; k < no; k++) {
                
                param.set("", paramValue.substring(k * split, tool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
            }
            for (int s = 0; s < 6 - no; s++) {
                param.set("", "");
            }
            executeUpdate(sql, param);
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

    /**
     * 
     * 获取Util DOMAIN对象 <br> 
     *  
     * @author Srd <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractUtilInfo getUtilDmo() throws BaseAppException {
        return (AbstractUtilInfo) GeneralDMOFactory.create(AbstractUtilInfo.class);
    }
}
