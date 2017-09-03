package com.ztesoft.zsmart.oss.core.pm.bscreen.dao.oracle;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.SQLUtil;

/**
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.dao.oracle <br>
 */
public class BScreenMgrDaoOracleImpl extends BScreenMgrDao {
    
    /**
     * logger
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        // TODO 保存更新大屏主题 (doing)
        com.ztesoft.zsmart.web.filter.LocaleFilter s;
        ArrayList<DynamicDict> list = (ArrayList<DynamicDict>) dict.getList("data");
        DynamicDict data = list.get(0);
        String topicId = data.getString("id");
        if (isExistTopic(topicId)) {
            String imagePath = saveImage(data.getString("base64"), topicId);
            data.set("imagePath", imagePath);
            updateTopic(data);
        }
        else {
            String v_topic_no = BScreenUtil.getSeq("PM_BSTOPIC_SEQ");
            data.set("id", v_topic_no);
            String imagePath = saveImage(data.getString("base64"), v_topic_no);
            data.set("imagePath", imagePath);
            saveTopic(data);
        }

        updateTopicNodes(data);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param base64  
     * @param topicId  
     * @return <br>
     */
    private String saveImage(String base64, String topicId) {
        // TODO Auto-generated method stub
        URL path = this.getClass().getResource("/../../"); // 得到当前目录真实目录文件
        File dirs = new File(path.getPath() + "/oss_core/pm/screendesigner/upload/bsimage");
        String filename = BScreenUtil.saveImage(dirs, base64, topicId); // 生成topicId.png存放在dirs中。
        if (filename == null) {
            return "";
        }
        else {
            return "oss_core/pm/screendesigner/upload/bsimage/" + filename;
        }

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param data 
     * @throws BaseAppException 
     *             <br>
     */
    private void updateTopic(DynamicDict data) throws BaseAppException {
        // TODO 更新大屏主题
        String sql = "UPDATE PM_BSCREEN_TOPIC_LIST " + "   SET TOPIC_NAME = ?, " + "       ATTRS = ?, " + "       IMAGE_PATH = ?, "
                + "       IS_SHARE = ?, " + "       STATE = ? " + " WHERE TOPIC_NO=? ";

        String v_topic_no = data.getString("id");
        String v_topic_name = data.getString("name");
        String v_attrs = JSON.toJSONString(BScreenUtil.dic2Map((DynamicDict) data.get("attrs")));
        String v_image_path = data.getString("imagePath");
        String v_is_share = data.getString("isShare");
        String v_state = data.getString("state");
        // TODO :保存大屏主题,还没使用的的字段
        String v_bp_id = "";
        String v_class_no = "";
        // 设置参数
        ParamArray pa = new ParamArray();
        pa.set("", v_topic_name);
        pa.set("", v_attrs);
        pa.set("", v_image_path);
        pa.set("", v_is_share);
        pa.set("", v_state);
        pa.set("", v_topic_no);
        this.executeUpdate(sql, pa);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param data 
     * @throws BaseAppException 
     *             <br>
     */
    private void saveTopic(DynamicDict data) throws BaseAppException {
        // TODO 保存大屏主题
        String sql = "insert into pm_bscreen_topic_list "
                + "  (topic_no, topic_name, attrs, image_path, is_share, state, oper_user, oper_date, bp_id, class_no) " + " values "
                + "  (?, ?, ?, ?, ?, ?, ?, sysdate, null, null)";
        ParamArray pa = new ParamArray();
        String v_topic_no = data.getString("id");
        String v_topic_name = BScreenUtil.toString(data.get("name"));
        String v_attrs = JSON.toJSONString(BScreenUtil.dic2Map((DynamicDict) data.get("attrs")));
        String v_image_path = data.getString("imagePath");
        String v_is_share = BScreenUtil.toString(data.get("isShare"));
        String v_state = BScreenUtil.toString(data.get("state"));
        Long v_oper_user = data.getLong("userid");
        // TODO :保存大屏主题,还没使用的的字段
        String v_bp_id = "";
        String v_class_no = "";
        // 设置参数
        pa.set("", v_topic_no);
        pa.set("", v_topic_name);
        pa.set("", v_attrs);
        pa.set("", v_image_path);
        pa.set("", v_is_share);
        pa.set("", v_state);
        pa.set("", v_oper_user);
        this.executeUpdate(sql, pa);
        data.set("id", v_topic_no);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param data 
     * @throws BaseAppException
     *             <br>
     */
    private void updateTopicNodes(DynamicDict data) throws BaseAppException {
        String topcNo = BScreenUtil.toString(data.get("id"));
        // TODO 删除所有子节点
        String delsql = "delete pm_bscreen_topic_nodes nodes " + " where nodes.topic_no=?";
        ParamArray del_pa = new ParamArray();
        del_pa.set("", topcNo);
        this.executeUpdate(delsql, del_pa);
        // TODO 添加新的所有子节点
        ArrayList<DynamicDict> nodes = (ArrayList<DynamicDict>) data.getList("nodes");
        String add_sql = "insert into pm_bscreen_topic_nodes " + "  (topic_no, node_no, attrs, attr_seq) " + "values " + "  (?, ?, ?, ?)";
        for (DynamicDict node : nodes) {
            Map attrsMap = BScreenUtil.dic2Map((DynamicDict) node.get("attrs"));
            Map dbServer = (Map) attrsMap.get("dbServer");
            String attrs = JSON.toJSONString(attrsMap);
            String v_node_no = BScreenUtil.getSeq("PM_BSTNODES_SEQ");
            if (dbServer != null) {
                saveOrUpdateNodeService(topcNo, v_node_no, "" + dbServer.get("serverName"));
            }
            List<String> attrs_parts = BScreenUtil.splitByNumbers(attrs, 1024); // 按字符大小分割问题。
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
     * @param topcNo 
     * @param v_node_no 
     * @param no
     * 
     *            <br>
     */
    private void saveOrUpdateNodeService(String topcNo, String v_node_no, String no) {
        Map<String, String> param = new HashMap<String, String>();
        param.put("no", no);
        try {
            if (isExistSourceService(param)) {
                String sql = " DELETE FROM PM_BSCREEN_NODES_SERVFIELD WHERE TOPIC_NO =?";
                ParamArray pa = new ParamArray();
                pa.set("", topcNo);
                this.executeUpdate(sql, pa);
                String add_sql = "" + "INSERT INTO PM_BSCREEN_NODES_SERVFIELD ( " + "    CLASS_NO, " + "    TOPIC_NO, " + "    NODE_NO, "
                        + "    SERVICE_NO " + ") VALUES ( " + "    0 , " + "    ?, " + "    ?, " + "    ? " + ")";
                ParamArray pa2 = new ParamArray();
                pa2.set("", topcNo);
                pa2.set("", v_node_no);
                pa2.set("", no);
                this.executeUpdate(add_sql, pa2);

            }
        }
        catch (Exception e) {
            e.getMessage();
        }
    }

    @Override
    public boolean isExistTopic(String topic_no) throws BaseAppException {
        // TODO 大屏主题是否存在(done)
        String sql = "select count(*) from PM_BSCREEN_TOPIC_LIST t where t.topic_no=?";
        ParamArray pa = new ParamArray();
        pa.set("", topic_no);
        int i = this.queryInt(sql, pa);
        return this.queryInt(sql, pa) > 0;
    }

    @Override
    public void queryBScreenById(DynamicDict dict) throws BaseAppException {
        // TODO 查询BScreeen
        String topID = BScreenUtil.toString(dict.get("topId"));
        if (!isExistTopic(topID)) {
            return;
        }
        HashMap<String, Object> json = new HashMap<String, Object>();
        // 获取主题信息
        String topic_sql = "SELECT T.TOPIC_NO as ID ,T.TOPIC_NAME as NAME,T.ATTRS as attrs,T.IMAGE_PATH as IMAGE_PATH,"
                + "T.IS_SHARE as IS_SHARE,T.STATE as STATE,T.OPER_USER as USER_ID FROM PM_BSCREEN_TOPIC_LIST T WHERE T.TOPIC_NO=?";
        ParamArray topic_pa = new ParamArray();
        topic_pa.set("", topID);
        List<HashMap<String, String>> topicList = this.queryList(topic_sql, topic_pa);
        HashMap<String, String> topic = topicList.get(0);
        json = BScreenUtil.toConvert(topic);
        String att = "" + json.get("attrs");
        json.put("attrs", JSON.parseObject(att));
        // json.put("attrs", JSON.parse(BScreenUtil.toString(json.get("attrs"))));
        // 获取所有节点信息
        String sql = "select distinct node_no from pm_bscreen_topic_nodes  nodes where nodes.topic_no =? order by node_no";
        ParamArray pa = new ParamArray();
        pa.set("", topID);
        List<HashMap<String, String>> node_parts = this.queryList(sql, pa);
        String attrs_sql = "select attrs,attr_seq from pm_bscreen_topic_nodes nodes where nodes.node_no=? order by attr_seq";
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
            node.put("attrs", JSON.parseObject(attrs.toString()));
            String json_nodes = JSON.toJSONString(node);
            nodes.add(JSON.parseObject(json_nodes));
        }
        json.put("nodes", nodes);
        dict.add("topicJson", json);
    }

    @Override
    public List<Map<String, Object>> queryBScreenListByUserID(Long userId) throws BaseAppException {
        String sql = "SELECT  T.TOPIC_NO as ID ,T.TOPIC_NAME as NAME,ATTRS,T.IMAGE_PATH as IMAGE_PATH,"
                + "T.IS_SHARE ,T.OPER_USER,T.OPER_DATE  FROM PM_BSCREEN_TOPIC_LIST T WHERE T.OPER_USER=? OR IS_SHARE=3 ORDER BY T.OPER_DATE";
        ParamArray pa = new ParamArray();
        pa.set("", userId);
        List<Map<String, Object>> result = BScreenUtil.toConvert(this.queryList(sql, pa));
        for (Map<String, Object> map : result) {
            String att = "" + map.get("attrs");
            map.put("attrs", JSON.parseObject(att));
        }
        return result;
    }
    
    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [刘宁]<br>
     * @taskId <br>
     * @param id  
     * @throws BaseAppException <br>
     */
    private void deleteBScreenByIdFiles(String id) throws BaseAppException {
        try {
            DynamicDict dict = new DynamicDict();
            dict.set("topId", id);
            queryBScreenById(dict);
            HashMap<String, Object> json = (HashMap<String, Object>) dict.get("topicJson");
            List<JSONObject> nodes = (List<JSONObject>) json.get("nodes");
            for (JSONObject node : nodes) {
                JSONObject attrs = (JSONObject) node.get("attrs");
                String type = "" + attrs.get("type");
                if ("imageNode".equalsIgnoreCase(type)) {
                    String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
                    String fileName = attrs.getString("filename");
                    String filePath = fileDirectory + "/" + fileName;
                    File file = new File(filePath);
                    file.delete();
                }
            }
        }
        catch (Exception e) {
            e.getMessage();
        }
    }

    @Override
    public boolean deleteBScreenById(String id) throws BaseAppException {
        boolean b = true;
        deleteBScreenByIdFiles(id);
        try {
            String sql = "DELETE PM_BSCREEN_TOPIC_LIST T WHERE T.TOPIC_NO=?";
            ParamArray pa = new ParamArray();
            pa.set("", id);
            this.executeUpdate(sql, pa);
            String deleteNodeSql = "DELETE PM_BSCREEN_TOPIC_NODES T WHERE T.TOPIC_NO=?";
            ParamArray pa2 = new ParamArray();
            pa2.set("", id);
            this.executeUpdate(deleteNodeSql, pa2);
        }
        catch (Exception e) {
            b = false;
        }
        return b;
    }

    @Override
    public Map<String, Object> getFields(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub
        String source = param.get("source");
        String sql = param.get("sql");
        Map<String, String> info = getSource(source);
        if (info == null) {
            Map<String, Object> error = new HashMap<String, Object>();
            error.put("message", "Data Source Error");
            error.put("fields", new ArrayList<String>());
            return error;
        }
        return SQLUtil.getFields(SQLUtil.getJdbcTemplate(info), sql);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param sourceID  
     * @return map
     * @throws BaseAppException
     *             <br>
     */
    private Map<String, String> getSource(String sourceID) throws BaseAppException {
        // TODO Auto-generated method stub
        Map<String, String> result = new HashMap<String, String>();
        String sql = "select VALUE,NAME from tfm_config t where t.parent_id=?";
        ParamArray pa = new ParamArray();
        pa.set("", sourceID);

        List<HashMap<String, String>> list = this.queryList(sql, pa);
        if (list.isEmpty()) {
            return null;
        }
        for (HashMap<String, String> item : list) {
            result.put(item.get("NAME"), item.get("VALUE"));
        }

        return result;
    }

    @Override
    public Map<String, Object> saveOrUpdateSourceService(Map<String, String> map) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        if (isExistSourceService(map)) {
            updateSourceService(map);
        }
        else {
            saveSourceService(map);
        }

        saveUpdateSourceServiceAttrs(map);

        result.put("no", map.get("no"));
        result.put("name", map.get("name"));
        return result;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @throws BaseAppException
     *             <br>
     */
    private void saveUpdateSourceServiceAttrs(Map<String, String> map) throws BaseAppException {
        deleteSourceServiceAttrs(map);
        saveSourceServiceAttrs(map);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @throws BaseAppException
     *             <br>
     */
    private void saveSourceServiceAttrs(Map<String, String> map) throws BaseAppException {
        // TODO Auto-generated method stub
        String sql = "" + "INSERT INTO pm_bscreen_service_col ( " + "    service_no, " + "    service_col_no, " + "    attr_seq, " + "    attrs "
                + ") VALUES ( " + "    ?, " + "    ?, " + "    ?, " + "    ? " + ")";

        ParamArray pa = new ParamArray();
        String no = "" + map.get("no");
        String col_no = BScreenUtil.getSeq("PM_BSSERCOL_SEQ");
        String attrs = map.get("attrs");

        List<String> attrs_parts = BScreenUtil.splitByNumbers(attrs, 1024); // 按字符大小分割问题。
        for (int i = 0; i < attrs_parts.size(); i++) {
            ParamArray add_pa = new ParamArray();
            String attr = attrs_parts.get(i);
            add_pa.set("", no);
            add_pa.set("", col_no);
            add_pa.set("", i);
            add_pa.set("", attr);
            this.executeUpdate(sql, add_pa);
        }

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @throws BaseAppException
     *             <br>
     */
    private void deleteSourceServiceAttrs(Map<String, String> map) throws BaseAppException {
        // TODO Auto-generated method stub
        String sql = "delete  PM_BSCREEN_SERVICE_COL where service_no=?";
        ParamArray pa = new ParamArray();
        String no = map.get("no");
        pa.set("", no);
        this.executeUpdate(sql, pa);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @throws BaseAppException
     *             <br>
     */
    private void updateSourceService(Map<String, String> map) throws BaseAppException {
        String sql = "" + "UPDATE pm_bscreen_service_list " + "    SET " + "          service_name =?, " + "          service_type =?, "
                + "          service_source =?, " + "          oper_user =?, " + "          oper_date =sysdate " + "          " + "WHERE "
                + "        service_no =?";
        ParamArray pa = new ParamArray();
        String no = map.get("no");
        String name = map.get("name");
        String type = map.get("type");
        String source = map.get("source");
        String userId = map.get("userId");
        pa.set("", name); // name
        pa.set("", type); // type
        pa.set("", source); // Source
        pa.set("", userId); // userId
        pa.set("", no); // no
        this.executeUpdate(sql, pa);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @return boolean
     * @throws BaseAppException
     *             <br>
     */
    private boolean isExistSourceService(Map<String, String> map) throws BaseAppException {
        String sql = "select count(*) from PM_BSCREEN_SERVICE_LIST t where t.SERVICE_NO=?";
        String no = map.get("no");
        ParamArray pa = new ParamArray();
        pa.set("", no);
        return this.queryInt(sql, pa) > 0;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param map 
     * @throws BaseAppException
     *             <br>
     */
    private void saveSourceService(Map<String, String> map) throws BaseAppException {
        String sql = "" + "INSERT INTO pm_bscreen_service_list ( " + "    service_no, " + "    service_name, " + "    service_type, "
                + "    service_source, " + "    oper_user, " + "    oper_date, " + "    bp_id " + ") VALUES ( " + "     ?, " + "     ?, " + "     ?, "
                + "     ?, " + "     ?, " + "     sysdate, " + "     null " + ")";
        ParamArray pa = new ParamArray();
        String no = BScreenUtil.getSeq("PM_BSSERVICE_SEQ");
        map.put("no", no);
        String name = map.get("name");
        String type = map.get("type");
        String source = map.get("source");
        String userId = map.get("userId");

        pa.set("", no); // no
        pa.set("", name); // name
        pa.set("", type); // type
        pa.set("", source); // Source
        pa.set("", userId); // userId
        this.executeUpdate(sql, pa);

    }

    @Override
    public Map<String, Object> getSourceServiceList(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        String sql = "SELECT  T.SERVICE_NO,T.SERVICE_NAME,T.SERVICE_TYPE,T.SERVICE_SOURCE,T.OPER_USER ,"
                + "T.OPER_DATE FROM PM_BSCREEN_SERVICE_LIST  T  WHERE  T.OPER_USER=?";
        ParamArray pa = new ParamArray();
        pa.set("", param.get("userId"));
        result.put("datas", BScreenUtil.toConvert(this.queryList(sql, pa)));
        return result;
    }

    @Override
    public Map<String, Object> getSourceServiceById(Map<String, String> param) throws BaseAppException {
        Map<String, Object> result = new HashMap<String, Object>();
        Map<String, Object> json = new HashMap<String, Object>();
        String id = param.get("Id");

        String sql = "SELECT SERVICE_NO no, SERVICE_NAME name, SERVICE_TYPE TYPE, SERVICE_SOURCE source, "
                + "OPER_USER USER_ID, OPER_DATE OPER_DATE, BP_ID bpId FROM PM_BSCREEN_SERVICE_LIST  T WHERE T.SERVICE_NO=?";

        ParamArray pa = new ParamArray();
        pa.set("", id);
        json = BScreenUtil.toConvert(this.query(sql, pa));

        String sql2 = "SELECT  DISTINCT SERVICE_COL_NO  FROM PM_BSCREEN_SERVICE_COL WHERE SERVICE_NO=?";
        ParamArray pa2 = new ParamArray();
        pa2.set("", id);
        HashMap<String, String> node_attrs = this.query(sql2, pa2);

        String attrs_sql = "SELECT SERVICE_NO, SERVICE_COL_NO, ATTR_SEQ, ATTRS "
                + "FROM PM_BSCREEN_SERVICE_COL T WHERE T.SERVICE_COL_NO=? ORDER BY ATTR_SEQ";
        HashMap<String, Object> node = new HashMap<String, Object>();
        String no = node_attrs.get("SERVICE_COL_NO");
        ParamArray attrs_pa = new ParamArray();
        attrs_pa.set("", no);
        StringBuffer attrs = new StringBuffer();
        for (HashMap<String, String> attr_part : this.queryList(attrs_sql, attrs_pa)) {
            attrs.append(attr_part.get("ATTRS").trim());
        }
        json.put("attrs", JSON.parseObject(attrs.toString()));
        result.put("data", json);
        return result;

    }

    @Override
    public Map<String, Object> delSourceServiceById(Map<String, String> param) throws BaseAppException {

        Map<String, Object> result = new HashMap<String, Object>();
        ParamArray pa = new ParamArray();
        pa.set("", param.get("Id"));
        String subSql = "DELETE PM_BSCREEN_SERVICE_COL  WHERE SERVICE_NO=?";
        String parentSql = "DELETE PM_BSCREEN_SERVICE_LIST  WHERE SERVICE_NO=?";
        this.executeUpdate(subSql, pa);
        this.executeUpdate(parentSql, pa);
        result.put("delId", param.get("Id"));
        return result;
    }

    @Override
    public Map<String, Object> getServerSkeleton(Map<String, String> param) throws BaseAppException {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> result = this.getSourceServiceById(param);
        Map<String, Object> json = (Map<String, Object>) result.get("data");
        Map<String, Object> attrs = (Map<String, Object>) json.get("attrs");
        Map<String, Object> skeleton = new HashMap<String, Object>();
        String sql = "" + attrs.get("sql");
        String source = "" + json.get("source");
        Map<String, String> info = getSource(source);
        Map<String, Object> sqlDatas = SQLUtil.getDatas(SQLUtil.getJdbcTemplate(info), sql);
        List<Map<String, Object>> datas = (List<Map<String, Object>>) sqlDatas.get("datas");
        List<Map<String, Object>> x_colModels = (List<Map<String, Object>>) attrs.get("x_colModels");
        List<Map<String, Object>> y_colModels = (List<Map<String, Object>>) attrs.get("y_colModels");

        String serverName = param.get("Id");
        String serverLabel = "" + json.get("name");
        List<Map<String, Object>> xAxis = BScreenUtil.toAxis(x_colModels, datas);
        List<Map<String, Object>> yAxis = BScreenUtil.toAxis(y_colModels, datas);

        skeleton.put("serverName", serverName);
        skeleton.put("serverLabel", serverLabel);
        skeleton.put("xAxis", xAxis);
        skeleton.put("yAxis", yAxis);
        map.put("data", skeleton);

        return map;
    }

  
    @Override
    public List<HashMap<String, String>> getSource() throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String sql = "";
        sql = "select id, name, comments    \n" + "  from tfm_config    \n" + " where lower(module_name) = 'jdbc'    \n"
                + "   and parent_id is null    \n" + " order by name    \n";
        ParamArray params = new ParamArray();
        return queryList(sql, params);

    }

}
