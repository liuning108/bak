package com.ericsson.inms.pm.schedule.jobsys.model;

/** 
 * [描述] 实例表 pm_task_inst 中信息<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.job.model <br>
 */
public class TaskInst {

    /**
     * btime <br>
     */
    private String btime;
    /**
     * etime <br>
     */
    private String etime;
    /**
     * taskNo <br>
     */
    private String taskNo;
    /**
     * taskID <br>
     */
    private String taskID;
    /**
     * taskName <br>
     */
    private String taskName;
    /**
     * taskType <br>
     */
    private String taskType;
    /**
     * taskServIP <br>
     */
    private String taskServIP;
    /**
     * taskServUser <br>
     */
    private String taskServUser;
    /**
     * taskState <br>
     */
    private String taskState = "1";
    /**
     * taskParam <br>
     */
    private String taskParam = "";
    /**
     * delayTime <br>
     */
    private int delayTime = 0;
    /**
     * taskCreateDate <br>
     */
    private String taskCreateDate;
    /**
     * taskExecDate <br>
     */
    private String taskExecDate;
    /**
     * taskFinishDate <br>
     */
    private String taskFinishDate;
    /**
     * taskExecDuration <br>
     */
    private long taskExecDuration = 0;
    /**
     * taskExecTimes <br>
     */
    private int taskExecTimes = 0;
    /**
     * taskExceptInfo <br>
     */
    private String taskExceptInfo = "";
    /**
     * cycleSchduleType <br>
     */
    private String cycleSchduleType;
    /**
     * taskNoVer <br>
     */
    private String taskNoVer;
    /**
     * machineNo <br>
     */
    private String machineNo;
    /**
     * extParamFlag <br>
     */
    private String extParamFlag = "1";
    /**
     * pieceSeq <br>
     */
    private int pieceSeq = -1;
    /**
     * taskAssignDate <br>
     */
    private String taskAssignDate;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getBtime() {
        return btime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param btime  <br>
     */
    public void setBtime(String btime) {
        this.btime = btime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getEtime() {
        return etime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param etime  <br>
     */
    public void setEtime(String etime) {
        this.etime = etime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskNo() {
        return taskNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNo  <br>
     */
    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskID() {
        return taskID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskID  <br>
     */
    public void setTaskID(String taskID) {
        this.taskID = taskID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskName() {
        return taskName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskName  <br>
     */
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskType() {
        return taskType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskType  <br>
     */
    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskServIP() {
        return taskServIP;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskServIP  <br>
     */
    public void setTaskServIP(String taskServIP) {
        this.taskServIP = taskServIP;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskServUser() {
        return taskServUser;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskServUser  <br>
     */
    public void setTaskServUser(String taskServUser) {
        this.taskServUser = taskServUser;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskState() {
        return taskState;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskState  <br>
     */
    public void setTaskState(String taskState) {
        this.taskState = taskState;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskParam() {
        return taskParam;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskParam  <br>
     */
    public void setTaskParam(String taskParam) {
        this.taskParam = taskParam;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getDelayTime() {
        return delayTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param delayTime  <br>
     */
    public void setDelayTime(int delayTime) {
        this.delayTime = delayTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskCreateDate() {
        return taskCreateDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskCreateDate  <br>
     */
    public void setTaskCreateDate(String taskCreateDate) {
        this.taskCreateDate = taskCreateDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskExecDate() {
        return taskExecDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskExecDate  <br>
     */
    public void setTaskExecDate(String taskExecDate) {
        this.taskExecDate = taskExecDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskFinishDate() {
        return taskFinishDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskFinishDate  <br>
     */
    public void setTaskFinishDate(String taskFinishDate) {
        this.taskFinishDate = taskFinishDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public long getTaskExecDuration() {
        return taskExecDuration;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskExecDuration  <br>
     */
    public void setTaskExecDuration(long taskExecDuration) {
        this.taskExecDuration = taskExecDuration;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getTaskExecTimes() {
        return taskExecTimes;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskExecTimes  <br>
     */
    public void setTaskExecTimes(int taskExecTimes) {
        this.taskExecTimes = taskExecTimes;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskExceptInfo() {
        return taskExceptInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskExceptInfo  <br>
     */
    public void setTaskExceptInfo(String taskExceptInfo) {
        this.taskExceptInfo = taskExceptInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getCycleSchduleType() {
        return cycleSchduleType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param cycleSchduleType  <br>
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
    public String getMachineNo() {
        return machineNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param machineNo  <br>
     */
    public void setMachineNo(String machineNo) {
        this.machineNo = machineNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getExtParamFlag() {
        return extParamFlag;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param extParamFlag  <br>
     */
    public void setExtParamFlag(String extParamFlag) {
        this.extParamFlag = extParamFlag;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskNoVer() {
        return taskNoVer;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskNoVer  <br>
     */
    public void setTaskNoVer(String taskNoVer) {
        this.taskNoVer = taskNoVer;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getPieceSeq() {
        return pieceSeq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param pieceSeq  <br>
     */
    public void setPieceSeq(int pieceSeq) {
        this.pieceSeq = pieceSeq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String toStr() {
        return taskNo + "|" + taskID + "|" + taskType + "|" + taskState + "|" + taskNoVer;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String toAllStr() {
        return btime + "|" + etime + "|" + taskNo + "|" + taskID + "|" + taskName + "|" + taskType + "|" + taskServIP
                + "|" + taskServUser + "|" + taskState + "|" + taskParam + "|" + delayTime + "|" + taskCreateDate + "|"
                + taskExecDate + "|" + taskFinishDate + "|" + taskExecDuration + "|" + taskExecTimes + "|"
                + taskExceptInfo + "|" + cycleSchduleType + "|" + taskNoVer + "|" + machineNo + "|" + extParamFlag + "|"
                + pieceSeq + "|" + taskAssignDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public String getTaskAssignDate() {
        return taskAssignDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param taskAssignDate  <br>
     */
    public void setTaskAssignDate(String taskAssignDate) {
        this.taskAssignDate = taskAssignDate;
    }

}
