package com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao.mysql;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao.ModelPhyDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;

/**
 * 
 * PM元数据-物理模型管理相关的Mysql DAO操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-10 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao.mysql <br>
 */
public class ModelPhyDAOMysqlImpl extends ModelPhyDAO {
    /**
     * sql
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();
    
    @Override
    public void getModelPhyInfo(DynamicDict dict) throws BaseAppException {

        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String modelCode = (String) dict.getValueByName("MODEL_PHY_CODE", "");
        String modelType = (String) dict.getValueByName("MODEL_TYPE", "");
        String modelCodes = (String) dict.getValueByName("MODEL_PHY_CODE_S", "");
        if (!("".equals(modelCodes))) {
            modelCodes = "'" + modelCodes.replaceAll("[',']", "','") + "'";
        }

        sql = "select a.model_phy_name, \n"
            + "       a.model_phy_code, \n"
            + "       a.ems_type_rel_id,\n"
            + "       a.ems_ver_code,    \n"
            + "       a.ems_code,    \n"
            + "       concat_ws('', a.model_phy_name,'(', a.model_phy_code,')') as model_phy,    \n"
            + "       to_char(a.eff_time, 'yyyy-mm-dd') as eff_time,    \n"
            + "       to_char(a.exp_time, 'yyyy-mm-dd') as exp_time,    \n"
            + "       a.granu_mode,    \n"
            + "       a.model_type,    \n"
            + "       a.comments,    \n"
            + "       a.bp_id    \n"
            + "  from pm_model_phy a    \n"
            + " where 1 = 1    \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(verCode), "", " and a.ems_ver_code = ?   \n")
            + tool.ternaryExpression("".equals(modelCode), "", " and a.model_phy_code = ?   \n")
            + tool.ternaryExpression("".equals(modelType), "", " and a.model_type = ?   \n")
            + tool.ternaryExpression("".equals(modelCodes), "", " and a.model_phy_code in (" + modelCodes + ")   \n")
            + " order by a.model_phy_name, a.model_phy_code    \n";

        ParamArray params = new ParamArray();
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(modelCode))) {
            params.set("", modelCode);
        }
        if (!("".equals(modelType))) {
            params.set("", modelType);
        }
        dict.set("modelList", queryList(sql, params));
    }

    @Override
    public void getModelPhyScript(DynamicDict dict) throws BaseAppException {
        String modelCode = dict.getString("MODEL_PHY_CODE");
        
        sql = "select a.model_phy_code, a.script_type, a.script, a.script_no, a.bp_id    \n"
            + "  from pm_model_phy_script a    \n"
            + " where a.model_phy_code = ?    \n"
            + " order by a.model_phy_code, a.script_type, a.script_no    \n";
        
        ParamArray params = new ParamArray();
        params.set("", modelCode);
        dict.set("modelScript", queryList(sql, params));
    }

    @Override
    public void getModelPhyDataSource(DynamicDict dict) throws BaseAppException {
        String modelCode = dict.getString("MODEL_PHY_CODE");
        
        sql = "select a.model_phy_code, a.granu, a.data_source, a.bp_id    \n"
            + "  from pm_phy_db_rel a    \n"
            + " where a.model_phy_code = ?    \n";
            
        
        ParamArray params = new ParamArray();
        params.set("", modelCode);
        dict.set("modelDataSource", queryList(sql, params));
    }
    
    @Override
    public void addModelPhyInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        sql = "select count(1) as count from pm_model_phy where model_phy_code = ?";
        params.set("", dict.getString("MODEL_PHY_CODE", true));
        int count = queryInt(sql, params);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "CODE已经存在.");
        }

        sql = "insert into pm_model_phy    \n"
            + "  (model_phy_name,    \n"
            + "   model_phy_code,    \n"
            + "   ems_type_rel_id,    \n"
            + "   ems_ver_code,        \n"
            + "   ems_code,    \n"
            + "   eff_time,    \n"
            + "   exp_time,    \n"
            + "   granu_mode,\n"
            + "   model_type,\n"
            + "   comments,    \n"
            + "   bp_id)        \n"
            + "values        \n"
            + "  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        params.clear();
        params.set("", dict.getString("MODEL_PHY_NAME", true));
        params.set("", dict.getString("MODEL_PHY_CODE", true));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("GRANU_MODE"));
        params.set("", dict.getString("MODEL_TYPE"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("BP_ID"));
        
        executeUpdate(sql, params);
        
        this.batchAddScript(dict);
        
        this.addModelPhyDataSource(dict);
    }
    
    @Override
    public void editModelPhyInfo(DynamicDict dict) throws BaseAppException {
        sql = "update pm_model_phy    \n"
            + "   set model_phy_name  = ?,    \n"
            + "       ems_type_rel_id = ?,    \n"
            + "       ems_ver_code    = ?,    \n"
            + "       ems_code        = ?,    \n"
            + "       eff_time        = ?,    \n"
            + "       exp_time        = ?,    \n"
            + "       granu_mode      = ?,    \n"
            + "       model_type      = ?,    \n"
            + "       comments        = ?,    \n"
            + "       bp_id           = ?    \n"
            + " where model_phy_code  = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("MODEL_PHY_NAME", true));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("GRANU_MODE"));
        params.set("", dict.getString("MODEL_TYPE"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("MODEL_PHY_CODE", true));

        executeUpdate(sql, params);

        this.batchAddScript(dict);

        this.addModelPhyDataSource(dict);
    }

    @Override
    public void delModelPhyInfo(DynamicDict dict) throws BaseAppException {
        sql = "delete from pm_model_phy_script where model_phy_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("MODEL_PHY_CODE", true));
        executeUpdate(sql, params);

        sql = "delete from pm_phy_db_rel where model_phy_code = ? \n";
        executeUpdate(sql, params);

        sql = "delete from pm_model_phy where model_phy_code = ? \n";
        executeUpdate(sql, params);

    }
    
    /**
     * 
     * 批量循环新增脚本 <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void batchAddScript(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String modelCode = dict.getString("MODEL_PHY_CODE", true);
        sql = "delete from pm_model_phy_script where model_phy_code = ?    \n";
        params.set("", modelCode);
        executeUpdate(sql, params);

        sql = "insert into pm_model_phy_script    \n"
            + "  (model_phy_code, script_type, script, script_no, bp_id)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?, ?)    \n";
        int count = dict.getCount("modelScript");
        int split = 1000;
        for (int i = 0; i < count; i++) {
            DynamicDict scriptDict = dict.getBO("modelScript", i);
            String script = (String) scriptDict.getValueByName("SCRIPT", "");
            int sl = script.length();
            int no = (int) Math.ceil((sl * 100) / (split * 100.0));
            for (int k = 0; k < no; k++) {
                ParamArray param = new ParamArray();
                param.set("", modelCode);
                param.set("", scriptDict.getString("SCRIPT_TYPE", true));
                param.set("", script.substring(k * split, tool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
                param.set("", k);
                param.set("", scriptDict.getString("BP_ID"));
                executeUpdate(sql, param);
            }
        }
    }

    @Override
    public void addModelPhyDataSource(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String modelCode = dict.getString("MODEL_PHY_CODE", true);
        sql = "delete from pm_phy_db_rel where model_phy_code = ?    \n";
        params.set("", modelCode);
        executeUpdate(sql, params);
        
        sql = "insert into pm_phy_db_rel    \n"
            + "  (model_phy_code, granu, data_source, bp_id)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?)    \n";
        int count = dict.getCount("modelDataSource");
        for (int i = 0; i < count; i++) {
            DynamicDict scriptDict = dict.getBO("modelDataSource", i);
            ParamArray param = new ParamArray();
            param.set("", modelCode);
            param.set("", scriptDict.getString("GRANU", true));
            param.set("", scriptDict.getString("DATA_SOURCE", true));
            param.set("", scriptDict.getString("BP_ID"));
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
