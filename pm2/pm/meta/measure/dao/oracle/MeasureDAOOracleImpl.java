package com.ztesoft.zsmart.oss.core.pm.meta.measure.dao.oracle;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.measure.dao.MeasureDAO;
import com.ztesoft.zsmart.oss.core.pm.util.domain.AbstractUtilInfo;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;

/**
 * 
 * PM元数据-测量对象管理相关的Oracle DAO操作实现类 <br> 
 *  
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-7 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.measure.dao.oracle <br>
 */
public class MeasureDAOOracleImpl extends MeasureDAO {
    /**
     * sql
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();

    @Override
    public void getMeasureInfo(DynamicDict dict) throws BaseAppException {

        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String moCode = (String) dict.getValueByName("MO_CODE", "");
        String moType = (String) dict.getValueByName("MO_TYPE", "");
        String moCodes = (String) dict.getValueByName("MO_CODE_S", "");
        if (!("".equals(moCodes))) {
            moCodes = "'" + moCodes.replaceAll("[',']", "','") + "'";
        }
        
        sql = "select a.ems_type_rel_id,    \n"
            + "       a.ems_ver_code,    \n"
            + "       a.mo_name,        \n"
            + "       a.mo_code,        \n"
            + "       a.ems_code,    \n"
            + "       to_char(a.eff_time, 'yyyy-mm-dd') as eff_time,    \n"
            + "       to_char(a.exp_time, 'yyyy-mm-dd') as exp_time,    \n"
            + "       a.mo_type,            \n"
            + "       a.filename_rule,    \n"
            + "       a.proc_rule,        \n"
            + "       a.sepa_str,        \n"
            + "       a.is_col_header,    \n"
            + "       a.is_quot,        \n"
            + "       a.comments,    \n"
            + "       a.mo_name_desc,\n"
            + "       a.bp_id,    \n"
            + "        (select p.plugin_spec_no  \n"
            + "          from pm_pluginserv p    \n"
            + "         where p.plugin_no = a.filename_rule      \n"
            + "           and p.seq = 0                          \n"
            + "           and p.plugin_type = '03'               \n"
            + "           and rownum < 2) as filename_rule_spec, \n"
            + "        (select p.plugin_spec_no  \n"
            + "          from pm_pluginserv p    \n"
            + "         where p.plugin_no = a.proc_rule         \n"
            + "           and p.seq = 0                         \n"
            + "           and p.plugin_type = '04'              \n"
            + "           and rownum < 2) as proc_rule_spec     \n"
            + "  from pm_mo a    \n"
            + " where 1 = 1        \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(verCode), "", " and a.ems_ver_code = ?   \n")
            + tool.ternaryExpression("".equals(moCode), "", " and a.mo_code = ?   \n")
            + tool.ternaryExpression("".equals(moType), "", " and a.mo_type = ?   \n")
            + tool.ternaryExpression("".equals(moCodes), "", " and a.mo_code in (" + moCodes + ")   \n")
            + " order by a.mo_name, a.mo_code    \n";
        
        ParamArray params = new ParamArray();
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(moCode))) {
            params.set("", moCode);
        }
        if (!("".equals(moType))) {
            params.set("", moType);
        }
        dict.set("moList", queryList(sql, params));
    }

    @Override
    public void getMeasureField(DynamicDict dict) throws BaseAppException {
        String moCode = (String) dict.getValueByName("MO_CODE", "");
        String fieldType = (String) dict.getValueByName("FIELD_TYPE", "");
        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String moCodes = (String) dict.getValueByName("MO_CODE_S", "");
        if (!("".equals(moCodes))) {
            moCodes = "'" + moCodes.replaceAll("[',']", "','") + "'";
        }
        
        sql = "select a.mo_code,        \n"
            + "       a.field_name,    \n"
            + "       a.field_code,    \n"
            + "       to_char(a.eff_time, 'yyyy-mm-dd') as eff_time,    \n"
            + "       a.field_type,    \n"
            + "       a.data_type,    \n"
            + "       a.vafield,        \n"
            + "       a.field_no,    \n"
            + "       a.comments,    \n"
            + "       b.mo_name,        \n"
            + "       b.ems_type_rel_id,    \n"
            + "       b.ems_ver_code        \n"
            + "  from pm_mo_detail a,pm_mo b    \n"
            + " where a.mo_code = b.mo_code    \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and b.ems_type_rel_id = ?   \n")
            + tool.ternaryExpression("".equals(verCode), "", " and b.ems_ver_code = ?   \n")
            + tool.ternaryExpression("".equals(moCode), "", " and a.mo_code = ?   \n")
            + tool.ternaryExpression("".equals(fieldType), "", " and a.field_type = ?   \n")
            + tool.ternaryExpression("".equals(moCodes), "", " and a.mo_code in (" + moCodes + ")   \n")
            
            + " order by a.field_no asc    \n";
        
        ParamArray params = new ParamArray();

        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(moCode))) {
            params.set("", moCode);
        }
        if (!("".equals(fieldType))) {
            params.set("", fieldType);
        }
        dict.set("moField", queryList(sql, params));
    }
    
    @Override
    public void addMeasureInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        sql = "select count(1) as count from pm_mo where mo_code = ?";
        params.set("", dict.getString("MO_CODE", true));
        int count = queryInt(sql, params);
        if (count > 0) {
            throw new BaseAppException("S-PM-DAO-0001", "CODE已经存在.");
        }

        String fileNameRule = "";
        String procRule = "";
        if (dict.getCount("fileNamePlugin") > 0) {
            DynamicDict fileNameDict = dict.getBO("fileNamePlugin");
            getUtilDmo().operPluginParam(fileNameDict);
            fileNameRule = (String) fileNameDict.getValueByName("PLUGIN_NO", "");
            dict.setValueByName("FILENAME_RULE", fileNameRule);
        }
        if (dict.getCount("procRulePlugin") > 0) {
            DynamicDict procRuleDict = dict.getBO("procRulePlugin");
            getUtilDmo().operPluginParam(procRuleDict);
            procRule = (String) procRuleDict.getValueByName("PLUGIN_NO", "");
            dict.setValueByName("PROC_RULE", procRule);
        }

        sql = "insert into pm_mo        \n"
            + "  (ems_type_rel_id,    \n"
            + "   ems_ver_code,        \n"
            + "   mo_name,    \n"
            + "   mo_code,    \n"
            + "   ems_code,    \n"
            + "   eff_time,    \n"
            + "   exp_time,    \n"
            + "   mo_type,    \n"
            + "   filename_rule,    \n"
            + "   proc_rule,        \n"
            + "   sepa_str,        \n"
            + "   is_col_header,    \n"
            + "   is_quot,        \n"
            + "   comments,        \n"
            + "   mo_name_desc,    \n"
            + "   bp_id)            \n"
            + "values            \n"
            + "  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        params.clear();
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("MO_NAME", true));
        params.set("", dict.getString("MO_CODE", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("MO_TYPE"));
        params.set("", fileNameRule);
        params.set("", procRule);
        params.set("", dict.getString("SEPA_STR"));
        params.set("", dict.getString("IS_COL_HEADER"));
        params.set("", dict.getString("IS_QUOT"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("MO_NAME_DESC"));
        params.set("", dict.getString("BP_ID"));
        
        executeUpdate(sql, params);
        
        this.batchAddField(dict);
    }
    
    @Override
    public void editMeasureInfo(DynamicDict dict) throws BaseAppException {

        String fileNameRule = "";
        String procRule = "";
        if (dict.getCount("fileNamePlugin") > 0) {
            DynamicDict fileNameDict = dict.getBO("fileNamePlugin");
            getUtilDmo().operPluginParam(fileNameDict);
            fileNameRule = (String) fileNameDict.getValueByName("PLUGIN_NO", "");
            dict.setValueByName("FILENAME_RULE", fileNameRule);
        }
        if (dict.getCount("procRulePlugin") > 0) {
            DynamicDict procRuleDict = dict.getBO("procRulePlugin");
            getUtilDmo().operPluginParam(procRuleDict);
            procRule = (String) procRuleDict.getValueByName("PLUGIN_NO", "");
            dict.setValueByName("PROC_RULE", procRule);
        }

        sql = "update pm_mo    \n"
            + "   set ems_type_rel_id = ?,    \n"
            + "       ems_ver_code    = ?,    \n"
            + "       mo_name         = ?,    \n"
            + "       ems_code        = ?,    \n"
            + "       eff_time        = ?,    \n"
            + "       exp_time        = ?,    \n"
            + "       mo_type         = ?,    \n"
            + "       filename_rule   = ?,    \n"
            + "       proc_rule       = ?,    \n"
            + "       sepa_str        = ?,    \n"
            + "       is_col_header   = ?,    \n"
            + "       is_quot         = ?,    \n"
            + "       comments        = ?,    \n"
            + "       mo_name_desc    = ?,    \n"
            + "       bp_id           = ?    \n"
            + " where mo_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("MO_NAME", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getDate("EFF_TIME"));
        params.set("", dict.getDate("EXP_TIME"));
        params.set("", dict.getString("MO_TYPE"));
        params.set("", fileNameRule);
        params.set("", procRule);
        params.set("", dict.getString("SEPA_STR"));
        params.set("", dict.getString("IS_COL_HEADER"));
        params.set("", dict.getString("IS_QUOT"));
        params.set("", dict.getString("COMMENTS"));
        params.set("", dict.getString("MO_NAME_DESC"));
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("MO_CODE", true));
        
        executeUpdate(sql, params);
        
        this.batchAddField(dict);
    }
    
    @Override
    public void delMeasureInfo(DynamicDict dict) throws BaseAppException {

        if (dict.getCount("fileNamePlugin") > 0) {
            DynamicDict fileNameDict = dict.getBO("fileNamePlugin");
            getUtilDmo().operPluginParam(fileNameDict);
        }
        if (dict.getCount("procRulePlugin") > 0) {
            DynamicDict procRuleDict = dict.getBO("procRulePlugin");
            getUtilDmo().operPluginParam(procRuleDict);
        }
        sql = "delete from pm_mo_detail where mo_code = ?    \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("MO_CODE", true));
        executeUpdate(sql, params);
        
        sql = "delete from pm_mo where mo_code = ? \n";
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
        String moCode = dict.getString("MO_CODE", true);
        sql = "delete from pm_mo_detail where mo_code = ?    \n";
        params.set("", moCode);
        executeUpdate(sql, params);

        sql = "insert into pm_mo_detail    \n"
            + "  (mo_code,field_name,field_code,eff_time,field_type,data_type,vafield,field_no,comments)    \n"
            + "values    \n"
            + "  (?, ?, ?, ?, ?, ?, ?, ?, ?)    \n";
        int count = dict.getCount("moField");
        for (int i = 0; i < count; i++) {
            DynamicDict fieldDict = dict.getBO("moField", i);
            String effTime = (String) fieldDict.getValueByName("EFF_TIME", "");
            if ("&#160;".equals(effTime)) {
                effTime = "";
            }
            fieldDict.set("EFF_TIME", effTime.replaceAll("['/']", "-"));
            ParamArray param = new ParamArray();
            param.set("", moCode);
            param.set("", fieldDict.getString("FIELD_NAME", true));
            param.set("", fieldDict.getString("FIELD_CODE", true));
            param.set("", fieldDict.getDate("EFF_TIME"));
            param.set("", fieldDict.getString("FIELD_TYPE"));
            param.set("", fieldDict.getString("DATA_TYPE"));
            param.set("", fieldDict.getString("VAFIELD"));
            param.set("", i);
            param.set("", fieldDict.getString("COMMENTS"));
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
