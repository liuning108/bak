package com.ericsson.inms.pm.service.impl.resourceinfo.dao.mysql;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.service.impl.resourceinfo.dao.ResourceInfoDAO;
import com.ericsson.inms.pm.taskalarm.agg.config.AlarmAggConf;
import com.ericsson.inms.pm.taskalarm.agg.redis.JedisClusterPipeline;
import com.ericsson.inms.pm.taskalarm.agg.redis.RedisUtil;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.spring.SpringContext;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.parammgr.dao.mysql <br>
 */
public class ResourceInfoDAOMysqlImpl extends ResourceInfoDAO {
	
	/**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
	@Override
    public JSONObject getResourceInfo(JSONObject dict) throws BaseAppException {
    	JSONObject json=new JSONObject();
    	AlarmAggConf conf=SpringContext.getBean(AlarmAggConf.class);
    	RedisUtil util = RedisUtil.getInstance(conf.getRedisAddress());
        JedisClusterPipeline pip = util.getPipeline();
        pip.get("PORTAL:AUTH:"+dict.getString("userId"));
        Map<String,Object> dataMap=new HashMap<String,Object>();
        List<Object> list = pip.syncAndReturnAll();
        List<String> vendorList=new ArrayList<String>();
        List<Map<String,Object>> objectList=new ArrayList<Map<String,Object>>();
        List<Map<String,Object>> proviceData=new ArrayList<Map<String,Object>>();
        List<Map<String,Object>> cityData=new ArrayList<Map<String,Object>>();
        List<String> vimIdList=new ArrayList<String>();
        for (Object obj : list) {
        	String data= (String) obj;
        	JSONObject jasonObject = JSONObject.parseObject(data);
			Map<String,Object> map=jasonObject.getInnerMap();
			if(!(map.get("vendor") instanceof String)) {
				for(String str : (List<String>) map.get("vendor")) {
					vendorList.add(str);
				}
			}
			if(!(map.get("vim") instanceof String)) {
				List<Map<String, Object>> vimList=(List<Map<String, Object>>) map.get("vim");
				for(Map<String, Object> vimMap : vimList) {
					vimIdList.add((String) vimMap.get("vim_id"));
				}
			}
			if(map.containsKey("project")) {
				List<Map<String, Object>> projectList=(List<Map<String, Object>>) map.get("project");
				for(Map<String, Object> projectMap : projectList) {				
					objectList.add(projectMap);
				}
			}
			dataMap.put("vnf_type", map.get("vnf_type"));
						
        }
        pip.close();
        if(!objectList.isEmpty()) {
        	List<String> proviceList=new ArrayList<String>();
            List<String> cityList=new ArrayList<String>();
            List<String> parentList=new ArrayList<String>();
        	for(Map<String,Object> objectMap : objectList) {
        		if(objectMap.get("region").equals("2"))proviceList.add((String) objectMap.get("project_id"));      		
        		if(objectMap.get("region").equals("3"))cityList.add((String) objectMap.get("project_id"));        	
        	}        
        	for(String proviceId : proviceList) {
        		for(Map<String,Object> objectMap : objectList) {
        			if(!objectMap.get("parent_id").equals(proviceId)&&objectMap.get("region").equals("3")) {
        				parentList.add(proviceId);
        			}
        		}
        	}
            proviceData=getRegoinInfo(proviceList);
            cityData=getRegoinInfo(cityList);
            List<Map<String, Object>> parentData=getCityList(parentList);
            cityData.addAll(parentData);
        }
        List<Map<String, Object>> vimData=getVimInfo(vimIdList);
        List<Map<String, Object>> vendorData=getVendorInfo(vendorList);
        dataMap.put("province", proviceData);
        dataMap.put("city", cityData);
        dataMap.put("vim", vimData);
        dataMap.put("pim", vimData);
        dataMap.put("vendor", vendorData);
        json.putAll(dataMap);
        return json;
    }
    
	public List<Map<String, Object>> getRegoinInfo(List<String> paramList){
		if(paramList.isEmpty())return null;
		String sql="select code id,name name from cm_region where object_id in("+splitList(paramList)+")";
		return queryForMapList(sql, new Object[] {});
	}
	
	public List<Map<String, Object>> getVendorInfo(List<String> paramList){
		String sql="select vendor_code id,vendor_name name from cm_vendor ";
		if(!paramList.isEmpty())sql+="where vendor_code in("+splitList(paramList)+")";
		return queryForMapList(sql, new Object[] {});
	}
	
	public List<Map<String, Object>> getVimInfo(List<String> paramList){
		String sql="select vid id,name name from nfvo_vim_query_info ";
		if(!paramList.isEmpty())sql+="where vid in("+splitList(paramList)+")";
		return queryForMapList(sql, new Object[] {});
	}
	
	public List<Map<String, Object>> getRegoinList(){
		String regoinSql="select object_id,code,name from CM_REGION where region_level='Province' ";
		List<Map<String, Object>> proviceList=queryForMapList(regoinSql, new Object[] {});		
		return proviceList;
	}
	
	public List<Map<String, Object>> getCityList(List<String> paramList){
		if(paramList.isEmpty())return null;
		String citySql="select code id,name name from cm_region where parent_id in("+splitList(paramList)+")";	
		return queryForMapList(citySql, new Object[] {});
	}
	
	public String splitList(List<String> paramList) {
		String param="";
		for(String str : paramList) {
			param+="'"+str+"',";
		}
		return param.substring(0,param.length()-1);
	}
	
}