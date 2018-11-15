package com.ericsson.inms.pm.service.impl.resmgr.dao.mysql;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.resmgr.dao.ResMgrDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

public class ResMgrDAOMysqlImpl extends ResMgrDAO {
    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;
    private static OpbLogger logger = OpbLogger.getLogger(ResMgrDAOMysqlImpl.class, "PM");

    @Override
    public JSONObject loadTree(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        JSONObject result = new JSONObject();
        try {
            String vnfTypes = "'vmme','vpsbc','vsgw'";
            String sql = "SELECT " + "  ems_type CAT_NAME, " + "  GROUP_CONCAT(r.class_id)  SUBIDS ,SUBSTR(EMS_TYPE,1,2) CID "
                + "FROM cm_object_class_rel r, " + "  pm_ems_type e, " + "  cm_object_class c "
                + "WHERE r.category = e.ems_type_code " + "AND r.class_code = c.object_class "
                + "AND r.up_class_id IS NULL " + "AND r.class_code NOT IN ( " + "  SELECT " + "    ne_objecttype "
                + "  FROM " + "    cm_vnftype_netype " + "  WHERE " + "    vnf_type NOT IN ( " + vnfTypes + " ) " + ") "
                + "GROUP BY " + "ems_type";

            List<Map<String, Object>> pDatas = this.queryForMapList(sql);
            System.out.println(pDatas);
            int count = 0;
            for (Map<String, Object> item : pDatas) {
                System.err.println(item);
                item.put("CAT_CODE", "PP" + count);
                item.put("REL_ID", "PP" + count);
                item.put("expanded", true);
                String subids = "" + item.get("SUBIDS");
                try {
                    item.put("children", this.getSubTreeData(subids));
                }
                catch (Exception e) {
                    e.printStackTrace();
                }

            }
            result.put("result", pDatas);
        }
        catch (Exception e) {
            logger.error("PM-resMgr-loadTree", e.getMessage());
            return result;
        }

        return result;
    }

    private List<Map<String, Object>> getSubTreeData(String subids) {
        // TODO Auto-generated method stub
        String sql = "" + "select * from ( " + "SELECT " + " class_id REL_ID, "  + "  category_id CID, " + "    class_code CAT_CODE, "
            + "    c.name CAT_NAME, " + "    table_name TNAME, " + "    b.child_id SUBIDS " + "FROM "
            + "    cm_object_class_rel r " + "        LEFT JOIN " + "    (SELECT "
            + "        up_class_id id, GROUP_CONCAT(class_id) child_id " + "    FROM "
            + "        cm_object_class_rel cr " + "    WHERE " + "        up_class_id IS NOT NULL "
            + "    GROUP BY up_class_id) AS b ON r.class_id = b.id " + "        LEFT JOIN "
            + "    cm_object_class c ON r.class_code = c.object_class " + "    ) t where t.REL_ID in (" + subids + ")";
        return this.queryForMapList(sql);
    }

    @Override
    public JSONObject qurRes(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        String sql = ""
            + "SELECT "
            + "  r.name CITY, "
            + "  v.vendor_name VENDOR, "
            + "  a.name NAME, "
            + "  a.object_id OID, "
            + "  a.rmuid RMUID, "
            + "  a.health_state STATE, "
            + "  vm.name VIM, "
            + "  pm.name PIM, "
            + "  n.template_id TID, "
            + "  ( "
            + "    SELECT "
            + "      count(1) "
            + "    FROM "
            + "      pm_screen_detail "
            + "    WHERE "
            + "      tid = n.template_id "
            + "  ) SCREEN "
            + "FROM "
            + "  ( "
            + "    SELECT "
            + "      * "
            + "    FROM "
            + "      vw_cm_device "
            + "    WHERE "
            + "     object_class ='ServerSystem' "
            + "  ) AS a "
            + "LEFT JOIN cm_device d ON a.device_id = d.object_id "
            + "LEFT JOIN pm_ne_inst n ON a.rmuid = n.GID "
            + "LEFT JOIN cm_region r ON d.region_code=r.code "
            + "LEFT JOIN cm_vendor v ON d.vendor=v.vendor_code "
            + "LEFT JOIN nfvo_vim_query_info vm ON d.vim_id=vm.vid "
            + "LEFT JOIN nfvo_vim_query_info pm ON d.pim_id=pm.vid;";
        JSONObject result = new JSONObject();
        result.put("result", this.queryForMapList(sql));                 
        return result;
    }

    @Override
    public JSONObject qurTmpInfo(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String tid = dict.getString("tid");
        System.err.println(tid);
        String sql ="select model_phy_code PCODE, model_BUSI_CODE MCODE  from pm_ne_template t where t.template_id=?";
        result.put("result", this.queryForMapList(sql,tid));
        return result;
    }

}
