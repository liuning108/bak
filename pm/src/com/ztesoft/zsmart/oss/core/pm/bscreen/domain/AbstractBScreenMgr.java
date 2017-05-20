package com.ztesoft.zsmart.oss.core.pm.bscreen.domain;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

public abstract class AbstractBScreenMgr {
	
	public abstract void saveOrUpdate(DynamicDict dict)  throws BaseAppException;

	public abstract void queryBScreenById(DynamicDict dict) throws BaseAppException;

	public abstract List<Map<String, Object>> queryBScreenListByUserID(Long userId) throws BaseAppException;

	public abstract boolean deleteBScreenById(String id)throws BaseAppException;

}
