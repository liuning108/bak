package com.ztesoft.zsmart.oss.inms.pm.jobsys.tool;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.dao.SysJobDaoUtil;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.inms.pm.utils.PublicToolUtil;

public class ProduceInstParam {
    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(ProduceInstParam.class);
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
        logger.info("produceAllInstParam begin mapTaskParamVer size: " + mapTaskParamVer.size() + " taskNoList size:"
                + taskNoList.size());

        for (Map<String, Object> taskNoInfo : taskNoList) {
            String taskNo = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_NO"));
            String taskNoVer = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_NO_VER"));
            String taskType = PublicToolUtil.ObjectToStr(taskNoInfo.get("TASK_TYPE"));
            Date endTime = (Date) taskNoInfo.get("endTime");

            TaskParamVer taskParamVer = mapTaskParamVer.get(taskNo + taskNoVer);
            if (taskParamVer == null) {
                logger.warn("taskNo[" + taskNo + "] taskNoVer[" + taskNoVer
                        + "] is invalid task can not find TaskParamVer");
                continue;
            }

            // 切片按调度计划
            Map<String, String> instData4creat = new HashMap<String, String>();
            List<TaskInst> listInstPre = TaskSplit.getInstance().taskSplit(taskNoInfo, taskParamVer, instData4creat);
            if (listInstPre.size() == 0) continue;
            // 反射获取调度实例参数
            List<TaskInst> listInstSuf = null;
            String classPath = JobProduceSpecInstInfo.mapTaskTypeClass.get(taskType);
            if (classPath == null) {
                logger.warn("taskNo[" + taskNo + "] taskType[" + taskType
                        + "] can not find task classPath regiter info");
                listInstSuf = listInstPre;
            }
            else listInstSuf = invokeMethod(listInstPre, taskParamVer, classPath);

            // 入库
            sysJobDaoUtil.insertListTaskInst(listInstSuf, taskNo, taskNoVer, taskType,
                    TimeProcess.getInstance().getTimeStr(endTime), instData4creat);

        }
        logger.info("produceAllInstParam finish .");
    }

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
                logger.warn("classpath[" + classpath + "] return mapListTaskParamVer null");
                listInst = listTaskInst;
            }
        }
        catch (ClassNotFoundException e) {
            logger.error("invokeMethod class[" + classpath + "] ClassNotFoundException:" + e);
        }
        catch (SecurityException e) {
            logger.error("invokeMethod class[" + classpath + "] SecurityException:" + e);
        }
        catch (NoSuchMethodException e) {
            logger.error("invokeMethod class[" + classpath + "] NoSuchMethodException:" + e);
        }
        catch (IllegalArgumentException e) {
            logger.error("invokeMethod class[" + classpath + "] IllegalArgumentException:" + e);
        }
        catch (IllegalAccessException e) {
            logger.error("invokeMethod class[" + classpath + "] IllegalAccessException:" + e);
        }
        catch (InvocationTargetException e) {
            logger.error("invokeMethod class[" + classpath + "] InvocationTargetException:" + e);
            Throwable t = e.getTargetException();
            logger.error("invokeMethod class[" + classpath + "] Throwable:" + t);
        }
        catch (InstantiationException e) {
            logger.error("invokeMethod class[" + classpath + "] InstantiationException:" + e);
        }
        return listInst;
    }
}
