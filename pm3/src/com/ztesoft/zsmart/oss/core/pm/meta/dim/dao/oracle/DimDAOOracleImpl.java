package com.ztesoft.zsmart.oss.core.pm.meta.dim.dao.oracle;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.dim.dao.DimDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;

/**
 * 
 * PM元数据-维度管理相关的Oracle DAO操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-3 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.dao.oracle <br>
 */
public class DimDAOOracleImpl extends DimDAO {
    /**
     * sql
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();
    @Override
    public void getDimInfo(DynamicDict dict) throws BaseAppException {
        String dimCode = (String) dict.getValueByName("DIM_CODE", "");
        String dimCodes = (String) dict.getValueByName("DIM_CODE_S", "");
        if (!("".equals(dimCodes))) {
            dimCodes = "'" + dimCodes.replaceAll("[',']", "','") + "'";
        }
        
        sql = "select a.dim_name,    \n"
            + "       a.dim_code,    \n"
            + "       a.dim_desc,    \n"
            + "       a.bp_id    \n"
            + "  from pm_dim a    \n"
            + " where 1 = 1    \n"
            + tool.ternaryExpression("".equals(dimCode), "", " and a.dim_code = ?   \n")
            + tool.ternaryExpression("".equals(dimCodes), "", " and a.dim_code in (" + dimCodes + ")   \n")
            + " order by a.dim_name asc,a.dim_code asc    \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(dimCode))) {
            params.set("", dimCode);
        }
        dict.set("dimList", queryList(sql, params));
        
        sql = "select a.dim_code, a.script_type, a.dim_script, a.dim_script_no, a.bp_id    \n"
            + "  from pm_dim_script a    \n"
            + " where exists (select 1 from pm_dim d where d.dim_code = a.dim_code)    \n"
            + tool.ternaryExpression("".equals(dimCode), "", " and a.dim_code = ?   \n")
            + tool.ternaryExpression("".equals(dimCodes), "", " and a.dim_code in (" + dimCodes + ")   \n")
            + " order by a.dim_code, a.script_type, a.dim_script_no asc    \n";
        dict.set("scriptList", queryList(sql, params));
    }

    @Override
    public void addDimInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        sql = "select count(1) as count from pm_dim where dim_code = ?";
        params.set("", dict.getString("DIM_CODE", true));
        int count = queryInt(sql, params);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "CODE已经存在.");
        }
        
        sql = "insert into pm_dim    \n"
            + "  (dim_name, dim_code, dim_desc, bp_id)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?)    \n";
        params.clear();
        params.set("", dict.getString("DIM_NAME", true));
        params.set("", dict.getString("DIM_CODE", true));
        params.set("", dict.getString("DIM_DESC"));
        params.set("", dict.getString("BP_ID"));
        
        executeUpdate(sql, params);
        
        this.batchAddScript(dict);
    }
    
    @Override
    public void editDimInfo(DynamicDict dict) throws BaseAppException {
        sql = "update pm_dim set dim_name = ?, dim_desc = ?, bp_id = ? where dim_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("DIM_NAME", true));
        params.set("", dict.getString("DIM_DESC"));
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("DIM_CODE", true));
        
        executeUpdate(sql, params);
        
        this.batchAddScript(dict);
    }
    
    @Override
    public void delDimInfo(DynamicDict dict) throws BaseAppException {
        sql = "delete from pm_dim_script where dim_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("DIM_CODE", true));
        executeUpdate(sql, params);

        sql = "delete from pm_dim where dim_code = ? \n";
        executeUpdate(sql, params);
        
    }
    /**
     * 
     * 批量循环增加Script <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void batchAddScript(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String dimCode = dict.getString("DIM_CODE", true);
        sql = "delete from pm_dim_script where dim_code = ?    \n";
        params.set("", dimCode);
        executeUpdate(sql, params);
        
        sql = "insert into pm_dim_script    \n"
            + "  (dim_code, script_type, dim_script, dim_script_no, bp_id)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?, ?)    \n";
        int count = dict.getCount("scriptList");
        int split = 1000;
        for (int i = 0; i < count; i++) {
            DynamicDict scriptDict = dict.getBO("scriptList", i);
            String script = (String) scriptDict.getValueByName("DIM_SCRIPT", "");
            int sl = script.length();
            int no = (int) Math.ceil((sl * 100) / (split * 100.0));
            for (int k = 0; k < no; k++) {
                ParamArray param = new ParamArray();
                param.set("", dimCode);
                param.set("", scriptDict.getString("SCRIPT_TYPE", true));
                param.set("", script.substring(k * split, tool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
                param.set("", k);
                param.set("", scriptDict.getString("BP_ID"));
                executeUpdate(sql, param);
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
