package com.ztesoft.zsmart.oss.kdo.itnms.host.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAO;

public abstract class HostDao extends GeneralDAO<Map<String, String>> {
	public abstract List<Map<String, Object>> getCategoryTree();

	public abstract  List<Map<String,Object>> getGroupidsBySubNo(String id);
}
