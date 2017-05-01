package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.quartz.SchedulerException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.domain.SlaTpl;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月9日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.datastatistic <br>
 */
public class DataStatistic {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(DataStatistic.class.getName());

    /**
     * st  <br>
     */
    private static SlaTpl st = new SlaTpl();

    /**
     * firstRun 程序是否第一次运行 1 yes 0 no <br>
     */
    private static int firstRun = 1;

    /**
     * quartzJobManager  <br>
     */
    public QuartzTaskManager quartzJobManager = new QuartzTaskManager();

    /**
     * taskCreateTableMap 建表任务MAP <br>
     */
    private static HashMap<String, SLMEntyExtInfoTask> taskCreateTableMap = new HashMap<String, SLMEntyExtInfoTask>();

    /**
     * taskStatisticMap 统计任务MAP<br>
     */
    private static HashMap<String, SLMBasicStatisticTask> taskStatisticMap = new HashMap<String, SLMBasicStatisticTask>();

    /**
     * slmEntyInfoMap 存储所有接口表信息 key = 实体ID<br>
     */
    public static HashMap<String, SLMEntyInfo> slmEntyInfoMap = new HashMap<String, SLMEntyInfo>();

    /**
     * slmEntyExtInfoMap 存储所有预统计表信息 key = 实体编码+计算周期<br>
     */
    public static HashMap<String, SLMEntyExtInfoTask> slmEntyExtInfoMap = new HashMap<String, SLMEntyExtInfoTask>();

    /**
     * entyIDDIMInfoMap 实体维度字段信息<br>
     */
    public static HashMap<String, List<String>> entyIDDIMInfoMap = new HashMap<String, List<String>>();

    /**
     * entyIDKPIInfoMap 视图指标字段信息<br>
     */
    public static HashMap<String, List<String>> entyIDKPIInfoMap = new HashMap<String, List<String>>();

    /**
     * sliNoEntyTableCodeMap  <br>
     */
    public static HashMap<String, String> sliNoEntyTableCodeMap = new HashMap<String, String>();

    /**
     * kpiAlgorithmMap 指标及指标算法<br>
     */
    public static HashMap<String, String> kpiAlgorithmMap = new HashMap<String, String>();

    /**
     * ct <br>
     */
    public CreateTableSql ct = new CreateTableSql();
    /**
     * [方法描述] 主逻辑<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @throws BaseAppException <br>
     */ 
    public void run() throws BaseAppException {
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            st.getSliNoEntyInfo(sliNoEntyTableCodeMap, kpiAlgorithmMap);
            logger.info("getSliNoEntyInfo sliNoEntyTableCodeMap size [" + sliNoEntyTableCodeMap.size() + "]");
            for (Entry<String, String> entry : sliNoEntyTableCodeMap.entrySet()) { 
                logger.debug("sliNoEntyTableCodeMap:" + entry.getKey() + "-" + entry.getValue());
            }

            logger.info("getSliNoEntyInfo kpiAlgorithmMap size [" + kpiAlgorithmMap.size() + "]");
            for (Entry<String, String> entry : kpiAlgorithmMap.entrySet()) {
                logger.debug("kpiAlgorithmMap:" + entry.getKey() + "-" + entry.getValue());
            }

            st.getSLMEntyInfo(slmEntyInfoMap, entyIDDIMInfoMap, entyIDKPIInfoMap);

            logger.info("get interface table[slm_enty_info] size [" + slmEntyInfoMap.size() + "]");
            logger.info("get interface table[entyIDDIMInfoMap] size [" + entyIDDIMInfoMap.size() + "]");
            logger.info("get interface table[entyIDKPIInfoMap] size [" + entyIDKPIInfoMap.size() + "]");
            
            for (Entry<String, SLMEntyInfo> entry : slmEntyInfoMap.entrySet()) { 
                logger.debug(entry.getValue().printJobInfo());
            }
            for (Entry<String, List<String>> entry : entyIDDIMInfoMap.entrySet()) {
                logger.debug("get field info entyID[" + entry.getKey() + "] dim[" + entry.getValue().size() + "]");
            }
            for (Entry<String, List<String>> entry : entyIDKPIInfoMap.entrySet()) {
                logger.debug("get field info entyID[" + entry.getKey() + "] kpi[" + entry.getValue().size() + "]");
            }
            st.getSLMEntyExtInfo(slmEntyExtInfoMap);

            logger.info("get basic stat table[slm_enty_ext_info] size [" + slmEntyExtInfoMap.size() + "]");
            for (Entry<String, SLMEntyExtInfoTask> entry : slmEntyExtInfoMap.entrySet()) {
                logger.debug(entry.getValue().printJobInfo());
            }
            logger.info("before update CreateTableMap size[" + taskCreateTableMap.size() + "]");
            logger.info("before update BasicStatisticMap size[" + taskStatisticMap.size() + "]");
            /* 清空之前所有任务，重新生成新的周期内的任务 */
            quartzJobManager.clearCreateTableTask(taskCreateTableMap);

            addTaskToCreateMap();
            ses.commitTrans();
            logger.info("after update CreateTableMap size[" + taskCreateTableMap.size() + "]");
            logger.info("after update BasicStatisticMap size[" + taskStatisticMap.size() + "]");
            firstRun = 0;
        } 
        catch (Exception e) {
            logger.error("run DataStistic class", e);
        } 
        finally {
            if (ses != null) { 
                try {
                    ses.releaseTrans();
                }
                catch (BaseAppException e) {
                    logger.error("DataStatistic run error", e);
                }
            }
        }
    }

    /**
     * [方法描述] 新增建表任务和统计任务<br> 
     *  
     * @author [作者名]<br>
     * @taskId 新增新建表调度至taskCreateTableMap <br>
     * @throws BaseAppException 
     * @throws SchedulerException 
     * @throws ParseException <br>
     */ 
    public void addTaskToCreateMap() throws BaseAppException, SchedulerException, ParseException {
        Date date = new Date();
        Calendar lastCycleTime = Calendar.getInstance();
        Calendar nowTime = Calendar.getInstance();
        nowTime.setTime(date);
        lastCycleTime.setTime(date);
        lastCycleTime.add(Calendar.MINUTE, ConstantInterface.updateEntyInfoCycle);
        produceLimitTimeStat(nowTime, lastCycleTime);
        Calendar btimeEval = (Calendar) nowTime.clone();
        
        //程序第一次运行依然根据当前时间建立当日所在的周/月 各个天的表
        if (firstRun == 1) {
            Calendar nowCreatetime = (Calendar) nowTime.clone();
            Calendar monday = (Calendar) nowTime.clone();
            Calendar monthfirstday = (Calendar) nowTime.clone();
            monthfirstday.set(nowTime.get(Calendar.YEAR), nowTime.get(Calendar.MONTH), 1, 0, 0, 0);
            if (monday.get(Calendar.DAY_OF_WEEK) > 1) {
                monday.add(Calendar.DATE, -(monday.get(Calendar.DAY_OF_WEEK) - 2));
            } 
            else {
                monday.add(Calendar.DATE, 1);
            }

            if (-1 == monday.compareTo(monthfirstday)) {
                nowCreatetime = (Calendar) monday.clone();
            } 
            else {
                nowCreatetime = (Calendar) monthfirstday.clone();
            }

            
            while (-1 == nowCreatetime.compareTo(nowTime)) {
                for (Entry<String, SLMEntyExtInfoTask> entry : slmEntyExtInfoMap.entrySet()) { 
                    st.executeCreateSqlTpl(entry.getValue(), nowCreatetime);
                }
                nowCreatetime.add(Calendar.DATE, 1);
            }
        }
        
        ct.initEvalTable(st, btimeEval, lastCycleTime);
        
        /* 非指定周期，当前时间的一个周期内 */
        for (Entry<String, SLMEntyExtInfoTask> entry : slmEntyExtInfoMap.entrySet()) {
            quartzJobManager.addCreatetask(entry.getValue(), taskCreateTableMap);
            /* 生成当前周期该task所有的统计任务至数据库 同时加入调度 */
            if (!produceStatisticTaskToDB(entry.getValue(), nowTime, lastCycleTime, 0)) {
                logger.error("[" + entry.getValue().getjobName()
                        + "] produceStatisticTaskToDB falied.SLMEntyExtInfoTask info[" + entry.getValue().printJobInfo()
                        + "]");
                continue;
            }

        }
    }

    /**
     * [方法描述]  生成指定时间段的任务 <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param nowTime 
     * @param lastCycleTime 
     * @throws ParseException <br>
     * @throws BaseAppException 
     * @throws SchedulerException 
     */ 
    public void produceLimitTimeStat(Calendar nowTime, Calendar lastCycleTime) throws ParseException, BaseAppException, SchedulerException {

        /* 如果程序第一次运行同时指定了时间段统计则建立这个时间段所有的基础统计表 */
        if (firstRun == 1 && !ConstantInterface.stbtime.equals("") && !ConstantInterface.stetime.equals("")) {
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            Calendar stBtime = Calendar.getInstance();
            Calendar stEtime = Calendar.getInstance();
            Date _btime = format.parse(ConstantInterface.stbtime);
            Date _etime = format.parse(ConstantInterface.stetime);
            stBtime.setTime(_btime);
            Calendar btime = (Calendar) stBtime.clone();
            stEtime.setTime(_etime);
            Calendar btimeEval = (Calendar) stBtime.clone();
            
            logger.info("will execute limit task stBtime-stEtime["
                    + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(stBtime.getTime()) + "] -- ["
                    + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(stEtime.getTime()) + "]");
            if (-1 == nowTime.compareTo(stEtime)) {
                stEtime = (Calendar) nowTime.clone();
            }
            stBtime.set(stBtime.get(Calendar.YEAR), stBtime.get(Calendar.MONTH), stBtime.get(Calendar.DATE), 0, 0, 0);
            /* 之前一天的表业同样建立，避免统计跨表报错 ,从周一/月初开始建立没有的表 */
            // stBtime.add(Calendar.DATE, -Calendar.DATE);
            Calendar monday = (Calendar) stBtime.clone();
            Calendar monthfirstday = (Calendar) stBtime.clone();
            monthfirstday.set(stBtime.get(Calendar.YEAR), stBtime.get(Calendar.MONTH), 1, 0, 0, 0);
            if (monday.get(Calendar.DAY_OF_WEEK) > 1) {
                monday.add(Calendar.DATE, -(monday.get(Calendar.DAY_OF_WEEK) - 2));
            } 
            else {
                monday.add(Calendar.DATE, 1);
            }

            if (-1 == monday.compareTo(monthfirstday)) {
                stBtime = (Calendar) monday.clone();
            } 
            else {
                stBtime = (Calendar) monthfirstday.clone();
            }

            ct.initEvalTable(st, btimeEval, stEtime);
            
            while (-1 == stBtime.compareTo(stEtime)) {
                for (Entry<String, SLMEntyExtInfoTask> entry : slmEntyExtInfoMap.entrySet()) { 
                    st.executeCreateSqlTpl(entry.getValue(), stBtime);
                }
                stBtime.add(Calendar.DATE, 1);
            }

            for (Entry<String, SLMEntyExtInfoTask> entry : slmEntyExtInfoMap.entrySet()) {
                /* 生成当前指定周期该task所有的统计任务至数据库 */
                if (!produceStatisticTaskToDB(entry.getValue(), btime, stEtime, 1)) {
                    logger.error("[" + entry.getValue().getjobName()
                            + "] produce limit StatisticTaskToDB falied.SLMEntyExtInfoTask info["
                            + entry.getValue().printJobInfo() + "]");
                    continue;
                }

            }
        }
    }
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名] <br>
     * @taskId  根据分表规则及计算周期获取表的分表后缀 <br>
     * @param crtTableMeth  
     * @param cycle  
     * @param _time  
     * @return  return 
     * @throws BaseAppException  e <br>
     */ 
    public static String getTableLimitTimeStr(String crtTableMeth, String cycle, Calendar _time) throws BaseAppException {
        String TimeStr = "_" + cycle;
        /* stxx_60_20160812 */
        if ("01".equals(crtTableMeth)) {
            TimeStr = TimeStr + "_" + new SimpleDateFormat("yyyyMMdd").format(_time.getTime());
            /* stxx_60_201608 */
        } 
        else if ("02".equals(crtTableMeth)) {
            TimeStr = TimeStr + "_" + new SimpleDateFormat("yyyyMM").format(_time.getTime());
            /* stxx_60_2016 */
        } 
        else if ("03".equals(crtTableMeth)) {
            TimeStr = TimeStr + "_" + new SimpleDateFormat("yyyy").format(_time.getTime());
        }
        return TimeStr;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId  根据分表规则 ，计算周期，周期单位 获取字符串型计算周期 <br>
     * @param cycle_units 
     * @return r
     */ 
    public static String getCycle(String cycle_units) {
        String caculateCycle = "";
        if ("00".equals(cycle_units)) {
            caculateCycle = "5";
        } 
        else if ("01".equals(cycle_units)) {
            caculateCycle = "15";
        } 
        else if ("02".equals(cycle_units)) {
            caculateCycle = "30";
        } 
        else if ("03".equals(cycle_units)) {
            caculateCycle = "60";
        } 
        else if ("04".equals(cycle_units)) {
            caculateCycle = "1440";
        } 
        else if ("05".equals(cycle_units)) {
            caculateCycle = "WK";
        } 
        else if ("06".equals(cycle_units)) {
            caculateCycle = "MON";
        } 
        else if ("07".equals(cycle_units)) {
            caculateCycle = "YEAR";
        } 
        else {
            logger.error("cycle_units[" + cycle_units + "] is not in 00-07.please check it.");
        }
        return caculateCycle;
    }

    /**
     * [方法描述] 根据适配层源表的指定日期的具体表名称 <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> 
     * @param _slmentyinfo 
     * @param toDay 
     * @return r <br>
     */ 
    public String getsrcTableName(SLMEntyInfo _slmentyinfo, Calendar toDay) {
        String name = _slmentyinfo.getentyTableCode() + "_" + _slmentyinfo.getcaculateCycle() + "_"
                + new SimpleDateFormat("yyyyMMdd").format(toDay.getTime());
        if ("00".equals(_slmentyinfo.getcrtTableMeth())) {
            name = _slmentyinfo.getentyTableCode() + "_" + _slmentyinfo.getcaculateCycle();
        } 
        else if ("02".equals(_slmentyinfo.getcrtTableMeth())) {
            name = _slmentyinfo.getentyTableCode() + "_" + _slmentyinfo.getcaculateCycle() + "_"
                    + new SimpleDateFormat("yyyyMM").format(toDay.getTime());
        } 
        else if ("03".equals(_slmentyinfo.getcrtTableMeth())) {
            name = _slmentyinfo.getentyTableCode() + "_" + _slmentyinfo.getcaculateCycle() + "_"
                    + new SimpleDateFormat("yyyy").format(toDay.getTime());
        }
        return name;
    }

    /**
     * [方法描述]  根据分表规则获取建表任务的cronExpression表达式 ,不分表只加入到任务组中不去触发，创建任务时会建立一次<br> 
     *  
     * @author [作者名]<br>
     * @taskId  <br>
     * @param crtTableMeth 
     * @return r <br>
     */ 
    public static String getCreateCron(String crtTableMeth) {
        String cronExpression = "";
        if ("00".equals(crtTableMeth)) {
            cronExpression = ConstantInterface.failedCron;
        } 
        else if ("01".equals(crtTableMeth)) {
            cronExpression = ConstantInterface.dayCrttablemethCron;
        } 
        else if ("02".equals(crtTableMeth)) {
            cronExpression = ConstantInterface.monCrttablemethCron;
        } 
        else if ("03".equals(crtTableMeth)) {
            cronExpression = ConstantInterface.yearCrttablemethCron;
        } 
        else {
            logger.error("can not find Cron [" + crtTableMeth + "].please check it.");
        }
        return cronExpression;
    }

    /**
     * [方法描述] 获取统计目标表的指定日期的具体表名称<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param toDay 
     * @return R <br>
     */ 
    public static String getExtTableName(SLMEntyExtInfoTask info, Calendar toDay) {
        String name = info.getentyTableCode() + "_" + info.getcaculateCycle() + "_"
                + new SimpleDateFormat("yyyyMMdd").format(toDay.getTime());
        if ("00".equals(info.getcrtTableMeth())) {
            name = info.getentyTableCode() + "_" + info.getcaculateCycle();
        } 
        else if ("02".equals(info.getcrtTableMeth())) {
            name = info.getentyTableCode() + "_" + info.getcaculateCycle() + "_"
                    + new SimpleDateFormat("yyyyMM").format(toDay.getTime());
        } 
        else if ("03".equals(info.getcrtTableMeth())) {
            name = info.getentyTableCode() + "_" + info.getcaculateCycle() + "_"
                    + new SimpleDateFormat("yyyy").format(toDay.getTime());
        }
        return name;
    }


    /**
     * [方法描述]      * 根据建表的任务信息 生成当天该task所有的统计任务至数据库
     * 从当前时间开始计算出其所有计算窗口任务之List<SLMBasicStatisticTask> ListStatisticTask中<br> 
     *  适配层实体表不存在或者WK/MON 粒度 不添加统计任务 
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param beginTime 
     * @param lastCycleTime 
     * @param isLimitTime 
     * @return R 
     * @throws BaseAppException  
     * @throws SchedulerException E <br>
     */ 
    public boolean produceStatisticTaskToDB(SLMEntyExtInfoTask info, Calendar beginTime, Calendar lastCycleTime, 
            int isLimitTime) throws BaseAppException, SchedulerException {
        HashMap<String, SLMBasicStatisticTask> statisticTask = new HashMap<String, SLMBasicStatisticTask>();
        if (!slmEntyInfoMap.containsKey(info.getentyID())) {
            logger.error("[" + info.getjobName() + "] entyID[" + info.getentyID() + "] can not find adaptive table info from table[slm_enty_info]");
            return false;
        }
        SLMEntyInfo _slmentyinfo = slmEntyInfoMap.get(info.getentyID());
        if ("WK".equals(_slmentyinfo.getcaculateCycle()) || "MON".equals(_slmentyinfo.getcaculateCycle())
                || "YEAR".equals(_slmentyinfo.getcaculateCycle())) {
            logger.info("[" + info.getjobName() + "] entyID[" + info.getentyID()  + "] adaptive caculatecycle is wk/mon/year do not statistic task");
            return false;
        }
        
        logger.info("firstRun [" + firstRun + "][" + info.getjobName() + "] task time:" + 
                new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(beginTime.getTime()) + "-" +
                new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(lastCycleTime.getTime()));

        getTask(statisticTask, _slmentyinfo, info, beginTime, lastCycleTime, isLimitTime);
        logger.info("[" + info.getjobName() + "]" + " will insert into statisticTask:" + statisticTask.size());
        addStatJobExt(statisticTask);
        return true;
    }


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param statisticTask 
     * @param _slmentyinfo 
     * @param info 
     * @param beginTime 
     * @param lastCycleTime 
     * @param isLimitTime  <br>
     */ 
    public void getTask(HashMap<String, SLMBasicStatisticTask> statisticTask, SLMEntyInfo _slmentyinfo, 
            SLMEntyExtInfoTask info, Calendar beginTime, Calendar lastCycleTime, int isLimitTime) {
        if (Integer.parseInt(_slmentyinfo.getcaculateCycle()) <= 5 && slmEntyExtInfoMap.containsKey(info.getentyTableCode() + "_5")) {
            getTaskInter5(info, beginTime, lastCycleTime, isLimitTime, _slmentyinfo, statisticTask);
        } 
        else if (Integer.parseInt(_slmentyinfo.getcaculateCycle()) > 5
                && Integer.parseInt(_slmentyinfo.getcaculateCycle()) <= 60
                && slmEntyExtInfoMap.containsKey(info.getentyTableCode() + "_60")) {
            getTaskInter60(info, beginTime, lastCycleTime, isLimitTime, _slmentyinfo, statisticTask);
        } 
        else if (Integer.parseInt(_slmentyinfo.getcaculateCycle()) > 60
                && Integer.parseInt(_slmentyinfo.getcaculateCycle()) <= 1440
                && slmEntyExtInfoMap.containsKey(info.getentyTableCode() + "_1440")) {
            getTaskInter1440(info, beginTime, lastCycleTime, isLimitTime, _slmentyinfo, statisticTask);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param statisticTask 
     * @throws SchedulerException  e
     * @throws BaseAppException e<br>
     */ 
    public void addStatJobExt(HashMap<String, SLMBasicStatisticTask> statisticTask) throws SchedulerException, BaseAppException {
        if (statisticTask.size() == 0) {
            return;
        }
        for (Entry<String, SLMBasicStatisticTask> entry : statisticTask.entrySet()) {
            quartzJobManager.addStatisticJob(entry.getValue(), taskStatisticMap);
        }
        st.insertStatisticTaskDB(statisticTask);
    }
    
    /**
     * [方法描述] 接口文件小于等于5分钟生成的各个粒度统计任务<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param beginTime 
     * @param lastCycleTime 
     * @param isLimitTime 
     * @param _slmentyinfo 
     * @param statisticTask 
     */ 
    public void getTaskInter5(SLMEntyExtInfoTask info, Calendar beginTime, Calendar lastCycleTime, 
            int isLimitTime, SLMEntyInfo _slmentyinfo, HashMap<String, SLMBasicStatisticTask> statisticTask) {
        Calendar to5min = (Calendar) beginTime.clone();
        Calendar nex5min = (Calendar) beginTime.clone();
        to5min.add(Calendar.SECOND, -to5min.get(Calendar.SECOND));
        to5min.add(Calendar.MINUTE, -(to5min.get(Calendar.MINUTE) % 5));
        nex5min.add(Calendar.SECOND, -nex5min.get(Calendar.SECOND));
        nex5min.add(Calendar.MINUTE, 5 - (nex5min.get(Calendar.MINUTE) % 5));
        while (-1 == nex5min.compareTo(lastCycleTime) || 0 == nex5min.compareTo(lastCycleTime)) {
            Calendar executeTime = (Calendar) nex5min.clone();
            int HH = to5min.get(Calendar.HOUR_OF_DAY);
            int MI = to5min.get(Calendar.MINUTE);
            int WK = to5min.get(Calendar.DAY_OF_WEEK);
            if (WK == 1) {
                WK = 7;
            } 
            else {
                WK = WK - 1;
            }
            SLMBasicStatisticTask task = new SLMBasicStatisticTask();
            getTaskInter5Ext(info, to5min, nex5min, executeTime, isLimitTime, _slmentyinfo, task, HH, MI, WK);
            if (getTaskDimsKpis(task)) {
                statisticTask.put(task.getJobName(), task);
            }
            to5min.add(Calendar.MINUTE, 5);
            nex5min.add(Calendar.MINUTE, 5);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param to5min 
     * @param nex5min 
     * @param executeTime 
     * @param isLimitTime 
     * @param _slmentyinfo 
     * @param task 
     * @param HH 
     * @param MI 
     * @param WK 
     */ 
    public void getTaskInter5Ext(SLMEntyExtInfoTask info, Calendar to5min, Calendar nex5min, Calendar executeTime, 
            int isLimitTime, SLMEntyInfo _slmentyinfo, SLMBasicStatisticTask task, int HH, int MI, int WK) {
        String caculateCycle = info.getcaculateCycle();
        if ("5".equals(caculateCycle)) {
            task.setHh(HH);
            task.setMi(MI);
            task.setWk(WK);
            task.setInterfacecaculatecycle(_slmentyinfo.getcaculateCycle());
            task.setJobName(_slmentyinfo.getentyTableCode() + "_EVAL_5_"
                    + new SimpleDateFormat("yyyyMMddHHmm").format(to5min.getTime()) + "00_"
                    + new SimpleDateFormat("yyyyMMddHHmm").format(nex5min.getTime()) + "00");
            task.setBtime(new SimpleDateFormat("yyyy-MM-dd HH:mm").format(to5min.getTime()) + ":00");
            task.setEtime(new SimpleDateFormat("yyyy-MM-dd HH:mm").format(nex5min.getTime()) + ":00");
            task.srcTableMap.put(getsrcTableName(_slmentyinfo, to5min),
                    new TimePeriod(task.getBtime(), task.getEtime()));
            task.setJobGroup("STATISTIC_" + info.getentyTableCode());
            task.setJobStatus("0");
            if (isLimitTime == 1) {
                executeTime.setTime(new Date());
                executeTime.add(Calendar.MINUTE, ConstantInterface.fiveHistoryStatMinDelay);
            } 
            else {
                executeTime.add(Calendar.SECOND, ConstantInterface.fiveStatSecondDelay);
            }
            task.setCronExpression(executeTime.get(Calendar.SECOND) + " " + executeTime.get(Calendar.MINUTE)
                    + " " + executeTime.get(Calendar.HOUR_OF_DAY) + " " + executeTime.get(Calendar.DAY_OF_MONTH)
                    + " " + (1 + executeTime.get(Calendar.MONTH)) + " ? " + executeTime.get(Calendar.YEAR));
            task.setEntyID(info.getentyID());
            task.setDstTableName(getExtTableName(info, to5min));
            task.setCaculateCycle(info.getcaculateCycle());
            String insertTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
            task.setInsertTime(insertTime);
            return;
        } 
        //计算周期为5分钟以上粒度的统计
        getTaskInter5Ext60Mon(info, to5min, nex5min, executeTime, isLimitTime, _slmentyinfo, task, HH, MI, WK);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param to5min 
     * @param nex5min 
     * @param executeTime 
     * @param isLimitTime 
     * @param _slmentyinfo 
     * @param task 
     * @param HH 
     * @param MI 
     * @param WK  <br>
     */ 
    public void getTaskInter5Ext60Mon(SLMEntyExtInfoTask info, Calendar to5min, Calendar nex5min, Calendar executeTime, 
            int isLimitTime, SLMEntyInfo _slmentyinfo, SLMBasicStatisticTask task, int HH, int MI, int WK) {
        String caculateCycle = info.getcaculateCycle();
        int nextMonthDay = nex5min.get(Calendar.DAY_OF_MONTH);
        
        if ("60".equals(caculateCycle) && MI == 55) {
            task.setHh(HH);
            task.setWk(WK);
            get60StatisticTask(task, info, _slmentyinfo, executeTime, to5min, nex5min, 0, isLimitTime);
        } 
        else if ("1440".equals(caculateCycle) && HH == 23 && MI == 55) {
            task.setWk(WK);
            get1440StatisticTask(task, info, _slmentyinfo, executeTime, to5min, nex5min, 0, isLimitTime);
        } 
        else if ("WK".equals(caculateCycle) && WK == 7 && HH == 23 && MI == 55) {
            getWKStatisticTask(task, info, _slmentyinfo, executeTime, to5min, nex5min, isLimitTime);
        } 
        else if ("MON".equals(caculateCycle) && nextMonthDay == 1 && HH == 0 && MI == 0) {
            getMONStatisticTask(task, info, _slmentyinfo, executeTime, to5min, nex5min, isLimitTime);
        }
    }
    
    /**
     * [方法描述] 接口文件大于5分钟 - 60 生成的各个粒度统计任务<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param beginTime 
     * @param lastCycleTime 
     * @param isLimitTime 
     * @param _slmentyinfo 
     * @param statisticTask 
     */ 
    public void getTaskInter60(SLMEntyExtInfoTask info, Calendar beginTime, Calendar lastCycleTime, 
            int isLimitTime, SLMEntyInfo _slmentyinfo, HashMap<String, SLMBasicStatisticTask> statisticTask) {
        Calendar toHour = (Calendar) beginTime.clone();
        Calendar nextHour = (Calendar) beginTime.clone();
        toHour.set(toHour.get(Calendar.YEAR), toHour.get(Calendar.MONTH), toHour.get(Calendar.DATE),
                toHour.get(Calendar.HOUR_OF_DAY), 0, 0);
        nextHour.add(Calendar.HOUR, 1);
        nextHour.set(nextHour.get(Calendar.YEAR), nextHour.get(Calendar.MONTH), nextHour.get(Calendar.DATE),
                nextHour.get(Calendar.HOUR_OF_DAY), 0, 0);

        while (-1 == nextHour.compareTo(lastCycleTime) || 0 == nextHour.compareTo(lastCycleTime)) {
            Calendar executeTime = (Calendar) nextHour.clone();
            int HH = toHour.get(Calendar.HOUR_OF_DAY);
            int MI = 0;
            int WK = toHour.get(Calendar.DAY_OF_WEEK);
            if (WK == 1) {
                WK = 7;
            } 
            else {
                WK = WK - 1;
            }
            SLMBasicStatisticTask task = new SLMBasicStatisticTask();
            getTaskInter60Ext(info, toHour, nextHour, executeTime, isLimitTime, _slmentyinfo, task, HH, MI, WK);
            if (getTaskDimsKpis(task)) {
                statisticTask.put(task.getJobName(), task);
            }
            toHour.add(Calendar.HOUR, 1);
            nextHour.add(Calendar.HOUR, 1);
        }
    }
   
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param toHour 
     * @param nextHour 
     * @param executeTime 
     * @param isLimitTime 
     * @param _slmentyinfo 
     * @param task 
     * @param HH 
     * @param MI 
     * @param WK  <br>
     */ 
    public void getTaskInter60Ext(SLMEntyExtInfoTask info, Calendar toHour, Calendar nextHour, Calendar executeTime, 
            int isLimitTime, SLMEntyInfo _slmentyinfo, SLMBasicStatisticTask task, int HH, int MI, int WK) {
        String caculateCycle = info.getcaculateCycle();
        int nextMonthDay = nextHour.get(Calendar.DAY_OF_MONTH);
        if ("60".equals(caculateCycle)) {
            task.setHh(HH);
            task.setWk(WK);
            get60StatisticTask(task, info, _slmentyinfo, executeTime, toHour, nextHour, 1, isLimitTime);
        } 
        else if ("1440".equals(caculateCycle) && HH == 23 && MI == 0) {
            task.setWk(WK);
            get1440StatisticTask(task, info, _slmentyinfo, executeTime, toHour, nextHour, 0, isLimitTime);
        } 
        else if ("WK".equals(caculateCycle) && WK == 7 && HH == 23 && MI == 0) {
            getWKStatisticTask(task, info, _slmentyinfo, executeTime, toHour, nextHour, isLimitTime);
        } 
        else if ("MON".equals(caculateCycle) && nextMonthDay == 1 && HH == 0 && MI == 0) {
            getMONStatisticTask(task, info, _slmentyinfo, executeTime, toHour, nextHour, isLimitTime);
        }
    }
    
    /**
     * [方法描述] 接口文件大于60分钟 - 1440 生成的各个粒度统计任务<br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param beginTime 
     * @param lastCycleTime 
     * @param isLimitTime 
     * @param _slmentyinfo 
     * @param statisticTask 
     */ 
    public void getTaskInter1440(SLMEntyExtInfoTask info, Calendar beginTime, Calendar lastCycleTime, 
            int isLimitTime, SLMEntyInfo _slmentyinfo, HashMap<String, SLMBasicStatisticTask> statisticTask) {
        Calendar toDay = (Calendar) beginTime.clone();
        Calendar nextDay = (Calendar) beginTime.clone();
        toDay.set(toDay.get(Calendar.YEAR), toDay.get(Calendar.MONTH), toDay.get(Calendar.DATE), 0, 0, 0);
        nextDay.add(Calendar.DATE, 1);
        nextDay.set(nextDay.get(Calendar.YEAR), nextDay.get(Calendar.MONTH), nextDay.get(Calendar.DATE), 0, 0, 0);
        while (-1 == nextDay.compareTo(lastCycleTime) || 0 == nextDay.compareTo(lastCycleTime)) {
            Calendar executeTime = (Calendar) nextDay.clone();
            int HH = toDay.get(Calendar.HOUR_OF_DAY);
            int MI = 0;
            int WK = toDay.get(Calendar.DAY_OF_WEEK);
            if (WK == 1) {
                WK = 7;
            } 
            else {
                WK = WK - 1;
            }
            String caculateCycle = info.getcaculateCycle();
            int nextMonthDay = nextDay.get(Calendar.DAY_OF_MONTH);
            SLMBasicStatisticTask task = new SLMBasicStatisticTask();
            if ("1440".equals(caculateCycle)) {
                task.setWk(WK);
                get1440StatisticTask(task, info, _slmentyinfo, executeTime, toDay, nextDay, 1, isLimitTime);
            } 
            else if ("WK".equals(caculateCycle) && WK == 7 && HH == 0 && MI == 0) {
                getWKStatisticTask(task, info, _slmentyinfo, executeTime, toDay, nextDay, isLimitTime);
            } 
            else if ("MON".equals(caculateCycle) && nextMonthDay == 1 && HH == 0 && MI == 0) {
                getMONStatisticTask(task, info, _slmentyinfo, executeTime, toDay, nextDay, isLimitTime);
            }
            if (getTaskDimsKpis(task)) {
                statisticTask.put(task.getJobName(), task);
            }
            toDay.add(Calendar.DATE, 1);
            nextDay.add(Calendar.DATE, 1);
        }
    }
    
    /**
     * [方法描述] 获取任务的 kpi 和维度<br> 
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @return 获取成功返回true<br>
     */ 
    public boolean getTaskDimsKpis(SLMBasicStatisticTask task) {
        if (task.srcTableMap.size() == 0 || !DataStatistic.entyIDKPIInfoMap.containsKey(task.getEntyID()) 
                || 0 == DataStatistic.entyIDKPIInfoMap.get(task.getEntyID()).size()) {
            //logger.debug("[" + task.getJobName() + "] not find entyID[" + task.getEntyID() + "] kpi or src table size:" + task.srcTableMap.size());
            return false;
        }

        int dim_size = 0;
        if (DataStatistic.entyIDDIMInfoMap.containsKey(task.getEntyID())) {
            dim_size = DataStatistic.entyIDDIMInfoMap.get(task.getEntyID()).size();
        } 
        else {
            logger.error("[" + task.getJobName() + "] can not find entyID[" + task.getEntyID() + "] dim fields");
        }
        String kpis = "";
        String kpis_code = "";
        for (int j = 0; j < DataStatistic.entyIDKPIInfoMap.get(task.getEntyID()).size(); j++) {
            String kpi = DataStatistic.entyIDKPIInfoMap.get(task.getEntyID()).get(j);
            if (!DataStatistic.kpiAlgorithmMap.containsKey(kpi)) {
                logger.error("[" + task.getJobName() + "] can not find kpi[" + kpi + "] Algorithm from slm_sli_info");
                return false;
            }
            kpis = kpis + "," + DataStatistic.kpiAlgorithmMap.get(kpi);
            kpis_code = kpis_code + "," + kpi;
        }

        String dims = "";
        String group_dims = "";

        for (int i = 0; i < dim_size; i++) {
            dims = dims + "," + DataStatistic.entyIDDIMInfoMap.get(task.getEntyID()).get(i);
            if (i != 0) {
                group_dims = group_dims + "," + DataStatistic.entyIDDIMInfoMap.get(task.getEntyID()).get(i);
            } 
            else {
                group_dims = "GROUP BY " + DataStatistic.entyIDDIMInfoMap.get(task.getEntyID()).get(i);
            }
        }

        String _from = "";
        for (Entry<String, TimePeriod> entry : task.srcTableMap.entrySet()) {
            _from = _from + " SELECT 1" + dims + kpis_code + " FROM " + entry.getKey()
                        + " WHERE BTIME >= to_date('" + entry.getValue().getbtime()
                        + "','yyyy-MM-dd hh24:mi:ss') AND BTIME < to_date('" + entry.getValue().getetime()
                        + "','yyyy-MM-dd hh24:mi:ss') " + " UNION ALL ";
        }
        _from = _from.substring(0, _from.length() - 10);
        
        task.setDims(dims);
        task.setGroupDims(group_dims);
        task.setKpis(kpis);
        task.setKpisCode(kpis_code);
        task.setFrom(_from);
        return true;
    }
    
    /**
     * [方法描述]  <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @param info 
     * @param _slmentyinfo 
     * @param executeTime 
     * @param to5min 
     * @param nex5min 
     * @param isbase 
     * @param isLimitTime <br>
     */ 
    public void get60StatisticTask(SLMBasicStatisticTask task, SLMEntyExtInfoTask info, SLMEntyInfo _slmentyinfo,
            Calendar executeTime, Calendar to5min, Calendar nex5min, int isbase, int isLimitTime) {
        if (isLimitTime == 1) {
            executeTime.setTime(new Date());
            executeTime.add(Calendar.MINUTE, ConstantInterface.hourHistoryStatMinDelay);
        } 
        else {
            executeTime.set(nex5min.get(Calendar.YEAR), nex5min.get(Calendar.MONTH), nex5min.get(Calendar.DATE),
                    nex5min.get(Calendar.HOUR_OF_DAY), 0, 0);
            executeTime.add(Calendar.MINUTE, ConstantInterface.hourStatMinDelay);
        }
        task.setInterfacecaculatecycle(_slmentyinfo.getcaculateCycle());
        task.setBtime(new SimpleDateFormat("yyyy-MM-dd HH").format(to5min.getTime()) + ":00:00");
        task.setEtime(new SimpleDateFormat("yyyy-MM-dd HH").format(nex5min.getTime()) + ":00:00");
        if (0 == isbase) {
            task.srcTableMap.put(getExtTableName(slmEntyExtInfoMap.get(info.getentyTableCode() + "_5"), to5min),
                    new TimePeriod(task.getBtime(), task.getEtime()));
        } 
        else {
            task.srcTableMap.put(getsrcTableName(_slmentyinfo, to5min),
                    new TimePeriod(task.getBtime(), task.getEtime()));
        }
        task.setJobName(_slmentyinfo.getentyTableCode() + "_EVAL_60_"
                + new SimpleDateFormat("yyyyMMddHH").format(to5min.getTime()) + "0000_"
                + new SimpleDateFormat("yyyyMMddHH").format(nex5min.getTime()) + "0000");
        task.setJobGroup("STATISTIC_" + info.getentyTableCode());
        task.setJobStatus("0");
        task.setCronExpression(executeTime.get(Calendar.SECOND) + " " + executeTime.get(Calendar.MINUTE) + " "
                + executeTime.get(Calendar.HOUR_OF_DAY) + " " + executeTime.get(Calendar.DAY_OF_MONTH) + " "
                + (1 + executeTime.get(Calendar.MONTH)) + " ? " + executeTime.get(Calendar.YEAR));
        task.setEntyID(info.getentyID());
        task.setDstTableName(getExtTableName(info, to5min));
        task.setCaculateCycle(info.getcaculateCycle());
        String insertTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        task.setInsertTime(insertTime);
    }

    /**
     * [方法描述]  <br> 
     *  
     * @author [作者名]<br>
     * @taskId  <br>
     * @param task 
     * @param info 
     * @param _slmentyinfo 
     * @param executeTime 
     * @param to5min 
     * @param nex5min 
     * @param isbase 
     * @param isLimitTime  <br>
     */ 
    public void get1440StatisticTask(SLMBasicStatisticTask task, SLMEntyExtInfoTask info, SLMEntyInfo _slmentyinfo,
            Calendar executeTime, Calendar to5min, Calendar nex5min, int isbase, int isLimitTime) {
        if (isLimitTime == 1) {
            executeTime.setTime(new Date());
            executeTime.add(Calendar.MINUTE, ConstantInterface.dayHistoryStatMinDelay);
        } 
        else {
            executeTime.set(nex5min.get(Calendar.YEAR), nex5min.get(Calendar.MONTH), nex5min.get(Calendar.DATE), 0, 0,
                    0);
            executeTime.add(Calendar.MINUTE, ConstantInterface.dayStatMinDelay);
        }
        task.setInterfacecaculatecycle(_slmentyinfo.getcaculateCycle());
        task.setBtime(new SimpleDateFormat("yyyy-MM-dd").format(to5min.getTime()) + " 00:00:00");
        task.setEtime(new SimpleDateFormat("yyyy-MM-dd").format(nex5min.getTime()) + " 00:00:00");
        if (0 == isbase) {
            task.srcTableMap.put(getExtTableName(slmEntyExtInfoMap.get(info.getentyTableCode() + "_60"), to5min),
                    new TimePeriod(task.getBtime(), task.getEtime()));
        }
        else {
            task.srcTableMap.put(getsrcTableName(_slmentyinfo, to5min),
                    new TimePeriod(task.getBtime(), task.getEtime()));
        }
        task.setJobName(_slmentyinfo.getentyTableCode() + "_EVAL_1440_"
                + new SimpleDateFormat("yyyyMMdd").format(to5min.getTime()) + "000000_"
                + new SimpleDateFormat("yyyyMMdd").format(nex5min.getTime()) + "000000");
        task.setJobGroup("STATISTIC_" + info.getentyTableCode());
        task.setJobStatus("0");
        task.setCronExpression(executeTime.get(Calendar.SECOND) + " " + executeTime.get(Calendar.MINUTE) + " "
                + executeTime.get(Calendar.HOUR_OF_DAY) + " " + executeTime.get(Calendar.DAY_OF_MONTH) + " "
                + (1 + executeTime.get(Calendar.MONTH)) + " ? " + executeTime.get(Calendar.YEAR));
        task.setEntyID(info.getentyID());
        task.setDstTableName(getExtTableName(info, to5min));
        task.setCaculateCycle(info.getcaculateCycle());
        String insertTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        task.setInsertTime(insertTime);
    }

    /**
     * [方法描述]  <br> 
     *  
     * @author [作者名] <br>
     * @taskId  <br>
     * @param task 
     * @param info 
     * @param _slmentyinfo 
     * @param executeTime 
     * @param to5min 
     * @param nex5min 
     * @param isLimitTime  <br>
     */ 
    public void getWKStatisticTask(SLMBasicStatisticTask task, SLMEntyExtInfoTask info, SLMEntyInfo _slmentyinfo,
            Calendar executeTime, Calendar to5min, Calendar nex5min, int isLimitTime) {
        logger.debug("to5min:" + new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(to5min.getTime()) + "]nex5min:"
                + new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(nex5min.getTime()));
        if (isLimitTime == 1) {
            executeTime.setTime(new Date());
            executeTime.add(Calendar.MINUTE, ConstantInterface.wkHistoryStatMinDelay);
        } 
        else {
            executeTime.set(nex5min.get(Calendar.YEAR), nex5min.get(Calendar.MONTH), nex5min.get(Calendar.DATE), 0, 0,
                    0);
            executeTime.add(Calendar.MINUTE, ConstantInterface.wkStatMinDelay);
        }
        Calendar toWKFirstDay = (Calendar) to5min.clone();
        toWKFirstDay.add(Calendar.DATE, -6);
        Calendar nextWKFirstDay = (Calendar) toWKFirstDay.clone();
        nextWKFirstDay.add(Calendar.DAY_OF_WEEK, 7);
        task.setInterfacecaculatecycle(_slmentyinfo.getcaculateCycle());
        task.setBtime(new SimpleDateFormat("yyyy-MM-dd").format(toWKFirstDay.getTime()) + " 00:00:00");
        task.setEtime(new SimpleDateFormat("yyyy-MM-dd").format(nextWKFirstDay.getTime()) + " 00:00:00");
        task.setJobName(_slmentyinfo.getentyTableCode() + "_EVAL_WK_"
                + new SimpleDateFormat("yyyyMMdd").format(toWKFirstDay.getTime()) + "000000_"
                + new SimpleDateFormat("yyyyMMdd").format(nextWKFirstDay.getTime()) + "000000");
        for (int i = 0; i < 7; i++) {
            String _src_tablename = getExtTableName(slmEntyExtInfoMap.get(info.getentyTableCode() + "_1440"),
                    toWKFirstDay);
            task.srcTableMap.put(_src_tablename, new TimePeriod(task.getBtime(), task.getEtime()));
            toWKFirstDay.add(Calendar.DATE, 1);
        }
        task.setJobGroup("STATISTIC_" + info.getentyTableCode());
        task.setJobStatus("0");
        task.setCronExpression(executeTime.get(Calendar.SECOND) + " " + executeTime.get(Calendar.MINUTE) + " "
                + executeTime.get(Calendar.HOUR_OF_DAY) + " " + executeTime.get(Calendar.DAY_OF_MONTH) + " "
                + (1 + executeTime.get(Calendar.MONTH)) + " ? " + executeTime.get(Calendar.YEAR));
        task.setEntyID(info.getentyID());
        task.setDstTableName(getExtTableName(info, to5min));
        task.setCaculateCycle(info.getcaculateCycle());
        String insertTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        task.setInsertTime(insertTime);
    }

    /**
     * [方法描述]  <br> 
     *  
     * @author [作者名] <br>
     * @taskId <br>
     * @param task 
     * @param info 
     * @param _slmentyinfo 
     * @param executeTime 
     * @param to5min 
     * @param nex5min 
     * @param isLimitTime  <br>
     */ 
    public void getMONStatisticTask(SLMBasicStatisticTask task, SLMEntyExtInfoTask info, SLMEntyInfo _slmentyinfo,
            Calendar executeTime, Calendar to5min, Calendar nex5min, int isLimitTime) {
        if (isLimitTime == 1) {
            executeTime.setTime(new Date());
            executeTime.add(Calendar.MINUTE, ConstantInterface.monHistoryStatMinDelay);
        } 
        else {
            executeTime.set(nex5min.get(Calendar.YEAR), nex5min.get(Calendar.MONTH), nex5min.get(Calendar.DATE), 0, 0,
                    0);
            executeTime.add(Calendar.MINUTE, ConstantInterface.monStatMinDelay);
        }
        Calendar toMonthDay = (Calendar) nex5min.clone();
        toMonthDay.add(Calendar.MONTH, -1);
        task.setInterfacecaculatecycle(_slmentyinfo.getcaculateCycle());
        task.setBtime(new SimpleDateFormat("yyyy-MM-dd").format(toMonthDay.getTime()) + " 00:00:00");
        task.setEtime(new SimpleDateFormat("yyyy-MM-dd").format(nex5min.getTime()) + " 00:00:00");
        task.setJobName(_slmentyinfo.getentyTableCode() + "_EVAL_MON_"
                + new SimpleDateFormat("yyyyMMdd").format(toMonthDay.getTime()) + "000000_"
                + new SimpleDateFormat("yyyyMMdd").format(nex5min.getTime()) + "000000");
        while (-1 == toMonthDay.compareTo(nex5min)) {
            String _src_tablename = getExtTableName(slmEntyExtInfoMap.get(info.getentyTableCode() + "_1440"),
                    toMonthDay);
            task.srcTableMap.put(_src_tablename, new TimePeriod(task.getBtime(), task.getEtime()));
            toMonthDay.add(Calendar.DATE, 1);
        }
        task.setJobGroup("STATISTIC_" + info.getentyTableCode());
        task.setJobStatus("0");
        task.setCronExpression(executeTime.get(Calendar.SECOND) + " " + executeTime.get(Calendar.MINUTE) + " "
                + executeTime.get(Calendar.HOUR_OF_DAY) + " " + executeTime.get(Calendar.DAY_OF_MONTH) + " "
                + (1 + executeTime.get(Calendar.MONTH)) + " ? " + executeTime.get(Calendar.YEAR));
        task.setEntyID(info.getentyID());
        task.setDstTableName(getExtTableName(info, to5min));
        task.setCaculateCycle(info.getcaculateCycle());
        String insertTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        task.setInsertTime(insertTime);
    }

    /**
     * [方法描述]  <br> 
     *  
     * @author [作者名] <br>
     * @taskId  <br>
     * @param sliNo 
     * @param cycle 
     * @param serviceDay 
     * @param serviceTime 
     * @param btime 
     * @param etime 
     * @return  R<br>
     */ 
    public static List<String> getTableNameList(String sliNo, String cycle, String serviceDay,
            String serviceTime, Date btime, Date etime) {
        List<String> _list = new ArrayList<String>();
        String caculateCycle = getCycle(cycle);
        
        if ("".equals(caculateCycle) || firstRun == 1 || !sliNoEntyTableCodeMap.containsKey(sliNo)) {
            logger.error("firstRun[" + firstRun + "] getTableNameList cycle[" + cycle + "] sliNo[" + sliNo + "] caculateCycle[" + cycle
                + "] serviceDay[" + serviceDay + "] serviceTime[" + serviceTime + "] btime["
                + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(btime) + "] etime["
                + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(etime) + "]");
            return _list;
        }
        
        Calendar this_spa = Calendar.getInstance();
        Calendar nex_spa = Calendar.getInstance();
        this_spa.setTime(btime);
        nex_spa.setTime(etime);
        this_spa.set(this_spa.get(Calendar.YEAR), this_spa.get(Calendar.MONTH), this_spa.get(Calendar.DATE), 0, 0,
                0);

        if ("S01".equals(serviceDay) && "S01".equals(serviceTime)) {
            getAllS01TableName(this_spa, nex_spa, caculateCycle, sliNo, _list);
        } 
        else {
            getOtherS01TableName(this_spa, nex_spa, caculateCycle, sliNo, _list, serviceDay, serviceTime);

        }

        logger.debug("getTableNameList size[" + _list.size() + "] sliNo[" + sliNo + "] caculateCycle[" + caculateCycle
                + "] serviceDay[" + serviceDay + "] serviceTime[" + serviceTime + "] btime["
                + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(btime) + "] etime["
                + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(etime) + "]");
        return _list;
    }

    /**
     * [方法描述] "S01".equals(serviceDay) && "S01".equals(serviceTime) <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param this_spa 
     * @param nex_spa  
     * @param caculateCycle 
     * @param sliNo 
     * @param _list <br>
     */ 
    public static void getAllS01TableName(Calendar this_spa, Calendar nex_spa, String caculateCycle, String sliNo, List<String> _list) {
        while (-1 == this_spa.compareTo(nex_spa)) {
            String name = getAllS01TableNameExt(this_spa, nex_spa, caculateCycle, sliNo, _list);
            if (!_list.contains(name) && !"".equals(name)) {
                _list.add(name);
            }
            this_spa.add(Calendar.DATE, 1);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param this_spa 
     * @param nex_spa 
     * @param caculateCycle 
     * @param sliNo 
     * @param _list 
     * @return <br>
     */ 
    public static String getAllS01TableNameExt(Calendar this_spa, Calendar nex_spa, String caculateCycle, String sliNo, List<String> _list) {
        String name = "";
        //天周月粒度
        if (("1440".equals(caculateCycle) || "WK".equals(caculateCycle) || "MON".equals(caculateCycle)) && 
                slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_" + caculateCycle)) {
            name = getExtTableName(
                    slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_" + caculateCycle),
                    this_spa);
        }
       //天以下小时以上粒度
        else if (Integer.parseInt(caculateCycle) < 1440 && Integer.parseInt(caculateCycle) >= 60 && 
                slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_60")) {
            name = getExtTableName(slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_60"),
                    this_spa);
        }
        //60分钟以下粒度
        else if (slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_5")) {
            name = getExtTableName(slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_5"),
                    this_spa);
        }
        return name;
    }
 
    /**
     * [方法描述] 不同时成立 "S01".equals(serviceDay) && "S01".equals(serviceTime) <br> 
     * @author [作者名]<br>
     * @taskId <br>
     * @param this_spa 
     * @param nex_spa 
     * @param caculateCycle 
     * @param sliNo 
     * @param _list  
     * @param serviceDay 
     * @param serviceTime  <br>
     */ 
    public static void getOtherS01TableName(Calendar this_spa, Calendar nex_spa, String caculateCycle, String sliNo,
            List<String> _list, String serviceDay, String serviceTime) {
        while (-1 == this_spa.compareTo(nex_spa)) {
            String name = getOtherS01TableNameExt(this_spa, nex_spa, caculateCycle, sliNo, _list, serviceDay, serviceTime);
            if (!_list.contains(name) && !"".equals(name)) {
                _list.add(name);
            }
            this_spa.add(Calendar.DATE, 1);
        }
    }
    

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param this_spa 
     * @param nex_spa 
     * @param caculateCycle 
     * @param sliNo 
     * @param _list 
     * @param serviceDay 
     * @param serviceTime 
     * @return <br>
     */ 
    public static String getOtherS01TableNameExt(Calendar this_spa, Calendar nex_spa, String caculateCycle, String sliNo, List<String> _list,
            String serviceDay, String serviceTime) {
        String name = "";
        // 天周月粒度
        if ("1440".equals(caculateCycle) || "WK".equals(caculateCycle) || "MON".equals(caculateCycle)) {
            if ("S01".equals(serviceTime) && slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_1440")) {
                name = getExtTableName(slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_1440"),
                        this_spa);
               // return name;
            } 
            else if (("S02".equals(serviceTime) || "S03".equals(serviceTime)) && 
                    slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_60")) {
                name = getExtTableName(slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_60"),
                        this_spa);
               // return name;
            } 
        }
        //天以下小时以上粒度
        else if ((Integer.parseInt(caculateCycle) < 1440 && Integer.parseInt(caculateCycle) >= 60) && 
                slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_60")) {
            name = getExtTableName(slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_60"),
                    this_spa);
            //return name;
        }        
        //小时以下粒度
        else if (slmEntyExtInfoMap.containsKey(sliNoEntyTableCodeMap.get(sliNo) + "_5")) {
            name = getExtTableName(slmEntyExtInfoMap.get(sliNoEntyTableCodeMap.get(sliNo) + "_5"),
                        this_spa);
            //return name;
        }
        return name;
    }
}

