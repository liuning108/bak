package com.ztesoft.zsmart.oss.kdo.itnms.host.dao.mysql;


import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.kdo.itnms.host.dao.HostDao;

public class HostDaoMysqlImpl extends HostDao {

	@Override
	public List<Map<String, Object>> getCategoryTree() {
		String sql = ""
				+ "select  c.CATEGORY_NO id ,c.CATEGORY_NAME name ,'R' pid from KDO_CATEGORY c "
				+ "union "
				+ "select s.SUBTYPES_NO id ,s.SUBTYPES_NAME name ,c.CATEGORY_NO pid from KDO_CATEGORY c, KDO_SUBTYPES s "
				+ "where c.CATEGORY_NO  = s.CATEGORY_NO";
		return 	this.queryForList(sql);
	}

	@Override
	public List<Map<String,Object>> getGroupidsBySubNo(String id) {
		// TODO Auto-generated method stub
		String sql = ""
				+ "select  groupid  from KDO_GROUPS_RELA "
				+ "where subTypes_No = ? ";
		return this.queryForList(sql, id);
	}
    
}
