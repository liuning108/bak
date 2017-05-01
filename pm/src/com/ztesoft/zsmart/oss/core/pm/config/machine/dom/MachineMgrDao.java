package com.ztesoft.zsmart.oss.core.pm.config.machine.dom;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;
/** 
 * [描述] <br> 
 *  
 * @author liuning <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.dom <br>
 */
public abstract class MachineMgrDao  extends GeneralDAO<Object>{
	 /**
     * [查出所有的采集机] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void qryCollectMachines(DynamicDict dict) throws BaseAppException;
    
    /**
     * [查出所有的采集机] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void saveOrUpdate(DynamicDict dict) throws BaseAppException;
    
    
    /**
     * [采集机是否已存在] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract boolean isExistCollectMachines(DynamicDict dict) throws BaseAppException;
    
    /**
     * [采集机保存] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract String saveCollectMachine(DynamicDict dict) throws BaseAppException;
    
    
    /**
     * [更新采集机] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract boolean updateCollectMachine(DynamicDict dict) throws BaseAppException;
    
    
    /**
     * [删除采集机] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void deleteCollectMachine(DynamicDict dict)  throws BaseAppException;
   
    
    /**
     * [删除采集机下的所有任务] <br> 
     *  
     * @author liuning <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public abstract void deleteAllCollectMachineTasks(DynamicDict dict)  throws BaseAppException;
   
    /**
    * [查出没有分配的任务] <br> 
    *  
    * @author liuning <br>
    * @taskId <br>
    * @param dict 
    * @throws BaseAppException <br>
    */ 
	public abstract void queryUndistbutedTask(DynamicDict dict) throws BaseAppException;
    
	/**
	    * [查出没有分配的任务] <br> 
	    *  
	    * @author liuning <br>
	    * @taskId <br>
	    * @param dict 
	    * @throws BaseAppException <br>
	    */ 
	public abstract void queryCollectMachineTasks(DynamicDict dict) throws BaseAppException;
	
	/**
	    * [是否存在处理机，不包含自己] <br> 
	    *  
	    * @author liuning <br>
	    * @taskId <br>
	    * @param dict 
	    * @throws BaseAppException <br>
	    */ 
	public abstract boolean isExistDisposeMachine(DynamicDict dict) throws BaseAppException;
	/**
	    * [是否包含用户名和IP相同的] <br> 
	    *  
	    * @author liuning <br>
	    * @taskId <br>
	    * @param dict 
	    * @throws BaseAppException <br>
	    */ 
	public abstract boolean isExistUserAndMachineIP(DynamicDict dict) throws BaseAppException;

	
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
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int update(Object arg0) throws BaseAppException {
		// TODO Auto-generated method stub
		return 0;
	}

	

	



	

	

	

}
