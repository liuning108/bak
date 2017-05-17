package com.ztesoft.zsmart.oss.core.pm.bscreen.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

public class BScreenMgr extends AbstractBScreenMgr {

	@Override
	public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
		BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class,
	            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
		dao.saveOrUpdate(dict);
	}

	@Override
	public void queryBScreenById(DynamicDict dict) throws BaseAppException {
		BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class,
	            JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
		dao.queryBScreenById(dict);
		
	}

}
