package com.ztesoft.zsmart.oss.core.pm.config.machine.dao.mysql;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.config.machine.dao.MachineMgrDao;
import com.ztesoft.zsmart.oss.core.pm.config.machine.util.MachineMgrUtil;

/**
 * [描述] <br>
 * 
 * @author liuning <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.dao.oracle <br>
 */
public class MachineMgrDaoMysqlImpl extends MachineMgrDao {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public void qryCollectMachines(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String sql = "SELECT MACHINE_NO, SEQ, MACHINE_NAME, MACHINE_USER, MACHINE_IP, "
                + "STATE, NOTES,REMAIN FROM PM_COLLECT_MACHINE ORDER BY REMAIN DESC";
        List<HashMap<String, String>> topicList = this.queryList(sql, pa);
        dict.set("collectMachineList", topicList);
    }

    @Override
    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        ArrayList<DynamicDict> list = (ArrayList<DynamicDict>) dict.getList("data");
        DynamicDict collectMechineDic = list.get(0);
        List<String> task_nos = new ArrayList<String>();
        for (Object data : dict.getList("taskData")) {
            task_nos.add("" + data);
        }

        boolean isExistUserAndIP = this.isExistUserAndMachineIP(collectMechineDic);
        dict.set("result_userip", isExistUserAndIP);
        if (isExistUserAndIP) {
            return;
        }
        DynamicDict disDict = new DynamicDict();
        disDict.set("data", collectMechineDic.getString("MACHINE_NO"));
        Long remain = collectMechineDic.getLong("REMAIN");
        dict.set("result_dis", false);
        // 需要修改成默处理采集机
        if (remain > 0) {
            // 存在已默认的处理机，不能保存
            boolean isDisMachine = this.isExistDisposeMachine(disDict);
            dict.set("result_dis", isDisMachine);
            if (isDisMachine) {
                return;
            }
        }

        boolean flag = this.isExistCollectMachines(collectMechineDic);
        dict.set("state", flag);
        if (flag) {
            boolean updateFlag = this.updateCollectMachine(collectMechineDic);
            dict.set("result", updateFlag);
            this.saveOrUpdateCollectMachineTask(collectMechineDic, task_nos);
        }
        else {
            String no = this.saveCollectMachine(collectMechineDic);
            collectMechineDic.set("MACHINE_NO", no);
            this.saveOrUpdateCollectMachineTask(collectMechineDic, task_nos);
            dict.set("result", no);
        }

    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param collectMechineDic 
     * @param task_nos 
     * @throws BaseAppException
     *             <br>
     */
    public void saveOrUpdateCollectMachineTask(DynamicDict collectMechineDic, List<String> task_nos) throws BaseAppException {
        // 删除原来的
        ParamArray pa = new ParamArray();
        String no = collectMechineDic.getString("MACHINE_NO");
        String sql = "DELETE FROM PM_COLLECT_MACHINE_TASK  WHERE MACHINE_NO=?";
        pa.set("", no);
        this.executeUpdate(sql, pa);
        // 添加最新的
        String addSql = "INSERT INTO PM_COLLECT_MACHINE_TASK " + "  (MACHINE_NO, SEQ, COLLECT_TASKNO) " + "VALUES " + "  (?, 0, ?) ";
        for (String tasno : task_nos) {
            ParamArray pa2 = new ParamArray();
            pa2.set("", no);
            pa2.set("", tasno);
            this.executeUpdate(addSql, pa2);
        }
    }

    @Override
    public boolean isExistCollectMachines(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String no = dict.getString("MACHINE_NO");
        String sql = "SELECT COUNT(*) FROM PM_COLLECT_MACHINE CM WHERE CM.MACHINE_NO=?";
        pa.set("", no);
        return this.queryInt(sql, pa) > 0;
    }

    @Override
    public String saveCollectMachine(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String no = MachineMgrUtil.getMachineSeq();
        String sql = "INSERT INTO PM_COLLECT_MACHINE " + "  (MACHINE_NO, SEQ, MACHINE_NAME, MACHINE_USER, MACHINE_IP, STATE, NOTES,REMAIN) "
                + "VALUES " + "  (?,0, ?, ?, ?, 1,?,?)";
        pa.set("", no);
        pa.set("", dict.getString("MACHINE_NAME"));
        pa.set("", dict.getString("MACHINE_USER"));
        pa.set("", dict.getString("MACHINE_IP"));
        pa.set("", dict.getString("NOTES"));
        pa.set("", dict.getString("REMAIN"));
        if (this.executeUpdate(sql, pa) > 0) {
            return no;
        }
        else {
            return "";
        }

    }

    @Override
    public boolean updateCollectMachine(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String sql = "UPDATE PM_COLLECT_MACHINE" + "   SET MACHINE_NAME = ?," + "       MACHINE_USER = ?," + "       MACHINE_IP = ?,"
                + "       NOTES = ?," + "       REMAIN = ?" + " WHERE MACHINE_NO =?";
        pa.set("", dict.getString("MACHINE_NAME"));
        pa.set("", dict.getString("MACHINE_USER"));
        pa.set("", dict.getString("MACHINE_IP"));
        pa.set("", dict.getString("NOTES"));
        pa.set("", dict.getString("REMAIN"));
        pa.set("", dict.getString("MACHINE_NO"));
        return this.executeUpdate(sql, pa) > 0;
    }

    @Override
    public void deleteCollectMachine(DynamicDict dict) throws BaseAppException {
        // 删除对应任务表
        this.deleteAllCollectMachineTasks(dict);
        // 删除采集机
        ParamArray pa = new ParamArray();
        String no = dict.getString("data");
        String sql = "DELETE FROM PM_COLLECT_MACHINE  WHERE MACHINE_NO=?";
        pa.set("", no);
        this.executeUpdate(sql, pa);
    }

    @Override
    public void deleteAllCollectMachineTasks(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String no = dict.getString("data");
        String sql = "DELETE FROM PM_COLLECT_MACHINE_TASK  WHERE MACHINE_NO=?";
        pa.set("", no);
        this.executeUpdate(sql, pa);

    }

    @Override
    public void queryUndistbutedTask(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        ParamArray pa = new ParamArray();
        String sql = "SELECT INFO.TASK_NO,INFO.TASK_NAME FROM PM_TASK_INFO INFO "
                + "WHERE INFO.task_type = '00' and  NOT EXISTS( SELECT 'X' FROM PM_COLLECT_MACHINE_TASK CT WHERE CT.COLLECT_TASKNO=INFO.TASK_NO)";
        dict.set("undistbutedTaskList", this.queryList(sql, pa));
    }

    @Override
    public void queryCollectMachineTasks(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String machineNo = dict.getString("data");
        String sql = "SELECT INFO.TASK_NO,INFO.TASK_NAME FROM PM_COLLECT_MACHINE_TASK CT ,PM_TASK_INFO INFO "
                + "WHERE CT.COLLECT_TASKNO=INFO.TASK_NO AND CT.MACHINE_NO=?";
        pa.set("", machineNo);
        dict.set("collectMachineTaskList", this.queryList(sql, pa));
    }

    @Override
    public boolean isExistDisposeMachine(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String machineNo = dict.getString("data");
        String sql = "SELECT COUNT(*) FROM PM_COLLECT_MACHINE CM WHERE CM.REMAIN=1 AND CM.MACHINE_NO!=?";
        pa.set("", machineNo);
        return this.queryInt(sql, pa) > 0;
    }

    @Override
    public boolean isExistUserAndMachineIP(DynamicDict dict) throws BaseAppException {
        ParamArray pa = new ParamArray();
        String sql = "SELECT COUNT(*) FROM PM_COLLECT_MACHINE  MC WHERE MC.MACHINE_IP=? AND MC.MACHINE_USER=? AND MC.MACHINE_NO != ?";
        pa.set("", dict.getString("MACHINE_IP"));
        pa.set("", dict.getString("MACHINE_USER"));
        pa.set("", dict.getString("MACHINE_NO"));
        return this.queryInt(sql, pa) > 0;
    }

}
