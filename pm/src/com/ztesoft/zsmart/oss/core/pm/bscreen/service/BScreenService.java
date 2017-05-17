package com.ztesoft.zsmart.oss.core.pm.bscreen.service;

import java.lang.reflect.Method;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.core.pm.config.machine.domain.AbstractMachineMgr;
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
	        	throw new BaseAppException(e.getMessage());
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


}