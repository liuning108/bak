package com.ericsson.inms.pm.service.impl.graphs;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.graphs.GraphService;
import com.ericsson.inms.pm.service.impl.graphs.dao.GraphsDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月26日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.service.impl.graphs <br>
 */
@Service("graphServiceImpl")
public class GraphServiceImpl implements GraphService {
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
        return getDAO().getTemplateCatagorys(dict);
    }
    /**
    * 
    * Description: <br> 
    *  
    * @author XXX<br>
    * @taskId <br>
    * @param dict
    * @return <br>
    */
    @Override
    public JSONObject getTemplateById(JSONObject dict)  throws BaseAppException {
        return getDAO().getTemplateById(dict);
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
    public JSONObject getTemplatesByCatagroyId(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().getTemplatesByCatagroyId(dict);
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
    public JSONObject getItemsByTemplateId(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().getItemsByTemplateId(dict);
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
    public JSONObject getGraphsTags(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().getGraphsTags(dict);
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
    public JSONObject saveOrUpdateGraphs(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().saveOrUpdateGraphs(dict);
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
        // TODO Auto-generated method stub
        return getDAO().getGraphsByUserID(dict);
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
    public JSONObject delGraphs(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return  getDAO().delGraphs(dict);
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
    public JSONObject getGraphsById(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().getGraphsById(dict);
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
    public JSONObject getItemsByTId(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return  getDAO().getItemsByTId(dict);
    }
    
    
    @Override
	public JSONObject getTimeConfig(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub    	
		return getDAO().getTimeConfig(dict);
	}
    
    
    @Override
	public JSONObject loadKpiData(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		return getDAO().loadKpiData(dict);
	}
    
    
    @Override
	public JSONObject saveOrUpdateDash(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		return getDAO().saveOrUpdateDash(dict);
	}
    
    @Override
	public JSONObject getDash(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
    	   return getDAO().getDash(dict);
	}
    
    
   

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    private GraphsDAO getDAO() {
	    	try {
	        GraphsDAO dao = (GraphsDAO) GeneralDAOFactory.create(GraphsDAO.class, JdbcUtil.OSS_PM);
	        return dao;
	    	}catch(Exception e) {
	    		e.printStackTrace();
	    		return null;
	    	}
    }
	
	
	
	
   
    
    

   
   
    
   

}
