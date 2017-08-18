package com.ztesoft.zsmart.oss.core.pm.meta.model.busi.dao.oracle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.model.busi.dao.ModelBusiDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;

/**
 * 
 * PM元数据-测量对象管理相关的Oracle DAO操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.busi.dao.oracle <br>
 */
public class ModelBusiDAOOracleImpl extends ModelBusiDAO {
    /**
     * sql
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();

    @Override
    public void getModelBusiInfo(DynamicDict dict) throws BaseAppException {

        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String emsCode = (String) dict.getValueByName("EMS_CODE", "");
        String modelCode = (String) dict.getValueByName("MODEL_BUSI_CODE", "");
        String modelPhyCode = (String) dict.getValueByName("MODEL_PHY_CODE", "");
        String modelCodes = (String) dict.getValueByName("MODEL_BUSI_CODE_S", "");
        if (!("".equals(modelCodes))) {
            modelCodes = "'" + modelCodes.replaceAll("[',']", "','") + "'";
        }
        sql = "select b.ems_code,   \n"
            + "       b.ems_type_rel_id,   \n"
            + "       b.ems_ver_code,    \n"
            + "       a.model_busi_name,    \n"
            + "       a.model_busi_code,    \n"
            + "       b.model_phy_name,    \n"
            + "       a.model_phy_code,    \n"
            + "       b.model_phy_name||'('|| a.model_phy_code||')' as model_phy,    \n"
            + "       b.granu_mode,    \n"
            + "       b.model_type,    \n"
            + "       to_char(a.eff_time, 'yyyy-mm-dd') as eff_time,    \n"
            + "       to_char(a.exp_time, 'yyyy-mm-dd') as exp_time,    \n"
            + "       a.comments,        \n"
            + "       a.bp_id            \n"
            + "  from pm_model_busi a, pm_model_phy b    \n"
            + " where a.model_phy_code = b.model_phy_code    \n"
            + tool.ternaryExpression("".equals(emsCode), "", " and b.ems_code = ?   \n")
            + tool.ternaryExpression("".equals(emsRela), "", " and b.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(verCode), "", " and b.ems_ver_code = ?   \n")
            + tool.ternaryExpression("".equals(modelCode), "", " and a.model_busi_code = ?   \n")
            + tool.ternaryExpression("".equals(modelPhyCode), "", " and a.model_phy_code = ?   \n")
            + tool.ternaryExpression("".equals(modelCodes), "", " and a.model_busi_code in (" + modelCodes + ")  \n")
            + " order by a.model_busi_name, a.model_busi_code    \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(emsCode))) {
            params.set("", emsCode);
        }
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(modelCode))) {
            params.set("", modelCode);
        }
        if (!("".equals(modelPhyCode))) {
            params.set("", modelPhyCode);
        }
        dict.set("modelList", queryList(sql, params));
    }

    @Override
    public void getModelBusiField(DynamicDict dict) throws BaseAppException {
        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String emsCode = (String) dict.getValueByName("EMS_CODE", "");
        String modelCode = (String) dict.getValueByName("MODEL_BUSI_CODE", "");
        String modelPhyCode = (String) dict.getValueByName("MODEL_PHY_CODE", "");
        String fieldType = (String) dict.getValueByName("FIELD_TYPE", "");
        String modelCodes = (String) dict.getValueByName("MODEL_BUSI_CODE_S", "");
        if (!("".equals(modelCodes))) {
            modelCodes = "'" + modelCodes.replaceAll("[',']", "','") + "'";
        }

        // 模式{空:仅返回modelField结果集,ALL:返回modelField和distinctField结果集,DISTINCT:仅返回distinctField结果集}
        String mode = (String) dict.getValueByName("MODE", "");

        sql = "select a.model_busi_code,    \n"
            + "       a.field_name,    \n"
            + "       a.field_code,    \n"
            + "       to_char(a.eff_time, 'yyyy-mm-dd') as eff_time,    \n"
            + "       a.field_type,    \n"
            + "       a.data_type,    \n"
            + "       a.dim_code,    \n"
            + "       a.phy_col,        \n"
            + "       a.field_no,    \n"
            + "       a.bp_id,        \n"
            + "       b.model_busi_name,    \n"
            + "       b.model_phy_code,    \n"
            + "       c.model_phy_name,    \n"
            + "       c.granu_mode,    \n" 
            + "       c.model_type    \n"
            + "  from pm_model_busi_detail a, pm_model_busi b, pm_model_phy c    \n"
            + " where a.model_busi_code = b.model_busi_code    \n"
            + "   and b.model_phy_code = c.model_phy_code    \n"
            + tool.ternaryExpression("".equals(emsCode), "", " and c.ems_code = ?   \n")
            + tool.ternaryExpression("".equals(emsRela), "", " and c.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(verCode), "", " and c.ems_ver_code = ?   \n")
            + tool.ternaryExpression("".equals(modelCode), "", " and a.model_busi_code = ?   \n")
            + tool.ternaryExpression("".equals(modelPhyCode), "", " and c.model_phy_code = ?   \n")
            + tool.ternaryExpression("".equals(fieldType), "", " and a.field_type = ?   \n")
            + tool.ternaryExpression("".equals(modelCodes), "", " and a.model_busi_code in (" + modelCodes + ")  \n")
            + " order by a.model_busi_code, a.field_no asc        \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(emsCode))) {
            params.set("", emsCode);
        }
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(modelCode))) {
            params.set("", modelCode);
        }
        if (!("".equals(modelPhyCode))) {
            params.set("", modelPhyCode);
        }
        if (!("".equals(fieldType))) {
            params.set("", fieldType);
        }
        if (!"DISTINCT".equals(mode)) {
            dict.set("modelField", queryList(sql, params));
        }
        if ("ALL".equals(mode) || "DISTINCT".equals(mode)) {
            sql = "with model_busi_detail as    \n" 
                + " (" + sql + "),    \n"
                + "distinct_dim as    \n"
                + " (select distinct field_type,    \n"
                + "                  field_code as field_code,    \n"
                + "                  dim_code,    \n"
                + "                  data_type,    \n"
                + "                  trim(field_name) as field_name    \n"
                + "    from model_busi_detail    \n"
                + "   where field_type <> '1'),    \n"
                + "distinct_kpi as                \n"
                + " (select distinct t.field_type,    \n"
                + "                  t.field_code as field_code,    \n"
                + "                  '' as dim_code,    \n"
                + "                  t.data_type,    \n"
                + "                  k.kpi_name as field_name,    \n"
                + "                  k.ems_type_rel_id        \n"
                + "    from model_busi_detail t, pm_kpi k    \n"
                + "   where t.field_type = '1'                \n"
                + "     and t.field_code = k.kpi_code)        \n"
                + "select field_type, field_code, dim_code, data_type, field_name ,ems_type_rel_id from (    \n"
                + "    select field_type, field_code, dim_code, data_type, field_name ,'' as ems_type_rel_id, 0 as levelid    \n"
                + "      from distinct_dim    \n"
                + "   where upper(field_code) in ('STTIME','HH','MI')    \n"
                + "    union all    \n"
                + "    select field_type, field_code, dim_code, data_type, field_name ,'' as ems_type_rel_id , 1 as levelid    \n"
                + "      from distinct_dim    \n"
                + "   where upper(field_code) not in ('STTIME','HH','MI')    \n"
                + "    union all    \n"
                + "    select field_type, field_code, dim_code, data_type, field_name ,ems_type_rel_id, 2 as levelid    \n"
                + "      from distinct_kpi    \n"
                + ") order by levelid,field_name    \n";
                
            List<HashMap<String, String>> qryList = queryList(sql, params);
            List<HashMap<String, String>> dimList = new ArrayList<HashMap<String, String>>();
            List<HashMap<String, String>> kpiList = new ArrayList<HashMap<String, String>>();
            List<HashMap<String, String>> otherList = new ArrayList<HashMap<String, String>>();
            // ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
            for (int i = 0; i < qryList.size(); i++) {
                HashMap<String, String> qryMap = qryList.get(i);
                String qryKey = tool.ternaryExpression((qryMap.get("FIELD_TYPE") == null), "", qryMap.get("FIELD_TYPE")) + "|"
                    + tool.ternaryExpression((qryMap.get("FIELD_CODE") == null), "", qryMap.get("FIELD_CODE")) + "|"
                    + tool.ternaryExpression((qryMap.get("DIM_CODE") == null), "", qryMap.get("DIM_CODE")) + "|"
                    + tool.ternaryExpression((qryMap.get("DATA_TYPE") == null), "", qryMap.get("DATA_TYPE"));
                
                String qryVal = qryMap.get("FIELD_NAME");
                String qryType = qryMap.get("FIELD_TYPE");
                List<HashMap<String, String>> retList = new ArrayList<HashMap<String, String>>();
                if ("0".equals(qryType)) {
                    retList = dimList;
                }
                else if ("1".equals(qryType)) {
                    retList = kpiList;
                }
                else {
                    retList = otherList;
                }

                boolean isExist = false;
                for (int t = 0; t < retList.size(); t++) {
                    HashMap<String, String> map = retList.get(t);
                    String key = tool.ternaryExpression((map.get("FIELD_TYPE") == null), "", map.get("FIELD_TYPE")) + "|"
                        + tool.ternaryExpression((map.get("FIELD_CODE") == null), "", map.get("FIELD_CODE")) + "|"
                        + tool.ternaryExpression((map.get("DIM_CODE") == null), "", map.get("DIM_CODE")) + "|"
                        + tool.ternaryExpression((map.get("DATA_TYPE") == null), "", map.get("DATA_TYPE"));
                    
                    String value = map.get("FIELD_NAME");
                    if (qryKey.equals(key)) {
                        map.put("FIELD_NAME", value + "/" + qryVal);
                        map.put("KEY", key);
                        retList.set(t, map);
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    qryMap.put("KEY", qryKey);
                    if ("0".equals(qryType)) {
                        dimList.add(qryMap);
                    }
                    else if ("1".equals(qryType)) {
                        kpiList.add(qryMap);
                    }
                    else {
                        otherList.add(qryMap);
                    }
                }
            }

            dict.set("DIMS", dimList);
            dict.set("KPIS", kpiList);
            dict.set("OTHERS", otherList);

        }
    }
    
    @Override
    public void addModelBusiInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        sql = "select count(1) as count from pm_model_busi where model_busi_code = ?";
        params.set("", dict.getString("MODEL_BUSI_CODE", true));
        int count = queryInt(sql, params);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "CODE已经存在.");
        }

        sql = "insert into pm_model_busi    \n"
            + "  (model_busi_name,    \n"
            + "   model_busi_code,    \n"
            + "   model_phy_code,    \n"
            + "   eff_time,    \n"
            + "   exp_time,    \n"
            + "   comments,    \n"
            + "   bp_id)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?, ?, ?, ?)    \n";
        params.clear();
        params.set("", dict.getString("MODEL_BUSI_NAME", true));
        params.set("", dict.getString("MODEL_BUSI_CODE", true));
        params.set("", dict.getString("MODEL_PHY_CODE", true));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("BP_ID"));

        executeUpdate(sql, params);

        this.batchAddField(dict);
    }

    @Override
    public void editModelBusiInfo(DynamicDict dict) throws BaseAppException {
        sql = "update pm_model_busi            \n"
            + "   set model_busi_name = ?,    \n"
            + "       model_phy_code  = ?,    \n"
            + "       eff_time        = ?,    \n"
            + "       exp_time        = ?,    \n"
            + "       comments        = ?,    \n"
            + "       bp_id           = ?    \n"
            + " where model_busi_code  = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("MODEL_BUSI_NAME", true));
        params.set("", dict.getString("MODEL_PHY_CODE", true));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("MODEL_BUSI_CODE", true));
        
        executeUpdate(sql, params);
        
        this.batchAddField(dict);
    }

    @Override
    public void delModelBusiInfo(DynamicDict dict) throws BaseAppException {
        sql = "delete from pm_model_busi_detail where model_busi_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("MODEL_BUSI_CODE", true));
        executeUpdate(sql, params);

        sql = "delete from pm_model_busi where model_busi_code = ? \n";
        executeUpdate(sql, params);

    }
    
    /**
     * 
     * 批量循环新增字段 <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void batchAddField(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String modelCode = dict.getString("MODEL_BUSI_CODE", true);
        sql = "delete from pm_model_busi_detail where model_busi_code = ?    \n";
        params.set("", modelCode);
        executeUpdate(sql, params);

        sql = "insert into pm_model_busi_detail    \n"
            + "  (model_busi_code,\n"
            + "   field_name,    \n"
            + "   field_code,    \n"
            + "   eff_time,        \n"
            + "   field_type,    \n"
            + "   data_type,    \n"
            + "   dim_code,    \n"
            + "   phy_col,    \n"
            + "   field_no,    \n"
            + "   bp_id)        \n"
            + "values        \n"
            + "  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        int count = dict.getCount("modelField");
        for (int i = 0; i < count; i++) {
            DynamicDict fieldDict = dict.getBO("modelField", i);
            String effTime = (String) fieldDict.getValueByName("EFF_TIME", "");
            if ("&#160;".equals(effTime)) {
                effTime = "";
            }
            fieldDict.set("EFF_TIME", effTime.replaceAll("['/']", "-"));
            ParamArray param = new ParamArray();
            param.set("", modelCode);
            param.set("", fieldDict.getString("FIELD_NAME", true));
            param.set("", fieldDict.getString("FIELD_CODE", true));
            param.set("", fieldDict.getDate("EFF_TIME"));
            param.set("", fieldDict.getString("FIELD_TYPE"));
            param.set("", fieldDict.getString("DATA_TYPE"));
            param.set("", fieldDict.getString("DIM_CODE"));
            param.set("", fieldDict.getString("PHY_COL"));
            param.set("", i);
            param.set("", fieldDict.getString("BP_ID"));
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
}
