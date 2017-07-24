package com.ztesoft.zsmart.oss.core.pm.bscreen.service;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

public class BScreenService implements IAction {

	@Override
	public int perform(DynamicDict dict) throws BaseAppException {
		   SessionManage.putSession(dict);
		   
	        String methodName = dict.getString("method");
	        try {
				Method method =this.getClass().getMethod(methodName, DynamicDict.class);
				method.invoke(this, dict);
	        } catch (Exception e) {
	        	e.printStackTrace();
	        	new BaseAppException(e.getMessage());
	        }
	        return 0;
	}
	
	
	 public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
		 bsm.saveOrUpdate(dict);
	 }
	
	 public void queryBScreenById(DynamicDict dict)  throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
		 bsm.queryBScreenById(dict);
	 }
	 
	 public void queryBScreenListByUserID(DynamicDict dict)  throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
		 Long userId =dict.getLong("userId");
		 List<Map<String,Object>>  topiclist = bsm.queryBScreenListByUserID(userId);
		 dict.add("topiclist", topiclist);
	
	 }
	 
	 
	 public void deleteBScreenById(DynamicDict dict)  throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
		 String id =dict.getString("topicId");
		 boolean b=bsm.deleteBScreenById(id);
		 dict.add("deleteTopic", b);
	
	 }
	 
	 public void saveOrUpdateSourceService(DynamicDict dict) throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
		  DynamicDict json =dict.getBO("json");
		  Map<String,String> map =new HashMap<String, String>();
		     map.put("no",json.getString("no"));
			 map.put("name", json.getString("name"));
			 map.put("type", json.getString("type"));
			 map.put("source", json.getString("source"));
			 map.put("userId", json.getString("userId"));
		  String  attrs =JSON.toJSONString(BScreenUtil.Dic2Map2((DynamicDict)json.get("attrs")));
		  map.put("attrs", attrs);
		  dict.add("saveUpdateSourceService", bsm.saveOrUpdateSourceService(map));
	 }
	 
	 public void getFields(DynamicDict dict) throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
         Map<String,String > param = new HashMap<String, String>();
         param.put("source", dict.getString("source"));
    	 param.put("sql", dict.getString("sql"));
    	 dict.add("fields", bsm.getFields(param));
    	  
	 }
	 
	 
	 public void getSourceServiceList(DynamicDict dict) throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
         Map<String,String > param = new HashMap<String, String>();
    	 param.put("userId", dict.getString("userId"));
    	 dict.add("serviceList", bsm.getSourceServiceList(param));
    	  
	 }
	 
	 public void getSourceServiceById(DynamicDict dict) throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
         Map<String,String > param = new HashMap<String, String>();
    	 param.put("Id", dict.getString("Id"));
    	 dict.add("sourceService", bsm.getSourceServiceById(param));
    	  
	 }
	 
	 public void delSourceServiceById(DynamicDict dict) throws BaseAppException{
		 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
         Map<String,String > param = new HashMap<String, String>();
    	 param.put("Id", dict.getString("Id"));
    	 dict.add("delSourceService", bsm.delSourceServiceById(param));
	 }
	 
	 
	 
	 
	 
	 


}
