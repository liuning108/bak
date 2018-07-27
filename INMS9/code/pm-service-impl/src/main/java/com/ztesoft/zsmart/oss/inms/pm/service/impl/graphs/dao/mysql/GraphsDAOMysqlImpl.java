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
        String sql = "select para_value value ,para_name name from pm_paravalue  where para_id='TEMPLATE_CATAGORY' order by para_order asc";
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
        String sql = "select template_id id, template_name name,catagory  from pm_templates  where template_id=?";
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
        String sql = "select template_id id, template_name name,catagory  from pm_templates  where catagory=?";
        String id = dict.getString("id");
        result.put("result", this.queryForMapList(sql, id));
        return result;
    }

}
