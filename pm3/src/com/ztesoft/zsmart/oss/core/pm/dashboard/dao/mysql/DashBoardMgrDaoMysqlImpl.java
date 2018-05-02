/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.dao.mysql;

import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sybase.jdbc3.a.b.p;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.ServiceFlow;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
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

public class DashBoardMgrDaoMysqlImpl extends DashBoardMgrDao {
    
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public Map<String, Object> addDashBoardClass(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        
       

     Map<String, Object> result = new HashMap<String, Object>();
        String sql = "" + "INSERT INTO pm_dashboard_class ( " + "    class_no, " + "    class_name, " + "    seq, " + "    oper_user, "
                + "    oper_date, " + "    bp_id " + ") VALUES ( " + "    ?, " + "    ?, " + "    0, " + "    ?, " + "    sysdate(), " + "    NULL "
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
        try {
        Map<String, String> sysClassParam = new HashMap<String, String>();
        sysClassParam.put("topicId", id);
        sysClassParam.put("classType", "01");
        sysClassParam.put("userId", ""+param.get("userId"));
        sysClassParam.put("isDel", "0");
        this.updateSysClass(sysClassParam);
        }catch(Exception e ){
            e.printStackTrace();
        }
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
        String delsql = "delete  FROM PM_DASHBOARD_TOPIC_NODES  " + " where topic_no=?";
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
                + "    ?, " + "    ?, " + "    ?, " + "    ?, " + "    sysdate(), " + "    null, " + "    ? " + ")";
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
        if("-2".equalsIgnoreCase(param.get("classId"))){
            return this.queryDashBoarListFavByClassId(param);
        }
        if("-3".equalsIgnoreCase(param.get("classId"))){
            return this.queryDashBoarListRecByClassId(param);
        }
        String sql = "select topic_no,topic_name,class_no from PM_DASHBOARD_TOPIC_LIST where oper_user= ? and class_no= ?  order by topic_name asc ";
        ParamArray pa = new ParamArray();
        pa.set("", "" + param.get("userId"));
        pa.set("", "" + param.get("classId"));
        result.put("datas", DashBoardUtil.toConvert(this.queryList(sql, pa)));
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param <br>
     */ 
    private Map<String, Object> queryDashBoarListFavByClassId(Map<String, String> param)  throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String, Object> result = new HashMap<String, Object>();
        String sql ="select t.topic_no, t.topic_name, t.class_no "
                    + " from PM_DASHBOARD_TOPIC_LIST t , pm_dashboard_sysclass s"
                    + " where t.oper_user= ?" +
                    "and t.topic_no=s.topic_no and s.seq=0 and s.class_type='00' order by topic_name asc ";

        ParamArray pa = new ParamArray();
        pa.set("", "" + param.get("userId"));
        result.put("datas", DashBoardUtil.toConvert(this.queryList(sql, pa)));
        return result;
    }
    
    private Map<String, Object> queryDashBoarListRecByClassId(Map<String, String> param)  throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String, Object> result = new HashMap<String, Object>();
        String sql = ""
            + "select t.topic_no, t.topic_name, t.class_no,s.oper_date from PM_DASHBOARD_TOPIC_LIST t , pm_dashboard_sysclass s where t.oper_user= 1 and  t.topic_no=s.topic_no and s.seq=0 and s.class_type='01' order by s.oper_date desc limit 0,10";
        ParamArray pa = new ParamArray();
        pa.set("", "" + param.get("userId"));
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
        Map<String,String> sysClassParam = new HashMap<String, String>();
        sysClassParam.put("topicId", topID);
        sysClassParam.put("classType", "00");
        result.put("fav", isExistSysClass(sysClassParam));
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
    public Map<String, Object> updateSysClass(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("message", "ok");
        updateSysClassSeq(param);
        String isDel = param.get("isDel");
        if("1".equalsIgnoreCase(isDel))return result ;
        String sql =
        "insert into pm_dashboard_sysclass\n" +
        "  (class_type, topic_no, seq, oper_user, oper_date)\n" + 
        "values\n" + 
        "  (?, ?, 0, ?, sysdate())";
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
        ParamArray pa = new ParamArray();
        String sql =
                "select * from ( " +
                        "select s.*,rownum rn from ( " + 
                        "select s.* from  pm_dashboard_sysclass s where s.oper_user = ? and s.class_type= ? and s.seq=0 order by s.oper_date desc " + 
                        ") s " + 
                        ") s where s.rn<=?";
        
        int num  =Integer.parseInt(""+param.get("num"));
        if (num<0){
            sql ="select s.* from  pm_dashboard_sysclass s where s.oper_user = ? and s.class_type= ? and s.seq=0 order by s.oper_date desc ";
            pa.set("", param.get("userId"));
            pa.set("", param.get("classType"));
        }else{
            pa.set("", param.get("userId"));
            pa.set("", param.get("classType"));
            pa.set("", num);
        }
        result.put("list", queryList(sql, pa));
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
    public Map<String, Object> isExistSysClass(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String, Object> result = new HashMap<String, Object>();
        String sql =
                       "select count(*) from pm_dashboard_sysclass t"
                    + " where t.topic_no= ? and t.seq=0 and t.class_type=?";

        ParamArray pa  = new ParamArray();
        pa.set("", param.get("topicId"));
        pa.set("", param.get("classType"));
        int count =queryInt(sql, pa);
        result.put("isExist", count>0);
        return result ;
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
    public Map<String, String> saveOrUpdateSendTopic(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String, String> result = new HashMap<String, String>();
        if(isSendTopicExist(param)){
            updateSendTopic(param);
            
        }else{
             saveSendTopic(param);
      
        }
        try {
            this.getConnection().commit();
        }
        catch (SQLException e) {
            // TODO Auto-generated catch block <br>
            e.printStackTrace();
        }
        return result;
        
        
    }
    
    public void delSendTopic(Map<String, String> param) throws BaseAppException{
        String sql ="delete from PM_TOPIC_SEND  where  topic_type=? and topic_no=? and oper_user=?";
        ParamArray pa  = new ParamArray();
        pa.set("", param.get("topicType"));
        pa.set("", param.get("topicNo"));
        pa.set("", param.get("userId"));
        this.executeUpdate(sql, pa);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param <br>
     */ 
    private void updateSendTopic(Map<String, String> param) throws BaseAppException  {
        delSendTopic(param);
        saveSendTopic(param);
 
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param <br>
     * @throws BaseAppException 
     * @throws ParseException 
     */ 
    @SuppressWarnings("deprecation")
    private void saveSendTopic(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        System.out.println("save saveSendTopic");
        
        String sql =
                "insert into pm_topic_send\n" +
                        "  (topic_type, topic_no, subject_name, recipient, report_type, eff_date, exp_date, oper_date, oper_user)\n" + 
                        "values\n" + 
                        "  (?, ?, ?, ?, ?, ?, ?, sysdate(), ?)";
       
        ParamArray pa  = new ParamArray();
        pa.set("", param.get("topicType"));
        pa.set("", param.get("topicNo"));
        pa.set("", param.get("SubjectName"));
        pa.set("", param.get("Recipent"));
        pa.set("", param.get("ReportType"));
        pa.set("", DashBoardUtil.parse("yyyy-MM-dd",param.get("EffDate")));
        pa.set("", DashBoardUtil.parse("yyyy-MM-dd",param.get("ExpDate")));
        pa.set("", param.get("userId"));
        
        this.executeUpdate(sql,  pa);
        
        
        
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     * @throws BaseAppException 
     */ 
    private boolean isSendTopicExist(Map<String, String> param) throws BaseAppException {
        String sql ="select count(*) from PM_TOPIC_SEND t where t.topic_type=? and t.topic_no=? and t.oper_user=?";
        ParamArray pa  = new ParamArray();
        pa.set("", param.get("topicType"));
        pa.set("", param.get("topicNo"));
        pa.set("", param.get("userId"));
        return this.queryInt(sql,pa)>0;
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
    public Map<String, String> querySendTopicByNo(Map<String, String> param) throws BaseAppException {
        String sql ="select t.topic_type,t.topic_no,t.subject_name,t.recipient,t.report_type,t.eff_date,t.exp_date from PM_TOPIC_SEND t where t.topic_type=? and t.topic_no=? and t.oper_user=?";
        ParamArray pa  = new ParamArray();
        pa.set("", param.get("topicType"));
        pa.set("", param.get("topicNo"));
        pa.set("", param.get("userId"));
        return DashBoardUtil.toConvertQuery(this.query(sql, pa));
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public boolean isEmailSendOn() throws BaseAppException {
       String sql ="select count(*) from pm_parameter t  where t.para_id='emailOnOff' and t.para_value='1'";
       return this.queryInt(sql)>0;
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
    public Map<String, String> delDashBoardById(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String,String> result = new HashMap<String,String>();
        String sql = "Delete  FROM  Pm_Dashboard_Topic_List Where Topic_No=? And Oper_User=?";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("id"));
        pa.set("", param.get("userId"));
        int value =this.executeUpdate(sql, pa);
        result.put("value", ""+value);
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
    public Map<String, Object> addExportTask(Map<String, Object> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String,Object> result = new HashMap<String,Object>();
        logger.debug("addExportTask:");
        logger.debug(param);
        String type  =""+param.get("type");
        String classPath ="";
        if("02".equalsIgnoreCase(type)) {
            classPath="com.ztesoft.zsmart.oss.core.pm.plugin.email.SendEmailOncePlug";
        }
        if("01".equalsIgnoreCase(type)) {
            classPath="com.ztesoft.zsmart.oss.core.pm.plugin.email.DownloadPlug";
        }
        param.put("class_path",classPath);

        DynamicDict taskParam = addTask(param);
        String sql = ""
            + "INSERT INTO pm_dataexp_log ( "
            + "    export_type, "
            + "    topic_no, "
            + "    task_id, "
            + "    export_filename, "
            + "    export_path, "
            + "    spec_export_date, "
            + "    state, "
            + "    commit_date, "
            + "    oper_user "
            + ") VALUES ( "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    null, "
            + "    ?, "
            + "    ?, "
            + "    sysdate(), "
            + "    ? "
            + ")";
        
        String sql2 = ""
            + "INSERT INTO pm_dataexp_log ( "
            + "    export_type, "
            + "    topic_no, "
            + "    task_id, "
            + "    export_filename, "
            + "    export_path, "
            + "    spec_export_date, "
            + "    state, "
            + "    commit_date, "
            + "    oper_user "
            + ") VALUES ( "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    ?, "
            + "    null, "
            + "    sysdate(), "
            + "    ?, "
            + "    sysdate(), "
            + "    ? "
            + ")";
        
       

        ParamArray pa = new ParamArray();
       
        String taskId =taskParam.getString("TASK_ID");
        pa.set("", type);
        pa.set("", ""+param.get("topicNo"));
        pa.set("", taskId);
        pa.set("", ""+param.get("exportFileName"));
        
        String exportDate =""+taskParam.getString("EXEC_DATE");
        boolean flag =true;
        if("-1".equalsIgnoreCase(exportDate)){
            flag =false;
        }
        if(flag){
        pa.set("", DashBoardUtil.parse("yyyy-MM-dd HH:mm:ss", exportDate));
        }
        
        pa.set("", DashBoardUtil.DOWANLOAD_STATE_TODO);
        pa.set("", ""+param.get("userId"));
        if(flag){
           this.executeUpdate(sql, pa);
        }else{
           this.executeUpdate(sql2, pa);
        }
        this.addTaskParam(taskId,""+param.get("jsonParam"));
        
       
       
        result.put("flag", true);
        try {
            this.getConnection().commit();
        }
        catch (SQLException e) {
            // TODO Auto-generated catch block <br>
            e.printStackTrace();
        }
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return <br>
     * @throws BaseAppException 
     */ 
    private DynamicDict addTask(Map<String, Object> param) throws BaseAppException {
        DynamicDict dict  = new DynamicDict();
       String sn ="MPM_TASKEXCUTEONETIME_SERVER";
        dict.setServiceName(sn);
        Map<String,String> task = new HashMap<String, String>();
        task.put("PARAM_PATH", ""+param.get("class_path") );
        task.put("PARAM",""+param.get("task_param"));
        task.put("EXEC_DATE", null);
        List<Map<String,String>> tasks = new ArrayList<Map<String,String>>();
        tasks.add(task);
        dict.set("Args", tasks);
        ServiceFlow.callService(dict, true);
        DynamicDict result =(DynamicDict) dict.get("Args");
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param uuid
     * @param object <br>
     */ 
    private void addTaskParam(String taskId, String jsonParam) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        System.err.println(taskId);
        String sql = ""
            + "INSERT INTO pm_dataexp_log_param ( "
            + "    task_id, "
            + "    task_param, "
            + "    param_seq "
            + ") VALUES ( "
            + "    ?, "
            + "    ?, "
            + "    ? "
            + ")";
        
        List<String> attrs_parts = DashBoardUtil.splitByNumbers(jsonParam, 1024);
        int count =0;
        for(String part :attrs_parts ){
            System.err.println(count+"==>"+part);
            ParamArray pa = new ParamArray();
            pa.set("", taskId);
            pa.set("", part);
            pa.set("", count);
            this.executeUpdate(sql, pa);
            count++;
        }
        
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
    public Map<String, Object> getExportTaskListByUserId(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        Map<String, Object> result = new HashMap<String,Object>();
        String userId = param.get("userId");
        String sql = ""
            + "select export_type, "
            + "    topic_no, "
            + "    task_id, "
            + "    export_filename, "
            + "    export_path, "
            + "    spec_export_date, "
            + "    state, "
            + "    commit_date, "
            + "    oper_user "
            + "FROM "
            + "    pm_dataexp_log "
            + "where "
            + "   Oper_User=?"
            + "   and  "
            + " export_type ='01' "
            +"   and  "
            + " COMMIT_DATE >= sysdate() - 7 order by COMMIT_DATE desc ";
        ParamArray pa = new ParamArray();
        pa.set("", userId);
        result.put("taskList", this.queryList(sql, pa));
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
    public Map<String, Object> getExportTaskListByUserIdAndFilter(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String,Object>();
        String userId = param.get("userId");
        String filter=param.get("filter");
        String sql = ""
            + "SELECT "
            + "    export_type, "
            + "    topic_no, "
            + "    task_id, "
            + "    export_filename, "
            + "    export_path, "
            + "    spec_export_date, "
            + "    state, "
            + "    commit_date, "
            + "    oper_user "
            + "FROM "
            + "    pm_dataexp_log "
            + "where "
            + "   Oper_User = ? "
            + "   and  "
            + "   Export_Filename like ? "
            + "   and  "
            + " export_type ='01'  "
            + " and "
            +" COMMIT_DATE >= sysdate - 7 order by COMMIT_DATE desc ";
         ParamArray pa = new ParamArray();
        pa.set("", userId);
        pa.set("", "%"+filter+"%");
        result.put("taskList", this.queryList(sql, pa));
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param key
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public String getParamter(String key) throws BaseAppException {
        String sql = "select  PARA_VALUE from pm_parameter t  where t.para_id=?";
        ParamArray pa = new ParamArray();
        pa.set("", key);
        return this.queryString(sql, pa).trim();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskid
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public String getTaskParam(String taskid) throws BaseAppException {
        String attrs_sql ="select  param_seq,task_param ATTRS from PM_DATAEXP_LOG_PARAM where task_id=?  order by  param_seq";
        ParamArray attrs_pa = new ParamArray();
        attrs_pa.set("", taskid);
        StringBuffer attrs = new StringBuffer();
        for (Map<String, String> attr_part : (List<HashMap<String,String>>)this.queryList(attrs_sql, attrs_pa)) {
            attrs.append(attr_part.get("ATTRS"));
        }
        return attrs.toString();
    }

    
    

}
