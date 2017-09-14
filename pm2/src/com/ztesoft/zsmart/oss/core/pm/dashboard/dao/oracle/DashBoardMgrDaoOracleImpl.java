/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.dao.oracle;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sybase.jdbc3.a.b.p;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.core.pm.dashboard.dao.DashBoardMgrDao;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.DashBoardUtil;

/**
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年8月12日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.dashboard.dao.oracle <br>
 */

public class DashBoardMgrDaoOracleImpl extends DashBoardMgrDao {

    @Override
    public Map<String, Object> addDashBoardClass(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>

        Map<String, Object> result = new HashMap<String, Object>();
        String sql = "" + "INSERT INTO pm_dashboard_class ( " + "    class_no, " + "    class_name, " + "    seq, " + "    oper_user, "
                + "    oper_date, " + "    bp_id " + ") VALUES ( " + "    ?, " + "    ?, " + "    0, " + "    ?, " + "    sysdate, " + "    NULL "
                + ")";
        String id = DashBoardUtil.getSeq("PM_DASHBOARD_SEQ");
        ParamArray pa = new ParamArray();
        pa.set("", id);
        pa.set("", param.get("name"));
        pa.set("", param.get("userId"));
        this.executeUpdate(sql, pa);
        result.put("id", id);
        return result;
    }

    @Override
    public Map<String, Object> queryDashBoardClassByUserID(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        String sql = "" + "SELECT " + "    class_no, " + "    class_name, " + "    seq, " + "    oper_user, " + "    oper_date, " + "    bp_id "
                + "FROM " + "    pm_dashboard_class " + "WHERE " + "   OPER_USER=? " + "ORDER BY " + "    oper_date ASC";

        ParamArray pa = new ParamArray();
        pa.set("", param.get("userId"));
        result.put("datas", DashBoardUtil.toConvert(this.queryList(sql, pa)));
        return result;

    }

    @Override
    public Map<String, Object> delDashBoardClassByID(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("isDel", false);
        if (isHasDashBoard(param)) {
            result.put("isDel", false);
            return result;
        }
        String sql = "DELETE FROM pm_dashboard_class WHERE class_no =?";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("classId"));
        this.executeUpdate(sql, pa);
        result.put("isDel", true);
        return result;
    }

    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return boolean
     * @throws BaseAppException  <br> 
     */
    private boolean isHasDashBoard(Map<String, String> param) throws BaseAppException {
        String sql = "select count(*) from PM_DASHBOARD_TOPIC_LIST where class_no = ? ";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("classId"));

        return this.queryInt(sql, pa) > 0;
    }

    @Override
    public Map<String, Object> changeDashBoardClassNameByID(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();

        String sql = "" + "UPDATE pm_dashboard_class " + "    SET " + "        class_name = ? " + "WHERE " + "        class_no =?";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("name"));
        pa.set("", param.get("classId"));
        this.executeUpdate(sql, pa);
        result.put("isOk", true);
        return result;
    }

    @Override
    public Map<String, Object> saveUpdateDashBoard(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String, Object> result = new HashMap<String, Object>();
        String id = "0";
        if (isExitsDashBoard(param)) {
            id = updateDashBoard(param);
        }
        else {

            id = saveDashBoard(param);
        }
        param.put("id", id);
        saveNodes(param);
        result.put("id", id);
        return result;
    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return String 
     * @throws BaseAppException
     *             <br>
     */
    private String updateDashBoard(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql = "" + "UPDATE pm_dashboard_topic_list " + "    SET " + "        topic_name = ?, " + "        attrs= ?, " + "        is_share= ?, "
                + "        state = ?, " + "        oper_user= ?, " + "        class_no= ? " + "WHERE " + "       topic_no = ?";
        ParamArray pa = new ParamArray();
        pa.set("", "" + param.get("name"));
        pa.set("", "" + param.get("canvasAttrs"));
        pa.set("", "" + param.get("isShare"));
        pa.set("", "" + param.get("state"));
        pa.set("", "" + param.get("userId"));
        pa.set("", "" + param.get("classNo"));
        pa.set("", "" + param.get("id"));
        this.executeUpdate(sql, pa);
        return "" + param.get("id");

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     *            <br>
     * @throws BaseAppException 
     */
    private void saveNodes(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String topcNo = "" + param.get("id");
        // TODO 删除所有子节点
        String delsql = "delete PM_DASHBOARD_TOPIC_NODES nodes " + " where nodes.topic_no=?";
        ParamArray del_pa = new ParamArray();
        del_pa.set("", topcNo);
        this.executeUpdate(delsql, del_pa);
        // TODO 添加新的所有子节点
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) param.get("nodesAttrs");
        String add_sql = "insert into PM_DASHBOARD_TOPIC_NODES " + "  (topic_no, node_no, attrs, attr_seq) " + "values " + "  (?, ?, ?, ?)";
        for (Map attrsMap : nodes) {
            String attrs = JSON.toJSONString(attrsMap);
            String v_node_no = DashBoardUtil.getSeq("PM_DASHBOARD_SEQ");
            List<String> attrs_parts = DashBoardUtil.splitByNumbers(attrs, 1024); // 按字符大小分割问题。
            for (int i = 0; i < attrs_parts.size(); i++) {
                ParamArray add_pa = new ParamArray();
                String attr = attrs_parts.get(i);
                add_pa.set("", topcNo);
                add_pa.set("", v_node_no);
                add_pa.set("", attr);
                add_pa.set("", i);
                this.executeUpdate(add_sql, add_pa);
            }
        }

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return <br>
     * @throws BaseAppException 
     */
    private String saveDashBoard(Map<String, Object> param) throws BaseAppException {
        String sql = "" + "INSERT INTO pm_dashboard_topic_list ( " + "    topic_no, " + "    topic_name, " + "    attrs, " + "    is_share, "
                + "    state, " + "    oper_user, " + "    oper_date, " + "    bp_id, " + "    class_no " + ") VALUES ( " + "    ?, " + "    ?, "
                + "    ?, " + "    ?, " + "    ?, " + "    ?, " + "    sysdate, " + "    null, " + "    ? " + ")";
        String id = DashBoardUtil.getSeq("PM_DASHBOARD_SEQ");
        ParamArray pa = new ParamArray();
        pa.set("", id);
        pa.set("", "" + param.get("name"));
        pa.set("", "" + param.get("canvasAttrs"));
        pa.set("", "" + param.get("isShare"));
        pa.set("", "" + param.get("state"));
        pa.set("", "" + param.get("userId"));
        pa.set("", "" + param.get("classNo"));
        this.executeUpdate(sql, pa);

        return id;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param param 
     * @return <br>
     * @throws BaseAppException 
     */
    private boolean isExitsDashBoard(Map<String, Object> param) throws BaseAppException {
        String sql = "select count(*)  from  PM_DASHBOARD_TOPIC_LIST where topic_no= ? ";
        ParamArray pa = new ParamArray();
        pa.set("", "" + param.get("id"));
        return this.queryInt(sql, pa) > 0;
    }

   
    @Override
    public Map<String, Object> queryDashBoarListByClassId(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        String sql = "select topic_no,topic_name,class_no from PM_DASHBOARD_TOPIC_LIST where oper_user= ? and class_no= ? ";
        ParamArray pa = new ParamArray();
        pa.set("", "" + param.get("userId"));
        pa.set("", "" + param.get("classId"));
        result.put("datas", DashBoardUtil.toConvert(this.queryList(sql, pa)));
        return result;
    }

    @Override
    public Map<String, Object> queryDashBoardById(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        // TODO 查询BScreeen
        String topID = param.get("id");
        HashMap<String, Object> json = new HashMap<String, Object>();
        // 获取主题信息
        String topic_sql = "SELECT T.TOPIC_NO as ID ,T.TOPIC_NAME as NAME,T.ATTRS as attrs, "
                + "T.IS_SHARE as IS_SHARE,T.STATE as STATE,T.OPER_USER as USER_ID,T.class_no  FROM PM_DASHBOARD_TOPIC_LIST T WHERE T.TOPIC_NO=?";
        ParamArray topic_pa = new ParamArray();
        topic_pa.set("", topID);
        List<HashMap<String, String>> topicList = this.queryList(topic_sql, topic_pa);
        HashMap<String, String> topic = topicList.get(0);
        json = BScreenUtil.toConvert(topic);
        String att = "" + json.get("attrs");
        json.put("attrs", JSON.parseObject(att));
        // json.put("attrs", JSON.parse(BScreenUtil.toString(json.get("attrs"))));
        // 获取所有节点信息
        String sql = "select distinct node_no from PM_DASHBOARD_TOPIC_NODES  nodes where nodes.topic_no =? order by node_no";
        ParamArray pa = new ParamArray();
        pa.set("", topID);
        List<HashMap<String, String>> node_parts = this.queryList(sql, pa);
        String attrs_sql = "select attrs,attr_seq from PM_DASHBOARD_TOPIC_NODES nodes where nodes.node_no=? order by attr_seq";
        List<JSONObject> nodes = new ArrayList<JSONObject>();
        for (HashMap<String, String> node_no : node_parts) {
            HashMap<String, Object> node = new HashMap<String, Object>();
            String no = node_no.get("NODE_NO");
            node.put("id", no);
            ParamArray attrs_pa = new ParamArray();
            attrs_pa.set("", no);
            StringBuffer attrs = new StringBuffer();
            for (HashMap<String, String> attr_part : this.queryList(attrs_sql, attrs_pa)) {
                attrs.append(attr_part.get("ATTRS").trim());
            }

            JSONObject nodeattr = JSON.parseObject(attrs.toString());
            nodeattr.put("id", no);
            nodes.add(nodeattr);
        }
        json.put("nodes", nodes);
        result.put("topicJson", json);
        return result;

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, Object> addSysClass(Map<String, String> param) throws BaseAppException {
        updateSysClassSeq(param);
        Map<String, Object> result = new HashMap<String, Object>();
        String sql =
        "insert into pm_dashboard_sysclass\n" +
        "  (class_type, topic_no, seq, oper_user, oper_date)\n" + 
        "values\n" + 
        "  (?, ?, 0, ?, sysdate)";
         ParamArray pa = new ParamArray();
        pa.set("", param.get("classType"));
        pa.set("", param.get("topicId"));
        pa.set("", param.get("userId"));
        this.executeUpdate(sql, pa);
        try {
            this.getConnection().commit();
        }
        catch (SQLException e) {
            // TODO Auto-generated catch block <br>
            e.printStackTrace();
        }
        System.err.println(pa);
        result.put("message", "ok");
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param <br>
     */ 
    private void updateSysClassSeq(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String seq = queryMaxSysClassSeq(param);
        System.err.println(seq);
        String sql =    "update pm_dashboard_sysclass " + 
                        "   set " + 
                        "    seq = ?" + 
                        " where class_type = ? " + 
                        "   and topic_no = ? " + 
                        "   and seq = 0 " + 
                        "   and oper_user = ?";

        ParamArray pa = new ParamArray();
        pa.set("", seq);
        pa.set("", param.get("classType"));
        pa.set("", param.get("topicId"));
        pa.set("", param.get("userId"));
        executeUpdate(sql, pa);
      
            
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     */ 
    private String queryMaxSysClassSeq(Map<String, String> param) throws BaseAppException  {
        String sql =
                "select max(seq)+1 from  pm_dashboard_sysclass where  topic_no = ?";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("topicId"));
        
        return ""+this.queryInt(sql,pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, Object> querySysClassTopList(Map<String, String> param) throws BaseAppException {
       
        Map<String, Object> result = new HashMap<String, Object>();

        String sql =
                "select * from ( " +
                        "select s.*,rownum rn from ( " + 
                        "select s.* from  pm_dashboard_sysclass s where s.oper_user = ? and s.class_type= ? and s.seq=0 order by s.oper_date desc " + 
                        ") s " + 
                        ") s where s.rn<=?";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("userId"));
        pa.set("", param.get("classType"));
        pa.set("", param.get("num"));
        result.put("list", queryList(sql, pa));
        return result;
    }

}
