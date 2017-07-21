package com.ztesoft.zsmart.oss.core.pm.bscreen.dao.oracle;

import java.io.File;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import com.alibaba.druid.util.jdbc.ResultSetMetaDataBase.ColumnMetaData;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.jdbc.ds.DbIdentifier;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.SQLUtil;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

import ch.qos.logback.core.net.SyslogOutputStream;


/**
 * [描述] <br>
 * 
 * @author liuning <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.dao.oracle <br>
 */
public class BScreenMgrDaoOracleImpl extends BScreenMgrDao {
	
	/**
	 * logger <br>
	 */
	ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());



	@Override
	public void saveOrUpdate(DynamicDict dict) throws BaseAppException {		
		 // TODO 保存更新大屏主题 (doing)
		com.ztesoft.zsmart.web.filter.LocaleFilter s;
		System.out.println("保存更新大屏主题");
		ArrayList<DynamicDict> list=(ArrayList<DynamicDict>) dict.getList("data"); 
		DynamicDict data= list.get(0);
		String topicId=data.getString("id");
		  if (isExistTopic(topicId)){
			  String imagePath =saveImage(data.getString("base64"),topicId);
			  data.set("imagePath", imagePath);
			  updateTopic(data);
		  }else{
			  String v_topic_no=BScreenUtil.getSeq("PM_BSTOPIC_SEQ");
			  data.set("id", v_topic_no);
			  String imagePath =saveImage(data.getString("base64"),v_topic_no);
			  data.set("imagePath", imagePath);
			  saveTopic(data);
		  }
		 
		  
		
		  updateTopicNodes(data);//更新所有子	  
	}

	private String saveImage(String base64,String topicId) {
		// TODO Auto-generated method stub
		URL path =this.getClass().getResource("/../../"); //得到当前目录真实目录文件
		File dirs=new File(path.getPath()+"/upload/bsimage");
		String filename =BScreenUtil.saveImage(dirs,base64,topicId); //生成topicId.png存放在dirs中。 
		if(filename==null){
			return "";
		}else{
			return "upload/bsimage/"+filename;
		}

	}

	private void updateTopic(DynamicDict data)  throws BaseAppException {
		// TODO 更新大屏主题
		System.out.println("更新大屏主题22");
		String sql=
				"UPDATE PM_BSCREEN_TOPIC_LIST " +
						"   SET TOPIC_NAME = ?, " + 
						"       ATTRS = ?, " + 
						"       IMAGE_PATH = ?, " + 
						"       IS_SHARE = ?, " + 
						"       STATE = ? " + 
						" WHERE TOPIC_NO=? ";

		
		String v_topic_no=data.getString("id");
		String v_topic_name=data.getString("name");
		String v_attrs=JSON.toJSONString(BScreenUtil.Dic2Map((DynamicDict)data.get("attrs")));
		String v_image_path=data.getString("imagePath");
		System.out.println(v_image_path);
        String v_is_share=data.getString("isShare");
		String v_state=data.getString("state");
		//TODO :保存大屏主题,还没使用的的字段
		String v_bp_id="";
		String v_class_no="";
		//设置参数
		ParamArray pa = new ParamArray();
				pa.set("", v_topic_name);
				pa.set("", v_attrs);
				pa.set("", v_image_path);
				pa.set("", v_is_share);
				pa.set("", v_state);
				pa.set("", v_topic_no);
		this.executeUpdate(sql, pa);
	}


	private void saveTopic(DynamicDict data) throws BaseAppException {
		// TODO 保存大屏主题
		System.out.println("保存大屏主题");
		String sql="insert into pm_bscreen_topic_list " +
						"  (topic_no, topic_name, attrs, image_path, is_share, state, oper_user, oper_date, bp_id, class_no) " + 
						" values " + 
						"  (?, ?, ?, ?, ?, ?, ?, sysdate, null, null)";
		ParamArray pa = new ParamArray();
		String v_topic_no=data.getString("id");
		String v_topic_name=BScreenUtil.toString(data.get("name"));
		String v_attrs=JSON.toJSONString(BScreenUtil.Dic2Map((DynamicDict)data.get("attrs")));
		String v_image_path=data.getString("imagePath");
        String v_is_share=BScreenUtil.toString(data.get("isShare"));
		String v_state=BScreenUtil.toString(data.get("state"));
		Long v_oper_user=data.getLong("userid");
		//TODO :保存大屏主题,还没使用的的字段
		String v_bp_id="";
		String v_class_no="";
		//设置参数
		pa.set("", v_topic_no);
		pa.set("", v_topic_name);
		pa.set("", v_attrs);
		pa.set("", v_image_path);
		pa.set("", v_is_share);
		pa.set("", v_state);
		pa.set("", v_oper_user);
		this.executeUpdate(sql, pa);
	    data.set("id", v_topic_no);//更新主键
	}


			
	private void updateTopicNodes(DynamicDict data) throws BaseAppException {
	     
		  String topcNo=BScreenUtil.toString(data.get("id"));
		  //TODO 删除所有子节点
		 System.out.println(data.get("id")+"删除所有子节点");
		 String delsql="delete pm_bscreen_topic_nodes nodes " +
						  " where nodes.topic_no=?";
		 ParamArray del_pa = new ParamArray();
		 del_pa.set("", topcNo);
         this.executeUpdate(delsql,del_pa);
		  //TODO 添加新的所有子节点
		 System.out.println(data.get("id")+"添加新的所有子节点");
		 ArrayList<DynamicDict> nodes=(ArrayList<DynamicDict>) data.getList("nodes");
		 String add_sql ="insert into pm_bscreen_topic_nodes " +
				 "  (topic_no, node_no, attrs, attr_seq) " + 
				 "values " + 
				 "  (?, ?, ?, ?)";
		 for (DynamicDict node:nodes){
			  Map attrsMap=BScreenUtil.Dic2Map((DynamicDict)node.get("attrs"));
			  String attrs =JSON.toJSONString(attrsMap);
			  String v_node_no=BScreenUtil.getSeq("PM_BSTNODES_SEQ");
			  List<String> attrs_parts=BScreenUtil.splitByNumbers(attrs, 1024); //按字符大小分割问题。
			  for (int i=0;i<attrs_parts.size();i++){
				  ParamArray add_pa = new ParamArray();
				  String attr=attrs_parts.get(i);
				  add_pa.set("", topcNo);
				  add_pa.set("", v_node_no);
				  add_pa.set("", attr);
				  add_pa.set("", i);
				  this.executeUpdate(add_sql, add_pa);
			  }
		 }
	     
	}
	@Override
	public boolean isExistTopic(String topic_no) throws BaseAppException {
		// TODO 大屏主题是否存在(done)
		String sql ="select count(*) from PM_BSCREEN_TOPIC_LIST t where t.topic_no=?";
		ParamArray pa = new ParamArray();
		pa.set("", topic_no); 
		int i=this.queryInt(sql,pa);
		System.out.println("大屏主题"+topic_no+"是否存在"+i);
		return this.queryInt(sql,pa)>0?true:false;
	}

	@Override
	public void queryBScreenById(DynamicDict dict) throws BaseAppException {
		// TODO 查询BScreeen
		String topID =BScreenUtil.toString(dict.get("topId"));
		if(!isExistTopic(topID))return;
		HashMap<String,Object> json = new HashMap<String,Object>();
		//获取主题信息
		String topic_sql ="SELECT T.TOPIC_NO as ID ,T.TOPIC_NAME as NAME,T.ATTRS as attrs,T.IMAGE_PATH as IMAGE_PATH,T.IS_SHARE as IS_SHARE,T.STATE as STATE,T.OPER_USER as USER_ID FROM PM_BSCREEN_TOPIC_LIST T WHERE T.TOPIC_NO=?";
        ParamArray topic_pa = new ParamArray();
        topic_pa.set("", topID);
        List<HashMap<String, String>> topicList=this.queryList(topic_sql, topic_pa);
        HashMap<String, String> topic = topicList.get(0);
        json = BScreenUtil.toConvert(topic);
        String att =""+json.get("attrs");
        json.put("attrs", JSON.parseObject(att));
        //json.put("attrs", JSON.parse(BScreenUtil.toString(json.get("attrs"))));
        //获取所有节点信息
		String sql ="select distinct node_no from pm_bscreen_topic_nodes  nodes where nodes.topic_no =? order by node_no";
        ParamArray pa = new ParamArray();
        pa.set("", topID);
        List<HashMap<String, String>> node_parts=this.queryList(sql, pa);
        String attrs_sql="select attrs,attr_seq from pm_bscreen_topic_nodes nodes where nodes.node_no=? order by attr_seq";
        List<JSONObject> nodes= new ArrayList<JSONObject>();
        for(HashMap<String, String> node_no:node_parts){
        	HashMap<String, Object> node= new HashMap<String, Object>();
        	String no=node_no.get("NODE_NO");
        	node.put("id",no);
        	ParamArray attrs_pa = new ParamArray();
        	attrs_pa.set("", no);
        	StringBuffer attrs=new StringBuffer();
        	for(HashMap<String, String>attr_part:this.queryList(attrs_sql, attrs_pa)){
        		
        		attrs.append(attr_part.get("ATTRS").trim());
        	}
        	node.put("attrs",JSON.parseObject(attrs.toString()));
        	String json_nodes=JSON.toJSONString(node);
            nodes.add(JSON.parseObject(json_nodes));
        }
        System.out.println(nodes);
        System.out.println("--------------json---------");
        System.out.println(json);
        json.put("nodes", nodes);
        	dict.add("topicJson", json);
        	 System.out.println("--------------json---------");
	}

	@Override
	public List<Map<String, Object>> queryBScreenListByUserID(Long userId) throws BaseAppException {
		String sql="SELECT  T.TOPIC_NO as ID ,T.TOPIC_NAME as NAME,ATTRS,T.IMAGE_PATH as IMAGE_PATH,T.IS_SHARE ,T.OPER_USER,T.OPER_DATE  FROM PM_BSCREEN_TOPIC_LIST T WHERE T.OPER_USER=? OR IS_SHARE=3 ORDER BY T.OPER_DATE";
		ParamArray pa = new ParamArray();
		pa.set("", userId);
		List<Map<String, Object>> result =BScreenUtil.toConvert(this.queryList(sql, pa));
		for (Map<String, Object> map :result){
			String att =""+map.get("attrs");
			map.put("attrs", JSON.parseObject(att));
		}
		return result;
	}

	@Override
	public boolean deleteBScreenById(String id) throws BaseAppException {
		boolean b = true;
		System.out.println(id);
		try{
			String sql="DELETE PM_BSCREEN_TOPIC_LIST T WHERE T.TOPIC_NO=?";
			ParamArray pa = new ParamArray();
			pa.set("", id);
			this.executeUpdate(sql, pa);
			String deleteNodeSql="DELETE PM_BSCREEN_TOPIC_NODES T WHERE T.TOPIC_NO=?";
			ParamArray pa2 = new ParamArray();
			pa2.set("", id);
			this.executeUpdate(deleteNodeSql, pa2);
		}catch(Exception e){
			e.printStackTrace();
			b=false;
		}
		return b;
	}

	@Override
	public List<String> getFields(HashMap<String, String> param) throws BaseAppException {
		// TODO Auto-generated method stub
		String source= param.get("sourceID");
		String sql = param.get("sql");
		Map<String,String> info = getSource(source);
		JdbcTemplate jdbcTemp=(SQLUtil.getJdbcTemplate(info));
		SqlRowSet sqlRowSet  = jdbcTemp.queryForRowSet(sql);
		SqlRowSetMetaData sqlRsmd = sqlRowSet.getMetaData();  
		int columnCount = sqlRsmd.getColumnCount();
		List<String> fields =new ArrayList<String>();
		for (int i = 1; i <= columnCount; i++) {  
			fields.add(sqlRsmd.getColumnName(i));  
		}  
		
		return fields;
	}

	private Map<String,String> getSource(String sourceID) throws BaseAppException {
		// TODO Auto-generated method stub
		Map<String,String> result =new HashMap<String, String>();
		String sql ="select VALUE,NAME from tfm_config t where t.parent_id=?";
		ParamArray pa = new ParamArray();
		pa.set("", sourceID);
		for(Map<String, String> item : this.queryList(sql, pa)){
			result.put(item.get("NAME"), item.get("VALUE"));
		}
	    	
		return result;
	}

}
