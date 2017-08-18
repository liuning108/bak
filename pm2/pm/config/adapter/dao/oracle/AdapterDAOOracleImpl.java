package com.ztesoft.zsmart.oss.core.pm.config.adapter.dao.oracle;

import java.util.Date;
import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.core.pm.config.adapter.dao.AdapterDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM配置管理-适配器管理相关的Oracle DAO操作实现类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-16 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.adapter.dao.oracle <br>
 */
public class AdapterDAOOracleImpl extends AdapterDAO {

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
    public void getAdapterInfo(DynamicDict dict) throws BaseAppException {

        String emsRela = (String) dict.getValueByName("EMS_TYPE_REL_ID", "");
        String verCode = (String) dict.getValueByName("EMS_VER_CODE", "");
        String adapterNo = (String) dict.getValueByName("ADAPTER_NO", "");
        String adapterName = (String) dict.getValueByName("ADAPTER_NAME", "");
        String pluginType = (String) dict.getValueByName("PLUGIN_TYPE", "00");
        
        sql = "select a.adapter_no, \n" 
            + "       a.adapter_name,   \n" 
            + "       a.seq,        \n" 
            + "       a.ems_code,   \n"
            + "       a.ems_type_rel_id,\n" 
            + "       a.ems_ver_code,   \n" 
            + "       a.protocol_type,  \n" 
            + "       a.plugin_no,      \n"
            + "       b.plugin_spec_no, \n" 
            + "       b.plugin_name,    \n" 
            + "       a.state,          \n" 
            + "       a.oper_user,      \n"
            + "       to_char(a.oper_date, 'yyyy-mm-dd hh24:mi:ss') as oper_date,   \n" 
            + "       a.bp_id               \n"
            + "  from pm_adapter_info a,    \n"
            + " (select p.plugin_no, p.plugin_spec_no, s.plugin_name      \n"
            + "   from pm_pluginserv p, pm_spec_pluginserv s    \n"
            + "  where p.plugin_type = ?    \n"
            + "    and s.plugin_type = p.plugin_type \n"
            + "    and s.seq = 0 \n"
            + "    and p.seq = 0 \n"
            + "    and p.plugin_spec_no = s.plugin_spec_no ) b \n"
            + " where a.seq = 0             \n" 
            + "  and a.plugin_no = b.plugin_no(+)  \n"
            + tool.ternaryExpression("".equals(emsRela), "", " and a.ems_type_rel_id = ?    \n")
            + tool.ternaryExpression("".equals(verCode), "", " and a.ems_ver_code = ?    \n")
            + tool.ternaryExpression("".equals(adapterNo), "", " and a.adapter_no = ?    \n")
            + tool.ternaryExpression("".equals(adapterName), "", " and upper(a.adapter_name) like '%' || upper(?) || '%'    \n")
            + " order by a.adapter_name    \n";

        ParamArray params = new ParamArray();
        params.set("", pluginType);
        
        if (!("".equals(emsRela))) {
            params.set("", emsRela);
        }
        if (!("".equals(verCode))) {
            params.set("", verCode);
        }
        if (!("".equals(adapterNo))) {
            params.set("", adapterNo);
        }
        if (!("".equals(adapterName))) {
            params.set("", adapterName);
        }
        dict.set("adapterList", queryList(sql, params));
    }

    @Override
    public void getAdapterMapping(DynamicDict dict) throws BaseAppException {
        String adapterNo = dict.getString("ADAPTER_NO", true);
        ParamArray params = new ParamArray();
        params.set("", adapterNo);

        sql = "select a.adapter_no, a.seq, a.mo_code, a.model_code,a.granu  \n" 
            + "  from pm_adapter_mo a   \n" 
            + " where a.seq = 0         \n"
            + "   and a.adapter_no = ?   \n";

        dict.set("adapterMO", queryList(sql, params));

        sql = "select a.adapter_no, a.seq, a.mo_code, a.db_dialect, a.sql_seq, a.map_sql   \n" 
            + "  from pm_adapter_mapping a   \n"
            + " where a.seq = 0   \n" 
            + "   and a.adapter_no = ?   \n" 
            + " order by a.adapter_no, a.mo_code, a.db_dialect, a.sql_seq   \n";

        dict.set("dbDialect", queryList(sql, params));
    }

    @Override
    public void addAdapterInfo(DynamicDict dict) throws BaseAppException {
        ParamArray params = new ParamArray();
        String codePrefix = ((String) dict.getValueByName("CODE_PREFIX", "")) + "PMS";

        StringBuffer seq = new StringBuffer(SeqUtil.getSeq("PM_ADAPTER_SEQ"));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String adapterNo = codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq;
        dict.setValueByName("ADAPTER_NO", adapterNo);
        dict.setValueByName("PLUGIN_NO", adapterNo);

        sql = "insert into pm_adapter_info   \n" 
            + "  (adapter_no,   \n" 
            + "   adapter_name,   \n" 
            + "   seq,         \n" 
            + "   ems_code,      \n"
            + "   ems_type_rel_id,   \n" 
            + "   ems_ver_code,   \n" 
            + "   protocol_type,   \n" 
            + "   plugin_no,      \n" 
            + "   state,         \n"
            + "   oper_user,      \n" 
            + "   oper_date,      \n" 
            + "   bp_id)         \n" 
            + "values         \n"
            + "  (?, ?, 0, ?, ?, ?, ?, ?, ?, ?, sysdate, ?)   \n";
        params.clear();
        params.set("", dict.getString("ADAPTER_NO", true));
        params.set("", dict.getString("ADAPTER_NAME", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("PROTOCOL_TYPE"));
        params.set("", dict.getString("PLUGIN_NO"));
        params.set("", dict.getString("STATE"));
        params.set("", SessionManage.getSession().getUserId());
        params.set("", dict.getString("BP_ID"));

        executeUpdate(sql, params);

        this.batchAddMapping(dict);
    }

    @Override
    public void editAdapterInfo(DynamicDict dict) throws BaseAppException {
        sql = "update pm_adapter_info      \n" 
            + "   set adapter_name    = ?,   \n" 
            + "       seq             = 0,   \n"
            + "       ems_code        = ?,   \n" 
            + "       ems_type_rel_id = ?,   \n" 
            + "       ems_ver_code    = ?,   \n"
            + "       protocol_type   = ?,   \n" 
            + "       plugin_no        = ?,   \n" 
            + "       state           = ?,   \n"
            + "       oper_user       = ?,   \n" 
            + "       oper_date       = sysdate,   \n" 
            + "       bp_id           = ?   \n"
            + " where adapter_no = ?   \n";
        ParamArray params = new ParamArray();
        params.set("", dict.getString("ADAPTER_NAME", true));
        params.set("", dict.getString("EMS_CODE"));
        params.set("", dict.getString("EMS_TYPE_REL_ID", true));
        params.set("", dict.getString("EMS_VER_CODE", true));
        params.set("", dict.getString("PROTOCOL_TYPE"));
        params.set("", dict.getString("PLUGIN_NO"));
        params.set("", dict.getString("STATE"));
        params.set("", SessionManage.getSession().getUserId());
        params.set("", dict.getString("BP_ID"));
        params.set("", dict.getString("ADAPTER_NO", true));

        executeUpdate(sql, params);

        this.batchAddMapping(dict);
    }

    @Override
    public void delAdapterInfo(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        params.set("", dict.getString("ADAPTER_NO", true));

        sql = "delete from pm_adapter_mapping where adapter_no = ?   \n";
        executeUpdate(sql, params);

        sql = "delete from pm_adapter_mo where adapter_no = ? \n";
        executeUpdate(sql, params);

        sql = "delete from pm_adapter_info where adapter_no = ? \n";
        executeUpdate(sql, params);

    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void batchAddMapping(DynamicDict dict) throws BaseAppException {

        ParamArray params = new ParamArray();
        String adapterNo = dict.getString("ADAPTER_NO", true);
        params.set("", adapterNo);

        sql = "delete from pm_adapter_mapping where adapter_no = ?   \n";
        executeUpdate(sql, params);

        sql = "delete from pm_adapter_mo where adapter_no = ?   \n";
        executeUpdate(sql, params);

        sql = "insert into pm_adapter_mo   \n" 
            + "  (adapter_no, seq, mo_code, model_code, granu)   \n" 
            + "values   \n" + "  (?, 0, ?, ?, ?)   \n";
        int MoCount = dict.getCount("adapterMO");
        for (int i = 0; i < MoCount; i++) {
            DynamicDict moDict = dict.getBO("adapterMO", i);
            ParamArray param = new ParamArray();
            param.set("", adapterNo);
            param.set("", moDict.getString("MO_CODE", true));
            param.set("", moDict.getString("MODEL_CODE", true));
            param.set("", moDict.getString("GRANU"));
            executeUpdate(sql, param);
        }

        sql = "insert into pm_adapter_mapping   \n" 
            + "  (adapter_no, seq, mo_code, db_dialect, sql_seq, map_sql)   \n" 
            + "values   \n"
            + "  (?, 0, ?, ?, ?, ?)   \n";
        int diaCount = dict.getCount("dbDialect");
        int split = 1000;
        for (int i = 0; i < diaCount; i++) {
            DynamicDict diaDict = dict.getBO("dbDialect", i);
            String mapSql = (String) diaDict.getValueByName("MAP_SQL", "");
            int sl = mapSql.length();
            int no = (int) Math.ceil((sl * 100) / (split * 100.0));
            for (int k = 0; k < no; k++) {
                ParamArray param = new ParamArray();
                param.set("", adapterNo);
                param.set("", diaDict.getString("MO_CODE", true));
                param.set("", diaDict.getString("DB_DIALECT", true));
                param.set("", k);
                param.set("", mapSql.substring(k * split, tool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
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
