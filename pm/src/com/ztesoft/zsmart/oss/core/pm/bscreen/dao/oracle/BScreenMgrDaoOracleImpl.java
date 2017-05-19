package com.ztesoft.zsmart.oss.core.pm.bscreen.dao.oracle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;

import ch.qos.logback.core.net.SyslogOutputStream;

/**
 * [描述] <br>
 * 
 * @author liuning <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.dom.oracle <br>
 */
public class BScreenMgrDaoOracleImpl extends BScreenMgrDao {
	
	/**
	 * logger <br>
	 */
	ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());



	@Override
	public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
		 // TODO 保存更新大屏主题 (doing)
		com.ztesoft.zsmart.web.servlet.UploadServlet s;
		System.out.println("保存更新大屏主题");
		ArrayList<DynamicDict> list=(ArrayList<DynamicDict>) dict.getList("data"); 
		System.out.println(list);  
	
		DynamicDict data= list.get(0);
		System.out.println(data.getString("id"));
		  if (isExistTopic(data.getString("id"))){
			  updateTopic(data);
		  }else{
			  saveTopic(data);
		  }
		  updateTopicNodes(data);//更新所有子	  
	}

	private void updateTopic(DynamicDict data) {
		// TODO 更新大屏主题
		System.out.println("更新大屏主题");
	}


	private void saveTopic(DynamicDict data) throws BaseAppException {
		// TODO 保存大屏主题
		System.out.println("保存大屏主题");
		String sql="insert into pm_bscreen_topic_list " +
						"  (topic_no, topic_name, attrs, image_path, is_share, state, oper_user, oper_date, bp_id, class_no) " + 
						" values " + 
						"  (?, ?, ?, ?, ?, ?, ?, sysdate, null, null)";
		ParamArray pa = new ParamArray();
		String v_topic_no=BScreenUtil.getSeq("PM_BSTOPIC_SEQ");
		String v_topic_name=BScreenUtil.toString(data.get("name"));
		String v_attrs=JSON.toJSONString(BScreenUtil.Dic2Map((DynamicDict)data.get("attrs")));
		String v_image_path=BScreenUtil.toString(data.get("imagePath"));
        String v_is_share=BScreenUtil.toString(data.get("isShare"));
		String v_state=BScreenUtil.toString(data.get("state"));
		String v_oper_user=BScreenUtil.toString(data.get("userid"));
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
	    System.out.println(v_topic_no+":"+v_topic_no);
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

}
