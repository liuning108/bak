package com.ztesoft.zsmart.oss.core.pm.bscreen.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

public abstract class BScreenMgrDao  extends GeneralDAO<Object>{
    public abstract void saveOrUpdate(DynamicDict dict) throws BaseAppException;
    public abstract boolean isExistTopic(String topic_no)  throws BaseAppException;
    public  abstract void queryBScreenById(DynamicDict dict) throws BaseAppException;
    public  abstract List<Map<String, Object>> queryBScreenListByUserID(Long userId)throws BaseAppException;
    public abstract boolean deleteBScreenById(String id) throws BaseAppException;
    public abstract List<String> getFields(HashMap<String, String> param) throws BaseAppException;
	@Override
	public int delete(Object arg0) throws BaseAppException {
		// TODO Auto-generated method stub
		return 0;
	}



	@Override
	public int deleteById(String arg0) throws BaseAppException {
		// TODO Auto-generated method stub
		return 0;
	}



	@Override
	public void insert(Object arg0) throws BaseAppException {
		// TODO Auto-generated method stub
		
	}



	@Override
	public HashMap<String, String> selectById(String arg0) throws BaseAppException {
  		return null;
	}



	@Override
	public int update(Object arg0) throws BaseAppException {
		// TODO Auto-generated method stub
		return 0;
	}
	
	
	
}
