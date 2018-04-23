package com.ztesoft.zsmart.oss.itnms.host.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.host.service.HostApiService;
import com.ztesoft.zsmart.oss.itnms.host.service.HostService;
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
		
		return hostApiService.getAllHostsByGroupids(ids,name,ip,dns,port);
	}
	
	@RequestMapping(value = "getAllGroup", method = RequestMethod.GET)
	@PublicServ
	public JSONObject getAllGroup() throws BaseAppException {
		return hostApiService.getAllGroup(null);
	}
	
	@RequestMapping(value = "getGroupidsBySubNo", method = RequestMethod.POST)
	@PublicServ
	public JSONObject getGroupidsBySubNo(@RequestBody Map<String,Object> param) throws BaseAppException {
	    String id = (String)param.get("id");
	    if(id==null) return getAllGroup();
	    	List<Map<String,Object>> result = hostService.getGroupidsBySubNo(id);
		List<String>ids =  result.stream().map(d->""+d.get("GROUPID")).collect(Collectors.toList());
		JSONObject jsonResult =hostApiService.getAllGroup(ids);
		return jsonResult;
	   
	}
	
	@RequestMapping(value = "getAllProxy", method = RequestMethod.GET)
	@PublicServ
	public JSONObject getAllProxy() throws BaseAppException {
		return  hostApiService.getAllProxy();	
	}
	
	@RequestMapping(value = "saveOrUpHost", method = RequestMethod.POST)
	@PublicServ
   public JSONObject  saveOrUpHost(@RequestBody Map<String,Object> param)  throws BaseAppException  {
		String cId=(String)param.get("cId");
		String sId=(String)param.get("sId");		
		String group_name=(String)param.get("newg_name");
		boolean isNewGroup = ("none".equalsIgnoreCase(sId))?false:true;
	    String new_gid=null;
		  if(isNewGroup) {
			 JSONObject  new_group=hostApiService.addHostGroup(group_name);
			  new_gid = new_group.getString("newGid");
			    if(hostApiService.isError(new_group)) {
			    	 return new_group;
			    }
			    hostService.bindCatalogAndGroup(cId,sId, new_gid);
		  }
	    	JSONObject host=hostApiService.saveOrUpHost(param,new_gid);	
	    	if( hostApiService.isError(host) ) {
			    if(isNewGroup) {
			    	  //rollback
			    	hostApiService.removeHostGroup(new_gid);
			    	hostService.unBindCatalogAndGroup(cId,sId, new_gid);
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
	
	@RequestMapping(value = "getTemplateByGroupId", method = RequestMethod.POST)
	@PublicServ
	public JSONObject getTemplateByGroupId(@RequestBody Map<String,Object> param) throws BaseAppException {
		String groupId=(String)param.get("groupId");
		return hostApiService.getTemplateByGroupId(groupId);
  	}
	
	
	
	@RequestMapping(value = "test", method = RequestMethod.GET)
	@PublicServ
	public void test() throws BaseAppException {
  	}
	
	
	
	
	
	
	
	
	
 	
	
}
