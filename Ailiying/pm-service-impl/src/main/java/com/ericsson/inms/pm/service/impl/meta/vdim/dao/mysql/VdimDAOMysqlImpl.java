/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.service.impl.meta.vdim.dao.mysql;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ericsson.inms.pm.service.impl.meta.vdim.dao.VdimDAO;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.itnms.templatemgr.dao.mysql <br>
 */
public class VdimDAOMysqlImpl extends VdimDAO {
    
    @Override
    public Map<String, Object> loadVdimList() throws BaseAppException {
        Map<String, Object> retData = new HashMap<String, Object>();
        String sql = "SELECT "
            + "VDIM_NAME,"
            + "VDIM_CODE,"
            + "FIELD_CODE,"
            + "GROUP_TYPE,"
            + "DIM_CODE,"
            + "OPER_DATE,"
            + "OPER_USER "
            + "FROM PM_VDIM ORDER BY VDIM_NAME,OPER_DATE DESC";
        List<Map<String, Object>> vdimList = queryForMapList(sql, new Object[] {});
        retData.put("vdimList", vdimList);
        //
        String groupSql = "SELECT "
            + "VDIM_CODE,"
            + "GROUP_NO,"
            + "GROUP_NAME,"
            + "GROUP_SEQ "
            + "FROM PM_VDIM_GROUP";
        List<Map<String, Object>> vdimGroupList = queryForMapList(groupSql, new Object[] {});
        retData.put("vdimGroupList", vdimGroupList);
        //
        String detailSql = "SELECT "
            + "VDIM_CODE,"
            + "GROUP_NO,"
            + "GROUP_SEQ,"
            + "GROUP_ATTR,"
            + "GROUP_ATTR_SEQ "
            + "FROM PM_VDIM_GROUP_DETAIL";
        List<Map<String, Object>> vdimGroupDetailList = queryForMapList(detailSql, new Object[] {});
        retData.put("vdimGroupDetailList", vdimGroupDetailList);        
        return retData;
    }
    
    @Override
    public void saveVdim(Map<String, Object> params) throws BaseAppException {
        String vdim_code = (String) params.get("VDIM_CODE");    
        if (null == vdim_code || "".equals(vdim_code)) {
            // 新建虚拟维度
            insertIntoPmVdim(params);
            insertIntoPmVdimGroup(params);
        } 
        else {
            // 修改虚拟维度
            deleteVdim(params);
            insertIntoPmVdim(params);
            insertIntoPmVdimGroup(params);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmVdim(Map<String, Object> params) throws BaseAppException {
        String vdim_name = (String) params.get("VDIM_NAME");
        String vdim_field = (String) params.get("VDIM_FIELD");
        String vdim_type = (String) params.get("VDIM_TYPE");
        String dim_code = (String) params.get("DIM_CODE");
        Long oper_user = PrincipalUtil.getPrincipal().getUserId();
        String vdim_code = (String) params.get("VDIM_CODE");
        if ("".equals(vdim_code)) {
            vdim_code = qryVdimCode(vdim_field);
        }
        //
        String sql = "INSERT INTO PM_VDIM("
            + "VDIM_NAME,"
            + "VDIM_CODE,"
            + "FIELD_CODE,"
            + "GROUP_TYPE,"
            + "DIM_CODE,"
            + "OPER_DATE,"
            + "OPER_USER"
            + ")VALUES (?,?,?,?,?,now(),?)";
        update(sql, new Object[] {vdim_name, vdim_code, vdim_field, vdim_type, dim_code, oper_user});
        params.put("VDIM_CODE", vdim_code);
    }
    
    @Override
    public void deleteVdim(Map<String, Object> params) throws BaseAppException {
        String vdim_code = (String) params.get("VDIM_CODE");
        String sql = "DELETE FROM PM_VDIM_GROUP_DETAIL WHERE VDIM_CODE=?";
        update(sql, new Object[] {vdim_code});
        //
        sql = "DELETE FROM PM_VDIM_GROUP WHERE VDIM_CODE=?";
        update(sql, new Object[] {vdim_code});
        //
        sql = "DELETE FROM PM_VDIM WHERE VDIM_CODE=?";
        update(sql, new Object[] {vdim_code});
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmVdimGroup(Map<String, Object> params) throws BaseAppException {
        String vdim_code = (String) params.get("VDIM_CODE");
        String vdim_type = (String) params.get("VDIM_TYPE");
        String otherGroupName = (String) params.get("NOGROUP_NAME");
        ArrayList<HashMap> groupList =  (ArrayList<HashMap>) params.get("groupList");
        //
        String sql = "INSERT INTO PM_VDIM_GROUP("
            + "VDIM_CODE,"
            + "GROUP_NO,"
            + "GROUP_NAME,"
            + "GROUP_SEQ"
            + ")VALUES (?,?,?,?)";
        // 保存Other Group固定group_no为0
        update(sql, new Object[] {vdim_code, "0", otherGroupName, 0});
        //
        for (int i = 0; i < groupList.size(); i++) {
            HashMap groupDict = groupList.get(i);
            String group_no = (String) groupDict.get("id");
            String group_name = (String) groupDict.get("name");
            String group_seq = (i + 1) + "";
            if ("0".equals(vdim_type)) {
                ArrayList<HashMap> itemList =  (ArrayList<HashMap>) groupDict.get("items");   
                for (int j = 0; j < itemList.size(); j++) {
                    HashMap itemDict = itemList.get(j);
                    String itemId = (String) (itemDict.get("id") + "");
                    String detailSql = "INSERT INTO PM_VDIM_GROUP_DETAIL("
                        + "VDIM_CODE,"
                        + "GROUP_NO,"
                        + "GROUP_SEQ,"
                        + "GROUP_ATTR,"
                        + "GROUP_ATTR_SEQ"
                        + ")VALUES (?,?,?,?,?)";
                    update(detailSql, new Object[] {vdim_code, group_no, group_seq, itemId, j});
                }
            } 
            else if ("1".equals(vdim_type)) { 
                String expression = (String) groupDict.get("expression");   
                String detailSql = "INSERT INTO PM_VDIM_GROUP_DETAIL("
                    + "VDIM_CODE,"
                    + "GROUP_NO,"
                    + "GROUP_SEQ,"
                    + "GROUP_ATTR,"
                    + "GROUP_ATTR_SEQ"
                    + ")VALUES (?,?,?,?,?)";
                update(detailSql, new Object[] {vdim_code, group_no, group_seq, expression, 0});
            }
            update(sql, new Object[] {vdim_code, group_no, group_name, group_seq});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param vdim_field 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryVdimCode(String vdim_field) throws BaseAppException {
        Date nowTime = new Date(); 
        SimpleDateFormat time = new SimpleDateFormat("yyyyMMddHHmmss"); 
        String vdimCode = vdim_field + "_" + time.format(nowTime);
        return vdimCode;
    }
    
}