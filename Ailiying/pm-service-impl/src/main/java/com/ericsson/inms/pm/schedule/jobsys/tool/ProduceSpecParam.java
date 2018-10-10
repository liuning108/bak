package com.ericsson.inms.pm.schedule.jobsys.tool;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ericsson.inms.pm.schedule.config.ScheduleConstant;
import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDaoUtil;
import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.utils.PublicToolUtil;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月31日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.jobsys.tool <br>
 */
public class ProduceSpecParam {

    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(ProduceSpecParam.class, "PM");

    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    /**
     * [方法描述] 获取有效task_no，生成规格版本参数入库<br> 
     *  
     * @author [作者名]<br>
     * @param mapTaskParamVer
     * @param taskNoList  <br>
     */
    public void produceAllSpecParam(Map<String, TaskParamVer> mapTaskParamVer, List<Map<String, Object>> taskNoList) {
        mapTaskParamVer.clear();
        logger.info(" ==============>> produceAllSpecParam begin taskNoList size:" + taskNoList.size());

        // 记录一组同taskType 的taskNo
        Map<String, List<String>> mapTypeTaskNo = new HashMap<String, List<String>>();

        for (Map<String, Object> taskNoInfo : taskNoList) {
            if (taskNoInfo.get("IS_VALID") != null && !(boolean) taskNoInfo.get("IS_VALID")) continue;
            TaskParamVer ret = generateTaskVer(taskNoInfo, mapTypeTaskNo);
            if (ret == null) continue;
            mapTaskParamVer.put(ret.getTaskNo() + ret.getTaskNoVer(), ret);
        }

        // 获取所有job类型 的规格参数
        Map<String, List<TaskParamVer>> mapListTaskParamVer = new HashMap<String, List<TaskParamVer>>();
        getAllTaskNoSpecParam(mapTypeTaskNo, mapListTaskParamVer);

        // insert至 PM_TASK_PARAM_VER
        insertTaskParamVer(mapTaskParamVer, mapListTaskParamVer);
        logger.info("==============>> produceAllSpecParam finish get mapTaskParamVer size:" + mapTaskParamVer.size()
                + " taskNoList size:" + taskNoList.size() + "\n");

    }

    /**
     * [方法描述] 判断task no 调度时间是否有效<br> 
     * @param taskNoInfo
     * @param mapTypeTaskNo
     * @return  <br>
     */
    private TaskParamVer generateTaskVer(Map<String, Object> taskNoInfo, Map<String, List<String>> mapTypeTaskNo) {
        try {
            if (!checkTaskNoInfo(taskNoInfo)) return null;
            // 设置每周一
            taskNoInfo.put("FIRST_DAY_OF_WEEK", "1");
            Date date = new Date();
            String taskNo = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_NO"));
            String taskNoVer = "";
            String cycle = PublicToolUtil.ObjectToStr(taskNoInfo.get("CYCLE_SCHDULE_TYPE"));
            String period = PublicToolUtil.ObjectToStr(taskNoInfo.get("INTERVAL_PERIOD"));
            String taskType = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_TYPE"));
            if (taskNoInfo.get("OPER_DATE") != null) {
                long second = TimeProcess.getInstance()
                        .getSecond(PublicToolUtil.ObjectToStr(taskNoInfo.get("OPER_DATE")));
                taskNoVer = second + "";
            }
            Date first_triggerDate = sysJobDaoUtil.getTaskCreateTableInfo(taskNo, taskNoVer, cycle);
            Date endTime = null;
            if (first_triggerDate != null) {
                endTime = TimeProcess.getInstance().getEndTime(first_triggerDate, 1);
            }
            else {
                endTime = TimeProcess.getInstance().getEndTime(date, 2);
                first_triggerDate = TaskSplit.getInstance().getFirstTrigTime(taskNoInfo, date);
            }
            // 仅生成任务到失效时间 (btime < exp_date|endTime)
            if (!endTime.before(TimeProcess.getInstance().getStrTime(String.valueOf(taskNoInfo.get("EXP_DATE")))))
                endTime = TimeProcess.getInstance().getStrTime(String.valueOf(taskNoInfo.get("EXP_DATE")));

            taskNoInfo.put("TASK_NO_VER", taskNoVer);
            taskNoInfo.put("first_triggerDate", first_triggerDate);
            taskNoInfo.put("endTime", endTime);

            Calendar c = Calendar.getInstance();
            c.setTime(date);
            if (Integer.parseInt(period) > c.getActualMaximum(Calendar.DATE) && cycle.equals("5")) {
                logger.warn("SCHEDU-W-001",
                        "generateTaskVer MONTH MAX DAY LESS THAN CONFIG,COFING: " + period + ",TASKNO: " + taskNo);
                taskNoInfo.put("IS_VALID", false);
                return null;
            }

            // 时间无效
            if (first_triggerDate == null || !first_triggerDate.before(endTime)) {
                logger.warn("SCHEDU-W-001",
                        "generateTaskVer taskno = [" + taskNo + "] getTriggerDate is null or first_triggerDate is ["
                                + ScheduleConstant.normalFormat.format(first_triggerDate) + "] after endTime = ["
                                + ScheduleConstant.normalFormat.format(endTime) + "]");
                taskNoInfo.put("IS_VALID", false);
                return null;
            }

            logger.debug("generateTaskVer taskno = " + taskNo + " first_triggerDate = "
                    + ScheduleConstant.normalFormat.format(first_triggerDate) + " --> endTime = "
                    + ScheduleConstant.normalFormat.format(endTime));

            if (mapTypeTaskNo.containsKey(taskType)) mapTypeTaskNo.get(taskType).add(taskNo);
            else {
                List<String> _list = new ArrayList<String>();
                _list.add(taskNo);
                mapTypeTaskNo.put(taskType, _list);
            }
            return new TaskParamVer("", taskNo, taskNoVer, 0, "", TimeProcess.getInstance().getTimeStr(date), cycle);
        }
        catch (Exception e) {
            logger.error("SCHEDU-E-001", "generateTaskVer get exception e[" + e + "]");
            return null;
        }
    }

    /**
     * [方法描述] 检查参数是否齐全<br> 
     *  
     * @author [作者名]<br>
     * @param taskNoInfo
     * @return  <br>
     */
    private boolean checkTaskNoInfo(Map<String, Object> taskNoInfo) {
        if (TimeProcess.getInstance().getStrTime(PublicToolUtil.ObjectToStr(taskNoInfo.get("EXP_DATE")))
                .before(new Date())) {
            logger.warn("SCHEDU-W-001",
                    "taskNo[" + PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_NO")) + "] is expired");
            taskNoInfo.put("IS_VALID", false);
            return false;
        }
        return true;
    }

    /**
     * [方法描述] 反射获取所有job类型下的所有taskNo的规格参数<br> 
     *  
     * @author [作者名]<br>
     * @param mapTypeTaskNo
     * @param mapListTaskParamVer  <br>
     */
    private void getAllTaskNoSpecParam(Map<String, List<String>> mapTypeTaskNo,
            Map<String, List<TaskParamVer>> mapListTaskParamVer) {
        for (Entry<String, List<String>> en : mapTypeTaskNo.entrySet()) {
            String classPath = JobProduceSpecInstInfo.mapTaskTypeClass.get(en.getKey());
            if (null == classPath) {
                logger.error("SCHEDU-E-001", "getAllTaskNoSpecParam task_type[" + en.getKey()
                        + "] can not find task classPath register class");
                continue;
            }
            mapListTaskParamVer.putAll(invokeMethod(en.getValue(), classPath));
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskNo 
     * @param classpath 
     * @return <br>
     */
    @SuppressWarnings("unchecked")
    private Map<String, List<TaskParamVer>> invokeMethod(List<String> listTaskNo, String classpath) {
        Map<String, List<TaskParamVer>> mapListTaskParamVer = new HashMap<String, List<TaskParamVer>>();
        try {
            Class<?> clazz = Class.forName(classpath);
            @SuppressWarnings("rawtypes")
            Class[] argsClass = new Class[1];
            argsClass[0] = ArrayList.class;
            Method method = clazz.getMethod("produceSpecParam", argsClass);
            mapListTaskParamVer = (Map<String, List<TaskParamVer>>) method.invoke(clazz.newInstance(), listTaskNo);
            if (mapListTaskParamVer == null) {
                logger.warn("SCHEDU-W-001", "classpath[" + classpath + "] return mapListTaskParamVer null");
                mapListTaskParamVer = new HashMap<String, List<TaskParamVer>>();
            }
        }
        catch (ClassNotFoundException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] ClassNotFoundException:", e);
        }
        catch (SecurityException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] SecurityException:", e);
        }
        catch (NoSuchMethodException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] NoSuchMethodException:", e);
        }
        catch (IllegalArgumentException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] IllegalArgumentException:", e);
        }
        catch (IllegalAccessException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] IllegalAccessException:", e);
        }
        catch (InvocationTargetException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] InvocationTargetException:", e);
            Throwable t = e.getTargetException();
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] Throwable:" + t);
        }
        catch (InstantiationException e) {
            logger.error("SCHEDU-E-001", "invokeMethod class[" + classpath + "] InstantiationException:", e);
        }
        return mapListTaskParamVer;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param mapTaskParamVer
     * @param mapTaskNoSpecParam  <br>
     */
    private void insertTaskParamVer(Map<String, TaskParamVer> mapTaskParamVer,
            Map<String, List<TaskParamVer>> mapTaskNoSpecParam) {
        int cnt = 0;
        for (Entry<String, TaskParamVer> en : mapTaskParamVer.entrySet()) {

            List<TaskParamVer> _list = mapTaskNoSpecParam.get(en.getValue().getTaskNo());
            if (_list == null) {
                cnt += (sysJobDaoUtil.insertEachTaskParamVer(en.getValue()) == 0) ? 1 : 0;
                continue;
            }
            for (TaskParamVer Param : _list) {
                // 特殊处理计算生成的，仅入库，不传递生成实例
                if ("L".equals(Param.getParamType())) {
                    TaskParamVer lret = new TaskParamVer(en.getValue());
                    lret.setParamType(Param.getParamType());
                    lret.setTaskParam(Param.getTaskParam());
                    cnt += (sysJobDaoUtil.insertEachTaskParamVer(lret) == 0) ? 1 : 0;
                    continue;
                }
                en.getValue().setParamType(Param.getParamType());
                en.getValue().setTaskParam(Param.getTaskParam());
                cnt += (sysJobDaoUtil.insertEachTaskParamVer(en.getValue()) == 0) ? 1 : 0;
            }
        }
        logger.info("insertTaskParamVer size:" + cnt);
    }

}
