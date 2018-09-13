package com.ericsson.inms.pm.service.impl.graphs.dao.mysql;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.graphs.dao.GraphsDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.util.SeqUtil;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月26日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.service.impl.graphs.dao.mysql <br>
 */
public class GraphsDAOMysqlImpl extends GraphsDAO {

    private static final long serialVersionUID = -7438192704600828281L;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getTemplateCatagorys(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        JSONObject result = new JSONObject();
        String sql = "select para_value VALUE ,para_name NAME from pm_paravalue  where para_id='TEMPLATE_CATAGORY' order by para_order asc";
        result.put("result", this.queryForMapList(sql));
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getTemplateById(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        JSONObject result = new JSONObject();
        
        String sql = "select template_id ID, template_name NAME,catagory CATAGORY from pm_templates  where template_id=?";
        String id = dict.getString("id");
        result.put("result", this.queryForMapList(sql, id));
       
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getTemplatesByCatagroyId(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String sql = "select template_id ID, template_name NAME,catagory  CATAGORY from pm_templates  where catagory=?";
        String id = dict.getString("id");
        result.put("result", this.queryForMapList(sql, id));
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getItemsByTemplateId(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        {}
        String sql = "select item_id as ID ,item_name  as NAME from pm_items where  template_id = ?";
        String id = dict.getString("id");
        result.put("result", this.queryForMapList(sql, id));
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getGraphsTags(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String sql = "" + "select graphclass NAME ,count(1) CNT " + "from pm_graphy_list "
            + "where graphclass is not null  and graphclass <>'' " + "group by graphclass " + "order by CNT desc "
            + "LIMIT ? ";
        Long num = dict.getLong("num");
        result.put("result", this.queryForMapList(sql, new Object[]{num}));
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject saveOrUpdateGraphs(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String gid = dict.getString("gid");
        if ("NONE".equalsIgnoreCase(gid)) {
            gid = insertList(dict);
            dict.put("gid", gid); 
        }
        else {
            updateList(dict);
        }
        updateDetail(dict,gid);
        result.put("result",true);
        result.put("gid",gid);
        return result;
    }

    private void updateDetail(JSONObject dict,String gid) {
        // TODO Auto-generated method stub
        deleteDetail(gid);
        String sql = ""
            + "INSERT INTO  pm_graphy_detail "
            + "( graphid, "
            + "attrseq, "
            + "attr) "
            + "VALUES "
            + "( ?, "
            + "  ?, "
            + " ?);";
       
        String jsonStr = dict.toJSONString();
        List<String> attrs_parts =splitByNumbers(jsonStr,1024);
        for(int i = 0; i < attrs_parts.size(); i++) {
            String attr = attrs_parts.get(i);
            this.insert(sql, new Object[] {gid,i,attr});
        }
    }
    
    private void deleteDetail(String gid) {
        String sql ="delete from pm_graphy_detail where graphid=?";
        this.delete(sql,new Object[] {gid});  
    } 

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param text 
     * @param number 
     * @return <br>
     */
    public static List<String> splitByNumbers(String text, int number) {
        List<String> strings = new ArrayList<String>();
        int index = 0;
        while (index < text.length()) {
            strings.add(text.substring(index, Math.min(index + number, text.length())));
            index += number;
        }
        return strings;
    }
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict <br>
     */
    private void updateList(JSONObject dict) {
        String title = dict.getString("title");
        String gid =dict.getString("gid");
        String graphclass = dict.getString("gclass");
        String gtype = dict.getString("gtype");
        String desc = dict.getString("desc");
        String sql = ""
                + "UPDATE  pm_graphy_list "
                + "SET "
                + "name=?, "
                + "graphclass = ?, "
                + "graphtype =?, "
                + "description = ? "
                + " WHERE graphid = ? ";    
        this.update(sql, new Object[] {
            title, graphclass, gtype, desc,gid
        });
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return <br>
     */
    private String insertList(JSONObject dict) {
        // {"gid":"NONE","gtype":1,"gclass":"test","title":"window
        // 服务器模板","templateId":"T00001","userId":"1","desc":"just test"}
        String gid = SeqUtils.getSeq("Graphs", "PM_G");
        String templateId = dict.getString("templateId");
        String title = dict.getString("title");
        String graphclass = dict.getString("gclass");
        String gtype = dict.getString("gtype");
        String userId = dict.getString("userId");
        String desc = dict.getString("desc");
    
        String sql = "" + "INSERT INTO pm_graphy_list " + "(graphid, " + "template_id, " + "name, " + "graphclass, "
            + "graphtype, " + "user_id, " + "description," + "create_time) " + "VALUES " + "(?, " + " ?, " + "?, "
            + "?, " + "?, " + "?, " + "?," + "SYSDATE())";
        this.insert(sql, new Object[] {
            gid, templateId, title, graphclass, gtype, userId, desc
        });

        return gid;
    }
    /**
     * 
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict
     * @return
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getGraphsByUserID(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String userId =dict.getString("userId");
        String tid = dict.getString("tId");
        String name = dict.getString("name");
        if(name.length()<0) {
	        String sql = ""
	            + "select graphid GID,template_id TID , name NAME, graphclass GCLASS , graphtype GTYPE  ,description DESCR ,create_time CTIME "
	            + "from pm_graphy_list where user_id=?  and template_id=? " + "order by create_time";
	        List<Map<String, String>> datas = this.queryForMapList(sql, new Object[] {userId,tid});
	        result.put("result", datas);
	        return result;
        }else {
          //按名称查询
        	  name = "%"+name+"%";
        	  String sql = ""
     	            + "select graphid GID,template_id TID , name NAME, graphclass GCLASS , graphtype GTYPE  ,description DESCR ,create_time CTIME "
     	            + "from pm_graphy_list where user_id=?  and template_id=? and name like ? " + "order by create_time";
     	        List<Map<String, String>> datas = this.queryForMapList(sql, new Object[] {userId,tid,name});
     	        result.put("result", datas);
     	        return result;
        }
     
        
    }

    @Override
    public JSONObject delGraphs(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String userId =dict.getString("userId");
        String subSql ="delete from pm_graphy_detail where graphid= ? ";
        String sql = ""
            + "delete from pm_graphy_list where graphid= ? and user_id= ?";
        JSONArray array= dict.getJSONArray("ids");
        for(Object id : array) {
          this.delete(subSql,new Object[] {""+id});
          this.delete(sql, new Object[] {""+id,userId});    
        }
        result.put("result",true);
        return result;
    }

    @Override
    public JSONObject getGraphsById(JSONObject dict) throws BaseAppException {
        JSONObject result = new JSONObject();
        String id = dict.getString("id");
        String sql ="select attrseq,attr ATTR from pm_graphy_detail where graphid= ? order by attrseq";
        List<Map<String,String>> partList =this.queryForMapList(sql, new Object[] {id});
        StringBuffer sb = new StringBuffer();
        for (Map<String,String> part : partList) {
             sb.append(part.get("ATTR"));
        }
        JSONObject json =JSONObject.parseObject(sb.toString());
        result.put("result", json);
        return result;
    }

    @Override
    public JSONObject getItemsByTId(JSONObject dict) throws BaseAppException {
        String tid =dict.getString("tid");
        String sql = "select item_id ID , metric_key MKEY, item_name NAME,unit UNIT  from pm_items where template_id= ? ";
        JSONObject result = new JSONObject();
        List<Map<String,String>> datas =this.queryForMapList(sql, new Object[] {tid});
        result .put("result", datas);
        return result;
    }

	@Override
	public JSONObject getTimeConfig(JSONObject dict) throws BaseAppException {
		JSONObject result = new JSONObject();
		String sql = ""
				+ "select para_id ID , para_value VALUE, para_name NAME ,para_name_cn NAME_CN,para_order pOrder from pm_paravalue where  (para_id  ='GRANU' or  para_id like 'TGRANU%' or para_id='GRANU_FORMAT' or para_id='GRANU_FORMAT2') "
				+ "order by para_id,para_order asc";
		 List<Map<String,String>> datas =this.queryForMapList(sql);
		 result .put("result", datas);
		return result;	
	}

	@Override
	public JSONObject loadKpiData(JSONObject dict) throws BaseAppException {
		JSONObject result = new JSONObject();
		String sql = dict.getString("sql");
		try {
		 List<Map<String,String>> datas =this.queryForMapList(sql);
		 result .put("result", datas);
		}catch(Exception e) {
	     result .put("error", e.getMessage());
		}
		return result;	
	}

}
