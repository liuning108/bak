package com.ztesoft.zsmart.oss.itnms.host.service.impl;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.itnms.host.dao.HostDao;
import com.ztesoft.zsmart.oss.itnms.host.service.HostService;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.framework.jdbc.JdbcUtil;

@Service("HostServiceImpl")
public class HostServiceImpl implements HostService {
	@Override
	public List<Map<String, Object>> getCategoryTree() throws BaseAppException {
		// TODO Auto-generated method stub
		HostDao dao = (HostDao) GeneralDAOFactory.create(HostDao.class, JdbcUtil.OSS_KDO);
         return dao.getCategoryTree();
	}

	@Override
	public List<Map<String,Object>> getGroupidsBySubNo(String id) throws BaseAppException {
		HostDao dao = (HostDao) GeneralDAOFactory.create(HostDao.class, JdbcUtil.OSS_KDO);
        return dao.getGroupidsBySubNo(id);
	}

	@Override
	public void bindCatalogAndGroup(String cId,String sId, String new_gid) throws BaseAppException {
		// TODO Auto-generated method stub
		HostDao dao = (HostDao) GeneralDAOFactory.create(HostDao.class, JdbcUtil.OSS_KDO);
		 dao.bindCatalogAndGroup(cId,sId,new_gid);
	}

	@Override
	public void unBindCatalogAndGroup(String cId,String sId, String new_gid) throws BaseAppException {
		// TODO Auto-generated method stub
		HostDao dao = (HostDao) GeneralDAOFactory.create(HostDao.class, JdbcUtil.OSS_KDO);
		 dao.unBindCatalogAndGroup(cId,sId,new_gid);
	}

}
