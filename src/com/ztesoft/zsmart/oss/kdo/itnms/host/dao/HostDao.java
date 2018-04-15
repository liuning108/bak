package com.ztesoft.zsmart.oss.kdo.itnms.host.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAO;

public abstract class HostDao extends GeneralDAO<Map<String, String>> {
	public abstract List<Map<String, Object>> getCategoryTree();

	public abstract  List<Map<String,Object>> getGroupidsBySubNo(String id);

	public abstract  void  bindCatalogAndGroup(String cId,String sId, String new_gid);
	public abstract String geCatalogId(String sId);

	public abstract void unBindCatalogAndGroup(String cId,String sId, String new_gid) ;
}
