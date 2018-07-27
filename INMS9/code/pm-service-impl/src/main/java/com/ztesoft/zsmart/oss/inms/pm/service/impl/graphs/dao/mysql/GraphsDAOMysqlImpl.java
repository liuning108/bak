package com.ztesoft.zsmart.oss.inms.pm.service.impl.graphs.dao.mysql;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.inms.pm.service.impl.graphs.dao.GraphsDAO;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月26日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.service.impl.graphs.dao.mysql <br>
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
        String sql = ""
            + "select graphclass NAME ,count(1) CNT "
            + "from pm_graphy_list "
            + "where graphclass is not null  and graphclass <>'' "
            + "group by graphclass "
            + "order by CNT desc "
            + "LIMIT ?";
        String num = dict.getString("num");
        result.put("result", this.queryForMapList(sql, num));
        return result;
    }

}
