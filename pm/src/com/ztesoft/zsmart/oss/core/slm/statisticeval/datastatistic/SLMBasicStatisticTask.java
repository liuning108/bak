package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import java.util.HashMap;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

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
public class SLMBasicStatisticTask {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(SLMBasicStatisticTask.class.getName());

    /** 任务名称 :st_msc_5_eval_201608171000_201608171005 */
    /**
     * jobName <br>
     */
    private String jobName;
    
    /** 任务组:statistic_st_msc_group */
    /**
     * jobGroup <br>
     */
    private String jobGroup;
    
    /** 任务状态: 0 未执行 1 已执行 2 执行异常 3 重算 */
    /**
     * jobStatus <br>
     */
    private String jobStatus;
    
    /** 任务运行时间表达式 */
    /**
     * cronExpression <br>
     */
    private String cronExpression;
    
    /** 实体ID */
    /**
     * entyID <br>
     */
    private String entyID;
    
    /** 目标表名称:st_msc_5_20160817 */
    /**
     * dstTableName <br>
     */
    private String dstTableName;
    
    /** 计算周期:5/60/1440/wk/mon */
    /**
     * caculateCycle <br>
     */
    private String caculateCycle;
    
    /** 统计数据开始时间 :2016-08-17 10:00:00 */
    /**
     * btime <br>
     */
    private String btime;
    
    /** 统计数据结束时间 :2016-08-17 10:05:00 */
    /**
     * etime  <br>
     */
    private String etime;
    
    /** 执行时间 */
    /**
     * executeTime <br>
     */
    private String executeTime;
    
    /** 任务插入时间 */
    /**
     * insertTime <br>
     */
    private String insertTime;
    
    /** 接口表的计算周期 */
    /**
     * interfacecaculatecycle <br>
     */
    private String interfacecaculatecycle;
    /* 除5分钟统计外的所有汇聚的源表，size>1则需要union */
    /**
     * srcTableMap <br>
     */
    public HashMap<String, TimePeriod> srcTableMap = new HashMap<String, TimePeriod>();

    /**
     * HH <br>
     */
    private int hh;

    /**
     * MI <br>
     */
    private int mi;
    /* 周1-7 值为1-7 */
    /**
     * WK <br>
     */
    private int wk;
    
    /**
     * kpis 指标的算法<br>
     */
    private String kpis;

    /**
     * kpis_code 指标组<br>
     */
    private String kpisCode;
    
    /**
     * dims 维度默认前带,<br>
     */
    private String dims;
    
    /**
     * groupDims dims 维度默认前不带,用于group by <br>
     */
    private String groupDims;
    
    /**
     * from 源表组<br>
     */
    private String from;
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    SLMBasicStatisticTask() {
        this.hh = 0;
        this.mi = 0;
        this.wk = 0;
        
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void printJobInfo() {
        logger.debug("\n jobName[" + jobName + "]\n jobGroup[" + jobGroup + "]\n jobStatus[" + jobStatus + "]\n"
                + " cronExpression[" + cronExpression + "]\n entyID[" + entyID + "]\n " + " dstTableName["
                + dstTableName + "]\n caculateCycle[" + caculateCycle + "]\n btime[" + btime + "]\n etime[" + etime
                + "]\n executeTime[" + executeTime + "]\n insertTime[" + insertTime + "]\n srcTableMap_size["
                + srcTableMap.size() + "]\n interfacecaculatecycle[" + interfacecaculatecycle + "]\n WK[" + wk
                + "]\n HH[" + hh + "]\n MI[" + mi + "]");
        for (Entry<String, TimePeriod> entry : srcTableMap.entrySet()) {
            logger.debug("source table[" + entry.getKey() + "]-[" + entry.getValue().getbtime() + "]-["
                    + entry.getValue().getetime() + "]");
        }

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getJobName() {
        return jobName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobName <br>
     */ 
    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getJobGroup() {
        return jobGroup;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobGroup <br>
     */ 
    public void setJobGroup(String jobGroup) {
        this.jobGroup = jobGroup;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getJobStatus() {
        return jobStatus;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobStatus <br>
     */ 
    public void setJobStatus(String jobStatus) {
        this.jobStatus = jobStatus;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getCronExpression() {
        return cronExpression;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param cronExpression <br>
     */ 
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getEntyID() {
        return entyID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param entyID <br>
     */ 
    public void setEntyID(String entyID) {
        this.entyID = entyID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDstTableName() {
        return dstTableName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dstTableName <br>
     */ 
    public void setDstTableName(String dstTableName) {
        this.dstTableName = dstTableName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getCaculateCycle() {
        return caculateCycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param caculateCycle <br>
     */ 
    public void setCaculateCycle(String caculateCycle) {
        this.caculateCycle = caculateCycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getBtime() {
        return btime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param btime <br>
     */ 
    public void setBtime(String btime) {
        this.btime = btime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getEtime() {
        return etime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param etime <br>
     */ 
    public void setEtime(String etime) {
        this.etime = etime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getExecuteTime() {
        return executeTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param executeTime <br>
     */ 
    public void setExecuteTime(String executeTime) {
        this.executeTime = executeTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getInsertTime() {
        return insertTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param insertTime <br>
     */ 
    public void setInsertTime(String insertTime) {
        this.insertTime = insertTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getInterfacecaculatecycle() {
        return interfacecaculatecycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param interfacecaculatecycle <br>
     */ 
    public void setInterfacecaculatecycle(String interfacecaculatecycle) {
        this.interfacecaculatecycle = interfacecaculatecycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public HashMap<String, TimePeriod> getSrcTableMap() {
        return srcTableMap;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param srcTableMap <br>
     */ 
    public void setSrcTableMap(HashMap<String, TimePeriod> srcTableMap) {
        this.srcTableMap = srcTableMap;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getHh() {
        return hh;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param hh <br>
     */ 
    public void setHh(int hh) {
        this.hh = hh;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getMi() {
        return mi;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param mi <br>
     */ 
    public void setMi(int mi) {
        this.mi = mi;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getWk() {
        return wk;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param wk <br>
     */ 
    public void setWk(int wk) {
        this.wk = wk;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getKpis() {
        return kpis;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param kpis <br>
     */ 
    public void setKpis(String kpis) {
        this.kpis = kpis;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getKpisCode() {
        return kpisCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param kpisCode <br>
     */ 
    public void setKpisCode(String kpisCode) {
        this.kpisCode = kpisCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDims() {
        return dims;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dims <br>
     */ 
    public void setDims(String dims) {
        this.dims = dims;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getGroupDims() {
        return groupDims;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param groupDims <br>
     */ 
    public void setGroupDims(String groupDims) {
        this.groupDims = groupDims;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFrom() {
        return from;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param from <br>
     */ 
    public void setFrom(String from) {
        this.from = from;
    }


}
