package com.ztesoft.zsmart.oss.core.pm.util.dao.oracle;

import java.util.Date;
import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.core.pm.util.dao.UtilDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/**
 * PM-Util服务相关的Oracle DAO操作实现类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-3-28 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.dao.oracle <br>
 */
public class UtilDAOOracleImpl extends UtilDAO {
    
    /**
     * tool 
     */
    PMTool tool = new PMTool();
    @Override
    public void getEMSInfo(DynamicDict dict) throws BaseAppException {
        String sql = "";
        sql = "select a.ems_code,   \n" 
            + "       a.ems_name,   \n" 
            + "       b.ems_type_rel_id,    \n" 
            + "       c.ems_type_code,  \n"
            + "       c.ems_type    \n" 
            + "  from pm_ems a, pm_ems_type_rel b, pm_ems_type c    \n" 
            + " where a.ems_code = b.ems_code   \n"
            + "   and b.ems_type_code = c.ems_type_code \n" 
            + " order by a.ems_name, c.ems_type \n";
        dict.set("emsList", queryList(sql, new ParamArray()));

        sql = "select a.ems_code,   \n" 
            + "       a.ems_name,   \n" 
            + "       b.ems_ver_code,   \n" 
            + "       b.ems_ver_name    \n"
            + "  from pm_ems a, pm_ems_ver b    \n" 
            + " where a.ems_code = b.ems_code   \n" 
            + " order by a.ems_name, b.ems_ver_name \n";
        dict.set("verList", queryList(sql, new ParamArray()));
    }

    @Override
    public void getParavalue(DynamicDict dict) throws BaseAppException {
        String paraId = (String) dict.getValueByName("PARA_ID", "");
        String sql = "";
        sql = "select a.para_id, a.para_value, a.para_order, a.para_name, a.para_f_name, a.para_desc    \n" 
            + "  from pm_paravalue a    \n"
            + " where 1 = 1 \n" 
            + tool.ternaryExpression("".equals(paraId), "", " and a.para_id = ?    \n")
            + " order by a.para_id, a.para_order    \n";
        ParamArray params = new ParamArray();
        if (!("".equals(paraId))) {
            params.set("", paraId);
        }
        dict.set("paraList", queryList(sql, params));
    }

    @Override
    public void getParameter(DynamicDict dict) throws BaseAppException {
        String paraId = (String) dict.getValueByName("PARA_ID", "");
        String sql = "";
        sql = "select a.para_id, a.para_value, a.para_name, a.para_f_name, a.para_desc  \n" 
            + "  from pm_parameter a    \n" 
            + " where 1 = 1 \n"
            + tool.ternaryExpression("".equals(paraId), "", " and a.para_id = ?    \n");
        ParamArray params = new ParamArray();
        if (!("".equals(paraId))) {
            params.set("", paraId);
        }
        dict.set("paraList", queryList(sql, params));
    }

    @Override
    public void getDataSource(DynamicDict dict) throws BaseAppException {

        String sql = "";
        sql = "select id, name, comments    \n" mo
            + "  from tfm_config    \n" 
            + " where lower(module_name) = 'jdbc'    \n" 
            + "   and parent_id is null    \n"
            + " order by name    \n";
        ParamArray params = new ParamArray();

        dict.set("sourceList", queryList(sql, params));
    }
    
    @Override
    public void getPluginSpec(DynamicDict dict) throws BaseAppException {
        String pluginType = (String) dict.getValueByName("PLUGIN_TYPE", "");
        String sql = "";
        sql = "select a.plugin_spec_no,     \n"
            + "       a.seq,                \n"
            + "       a.plugin_type,        \n"
            + "       a.plugin_classpath,   \n"
            + "       a.plugin_name,        \n"
            + "       a.bp_id               \n"
            + "  from pm_spec_pluginserv a  \n"
            + " where 1 = 1    \n"
            + tool.ternaryExpression("".equals(pluginType), "", " and a.plugin_type = ?    \n")
            + " order by a.plugin_type, a.plugin_name   \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(pluginType))) {
            params.set("", pluginType);
        }
        dict.set("pluginList", queryList(sql, params));
    }
    
    @Override
    public void getPluginParam(DynamicDict dict) throws BaseAppException {
        String pluginNo = (String) dict.getValueByName("PLUGIN_NO", "");
        String pluginType = (String) dict.getValueByName("PLUGIN_TYPE", "");
        String condition = (String) dict.getValueByName("CONDITION", "");
        String sql = "";
        
        sql = "select a.plugin_no,    \n" 
            + "       a.plugin_type,    \n" 
            + "       a.seq,    \n" 
            + "       a.plugin_name,    \n"
            + "       a.plugin_classpath,    \n" 
            + "       b.param_seq,    \n" 
            + "       b.param_name,    \n" 
            + "       b.param_code,    \n"
            + "       b.param_value,    \n" 
            + "       a.bp_id   \n" 
            + "  from pm_pluginserv a, pm_pluginserv_param b    \n" 
            + " where a.seq = 0    \n"
            + "   and b.seq = 0    \n" 
            + "   and a.plugin_no = b.plugin_no    \n" 
            + "   and a.plugin_type = b.plugin_type    \n"
            + tool.ternaryExpression("".equals(pluginNo), "", " and a.plugin_no = ?    \n")
            + tool.ternaryExpression("".equals(pluginType), "", " and a.plugin_type = ?    \n")
            + tool.ternaryExpression("".equals(condition), "", condition + " \n")
            + " order by a.plugin_type, a.plugin_name, a.plugin_no, b.param_seq    \n";

        ParamArray params = new ParamArray();
        if (!("".equals(pluginNo))) {
            params.set("", pluginNo);
        }
        if (!("".equals(pluginType))) {
            params.set("", pluginType);
        }
        dict.set("pluginParam", queryList(sql, params));
    }

    @Override
    public void operPluginParam(DynamicDict dict) throws BaseAppException {
        String sql = "";
        String operType = (String) dict.getValueByName("OPER_TYPE");
        String pluginNo = "";
        String pluginType = (String) dict.getValueByName("PLUGIN_TYPE");

        if ("del".equals(operType) || "edit".equals(operType)) {
            pluginNo = (String) dict.getValueByName("PLUGIN_NO");
            ParamArray params = new ParamArray();
            params.set("", pluginNo);
            params.set("", pluginType);
            sql = "delete from pm_pluginserv_param where plugin_no = ? and plugin_type = ?    \n";
            executeUpdate(sql, params);

            sql = "delete from pm_pluginserv where plugin_no = ? and plugin_type = ?    \n";
            executeUpdate(sql, params);
        }

        if ("add".equals(operType) || "edit".equals(operType)) {
            String classPath = (String) dict.getValueByName("PLUGIN_CLASSPATH", "");

            if (!"".equals(classPath)) { // PLUGIN_CLASSPATH为空,不插入数据
                pluginNo = (String) dict.getValueByName("PLUGIN_NO", "");
                if ("".equals(pluginNo)) {
                    String codePrefix = ((String) dict.getValueByName("CODE_PREFIX", "")) + "PMS";
                    StringBuffer seq = new StringBuffer(SeqUtil.getSeq("PM_PLUGIN_SEQ"));
                    while (seq.length() < 6) {
                        seq.insert(0, "0");
                    }
                    pluginNo = codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq;
                    dict.setValueByName("PLUGIN_NO", pluginNo);
                }
                sql = "insert into pm_pluginserv    \n" 
                    + "  (plugin_no, seq, plugin_type, plugin_classpath, plugin_name, plugin_spec_no, bp_id)    \n" 
                    + "values    \n"
                    + "  (?, 0, ?, ?, ?, ?, ?)    \n";
                ParamArray params = new ParamArray();
                params.set("", pluginNo);
                params.set("", pluginType);
                params.set("", dict.getString("PLUGIN_CLASSPATH", true));
                params.set("", dict.getString("PLUGIN_NAME"));
                params.set("", dict.getString("PLUGIN_SPEC_NO"));
                params.set("", dict.getString("BP_ID"));
                executeUpdate(sql, params);

                sql = "insert into pm_pluginserv_param    \n" 
                    + "  (plugin_no,    \n" 
                    + "   plugin_type,    \n" 
                    + "   seq,  \n" 
                    + "   param_seq,    \n"
                    + "   param_name,    \n" 
                    + "   param_code,    \n" 
                    + "   param_value)    \n" 
                    + "values    \n" + "  (?, ?, 0, ?, ?, ?, ?)    \n";

                int count = dict.getCount("pluginParam");
                for (int i = 0; i < count; i++) {
                    DynamicDict paramDict = dict.getBO("pluginParam", i);
                    ParamArray param = new ParamArray();
                    param.set("", pluginNo);
                    param.set("", pluginType);
                    param.set("", i);
                    param.set("", paramDict.getString("PARAM_NAME"));
                    param.set("", paramDict.getString("PARAM_CODE", true));
                    param.set("", paramDict.getString("PARAM_VALUE"));
                    executeUpdate(sql, param);
                }
            }
            else {
                dict.setValueByName("PLUGIN_NO", "");
            }
        }
    }

    @Override
    public void getScriptResult(DynamicDict dict) throws BaseAppException {
        String script = (String) dict.getValueByName("SCRIPT", "");
        String type = (String) dict.getValueByName("TYPE", "");

        if (!("".equals(script))) {
            if ("update".equals(type)) {
                executeUpdate(script, new ParamArray());
            }
            else {
                dict.set("resultList", queryList(script, new ParamArray()));
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
