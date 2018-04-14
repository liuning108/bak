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

	@Override
	public void bindCatalogAndGroup(String sId, String new_gid) {
		// TODO Auto-generated method stub
		String id = this.geCatalogId(sId);
		String sql ="insert into KDO_GROUPS_RELA (CATEGORY_NO,SUBTYPES_NO,GROUPID) values (?,?,?)";
		int count =this.update(sql, new Object[] {id,sId,new_gid});
		System.out.println(count);
	
	}
	@Override
	public String geCatalogId(String sId) {
			String sql = "select  CATEGORY_NO id from KDO_SUBTYPES    where SUBTYPES_NO = ? ";
			List<Map<String,Object>> list =this.queryForList(sql,sId);
			if(list.size()>0) {
				return (String)list.get(0).get("id");
			}
		return null;
	}

	@Override
	public void unBindCatalogAndGroup(String sId, String new_gid) {
		// TODO Auto-generated method stub
		String sql ="delete  FROM  KDO_GROUPS_RELA  where SUBTYPES_NO= ?  and GROUPID= ? ";
		int count =this.delete(sql,new Object[] {sId,new_gid});
	}
		
	
    
}
