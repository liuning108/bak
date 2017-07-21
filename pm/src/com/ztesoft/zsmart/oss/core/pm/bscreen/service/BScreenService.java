package com.ztesoft.zsmart.oss.core.pm.bscreen.service;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
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
		 com.ztesoft.zsmart.web.servlet.UploadServlet s=null;
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
	 
	 
	 


}
