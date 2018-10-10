package com.ericsson.inms.pm.schedule.jobsys.model;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月31日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.jobsys.model <br>
 */
public class TaskParamVer {
    /**
     * paramType <br>
     */
    private String paramType = "";
    /**
     * taskNo <br>
     */
    private String taskNo;
    /**
     * taskNoVer <br>
     */
    private String taskNoVer;
    /**
     * paramSeq <br>
     */
    private int paramSeq;
    /**
     * taskParam <br>
     */
    private String taskParam;
    /**
     * rectime <br>
     */
    private String rectime;
    /**
     * cycleSchduleType <br>
     */
    private String cycleSchduleType;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param paramType
     * @param taskNo
     * @param taskNoVer
     * @param paramSeq
     * @param taskParam
     * @param rectime
     * @param cycleSchduleType  <br>
     */
    public TaskParamVer(String paramType, String taskNo, String taskNoVer, int paramSeq, String taskParam,
            String rectime, String cycleSchduleType) {
        this.paramType = paramType;
        this.taskNo = taskNo;
        this.taskNoVer = taskNoVer;
        this.paramSeq = paramSeq;
        this.taskParam = taskParam;
        this.rectime = rectime;
        this.cycleSchduleType = cycleSchduleType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param object  <br>
     */ 
    public TaskParamVer(TaskParamVer object) {
        this.paramType = object.paramType;
        this.taskNo = object.taskNo;
        this.taskNoVer = object.taskNoVer;
        this.paramSeq = object.paramSeq;
        this.taskParam = object.taskParam;
        this.rectime = object.rectime;
        this.cycleSchduleType = object.cycleSchduleType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>  <br>
     */
    public TaskParamVer() {

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public String getParamType() {
        return paramType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public String getTaskNo() {
        return taskNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public String getTaskNoVer() {
        return taskNoVer;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public int getParamSeq() {
        return paramSeq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public String getTaskParam() {
        return taskParam;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public String getRectime() {
        return rectime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public String getCycleSchduleType() {
        return cycleSchduleType;
    }

    /**
     * [方法描述] taskType - paramType 对应关系 = 06-O|03-W|00-E|01-C/L<br> 
     *  
     * @author [作者名]<br>
     * @param paramType <br>
     */
    public void setParamType(String paramType) {
        this.paramType = paramType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNo <br>
     */
    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNoVer <br>
     */
    public void setTaskNoVer(String taskNoVer) {
        this.taskNoVer = taskNoVer;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param paramSeq <br>
     */
    public void setParamSeq(int paramSeq) {
        this.paramSeq = paramSeq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskParam <br>
     */
    public void setTaskParam(String taskParam) {
        this.taskParam = taskParam;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param rectime <br>
     */
    public void setRectime(String rectime) {
        this.rectime = rectime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param cycleSchduleType <br>
     */
    public void setCycleSchduleType(String cycleSchduleType) {
        this.cycleSchduleType = cycleSchduleType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */ 
    public String toAllStr() {
        return paramType + "|" + taskNo + "|" + taskNoVer + "|" + paramSeq + "|" + taskParam + "|" + rectime + "|"
                + cycleSchduleType;
    }
}
