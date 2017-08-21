package com.ztesoft.zsmart.oss.core.pm.config.machine.service;

import java.lang.reflect.Method;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.config.machine.domain.AbstractMachineMgr;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.service <br>
 */
public class MachineService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);
        String methodName = dict.getString("method");
        try {
            Method method = this.getClass().getMethod(methodName, DynamicDict.class);
            method.invoke(this, dict);
        }
        catch (Exception e) {
            throw new BaseAppException(e.getMessage());
        }
        return 0;
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void qryCollectMachines(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.qryCollectMachines(dict);
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.saveOrUpdate(dict);
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void deleteCollectMachine(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.deleteCollectMachine(dict);
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void queryUndistbutedTask(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.queryUndistbutedTask(dict);
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void queryCollectMachineTasks(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.queryCollectMachineTasks(dict);
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void isExistDisposeMachine(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.isExistDisposeMachine(dict);
    }

    /**
     * Description: <br>
     * 
     * @author Liuning<br>
     * @param dict
     *            <br>
     * @throws BaseAppException
     *             <br>
     */
    public void isExistUserAndMachineIP(DynamicDict dict) throws BaseAppException {
        AbstractMachineMgr dmo = (AbstractMachineMgr) GeneralDMOFactory.create(AbstractMachineMgr.class);
        dmo.isExistUserAndMachineIP(dict);
    }

}
