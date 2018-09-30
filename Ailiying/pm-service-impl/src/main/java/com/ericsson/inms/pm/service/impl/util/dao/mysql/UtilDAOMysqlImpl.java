package com.ericsson.inms.pm.service.impl.util.dao.mysql;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.python.jline.internal.Log;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.dim.DimService;
import com.ericsson.inms.pm.service.impl.util.dao.UtilDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.core.util.DateUtil;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.dao.mysql <br>
 */
public class UtilDAOMysqlImpl extends UtilDAO {

    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(UtilDAOMysqlImpl.class);

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getEMSInfo() throws BaseAppException {

        JSONObject result = new JSONObject();

        String sql = "";
        sql = "SELECT a.EMS_CODE, \n" + " a.EMS_NAME, \n" + " b.EMS_TYPE_REL_ID, \n" + " c.EMS_TYPE_CODE, \n"
            + " c.EMS_TYPE \n" + " FROM PM_EMS a, PM_EMS_TYPE_REL b, PM_EMS_TYPE c \n"
            + " where a.EMS_CODE = b.EMS_CODE \n" + " and b.EMS_TYPE_CODE = c.EMS_TYPE_CODE \n"
            + " ORDER BY c.EMS_TYPE,a.EMS_NAME \n";

        result.put("emsList", queryForMapList(sql, new Object[0]));

        sql = "SELECT a.EMS_CODE, \n" + " a.EMS_NAME, \n" + " b.EMS_VER_CODE, \n" + " b.EMS_VER_NAME \n"
            + " FROM PM_EMS a, PM_EMS_VER b \n" + " WHERE a.EMS_CODE = b.EMS_CODE \n"
            + " ORDER BY a.EMS_NAME, b.EMS_VER_NAME\n";

        result.put("verList", queryForMapList(sql, new Object[0]));

        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    @Override
    public List<Map<String, Object>> getParavalue(JSONObject dict) throws BaseAppException {
        String paraId = CommonUtil.getStrFromMap(dict, "PARA_ID", "");
        String sql = "";
        sql = "SELECT PV.PARA_ID, PV.PARA_VALUE, PV.PARA_ORDER, PV.PARA_NAME, PV.PARA_F_NAME, PV.PARA_DESC, PV.PARA_NAME_CN \n"
            + " FROM PM_PARAVALUE PV \n" + " WHERE 1 = 1 \n"
            + PMTool.ternaryExpression("".equals(paraId), "", " AND PV.PARA_ID = ? \n")
            + " ORDER BY PV.PARA_ID, PV.PARA_ORDER \n";
        List<Object> argsList = new ArrayList<Object>();
        if (!("".equals(paraId))) {
            argsList.add(paraId);
        }
        return queryForMapList(sql, argsList.toArray());
    }

    @Override
    public List<Map<String, Object>> getParameter(JSONObject dict) throws BaseAppException {
        String paraId = CommonUtil.getStrFromMap(dict, "PARA_ID", "");
        String sql = "";
        sql = "SELECT PM.PARA_ID, PM.PARA_VALUE, PM.PARA_NAME, PM.PARA_F_NAME, PM.PARA_DESC  \n"
            + "  FROM PM_PARAMETER PM    \n" + " WHERE 1 = 1 \n"
            + PMTool.ternaryExpression("".equals(paraId), "", " AND PM.PARA_ID = ?    \n");

        List<Object> argsList = new ArrayList<Object>();
        if (!("".equals(paraId))) {
            argsList.add(paraId);
        }
        return queryForMapList(sql, argsList.toArray());
    }

    @Override
    public JSONObject getDataSource() throws BaseAppException {
        // tfm_config 已废弃

        LinkedHashMap<String, Properties> proInxMap = CommonHelper.getProInxMap();

        List<Map<String, String>> sourceList = new ArrayList<Map<String, String>>();

        boolean breakFlag = false;
        String dsName = null;
        for (Properties prop : proInxMap.values()) {
            Set<Object> keySet = prop.keySet();
            Iterator iter = keySet.iterator();
            breakFlag = false;
            while (!breakFlag && iter.hasNext()) {
                String key = CommonUtil.object2String(iter.next());
                if (key.contains(".datasource.druid.driver-class-name")) {
                    breakFlag = true;
                    dsName = key.replace(".datasource.druid.driver-class-name", "");
                    Map<String, String> dsMap = new HashMap<String, String>();
                    dsMap.put("ID", dsName);
                    dsMap.put("NAME", dsName);
                    dsMap.put("COMMENTS", dsName);
                    sourceList.add(dsMap);
                }
            }
        }

        JSONObject result = new JSONObject();

        result.put("sourceList", sourceList);

        return result;
    }

    @Override
    public JSONObject getPluginSpec(JSONObject dict) throws BaseAppException {
        String pluginType = CommonUtil.getStrFromMap(dict, "PLUGIN_TYPE", "");
        String sql = "";
        sql = "SELECT a.PLUGIN_SPEC_NO, \n" + " a.SEQ, \n" + " a.PLUGIN_TYPE, \n" + " a.PLUGIN_CLASSPATH, \n"
            + " a.PLUGIN_NAME, \n" + " a.BP_ID \n" + " FROM pm_spec_pluginserv a \n" + " WHERE 1 = 1 \n"
            + PMTool.ternaryExpression("".equals(pluginType), "", " AND a.PLUGIN_TYPE = ? \n")
            + " ORDER BY a.PLUGIN_TYPE, a.PLUGIN_NAME \n";

        List<Object> argsList = new ArrayList<Object>();
        if (!("".equals(pluginType))) {
            argsList.add(pluginType);
        }

        JSONObject result = new JSONObject();
        result.put("pluginList", queryForMapList(sql, argsList.toArray()));

        return result;
    }

    @Override
    public JSONObject getPluginParam(JSONObject dict) throws BaseAppException {
        String pluginNo = CommonUtil.getStrFromMap(dict, "PLUGIN_NO", "");
        String pluginType = CommonUtil.getStrFromMap(dict, "PLUGIN_TYPE", "");
        String condition = CommonUtil.getStrFromMap(dict, "CONDITION", "");

        String sql = "select a.PLUGIN_NO, \n" + " a.PLUGIN_TYPE, \n" + " a.SEQ, \n" + " a.PLUGIN_NAME, \n"
            + " a.PLUGIN_CLASSPATH, \n" + " b.PARAM_SEQ, \n" + " b.PARAM_NAME, \n" + " b.PARAM_CODE, \n"
            + " b.PARAM_VALUE, \n" + " a.BP_ID \n" + " FROM pm_pluginserv a, pm_pluginserv_param b \n"
            + " WHERE a.SEQ = 0 \n" + " and b.SEQ = 0 \n" + " AND a.plugin_no = b.plugin_no \n"
            + " AND a.PLUGIN_TYPE = b.PLUGIN_TYPE \n"
            + PMTool.ternaryExpression("".equals(pluginNo), "", " AND a.PLUGIN_NO = ? \n")
            + PMTool.ternaryExpression("".equals(pluginType), "", " AND a.PLUGIN_TYPE = ? \n")
            + PMTool.ternaryExpression("".equals(condition), "", condition + " \n")
            + " ORDER BY a.PLUGIN_TYPE, a.PLUGIN_NAME, a.PLUGIN_NO, b.PARAM_SEQ \n";

        List<Object> argsList = new ArrayList<Object>();
        if (!("".equals(pluginNo))) {
            argsList.add(pluginNo);
        }

        if (!("".equals(pluginType))) {
            argsList.add(pluginType);
        }

        JSONObject result = new JSONObject();
        result.put("pluginParam", queryForMapList(sql, argsList.toArray()));

        return result;
    }

    @Override
    public void operPluginParam(JSONObject dict) throws BaseAppException {
        String sql = "";
        String operType = dict.getString("OPER_TYPE");
        String pluginNo = "";
        String pluginType = dict.getString("PLUGIN_TYPE");

        if ("del".equals(operType) || "edit".equals(operType)) {
            pluginNo = dict.getString("PLUGIN_NO");

            List<String> delArgsList = new ArrayList<String>();
            delArgsList.add(pluginNo);
            delArgsList.add(pluginType);

            sql = "delete from pm_pluginserv_param where plugin_no = ? and plugin_type = ? \n";
            update(sql, delArgsList.toArray());

            sql = "delete from pm_pluginserv where plugin_no = ? and plugin_type = ? \n";
            update(sql, delArgsList.toArray());
        }

        if ("add".equals(operType) || "edit".equals(operType)) {
            String classPath = CommonUtil.getStrFromMap(dict, "PLUGIN_CLASSPATH", "");

            if (!"".equals(classPath)) { // PLUGIN_CLASSPATH为空,不插入数据
                pluginNo = CommonUtil.getStrFromMap(dict, "PLUGIN_NO", "");
                if ("".equals(pluginNo)) {
                    String codePrefix = (CommonUtil.getStrFromMap(dict, "CODE_PREFIX", "")) + "PMS";
                    StringBuffer seq = new StringBuffer(SeqUtils.getSeq("PM_PLUGIN_SEQ"));
                    while (seq.length() < 6) {
                        seq.insert(0, "0");
                    }
                    pluginNo = codePrefix + "_"
                        + DateUtil.formatString(new Date(), DateUtil.DateConstants.DATETIME_FORMAT_2) + "_" + seq;
                    dict.put("PLUGIN_NO", pluginNo);
                }
                sql = "insert into pm_pluginserv \n"
                    + " (plugin_no, seq, plugin_type, plugin_classpath, plugin_name, plugin_spec_no, bp_id) \n"
                    + "values \n" + " (?, 0, ?, ?, ?, ?, ?) \n";

                List<String> iPluginParam = new ArrayList<String>();
                iPluginParam.add(pluginNo);
                iPluginParam.add(pluginType);
                iPluginParam.add(dict.getString("PLUGIN_CLASSPATH"));
                iPluginParam.add(dict.getString("PLUGIN_NAME"));
                iPluginParam.add(dict.getString("PLUGIN_SPEC_NO"));
                iPluginParam.add(dict.getString("BP_ID"));

                update(sql, iPluginParam.toArray());

                sql = "insert into pm_pluginserv_param \n" + " (plugin_no, \n" + " plugin_type, \n" + " seq, \n"
                    + " param_seq, \n" + " param_name, \n" + " param_code, \n" + " param_value) \n" + "values \n"
                    + " (?, ?, 0, ?, ?, ?, ?) \n";

                JSONArray pluginParamArr = dict.getJSONArray("pluginParam");
                if (null != pluginParamArr) {
                    int count = pluginParamArr.size();
                    for (int i = 0; i < count; i++) {
                        JSONObject curParam = pluginParamArr.getJSONObject(i);
                        String paramCode = curParam.getString("PARAM_CODE");
                        if (StringUtils.isNotEmpty(paramCode)) {
                            List<Object> params = new ArrayList<Object>();

                            params.add(pluginNo);
                            params.add(pluginType);
                            params.add(i);
                            params.add(curParam.getString("PARAM_NAME"));
                            params.add(paramCode);
                            params.add(curParam.getString("PARAM_VALUE"));
                            update(sql, params.toArray());
                        }
                    }
                }

            }
            else {
                dict.put("PLUGIN_NO", "");
            }
        }
    }

    @Override
    public JSONObject getScriptResult(JSONObject dict) throws BaseAppException {

        String dimCode = CommonUtil.getStrFromMap(dict, "DIM_CODE", "");
        String script = CommonUtil.getStrFromMap(dict, "MySqlSCRIPT", "");
        if (StringUtils.isEmpty(script)) {
            script = CommonUtil.getStrFromMap(dict, "SCRIPT", "");
        }
        String type = CommonUtil.getStrFromMap(dict, "TYPE", "");

        JSONObject result = new JSONObject();

        if (!StringUtils.isEmpty(dimCode)) {
            String maxRowNum = dict.getString("maxRowNum");
            String name = CommonUtil.getStrFromMap(dict, "NAME", "");
            String ids = CommonUtil.getStrFromMap(dict, "IDS", "");
            String exIds = CommonUtil.getStrFromMap(dict, "exIDS", "");
            if (!StringUtils.isEmpty(ids) && !CommonUtil.checkSQLinject(ids)) {
                ids = "'" + ids.replaceAll("[',']", "','") + "'";
            }
            else {
                ids = "";
            }
            if (!StringUtils.isEmpty(exIds) && !CommonUtil.checkSQLinject(exIds)) {
                exIds = "'" + exIds.replaceAll("[',']", "','") + "'";
            }
            else {
                exIds = "";
            }

            JSONObject dimReq = new JSONObject();
            dimReq.put("DIM_CODE", dimCode);

            JSONObject dimInfo = ((DimService) SpringContext.getBean("dimServ")).getDimInfo(dimReq);

            String qryScript = "";
            if (null != dimInfo) {
                JSONArray scriptList = dimInfo.getJSONArray("scriptList");
                if (null != scriptList) {
                    int scriptListSize = scriptList.size();
                    for (int i = 0; i < scriptListSize; i++) {
                        JSONObject curScriptDict = scriptList.getJSONObject(i);
                        String scriptType = CommonUtil.getStrFromMap(curScriptDict, "SCRIPT_TYPE", "");
                        String dimScript = CommonUtil.getStrFromMap(curScriptDict, "DIM_SCRIPT", "");
                        if ("o".equals(scriptType)) {
                            qryScript += dimScript;
                        }
                    }
                }

            }

            if (!StringUtils.isEmpty(qryScript)) {
                qryScript = "select * from (" + qryScript + ") s" + " where 1=1 "
                    + PMTool.ternaryExpression(StringUtils.isEmpty(name), "",
                        " and upper(s.name) like upper(concat_ws('','%',?,'%'))\n")
                    + PMTool.ternaryExpression(StringUtils.isEmpty(ids), "", " and s.id in (" + ids + ") \n")
                    + PMTool.ternaryExpression(StringUtils.isEmpty(exIds), "", " and s.id not in (" + exIds + ") \n")
                    + " order by s.name \n"
                    + PMTool.ternaryExpression(StringUtils.isEmpty(maxRowNum), "", " limit 0, ? \n");
                List<String> paramList = new ArrayList<String>();
                if (!StringUtils.isEmpty(name)) {
                    paramList.add(name);
                }
                if (!StringUtils.isEmpty(maxRowNum)) {
                    paramList.add(maxRowNum);
                }
                try {
                	result.put("resultList", queryForMapList(qryScript, paramList.toArray()));
                }
                catch (Exception e) {
                	Log.error(e);
        	        throw new BaseAppException("error","sql error"+e.getMessage());
        	      
                }
                
            }

        }
        else {
            if (!("".equals(script))) {
                if ("update".equals(type)) {
                    update(script, new Object[] {});
                }
                else {
                	try {
                		result.put("resultList", queryForMapList(script, new Object[] {}));
                    }
                    catch (Exception e) {
                    	Log.error(e);
            	        throw new BaseAppException("error","sql error"+e.getMessage());
            	      
                    }
                }
            }
        }
        return result;
    }
    
    @Override
    public boolean getEmailSendStatus() throws BaseAppException {
        String sql = "SELECT COUNT(1) AS COUNT FROM PM_PARAMETER T  WHERE T.PARA_ID='emailOnOff' AND T.PARA_VALUE='1'";
        return this.queryForLong(sql, "COUNT",  new Object[] {}) > 0;
    }
    
    
}
