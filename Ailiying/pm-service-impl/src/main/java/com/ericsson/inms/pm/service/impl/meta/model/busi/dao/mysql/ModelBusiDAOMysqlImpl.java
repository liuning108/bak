package com.ericsson.inms.pm.service.impl.meta.model.busi.dao.mysql;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ericsson.inms.pm.service.impl.meta.constant.Constant;
import com.ericsson.inms.pm.service.impl.meta.model.busi.dao.ModelBusiDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月14日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.model.busi.dao.mysql <br>
 */
public class ModelBusiDAOMysqlImpl extends ModelBusiDAO {

    @Override
    public JSONObject getModelBusiInfo(JSONObject dict) throws BaseAppException {

        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String emsCode = CommonUtil.getStrFromMap(dict, "EMS_CODE", "");
        String modelCode = CommonUtil.getStrFromMap(dict, "MODEL_BUSI_CODE", "");
        String modelPhyCode = CommonUtil.getStrFromMap(dict, "MODEL_PHY_CODE", "");
        String modelCodes = CommonUtil.getStrFromMap(dict, "MODEL_BUSI_CODE_S", "");
        String modelName = CommonUtil.getStrFromMap(dict, "MODEL_BUSI_NAME", "");
        if (!("".equals(modelCodes))) {
            modelCodes = "'" + modelCodes.replaceAll("[',']", "','") + "'";
        }
        String sql = "SELECT PMP.EMS_CODE,   \n" + "       PMP.EMS_TYPE_REL_ID,   \n" + "       PMP.EMS_VER_CODE,    \n"
            + "       PMB.MODEL_BUSI_NAME,    \n" + "       PMB.MODEL_BUSI_CODE,    \n"
            + "       PMP.MODEL_PHY_NAME,    \n" + "       PMB.MODEL_PHY_CODE,    \n"
            + "       concat_ws('', PMP.model_phy_name, '(', PMB.model_phy_code, ')') AS MODEL_PHY,    \n"
            + "       PMP.GRANU_MODE,    \n" + "       PMP.MODEL_TYPE,    \n"
            + "       date_format(PMB.eff_time, '%Y-%m-%d') AS EFF_TIME,    \n"
            + "       date_format(PMB.exp_time, '%Y-%m-%d') AS EXP_TIME,    \n" + "       PMB.COMMENTS,        \n"
            + "       PMB.BP_ID            \n" + "  FROM PM_MODEL_BUSI PMB, PM_MODEL_PHY PMP    \n"
            + " WHERE PMB.MODEL_PHY_CODE = PMP.MODEL_PHY_CODE    \n"
            + PMTool.ternaryExpression("".equals(emsCode), "", " AND PMP.EMS_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(emsRela), "", " AND PMP.EMS_TYPE_REL_ID = ?   \n")
            + PMTool.ternaryExpression("".equals(verCode), "", " AND PMP.EMS_VER_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelCode), "", " AND PMB.MODEL_BUSI_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelPhyCode), "", " AND PMB.MODEL_PHY_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelCodes), "", " AND PMB.MODEL_BUSI_CODE IN (" + modelCodes + ")  \n")
            + PMTool.ternaryExpression("".equals(modelName), "",
                    " AND UPPER(PMB.MODEL_BUSI_NAME) LIKE UPPER(concat_ws('','%',?,'%'))   \n")
            + " ORDER BY PMB.MODEL_BUSI_NAME, PMB.MODEL_BUSI_CODE    \n";

        List<String> paramsList = new ArrayList<String>();
        if (!("".equals(emsCode))) {
            paramsList.add(emsCode);
        }
        if (!("".equals(emsRela))) {
            paramsList.add(emsRela);
        }
        if (!("".equals(verCode))) {
            paramsList.add(verCode);
        }
        if (!("".equals(modelCode))) {
            paramsList.add(modelCode);
        }
        if (!("".equals(modelPhyCode))) {
            paramsList.add(modelPhyCode);
        }
        if (!("".equals(modelName))) {
        	paramsList.add(modelName);
        }

        JSONObject result = new JSONObject();
        result.put("modelList", queryForMapList(sql, paramsList.toArray()));
        return result;
    }

    @Override
    public JSONObject getModelBusiField(JSONObject dict) throws BaseAppException {
        String emsRela = CommonUtil.getStrFromMap(dict, "EMS_TYPE_REL_ID", "");
        String verCode = CommonUtil.getStrFromMap(dict, "EMS_VER_CODE", "");
        String emsCode = CommonUtil.getStrFromMap(dict, "EMS_CODE", "");
        String modelCode = CommonUtil.getStrFromMap(dict, "MODEL_BUSI_CODE", "");
        String modelPhyCode = CommonUtil.getStrFromMap(dict, "MODEL_PHY_CODE", "");
        String fieldType = CommonUtil.getStrFromMap(dict, "FIELD_TYPE", "");
        String modelCodes = CommonUtil.getStrFromMap(dict, "MODEL_BUSI_CODE_S", "");
        if (!("".equals(modelCodes))) {
            modelCodes = "'" + modelCodes.replaceAll("[',']", "','") + "'";
        }

        // 模式{空:仅返回modelField结果集,ALL:返回modelField和distinctField结果集,DISTINCT:仅返回distinctField结果集}
        String mode = CommonUtil.getStrFromMap(dict, "MODE", "");

        String sql = "SELECT PMBD.MODEL_BUSI_CODE,    \n" + "       PMBD.FIELD_NAME,    \n"
            + "       PMBD.FIELD_CODE,    \n" + "       date_format(PMBD.eff_time, '%Y-%m-%d') AS EFF_TIME,    \n"
            + "       PMBD.FIELD_TYPE,    \n" + "       PMBD.DATA_TYPE,    \n" + "       PMBD.DIM_CODE,    \n"
            + "       PMBD.PHY_COL,        \n" + "       PMBD.FIELD_NO,    \n" + "       PMBD.BP_ID,        \n"
            + "       PMB.MODEL_BUSI_NAME,    \n" + "       PMB.MODEL_PHY_CODE,    \n"
            + "       PMP.MODEL_PHY_NAME,    \n" + "       PMP.GRANU_MODE,    \n" + "       PMP.MODEL_TYPE    \n"
            + "  FROM PM_MODEL_BUSI_DETAIL PMBD, PM_MODEL_BUSI PMB, PM_MODEL_PHY PMP    \n"
            + " WHERE PMBD.MODEL_BUSI_CODE = PMB.MODEL_BUSI_CODE    \n"
            + "   AND PMB.MODEL_PHY_CODE = PMP.MODEL_PHY_CODE    \n"
            + PMTool.ternaryExpression("".equals(emsCode), "", " AND PMP.EMS_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(emsRela), "", " AND PMP.EMS_TYPE_REL_ID = ?   \n")
            + PMTool.ternaryExpression("".equals(verCode), "", " AND PMP.EMS_VER_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelCode), "", " AND PMBD.MODEL_BUSI_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelPhyCode), "", " AND PMP.MODEL_PHY_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(fieldType), "", " AND PMBD.FIELD_TYPE = ?   \n")
            + PMTool.ternaryExpression("".equals(modelCodes), "", " AND PMBD.MODEL_BUSI_CODE IN (" + modelCodes + ")  \n")
            + " ORDER BY PMBD.MODEL_BUSI_CODE, PMBD.FIELD_NO ASC        \n";

        List<String> paramsList = new ArrayList<String>();

        if (!("".equals(emsCode))) {
            paramsList.add(emsCode);
        }
        if (!("".equals(emsRela))) {
            paramsList.add(emsRela);
        }
        if (!("".equals(verCode))) {
            paramsList.add(verCode);
        }
        if (!("".equals(modelCode))) {
            paramsList.add(modelCode);
        }
        if (!("".equals(modelPhyCode))) {
            paramsList.add(modelPhyCode);
        }
        if (!("".equals(fieldType))) {
            paramsList.add(fieldType);
        }

        JSONObject result = new JSONObject();

        if (!"DISTINCT".equals(mode)) {
            result.put("modelField", queryForMapList(sql, paramsList.toArray()));
        }
        if ("ALL".equals(mode) || "DISTINCT".equals(mode)) {

            String model_busi_detail = new String(sql);
            String distinct_dim = " SELECT DISTINCT FIELD_TYPE,    \n"
                + "                  FIELD_CODE AS FIELD_CODE,    \n" + "                  DIM_CODE,    \n"
                + "                  DATA_TYPE,    \n" + "                  trim(FIELD_NAME) AS FIELD_NAME    \n"
                + "    FROM (" + model_busi_detail.toString() + ") h    \n" + "   WHERE field_type <> '1'    \n";
            String distinct_kpi = " SELECT DISTINCT t.FIELD_TYPE,    \n"
                + "                  t.FIELD_CODE AS FIELD_CODE,    \n" + "                  '' as DIM_CODE,    \n"
                + "                  t.DATA_TYPE,    \n" + "                  k.KPI_NAME as FIELD_NAME,    \n"
                + "                  k.EMS_TYPE_REL_ID        \n" + "    FROM (" + model_busi_detail.toString()
                + ") t, PM_KPI k    \n" + "   WHERE t.FIELD_TYPE = '1'                \n"
                + "     AND t.FIELD_CODE = k.KPI_CODE        \n";

            sql = "SELECT FIELD_TYPE, FIELD_CODE, DIM_CODE, DATA_TYPE, FIELD_NAME ,EMS_TYPE_REL_ID FROM (    \n"
                + "    SELECT FIELD_TYPE, FIELD_CODE, DIM_CODE, DATA_TYPE, FIELD_NAME ,'' as EMS_TYPE_REL_ID, 0 AS LEVELID    \n"
                + "      FROM (" + distinct_dim.toString() + ") i   \n"
                + "   WHERE upper(field_code) IN ('STTIME','HH','MI')    \n" + "    UNION ALL    \n"
                + "    SELECT FIELD_TYPE, FIELD_CODE, DIM_CODE, DATA_TYPE, FIELD_NAME ,'' AS EMS_TYPE_REL_ID , 1 AS LEVELID    \n"
                + "      FROM (" + distinct_dim.toString() + ") j   \n"
                + "   WHERE upper(field_code) NOT IN ('STTIME','HH','MI')    \n" + "    UNION ALL    \n"
                + "    SELECT FIELD_TYPE, FIELD_CODE, DIM_CODE, DATA_TYPE, FIELD_NAME ,EMS_TYPE_REL_ID, 2 AS LEVELID    \n"
                + "      FROM (" + distinct_kpi.toString() + ") k  \n" + ") l ORDER BY LEVELID,FIELD_NAME    \n";

            // 对params中的paraList进行拷贝
            List<String> curParamList = new ArrayList<String>(paramsList);

            if (!CollectionUtils.isEmpty(curParamList)) {
                int paramLength = curParamList.size();
                int i = 2;
                while (i > 0) {
                    for (int j = 0; j < paramLength; j++) {
                        paramsList.add(curParamList.get(j));
                    }
                    i--;
                }
            }

            List<Map<String, String>> qryList = queryForMapList(sql, paramsList.toArray());
            List<Map<String, String>> dimList = new ArrayList<Map<String, String>>();
            List<Map<String, String>> kpiList = new ArrayList<Map<String, String>>();
            List<Map<String, String>> otherList = new ArrayList<Map<String, String>>();
            // ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
            for (int i = 0; i < qryList.size(); i++) {
                Map<String, String> qryMap = (Map<String, String>) qryList.get(i);
                String qryKey = PMTool.ternaryExpression((CommonUtil.object2String(qryMap.get("FIELD_TYPE")) == null), "",
                    CommonUtil.object2String(qryMap.get("FIELD_TYPE"))) + "|"
                    + PMTool.ternaryExpression((qryMap.get("FIELD_CODE") == null), "", qryMap.get("FIELD_CODE")) + "|"
                    + PMTool.ternaryExpression((qryMap.get("DIM_CODE") == null), "", qryMap.get("DIM_CODE")) + "|"
                    + PMTool.ternaryExpression((CommonUtil.object2String(qryMap.get("DATA_TYPE")) == null), "",
                        CommonUtil.object2String(qryMap.get("DATA_TYPE")));

                String qryVal = qryMap.get("FIELD_NAME");
                String qryType = CommonUtil.object2String(qryMap.get("FIELD_TYPE"));
                List<Map<String, String>> retList = new ArrayList<Map<String, String>>();
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
                    Map<String, String> map = retList.get(t);
                    String key = PMTool.ternaryExpression((CommonUtil.object2String(map.get("FIELD_TYPE")) == null), "",
                        CommonUtil.object2String(map.get("FIELD_TYPE"))) + "|"
                        + PMTool.ternaryExpression((map.get("FIELD_CODE") == null), "", map.get("FIELD_CODE")) + "|"
                        + PMTool.ternaryExpression((map.get("DIM_CODE") == null), "", map.get("DIM_CODE")) + "|"
                        + PMTool.ternaryExpression((CommonUtil.object2String(map.get("DATA_TYPE")) == null), "",
                            CommonUtil.object2String(map.get("DATA_TYPE")));

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

            result.put("DIMS", dimList);
            result.put("KPIS", kpiList);
            result.put("OTHERS", otherList);
        }
        return result;
    }

    @Override
    public JSONObject addModelBusiInfo(JSONObject dict) throws BaseAppException {
        String sql = "select * from pm_model_busi where model_busi_code = ?";
        String modelBusiCode = CommonUtil.getStrFromMapWithExc(dict, "MODEL_BUSI_CODE");
        int count = queryForCount(sql, modelBusiCode);
        if (count > 0) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_CODE_EXISTS, "CODE已经存在.",
                dict.getString("MODEL_BUSI_CODE"));
        }

        sql = "insert into pm_model_busi \n" + " (model_busi_name, \n" + " model_busi_code, \n" + " model_phy_code, \n"
            + " eff_time, \n" + " exp_time, \n" + " comments, \n" + " bp_id) \n" + "values \n"
            + " (?, ?, ?, ?, ?, ?, ?) \n";

        List<Object> paramList = new ArrayList<Object>();

        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_BUSI_NAME"));
        paramList.add(modelBusiCode);
        paramList.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE"));
        paramList.add(dict.getDate("EFF_TIME"));
        paramList.add(dict.getDate("EXP_TIME"));
        paramList.add(dict.getString("COMMENTS"));
        paramList.add(dict.getString("BP_ID"));

        update(sql, paramList.toArray());

        this.batchAddField(dict);

        return dict;
    }

    @Override
    public JSONObject editModelBusiInfo(JSONObject dict) throws BaseAppException {
        String sql = "update pm_model_busi \n" + " set model_busi_name = ?, \n" + " model_phy_code = ?, \n"
            + " eff_time = ?, \n" + " exp_time = ?, \n" + " comments = ?, \n" + " bp_id = ? \n"
            + " where model_busi_code = ? \n";

        List<Object> params = new ArrayList<Object>();

        params.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_BUSI_NAME"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_PHY_CODE"));
        params.add(dict.getDate("EFF_TIME"));
        params.add(dict.getDate("EXP_TIME"));
        params.add(dict.getString("COMMENTS"));
        params.add(dict.getString("BP_ID"));
        params.add(CommonUtil.getStrFromMapWithExc(dict, "MODEL_BUSI_CODE"));

        update(sql, params.toArray());

        this.batchAddField(dict);

        return dict;
    }

    @Override
    public JSONObject delModelBusiInfo(JSONObject dict) throws BaseAppException {
        String sql = "delete from pm_model_busi_detail where model_busi_code = ? \n";
        String busiCode = CommonUtil.getStrFromMapWithExc(dict, "MODEL_BUSI_CODE");
        update(sql, busiCode);

        sql = "delete from pm_model_busi where model_busi_code = ? \n";
        update(sql, busiCode);

        JSONObject result = new JSONObject();
        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    private JSONObject batchAddField(JSONObject dict) throws BaseAppException {

        String sql = "delete from pm_model_busi_detail where model_busi_code = ? \n";

        String modelCode = dict.getString("MODEL_BUSI_CODE");
        update(sql, modelCode);

        sql = "insert into pm_model_busi_detail \n" + " (model_busi_code,\n" + " field_name, \n" + " field_code, \n"
            + " eff_time, \n" + " field_type, \n" + " data_type, \n" + " dim_code, \n" + " phy_col, \n"
            + " field_no, \n" + " bp_id) \n" + "values \n" + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \n";

        JSONArray modelFieldArr = dict.getJSONArray("modelField");
        if (null != modelFieldArr) {
            int count = modelFieldArr.size();
            for (int i = 0; i < count; i++) {
                JSONObject curField = modelFieldArr.getJSONObject(i);
                String effTime = CommonUtil.getStrFromMap(curField, "EFF_TIME", "");
                if ("&#160;".equals(effTime)) {
                    effTime = "";
                }
                curField.put("EFF_TIME", effTime.replaceAll("['/']", "-"));

                List<Object> params = new ArrayList<Object>();
                params.add(modelCode);
                params.add(CommonUtil.getStrFromMapWithExc(curField, "FIELD_NAME"));
                params.add(CommonUtil.getStrFromMapWithExc(curField, "FIELD_CODE"));
                params.add(curField.getDate("EFF_TIME"));
                params.add(curField.get("FIELD_TYPE"));
                params.add(curField.get("DATA_TYPE"));
                params.add(curField.getString("DIM_CODE"));
                params.add(curField.getString("PHY_COL"));
                params.add(i);
                params.add(curField.getString("BP_ID"));
                update(sql, params.toArray());
            }
        }
        return null;
    }

}
