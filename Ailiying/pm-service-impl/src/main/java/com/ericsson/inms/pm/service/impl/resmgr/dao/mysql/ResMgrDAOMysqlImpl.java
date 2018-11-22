package com.ericsson.inms.pm.service.impl.resmgr.dao.mysql;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONArray;
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
            String vnfTypes = dict.getString("vntypes");
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
        try {
        // TODO Auto-generated method stub
        JSONObject param = dict.getJSONObject("param");
        JSONObject initData = dict.getJSONObject("initData");
        String type =param.getString("TYPE");
        System.err.println("param");
        System.err.println(param);
        System.err.println("initData");
        System.err.println(initData);
        String sql = null;
        if("sublist".equalsIgnoreCase(type)) {
                  sql=this.subListSql(param);
        }else {
            String CID = param.getString("CID");
            
            //PIM
            if("1".equalsIgnoreCase(CID)) {
               sql = this.pimSql(param,initData);       
            }
            //VIM
            if("2".equalsIgnoreCase(CID)) {
                sql = this.vimSql(param,initData);       
             }
              
            //VNF        
            if("3".equalsIgnoreCase(CID)) {
                sql = this.vnfSql(param,initData);       
            }
            //FCAPS
            if("4".equalsIgnoreCase(CID)) {
                sql = this.FCAPSSql(param,initData);       
            }
            
        }
            
        
        
        JSONObject result = new JSONObject();
        System.err.println("sql");
          System.err.println(sql);
        result.put("result", this.queryForMapList(sql)); 
        return result;
        }catch(Exception e ) {
            e.printStackTrace();
            JSONObject result = new JSONObject();
            result.put("result", new ArrayList());
            result.put("message", e.getMessage());
            return result;
        }
    }

    private String subListSql(JSONObject param) {
        String tableName = param.getString("TNAME");
        String CODE = param.getString("CODE");
        String oid = param.getString("rowId");
        
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
            + tableName
            + "    WHERE "
            + "     object_class = '"+CODE+"'"
            +"      AND parent_id ='"+oid+"'"
            + "  ) AS a "
            + "LEFT JOIN cm_device d ON a.device_id = d.object_id "
            + "LEFT JOIN pm_ne_inst n ON a.rmuid = n.GID "
            + "LEFT JOIN cm_region r ON d.region_code=r.code "
            + "LEFT JOIN cm_vendor v ON d.vendor=v.vendor_code "
            + "LEFT JOIN nfvo_vim_query_info vm ON d.vim_id=vm.vid "
            + "LEFT JOIN nfvo_vim_query_info pm ON d.pim_id=pm.vid";
         return sql;
    }

    private String FCAPSSql(JSONObject param, JSONObject initData) {
        String tableName = param.getString("TNAME");
        String CODE = param.getString("CODE");
        JSONObject where =param.getJSONObject("where");
        String resname = where.getString("resname");
        if(resname!=null && resname.length()>0) {
            resname = "  AND name like '%"+resname+"%' ";
        }else {
            resname="";
        }
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
            + tableName
            + "    WHERE "
            + "     object_class = '"+CODE+"'"
            +resname
                      + "  ) AS a "
            + "LEFT JOIN cm_device d ON a.device_id = d.object_id "
            + "LEFT JOIN pm_ne_inst n ON a.rmuid = n.GID "
            + "LEFT JOIN cm_region r ON d.region_code=r.code "
            + "LEFT JOIN cm_vendor v ON d.vendor=v.vendor_code "
            + "LEFT JOIN nfvo_vim_query_info vm ON d.vim_id=vm.vid "
            + "LEFT JOIN nfvo_vim_query_info pm ON d.pim_id=pm.vid";
         return sql;
    }

    private String vnfSql(JSONObject param, JSONObject initData) {
        String tableName = param.getString("TNAME");
        String CODE = param.getString("CODE");
        JSONObject where =param.getJSONObject("where");
        String ps =  where.getString("ps");
        String citys =  initData.getString("citys");
        if(ps==null) {
             ps= initData.getString("ps");
        }
        String vendor =where.getString("vendor");
         if(vendor==null) {
            vendor= initData.getString("vendors");
        }
         String resname = where.getString("resname");
         if(resname!=null && resname.length()>0) {
             resname = "  AND name like '%"+resname+"%' ";
         }else {
             resname="";
         }
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
            + tableName
            + "    WHERE "
            + "     object_class = '"+CODE+"'"
            + "     AND  province_code IN ("+ps+")"
            +"       AND region_code IN ("+citys+")"
            + "     AND vendor IN ("+vendor+")"
            +resname
            + "  ) AS a "
            + "LEFT JOIN cm_device d ON a.device_id = d.object_id "
            + "LEFT JOIN pm_ne_inst n ON a.rmuid = n.GID "
            + "LEFT JOIN cm_region r ON d.region_code=r.code "
            + "LEFT JOIN cm_vendor v ON d.vendor=v.vendor_code "
            + "LEFT JOIN nfvo_vim_query_info vm ON d.vim_id=vm.vid "
            + "LEFT JOIN nfvo_vim_query_info pm ON d.pim_id=pm.vid";
         return sql;
    }

    private String vimSql(JSONObject param, JSONObject initData) {
        String tableName = param.getString("TNAME");
        String CODE = param.getString("CODE");
        JSONObject where =param.getJSONObject("where");
        String vim =  where.getString("vim");
        if(vim==null) {
             vim= initData.getString("vims");
        }
        String resname = where.getString("resname");
        if(resname!=null && resname.length()>0) {
            resname = "  AND name like '%"+resname+"%' ";
        }else {
            resname="";
        }
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
            + tableName
            + "    WHERE "
            + "     object_class = '"+CODE+"'"
            + "     AND vim_id IN ("+vim+")"
            +resname
            + "  ) AS a "
            + "LEFT JOIN cm_device d ON a.device_id = d.object_id "
            + "LEFT JOIN pm_ne_inst n ON a.rmuid = n.GID "
            + "LEFT JOIN cm_region r ON d.region_code=r.code "
            + "LEFT JOIN cm_vendor v ON d.vendor=v.vendor_code "
            + "LEFT JOIN nfvo_vim_query_info vm ON d.vim_id=vm.vid "
            + "LEFT JOIN nfvo_vim_query_info pm ON d.pim_id=pm.vid";
         return sql;
    }

    private String pimSql(JSONObject param, JSONObject initData) {
        String tableName = param.getString("TNAME");
        String CODE = param.getString("CODE");
        JSONObject where =param.getJSONObject("where");
        String pim =  where.getString("pim");
        String vendor =where.getString("vendor");
        if(pim==null) {
            pim= initData.getString("pims");
        }
        if(vendor==null) {
            vendor= initData.getString("vendors");
        }
        String resname = where.getString("resname");
        if(resname!=null && resname.length()>0) {
            resname = "  AND name like '%"+resname+"%' ";
        }else {
            resname="";
        }
              
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
            + tableName
            + "    WHERE "
            + "     object_class = '"+CODE+"'"
            + "     AND vendor IN ("+vendor+")"
            + "     AND pim_id IN ("+pim+")"
            +resname
            + "  ) AS a "
            + "LEFT JOIN cm_device d ON a.device_id = d.object_id "
            + "LEFT JOIN pm_ne_inst n ON a.rmuid = n.GID "
            + "LEFT JOIN cm_region r ON d.region_code=r.code "
            + "LEFT JOIN cm_vendor v ON d.vendor=v.vendor_code "
            + "LEFT JOIN nfvo_vim_query_info vm ON d.vim_id=vm.vid "
            + "LEFT JOIN nfvo_vim_query_info pm ON d.pim_id=pm.vid";
         return sql;
    }

    @Override
    public JSONObject qurTmpInfo(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String tid = dict.getString("tid");
        String sql ="select model_phy_code PCODE, model_BUSI_CODE MCODE  from pm_ne_template t where t.template_id=?";
        result.put("result", this.queryForMapList(sql,tid));
        return result;
    }

    @Override
    public JSONObject getSubTreeData(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        try {        
        String subids = dict.getString("ids");
        result.put("result", this.getSubTreeData(subids));
        }catch(Exception e) {
         result.put("result", new ArrayList());
        }
        return result;
    }

}
