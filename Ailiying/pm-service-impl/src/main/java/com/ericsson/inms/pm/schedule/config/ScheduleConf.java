package com.ericsson.inms.pm.schedule.config;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月13日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.common.config <br>
 */
public class ScheduleConf {
    /**
     * pieceNum 分片个数<br>
     */
    private int pieceNum;
    /**
     * assignTaskFrequency 分配任务时间间隔 min<br>
     */
    private int assignTaskFrequency;
    /**
     * executeTaskFrequency 执行任务时间间隔 min<br>
     */
    private int executeTaskFrequency;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getPieceNum() {
        return pieceNum;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param pieceNum  <br>
     */
    public void setPieceNum(int pieceNum) {
        this.pieceNum = pieceNum;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getAssignTaskFrequency() {
        return assignTaskFrequency;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param assignTaskFrequency  <br>
     */
    public void setAssignTaskFrequency(int assignTaskFrequency) {
        this.assignTaskFrequency = assignTaskFrequency;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getExecuteTaskFrequency() {
        return executeTaskFrequency;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param executeTaskFrequency  <br>
     */
    public void setExecuteTaskFrequency(int executeTaskFrequency) {
        this.executeTaskFrequency = executeTaskFrequency;
    }

}
