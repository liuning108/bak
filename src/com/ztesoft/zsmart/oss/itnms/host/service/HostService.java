package com.ztesoft.zsmart.oss.itnms.host.service;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;

public interface HostService {

	public  List<Map<String,Object>> getCategoryTree()   throws BaseAppException;

	public List<Map<String,Object>> getGroupidsBySubNo(String id)  throws BaseAppException;

	public void bindCatalogAndGroup(String cId, String sId, String new_gid) throws BaseAppException;

	public void unBindCatalogAndGroup(String cId, String sId, String new_gid) throws BaseAppException;

}
