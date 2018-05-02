package com.ztesoft.zsmart.oss.core.pm.config.machine.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.config.machine.dao.MachineMgrDao;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.domain <br>
 */
public class MachineMgr extends AbstractMachineMgr {

    @Override
    public void qryCollectMachines(DynamicDict dict) throws BaseAppException {
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.qryCollectMachines(dict);
    }

    @Override
    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.saveOrUpdate(dict);

    }

    @Override
    public void deleteCollectMachine(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.deleteCollectMachine(dict);

    }

    @Override
    public void queryUndistbutedTask(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.queryUndistbutedTask(dict);
    }

    @Override
    public void queryCollectMachineTasks(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dao.queryCollectMachineTasks(dict);
    }

    @Override
    public void isExistDisposeMachine(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dict.set("isExistDisposeMechine", dao.isExistDisposeMachine(dict));
    }

    @Override
    public void isExistUserAndMachineIP(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        MachineMgrDao dao = (MachineMgrDao) GeneralDAOFactory.create(MachineMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        dict.set("isExistDisposeMechine", dao.isExistUserAndMachineIP(dict));

    }

}
