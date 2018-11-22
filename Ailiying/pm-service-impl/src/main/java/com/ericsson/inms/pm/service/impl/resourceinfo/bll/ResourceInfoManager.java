package com.ericsson.inms.pm.service.impl.resourceinfo.bll;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.resourceinfo.dao.ResourceInfoDAO;
import com.ericsson.inms.pm.service.impl.resourceinfo.dao.mysql.ResourceInfoDAOMysqlImpl;
import com.ericsson.inms.pm.taskalarm.agg.redis.JedisClusterPipeline;
import com.ericsson.inms.pm.taskalarm.agg.redis.RedisUtil;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.dim.bll <br>
 */
@Component
public class ResourceInfoManager {

	/**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param params
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getResourceInfo(JSONObject dict) throws BaseAppException {
    	return this.getDAO().getResourceInfo(dict);
    }
	
    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @return <br>
     */
    private ResourceInfoDAO getDAO() {
    	ResourceInfoDAO dao = (ResourceInfoDAO) GeneralDAOFactory.create(ResourceInfoDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }
    public static void main(String[] args) {
		
	}
}
