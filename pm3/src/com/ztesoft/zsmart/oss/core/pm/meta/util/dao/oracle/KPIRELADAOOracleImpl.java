package com.ztesoft.zsmart.oss.core.pm.meta.util.dao.oracle;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.counter.domain.AbstractCounterInfo;
import com.ztesoft.zsmart.oss.core.pm.meta.util.dao.KPIRELADAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;

/**
 * KPIRELADAOOracleImpl <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.util.dao.oracle <br>
 */
public class KPIRELADAOOracleImpl extends KPIRELADAO {
    /**
     * logger
     */
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());

    /**
     * tool
     */
    PMTool tool = new PMTool();

    @Override
    public void getKPIRELAInfo(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        // 获取MO对应的Counter
        logger.debug("getKPIRELAInfo begin \n" + dict.asXML("utf-8"));
        DynamicDict molistDict = (DynamicDict) dict.getValueByName("MO_LIST", null);
        if (null == molistDict) {
            ExceptionHandler.publish("R8-PM-META-100101", "MO_LIST is empty");
        }
        DynamicDict remolistDict = new DynamicDict();
        DynamicDict reDict = new DynamicDict();
        for (int i = 0; i < molistDict.getCountByName("MO_NO"); i++) {
            DynamicDict reCounterListDict = new DynamicDict();
            DynamicDict redimListDict = new DynamicDict();

            String strmo = (String) molistDict.getValueByName("MO_NO", i);
            // System.out.println(strmo);
            DynamicDict reMONODict = new DynamicDict();
            DynamicDict counterDict = new DynamicDict();

            // 根据MO_NO获取Counter
            counterDict.setValueByName("MO_NO", strmo);
            // 2017-12-05 enjoy modify
            // counterDict.serviceName = "MPM_META_MO_COUNTER_QUERY";
            // ServiceFlow.callService(counterDict);
            AbstractCounterInfo abscounter = (AbstractCounterInfo) GeneralDMOFactory.create(AbstractCounterInfo.class);
            abscounter.getCounterInfo(counterDict);
            int count = counterDict.getCountByName("couterList");

            for (int i1 = 0; i1 < count; i1++) {
                HashMap<String, String> counterMap = new HashMap<String, String>();
                DynamicDict singlecounterDict = new DynamicDict();
                counterMap = (HashMap) counterDict.getValueByName("couterList", i1);
                singlecounterDict.setValueByName("NAME", counterMap.get("FIELD_CODE"));
                singlecounterDict.setValueByName("NO", counterMap.get("FIELD_NO"));
                reCounterListDict.setValueByName("COUNTER", singlecounterDict, 1);
            }

            // 根据MO_NO获取DIM
            DynamicDict dimDict = new DynamicDict();
            dimDict.setValueByName("MO_NO", strmo);
            // 2017-12-05 enjoy modify
            // dimDict.serviceName = "MPM_META_MO_DIM_QUERY";
            // ServiceFlow.callService(dimDict);
            AbstractCounterInfo absdim = (AbstractCounterInfo) GeneralDMOFactory.create(AbstractCounterInfo.class);
            absdim.getDimInfo(dimDict);

            int count2 = dimDict.getCountByName("dimList");
            for (int i2 = 0; i2 < count2; i2++) {
                HashMap<String, String> dimMap = new HashMap<String, String>();
                DynamicDict singleDimDict = new DynamicDict();
                dimMap = (HashMap) dimDict.getValueByName("dimList", i2);
                singleDimDict.setValueByName("NAME", dimMap.get("FIELD_CODE"));
                singleDimDict.setValueByName("NO", dimMap.get("FIELD_NO"));
                redimListDict.setValueByName("DIM", singleDimDict, 1);
            }
            reMONODict.setValueByName("VALUE", strmo);
            reMONODict.setValueByName("DIM_LIST", redimListDict);
            reMONODict.setValueByName("COUNTER_LIST", reCounterListDict);
            remolistDict.setValueByName("MO_NO", reMONODict, 1);
        }
        reDict.setValueByName("MO_LIST", remolistDict);
        // System.out.println(reDict.asXML("utf-8"));

        // 根据物理模型输出distinct后的KPI
        DynamicDict rekpilistDict = new DynamicDict();
        DynamicDict modellistDict = (DynamicDict) dict.getValueByName("MODEL_LIST", null);
        if (null == modellistDict) {
            ExceptionHandler.publish("R8-PM-META-100102", "MODEL_LIST is empty");
        }

        // 首先得到所有KPI字段
        String strColumn = "";
        for (int j = 0; j < modellistDict.getCountByName("BUSINESS_MODEL"); j++) {
            String strmodel = (String) modellistDict.getValueByName("BUSINESS_MODEL", j);
            // System.out.println(strmodel);
            // 获取对应物理模型的建表语句,返回String
            List<HashMap<String, String>> sqlscript;
            String Strscript = "";
            sqlscript = getScriptByModelphy(strmodel);
            if (sqlscript.size() == 0) {
                logger.debug("Physic model " + strmodel + "] has no script!");
                ExceptionHandler.publish("R8-PM-META-100110", "Physic model " + strmodel + "] has no script!");
                // return;
            }
            Iterator it1 = sqlscript.iterator();
            // 一个建表语句可能由多条记录拼接起来
            while (it1.hasNext()) {
                HashMap s = (HashMap) it1.next();
                Strscript = Strscript + s.get("SCRIPT");
            }
            // 获得该物理模型最终的建表SQL
            logger.debug("The model physic script in table is :\n" + Strscript);
            // 根据建表语句得到KPI字段,返回list
            List<String> listColumn = null;
            listColumn = tool.getColumnNameBySql(Strscript);
            if (listColumn == null || listColumn.size() == 0) {
                throw ExceptionHandler.publish("R8-PM-META-100105", "please check script! the physic model is :[" + strmodel + "]");
            }
            for (int j1 = 0; j1 < listColumn.size(); j1++) {
                strColumn = strColumn + listColumn.get(j1) + ",";
            }
        }

        // 所有KPI字段在KPI信息表做查询，得到distinct后的kpi
        String sqlKPI = getStr4SQLINParam(strColumn, ",");
        String sql = "select a.kpi_code,b.kpi_form, \n"
            + " (select para_name from pm_paravalue c where c.para_id ='KPI_AGG' and c.para_value = b.kpi_agg) para_name \n"
            + " from pm_kpi a,pm_kpi_form b  where 1 = 1    \n" 
            + " and a.kpi_code in( \n" + sqlKPI + ") \n" 
            + " and a.kpi_code = b.kpi_code \n"
            + " order by a.kpi_code \n";
        ParamArray params = new ParamArray();
        params.set("", "");
        List<HashMap<String, String>> rListKpi = queryList(sql, params);

        // 返回KPI节点信息
        int count = rListKpi.size();
        for (int k = 0; k < count; k++) {
            HashMap<String, String> kpihmap = rListKpi.get(k);
            DynamicDict reKPIDict = new DynamicDict();
            reKPIDict.setValueByName("KPI_CODE", replaceBlank(kpihmap.get("KPI_CODE")));
            reKPIDict.setValueByName("KPI_FORM", replaceBlank(kpihmap.get("KPI_FORM")));
            reKPIDict.setValueByName("KPI_AGG", replaceBlank(kpihmap.get("PARA_NAME")));
            rekpilistDict.setValueByName("KPI", reKPIDict, 1);
        }
        reDict.setValueByName("KPI_LIST", rekpilistDict);
        dict.setValueByName("z_d_r", reDict);
        logger.debug("getKPIRELAInfo end \n" + dict.asXML("utf-8"));
        // dict.valueMap.putAll(reDict.valueMap);
    }

    /**
     * [replaceBlank] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param str <br>
     * @return String <br>
     */
    public String replaceBlank(String str) {
        String dest = "";
        if (str != null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }

    /**
     * [getScriptByModelphy] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param model_phy_code <br>
     * @return List<HashMap<String, String>> <br>
     * @throws BaseAppException <br>
     */
    public List<HashMap<String, String>> getScriptByModelphy(String model_phy_code) throws BaseAppException {

        String sql = "select a.script from PM_MODEL_PHY_SCRIPT a where 1 = 1    \n"
            + tool.ternaryExpression("".equals(model_phy_code), "", " and a.model_phy_code = ?   \n") + " order by a.script_no    \n";
        ParamArray params = new ParamArray();
        if (!("".equals(model_phy_code))) {
            params.set("", model_phy_code);
        }
        return queryList(sql, params);
    }

    /**
     * [getStr4SQLINParam] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param valuesStr <br>
     * @param split <br>
     * @return String <br>
     */
    public String getStr4SQLINParam(String valuesStr, String split) {
        return getStr4SQLINParam1(valuesStr.split(split));
    }

    /**
     * [getStr4SQLINParam1] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param values <br>
     * @return String <br>
     */
    public String getStr4SQLINParam1(String[] values) {
        String str = "";
        for (int i = 0; i < values.length; i++) {
            str += tool.ternaryExpression((i != 0), ", ", "");
            str += "'" + values[i] + "'";
        }
        return str;
    }

    /**
     * [getStr4SQLINParam2] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param values <br>
     * @return String <br>
     */
    public static String getStr4SQLINParam2(String[] values) {
        String str = "";
        for (int i = 0; i < values.length; i++) {
            str += "'" + values[i] + "', ";
        }
        return str.substring(0, str.length() - 2);
    }

    /**
     * [getStr4SQLINParam3] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param values <br>
     * @return String <br>
     */
    public static String getStr4SQLINParam3(String[] values) {
        List<String> valueList = Arrays.asList(values);
        return valueList.toString().replace("[", "'").replace(", ", "', '").replace("]", "'");
    }

    /**
     * [方法描述] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @return String[] <br>
     */
    public static String[] listToString() {

        ArrayList<String> list = new ArrayList<String>();

        String[] strings = new String[list.size()];

        list.toArray(strings);
        return strings;

    }

    @Override
    public int delete(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public void insert(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int update(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public void getMOPluginInfo(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        DynamicDict molistDict = (DynamicDict) dict.getValueByName("MO_LIST", null);
        if (null == molistDict) {
            ExceptionHandler.publish("R8-PM-META-100101", "MO_LIST is empty");
        }
        DynamicDict remolistDict = new DynamicDict();
        DynamicDict reDict = new DynamicDict();
        for (int i = 0; i < molistDict.getCountByName("MO_NO"); i++) {
            DynamicDict reCounterListDict = new DynamicDict();
            DynamicDict reParamListDict = new DynamicDict();

            String strmo = (String) molistDict.getValueByName("MO_NO", i);
            // System.out.println(strmo);
            DynamicDict reMONODict = new DynamicDict();
            DynamicDict counterDict = new DynamicDict();

            // 根据MO_NO获取PLUGIN
            String sqlplugin = " select a.mo_code,b.plugin_classpath,b.plugin_no from pm_mo a, pm_pluginserv b " + " where 1 = 1 \n"
                + " and a.filename_rule = b.plugin_no \n" + tool.ternaryExpression("".equals(strmo), "", " and a.mo_code = ?   \n");
            ParamArray paramsMO = new ParamArray();
            paramsMO.set("MO_CODE", strmo);

            List<HashMap<String, String>> rListPlugin = queryList(sqlplugin, paramsMO);
            int pluginCount = rListPlugin.size();

            String str_plugin_classpath = "";
            String str_plugin_no = "";
            // 这里一个MO对应是否有多个plugin?
            for (int i1 = 0; i1 < pluginCount; i1++) {
                HashMap<String, String> pluginMap = new HashMap<String, String>();
                DynamicDict singlepluginDict = new DynamicDict();
                pluginMap = rListPlugin.get(i1);

                str_plugin_classpath = (String) pluginMap.get("PLUGIN_CLASSPATH");
                str_plugin_no = (String) pluginMap.get("PLUGIN_NO");
            }

            // 根据PLUGIN获取PARAM,也可能不存在param
            String sqlparam = " select b.plugin_type, b.param_code, b.param_name, b.param_value  from pm_pluginserv a, "
                + " pm_pluginserv_param b where 1 = 1   \n" + " and a.plugin_no = b.plugin_no \n"
                + tool.ternaryExpression("".equals(str_plugin_no), "", " and a.plugin_no = ?   \n");

            ParamArray params = new ParamArray();
            params.set("PLUGIN_NO", str_plugin_no);
            List<HashMap<String, String>> rListParam = queryList(sqlparam, params);
            int paramCount = rListParam.size();

            for (int j = 0; j < paramCount; j++) {

                HashMap paramMap = rListParam.get(j);
                DynamicDict singleParamDict = new DynamicDict();

                singleParamDict.setValueByName("PLUGIN_TYPE", paramMap.get("PLUGIN_TYPE"));
                singleParamDict.setValueByName("PARAM_CODE", paramMap.get("PARAM_CODE"));
                singleParamDict.setValueByName("PARAM_NAME", paramMap.get("PARAM_NAME"));
                singleParamDict.setValueByName("PARAM_VALUE", paramMap.get("PARAM_VALUE"));
                reParamListDict.setValueByName("PARAM", singleParamDict, 1);
            }
            reMONODict.setValueByName("MO_CODE", strmo);
            reMONODict.setValueByName("PLUGIN_CLASSPATH", str_plugin_classpath);
            reMONODict.setValueByName("PLUGIN_NO", str_plugin_no);

            if (reParamListDict == null) {
                reMONODict.setValueByName("PARAM_LIST", reParamListDict);
            }

            remolistDict.setValueByName("MO_NO", reMONODict, 1);
        }
        reDict.setValueByName("MO_LIST", remolistDict);
        dict.setValueByName("z_d_r", reDict);
    }
}
