package com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao.oracle;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.kpi.dao.KPIDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;

/**
 * 
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
    
    @Override
    public void getKPIInfo(DynamicDict dict) throws BaseAppException {
        
        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String kpiCode = (String) dict.getValueByName("KPI_CODE", "");
        String isAnalysis = (String) dict.getValueByName("IS_ANALYSIS", "");
        String kpiCodes = (String) dict.getValueByName("KPI_CODE_S", "");

        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }
        
        sql = "select a.kpi_name,    \n"
            + "       a.kpi_code,    \n"
            + "       a.ems_type_rel_id,    \n"
            + "       to_char(a.eff_time,'yyyy-mm-dd') as eff_time,    \n"
            + "       to_char(a.exp_time,'yyyy-mm-dd') as exp_time,    \n"
            + "       a.dirt,        \n"
            + "       a.kpi_type,    \n"
            + "       a.data_type,    \n"
            + "       a.unit,        \n"
            + "       a.prec,        \n"
            + "       a.def_value,    \n"
            + "       a.kpi_aname,    \n"
            + "       a.is_analysis,    \n"
            + "       a.comments,    \n"
            + "       a.bp_id        \n"
            + "  from pm_kpi a        \n"
            + " where 1 = 1            \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(kpiCode), "", " and a.kpi_code = ?   \n")
            + tool.ternaryExpression("".equals(isAnalysis), "", " and a.is_analysis = ?   \n")
            + tool.ternaryExpression("".equals(kpiCodes), "", " and a.kpi_code in (" + kpiCodes + ")   \n")
            + " order by a.kpi_name, a.kpi_code    \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(kpiCode))) {
            params.set("", kpiCode);
        }
        if (!("".equals(isAnalysis))) {
            params.set("", isAnalysis);
        }
        dict.set("kpiList", queryList(sql, params));
    }
    
    @Override
    public void getKPIFormular(DynamicDict dict) throws BaseAppException {
        String kpiCode = (String) dict.getValueByName("KPI_CODE", "");
        String kpiCodes = (String) dict.getValueByName("KPI_CODE_S", "");
        if (!("".equals(kpiCodes))) {
            kpiCodes = "'" + kpiCodes.replaceAll("[',']", "','") + "'";
        }
        sql = "select a.kpi_code,    \n"
            + "       a.ems_ver_code,\n"
            + "       a.kpi_agg,        \n"
            + "       a.kpi_form,    \n"
            + "       a.kpi_cond,    \n"
            + "       a.kpi_version,    \n"
            + "       a.bp_id,        \n"
            + "       b.kpi_name,    \n"
            + "       b.kpi_type,    \n"
            + "       b.data_type,    \n"
            + "       b.def_value,    \n"
            + "       b.unit,        \n"
            + "       b.dirt,        \n"
            + "       b.prec            \n"
            + "  from pm_kpi_form a ,pm_kpi b    \n"
            + " where a.kpi_code = b.kpi_code     \n"
            + tool.ternaryExpression("".equals(kpiCode), "", " and a.kpi_code = ?   \n")
            + tool.ternaryExpression("".equals(kpiCodes), "", " and a.kpi_code in (" + kpiCodes + ")   \n");
        
        ParamArray params = new ParamArray();
        if (!("".equals(kpiCode))) {
            params.set("", kpiCode);
        }
        dict.set("kpiFormular", queryList(sql, params));
    }
    
    @Override
    public void addKPIInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        sql = "select count(1) as count from pm_kpi where kpi_code = ?";
        params.set("", dict.getString("KPI_CODE", true));
        int count = queryInt(sql, params);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "CODE已经存在.");
        }
        
        sql = "insert into pm_kpi    \n"
            + "  (kpi_name,            \n"
            + "   kpi_code,            \n"
            + "   ems_type_rel_id,    \n"
            + "   eff_time,            \n"
            + "   exp_time,            \n"
            + "   dirt,                \n"
            + "   kpi_type,            \n"
            + "   data_type,            \n"
            + "   unit,                \n"
            + "   prec,                \n"
            + "   def_value,            \n"
            + "   kpi_aname,            \n"
            + "   is_analysis,        \n"
            + "   comments,            \n"
            + "   bp_id)                \n"
            + "values                \n"
            + "  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
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
        sql = "update pm_kpi    \n"
            + "   set kpi_name        = ?,    \n"
            + "       ems_type_rel_id = ?,    \n"
            + "       eff_time        = ?,    \n"
            + "       exp_time        = ?,    \n"
            + "       dirt            = ?,    \n"
            + "       kpi_type        = ?,    \n"
            + "       data_type       = ?,    \n"
            + "       unit            = ?,    \n"
            + "       prec            = ?,    \n"
            + "       def_value       = ?,    \n"
            + "       kpi_aname       = ?,    \n"
            + "       is_analysis     = ?,    \n"
            + "       comments        = ?,    \n"
            + "       bp_id           = ?    \n"
            + " where kpi_code = ?    \n";
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
        sql = "delete from pm_kpi_form where kpi_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("KPI_CODE", true));
        executeUpdate(sql, params);
        
        sql = "delete from pm_kpi where kpi_code = ? \n";
        executeUpdate(sql, params);
        
    }
    
    /**
     * 
     * batchAddFormular <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void batchAddFormular(DynamicDict dict) throws BaseAppException {
        
        ParamArray params = new ParamArray();
        String kpiCode = dict.getString("KPI_CODE", true);
        sql = "delete from pm_kpi_form where kpi_code = ?    \n";
        params.set("", kpiCode);
        executeUpdate(sql, params);

        sql = "insert into pm_kpi_form    \n"
            + "  (kpi_code, ems_code, ems_ver_code, kpi_agg, kpi_form, kpi_cond, kpi_version, bp_id)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?, ?, ?, ?, ?)    \n";
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
