package com.ztesoft.zsmart.oss.kdo.itnms.host.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.kdo.itnms.host.service.HostApiService;
import com.ztesoft.zsmart.oss.kdo.itnms.host.service.HostService;

import com.ztesoft.zsmart.pot.annotation.PublicServ;

@RestController
@RequestMapping("host")
public class HostController {
   @Autowired
	HostService hostService;
   @Autowired
    HostApiService hostApiService;
   
  	@RequestMapping(value = "getCategoryTree", method = RequestMethod.GET)
	@PublicServ
	public List<Map<String, Object>>getCategoryTree() throws BaseAppException {
		return hostService.getCategoryTree();
	}
	
	@RequestMapping(value = "getAllHostsByGroupids", method = RequestMethod.POST)
	@PublicServ
	public JSONObject getAllHostsByGroupids(@RequestBody Map<String,Object> param) throws BaseAppException {
		List<String> ids =(List<String>)param.get("ids");
		Map<String,Object> search=(Map<String,Object>)param.get("search");
		String name=(String)search.get("name");
		String ip=(String)search.get("ip");
		String dns=(String)search.get("dns");
		String port=(String)search.get("port");
		
		return hostApiService.getAllHostsByGroupids(ids.toArray(new String[ids.size()]),name,ip,dns,port);
	}
	
	
	@RequestMapping(value = "getAllGroup", method = RequestMethod.GET)
	@PublicServ
	public JSONObject getAllGroup() throws BaseAppException {
		return hostApiService.getAllGroup();
	}
	
	
	@RequestMapping(value = "getGroupidsBySubNo", method = RequestMethod.GET)
	@PublicServ
	public List<Map<String,Object>> getGroupidsBySubNo(String id) throws BaseAppException {
		return  hostService.getGroupidsBySubNo(id);
	}
	
	@RequestMapping(value = "getAllProxy", method = RequestMethod.GET)
	@PublicServ
	public JSONObject getAllProxy() throws BaseAppException {
		return  hostApiService.getAllProxy();
	}
	
	@RequestMapping(value = "saveOrUpHost", method = RequestMethod.POST)
	@PublicServ
   public JSONObject  saveOrUpHost(@RequestBody Map<String,Object> param)  throws BaseAppException  {
		String catalogId=(String)param.get("sId");
		String group_name=(String)param.get("newg_name");
		boolean isNewGroup = ("none".equalsIgnoreCase(catalogId))?false:true;
	    String new_gid=null;
		  if(isNewGroup) {
			 JSONObject  new_group=hostApiService.addHostGroup(group_name);
			  new_gid = new_group.getString("newGid");
			    if(hostApiService.isError(new_group)) {
			    	 return new_group;
			    }
			    hostService.bindCatalogAndGroup(catalogId, new_gid);
		  }
	    	JSONObject host=hostApiService.saveOrUpHost(param);	
	    	if( hostApiService.isError(host) ) {
			    if(isNewGroup) {
			    	  //rollback
			    	hostService.unBindCatalogAndGroup(catalogId, new_gid);
			    }
	    }
	   return  host;
	}

	@RequestMapping(value = "deleteHost", method = RequestMethod.POST)
	@PublicServ
	public JSONObject deleteHost(@RequestBody Map<String,Object> param) throws BaseAppException {
		return hostApiService.deleteHost(param);
  
	}
	
	@RequestMapping(value = "getHostByid", method = RequestMethod.POST)
	@PublicServ
	public JSONObject getHostByid(@RequestBody Map<String,Object> param) throws BaseAppException {
		String id = (String)param.get("id");
		return hostApiService.getHostByid(id);
  	}
	
	@RequestMapping(value = "changeHostStatus", method = RequestMethod.POST)
	@PublicServ
	public JSONObject changeHostStatus(@RequestBody Map<String,Object> param) throws BaseAppException {
		
		
		return hostApiService.changeHostStatus(param);
  	}
	
	
	@RequestMapping(value = "test", method = RequestMethod.GET)
	@PublicServ
	public void test() throws BaseAppException {
		
	
		hostService.unBindCatalogAndGroup("A02_01", "11");
	
  	}
	
	
	
	
	
	
	
	
	
 	
	
}
