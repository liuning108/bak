package com.ztesoft.zsmart.oss.core.pm.bscreen.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

public abstract class AbstractBScreenMgr {
	
	public abstract void saveOrUpdate(DynamicDict dict)  throws BaseAppException;

	public abstract void queryBScreenById(DynamicDict dict) throws BaseAppException;

}
