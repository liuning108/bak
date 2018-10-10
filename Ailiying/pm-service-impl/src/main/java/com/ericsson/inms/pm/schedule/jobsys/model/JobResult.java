package com.ericsson.inms.pm.schedule.jobsys.model;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.job.model <br>
 */
public class JobResult {
    /**
     * allCount 待执行sql 个数<br>
     */
    private int allCount;
    /**
     * succCount 执行成功个数<br>
     */
    private int succCount;
    /**
     * state 0 成功/7 部分成功/3 完全失败<br>
     */
    private String state;
    /**
     * cause <br>
     */
    private String cause;

    /**
     * [方法描述] <br> 
     *  
     */
    public JobResult() {
        this.state = "0";
        this.cause = "";
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param state
     * @param all
     * @param succ
     * @param cause <br>
     */ 
    public JobResult(String state, int all, int succ, String cause) {
        this.state = state;
        this.cause = cause;
        this.allCount = all;
        this.succCount = succ;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public int getAllCount() {
        return allCount;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param allCount <br>
     */
    public void setAllCount(int allCount) {
        this.allCount = allCount;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public int getSuccCount() {
        return succCount;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param succCount <br>
     */
    public void setSuccCount(int succCount) {
        this.succCount = succCount;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getState() {
        return state;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param state <br>
     */
    public void setState(String state) {
        this.state = state;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getCause() {
        return cause;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param cause <br>
     */
    public void setCause(String cause) {
        this.cause = cause;
    }
}
