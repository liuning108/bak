package com.ericsson.inms.pm.service.impl.meta.model.phy.dao.mysql;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ericsson.inms.pm.service.impl.meta.model.phy.dao.ModelPhyDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;

/**
 * PM元数据-物理模型管理相关的Mysql DAO操作实现类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-10 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.dao.mysql <br>
 */
public class ModelPhyDAOMysqlImpl extends ModelPhyDAO {

    @Override
    public JSONObject getModelPhyInfo(JSONObject dict) throws BaseAppException {

        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String modelCode = CommonUtil.getStrFromMap(dict, "MODEL_PHY_CODE", "");
        String modelType = CommonUtil.getStrFromMap(dict, "MODEL_TYPE", "");
        String modelCodes = CommonUtil.getStrFromMap(dict, "MODEL_PHY_CODE_S", "");
        if (!("".equals(modelCodes))) {
            modelCodes = "'" + modelCodes.replaceAll("[',']", "','") + "'";
        }

        String sql = "SELECT PMP.MODEL_PHY_NAME, \n" + "       PMP.MODEL_PHY_CODE, \n" + "       PMP.EMS_TYPE_REL_ID,\n"
            + "       PMP.EMS_VER_CODE,    \n" + "       PMP.EMS_CODE,    \n"
            + "       concat_ws('', PMP.model_phy_name,'(', PMP.model_phy_code,')') AS MODEL_PHY,    \n"
            + "       date_format(PMP.eff_time, '%Y-%m-%d') as EFF_TIME,    \n"
            + "       date_format(PMP.exp_time, '%Y-%m-%d') as EXP_TIME,    \n" + "       PMP.GRANU_MODE,    \n"
            + "       PMP.MODEL_TYPE,    \n" + "       PMP.COMMENTS,    \n" + "       PMP.BP_ID    \n"
            + "  FROM PM_MODEL_PHY PMP    \n" + " WHERE 1 = 1    \n"
            + PMTool.ternaryExpression("".equals(emsRela), "", " AND PMP.EMS_TYPE_REL_ID = ?   \n")
            + PMTool.ternaryExpression("".equals(verCode), "", " AND PMP.EMS_VER_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelCode), "", " AND PMP.MODEL_PHY_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelType), "", " AND PMP.MODEL_TYPE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelCodes), "",
                " AND PMP.MODEL_PHY_CODE in (" + modelCodes + ")   \n")
            + " ORDER BY PMP.MODEL_PHY_NAME, PMP.MODEL_PHY_CODE    \n";

        List<Object> paramList = new ArrayList<Object>();

        if (!("".equals(emsRela))) {
            paramList.add(emsRela);
        }
        if (!("".equals(verCode))) {
            paramList.add(verCode);
        }
        if (!("".equals(modelCode))) {
            paramList.add(modelCode);
        }
        if (!("".equals(modelType))) {
            paramList.add(modelType);
        }

        JSONObject result = new JSONObject();
        result.put("modelList", queryForMapList(sql, paramList.toArray()));
        return result;
    }

    @Override
    public JSONObject getModelPhyScript(JSONObject dict) throws BaseAppException {
        String modelCode = dict.getString("MODEL_PHY_CODE");

        String sql = "SELECT PMPS.MODEL_PHY_CODE, PMPS.SCRIPT_TYPE, PMPS.SCRIPT, PMPS.SCRIPT_NO, PMPS.BP_ID    \n"
            + "  FROM PM_MODEL_PHY_SCRIPT PMPS    \n" + " WHERE PMPS.MODEL_PHY_CODE = ?    \n"
            + " ORDER BY PMPS.MODEL_PHY_CODE, PMPS.SCRIPT_TYPE, PMPS.SCRIPT_NO    \n";

        JSONObject result = new JSONObject();
        result.put("modelScript", queryForMapList(sql, modelCode));
        return result;
    }

    @Override
    public JSONObject getModelPhyDataSource(JSONObject dict) throws BaseAppException {
        String modelCode = dict.getString("MODEL_PHY_CODE");

        String sql = "SELECT PPDR.MODEL_PHY_CODE, PPDR.GRANU, PPDR.DATA_SOURCE, PPDR.BP_ID    \n"
            + "  FROM PM_PHY_DB_REL PPDR    \n" + " WHERE PPDR.MODEL_PHY_CODE = ?    \n";

        JSONObject result = new JSONObject();
        result.put("modelDataSource", queryForMapList(sql, modelCode));

        return result;
    }

    @Override
    public JSONObject addModelPhyInfo(JSONObject dict) throws BaseAppException {

        String sql = "select * from pm_model_phy where model_phy_code = ?";
        int count = queryForCount(sql, CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE"));
        if (count > 0) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_CODE_EXISTS, "CODE已经存在.",
                dict.getString("MODEL_PHY_CODE"));
        }

        sql = "insert into pm_model_phy \n" + " (model_phy_name, \n" + " model_phy_code, \n" + " ems_type_rel_id, \n"
            + " ems_ver_code, \n" + " ems_code, \n" + " eff_time, \n" + " exp_time, \n" + " granu_mode,\n"
            + " model_type,\n" + " comments, \n" + " bp_id) \n" + "values \n" + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \n";

        List<Object> paramsList = new ArrayList<Object>();

        paramsList.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_NAME"));
        paramsList.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE"));
        paramsList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        paramsList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_VER_CODE"));
        paramsList.add(dict.getString("EMS_CODE"));
        paramsList.add(dict.getDate("EFF_TIME"));
        paramsList.add(dict.getDate("EXP_TIME"));
        paramsList.add(dict.getString("GRANU_MODE"));
        paramsList.add(dict.getString("MODEL_TYPE"));
        paramsList.add(dict.getString("COMMENTS"));
        paramsList.add(dict.getString("BP_ID"));

        update(sql, paramsList.toArray());

        this.batchAddScript(dict);
        this.addModelPhyDataSource(dict);

        return dict;
    }

    @Override
    public JSONObject editModelPhyInfo(JSONObject dict) throws BaseAppException {
        String sql = "update pm_model_phy \n" + " set model_phy_name = ?, \n" + " ems_type_rel_id = ?, \n"
            + " ems_ver_code = ?, \n" + " ems_code = ?, \n" + " eff_time = ?, \n" + " exp_time = ?, \n"
            + " granu_mode = ?, \n" + " model_type = ?, \n" + " comments = ?, \n" + " bp_id = ? \n"
            + " where model_phy_code = ? \n";

        List<Object> paramList = new ArrayList<Object>();

        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_NAME"));
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_TYPE_REL_ID"));
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "EMS_VER_CODE"));
        paramList.add(dict.getString("EMS_CODE"));
        paramList.add(dict.getDate("EFF_TIME"));
        paramList.add(dict.getDate("EXP_TIME"));
        paramList.add(dict.getString("GRANU_MODE"));
        paramList.add(dict.getString("MODEL_TYPE"));
        paramList.add(dict.getString("COMMENTS"));
        paramList.add(dict.getString("BP_ID"));
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE"));

        update(sql, paramList.toArray());
        this.batchAddScript(dict);
        this.addModelPhyDataSource(dict);

        return dict;
    }

    @Override
    public void delModelPhyInfo(JSONObject dict) throws BaseAppException {
        String sql = "delete from pm_model_phy_script where model_phy_code = ? \n";
        String modelPhyCode = CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE");
        // 校验不为空
        update(sql, modelPhyCode);
        sql = "delete from pm_phy_db_rel where model_phy_code = ? \n";
        update(sql, modelPhyCode);
        sql = "delete from pm_model_phy where model_phy_code = ? \n";
        update(sql, modelPhyCode);
    }

    /**
     * 批量循环新增脚本 <br>
     *
     * @author Srd<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */
    public void batchAddScript(JSONObject dict) throws BaseAppException {

        String modelCode = CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE");
        String sql = "delete from pm_model_phy_script where model_phy_code = ? \n";

        update(sql, modelCode);

        sql = "insert into pm_model_phy_script \n" + " (model_phy_code, script_type, script, script_no, bp_id) \n"
            + "values \n" + " (?, ?, ?, ?, ?) \n";

        JSONArray modelScriptArr = dict.getJSONArray("modelScript");
        if (null != modelScriptArr) {
            int count = modelScriptArr.size();
            int split = 1000;
            for (int i = 0; i < count; i++) {
                JSONObject curScript = modelScriptArr.getJSONObject(i);
                String script = CommonUtil.getStrFromMap(curScript, "SCRIPT", "");
                int sl = script.length();
                int no = (int) Math.ceil((sl * 100) / (split * 100.0));
                for (int k = 0; k < no; k++) {
                    List<Object> paramList = new ArrayList<Object>();

                    paramList.add(modelCode);
                    paramList.add(CommonUtil.getStrFromMapWithExc(curScript, "SCRIPT_TYPE"));
                    paramList.add(script.substring(k * split,
                        PMTool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
                    paramList.add(k);
                    paramList.add(curScript.getString("BP_ID"));
                    update(sql, paramList.toArray());
                }
            }
        }

    }

    @Override
    public void addModelPhyDataSource(JSONObject dict) throws BaseAppException {

        String modelCode = CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE");
        String sql = "delete from pm_phy_db_rel where model_phy_code = ? \n";
        update(sql, modelCode);

        sql = "insert into pm_phy_db_rel \n" + " (model_phy_code, granu, data_source, bp_id) \n" + "values \n"
            + " (?, ?, ?, ?) \n";

        JSONArray modelDataSourceArr = dict.getJSONArray("modelDataSource");
        if (null != modelDataSourceArr) {
            int count = modelDataSourceArr.size();
            for (int i = 0; i < count; i++) {
                JSONObject curModelDataSource = modelDataSourceArr.getJSONObject(i);

                List<Object> paramList = new ArrayList<Object>();

                paramList.add(modelCode);
                paramList.add(CommonUtil.getStrFromMapWithExc(curModelDataSource, "GRANU"));
                paramList.add(CommonUtil.getStrFromMapWithExc(curModelDataSource, "DATA_SOURCE"));
                paramList.add(curModelDataSource.getString("BP_ID"));

                update(sql, paramList.toArray());
            }
        }

    }

}
