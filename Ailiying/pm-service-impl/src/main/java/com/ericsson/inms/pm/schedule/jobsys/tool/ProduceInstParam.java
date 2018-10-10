package com.ericsson.inms.pm.schedule.jobsys.tool;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ericsson.inms.pm.schedule.jobsys.dao.SysJobDaoUtil;
import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.utils.PublicToolUtil;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.jobsys.tool <br>
 */
public class ProduceInstParam {
    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(ProduceInstParam.class, "PM");
    /**
     * sysJobDaoUtil <br>
     */
    public SysJobDaoUtil sysJobDaoUtil = SpringContext.getBean(SysJobDaoUtil.class);

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param mapTaskParamVer
     * @param taskNoList  <br>
     */
    public void produceAllInstParam(Map<String, TaskParamVer> mapTaskParamVer, List<Map<String, Object>> taskNoList) {
        logger.info("==============>>> produceAllInstParam begin mapTaskParamVer size: " + mapTaskParamVer.size()
                + " taskNoList size:" + taskNoList.size());

        for (Map<String, Object> taskNoInfo : taskNoList) {
            if (taskNoInfo.get("IS_VALID") != null && !(boolean) taskNoInfo.get("IS_VALID")) continue;
            delayEachTask(mapTaskParamVer, taskNoInfo);

        }
        logger.info("==============>>> produceAllInstParam finish .\n");
    }

    private void delayEachTask(Map<String, TaskParamVer> mapTaskParamVer, Map<String, Object> taskNoInfo) {

        String taskNo = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_NO"));
        String taskNoVer = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_NO_VER"));
        String taskType = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_TYPE"));
        try {
            TaskParamVer taskParamVer = mapTaskParamVer.get(taskNo + taskNoVer);
            if (taskParamVer == null) {
                logger.warn("SCHEDU-W-001", "taskNo[" + taskNo + "] taskNoVer[" + taskNoVer
                        + "] is invalid task can not find TaskParamVer");
                return;
            }

            // 切片按调度计划
            Map<String, String> instData4creat = new HashMap<String, String>();
            List<TaskInst> listInstPre = TaskSplit.getInstance().taskSplit(taskNoInfo, taskParamVer, instData4creat);
            if (listInstPre.size() == 0) return;
            logger.info(">>>>>>>> produce Inst taskNo[" + taskNo + "] listInstPre size:" + listInstPre.size()
                    + " inst btime from [" + listInstPre.get(0).getBtime() + "] to ["
                    + listInstPre.get(listInstPre.size() - 1).getBtime() + "]");

            // 反射获取调度实例参数
            List<TaskInst> listInstSuf = null;
            String classPath = JobProduceSpecInstInfo.mapTaskTypeClass.get(taskType);
            if (classPath == null) {
                logger.error("SCHEDU-E-001",
                        "taskNo[" + taskNo + "] taskType[" + taskType + "] can not find task classPath regiter info");
                listInstSuf = listInstPre;
            }
            else listInstSuf = invokeMethod(listInstPre, taskParamVer, classPath);
            // 入库
            sysJobDaoUtil.insertTaskInst(listInstSuf, taskNo, taskNoVer, taskType, instData4creat);

        }
        catch (Exception e) {
            logger.error("SCHEDU-E-001", "taskno[" + taskNo + "] delayEachTask exception:", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param listTaskInst
     * @param taskParamVer
     * @param classpath
     * @return  <br>
     */
    @SuppressWarnings("unchecked")
    private List<TaskInst> invokeMethod(List<TaskInst> listTaskInst, TaskParamVer taskParamVer, String classpath) {
        List<TaskInst> listInst = listTaskInst;
        try {
            Class<?> clazz = Class.forName(classpath);
            @SuppressWarnings("rawtypes")
            Class[] argsClass = new Class[2];
            argsClass[0] = ArrayList.class;
            argsClass[1] = taskParamVer.getClass();
            Method method = clazz.getMethod("produceInstParam", argsClass);
            listInst = (List<TaskInst>) method.invoke(clazz.newInstance(), listTaskInst, taskParamVer);
            if (listInst == null) {
                logger.warn("SCHEDU-W-001", "classpath[" + classpath + "] return mapListTaskParamVer null");
                listInst = listTaskInst;
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
        return listInst;
    }
}
