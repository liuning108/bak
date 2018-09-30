package com.ztesoft.zsmart.oss.inms.pm.jobsys.model;

import java.io.Serializable;

/** 
 * [描述] 实例表 pm_task_inst 中信息<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.job.model <br>
 */
public class TaskInst implements Serializable {
    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    private String btime;
    private String etime;
    private String taskNo;
    private String taskID;
    private String taskName;
    private String taskType;
    private String taskServIP;
    private String taskServUser;
    private String taskState = "1";
    private String taskParam = "";
    private int delayTime = 0;
    private String taskCreateDate;
    private String taskExecDate;
    private String taskFinishDate;
    private long taskExecDuration = 0;
    private int taskExecTimes = 0;
    private String taskExceptInfo = "";
    private String cycleSchduleType;
    private String taskNoVer;
    private String machineNo;
    private String extParamFlag = "1";
    private int pieceSeq = -1;
    private String taskAssignDate;

    public String getBtime() {
        return btime;
    }

    public void setBtime(String btime) {
        this.btime = btime;
    }

    public String getEtime() {
        return etime;
    }

    public void setEtime(String etime) {
        this.etime = etime;
    }

    public String getTaskNo() {
        return taskNo;
    }

    public void setTaskNo(String taskNo) {
        this.taskNo = taskNo;
    }

    public String getTaskID() {
        return taskID;
    }

    public void setTaskID(String taskID) {
        this.taskID = taskID;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public String getTaskServIP() {
        return taskServIP;
    }

    public void setTaskServIP(String taskServIP) {
        this.taskServIP = taskServIP;
    }

    public String getTaskServUser() {
        return taskServUser;
    }

    public void setTaskServUser(String taskServUser) {
        this.taskServUser = taskServUser;
    }

    public String getTaskState() {
        return taskState;
    }

    public void setTaskState(String taskState) {
        this.taskState = taskState;
    }

    public String getTaskParam() {
        return taskParam;
    }

    public void setTaskParam(String taskParam) {
        this.taskParam = taskParam;
    }

    public int getDelayTime() {
        return delayTime;
    }

    public void setDelayTime(int delayTime) {
        this.delayTime = delayTime;
    }

    public String getTaskCreateDate() {
        return taskCreateDate;
    }

    public void setTaskCreateDate(String taskCreateDate) {
        this.taskCreateDate = taskCreateDate;
    }

    public String getTaskExecDate() {
        return taskExecDate;
    }

    public void setTaskExecDate(String taskExecDate) {
        this.taskExecDate = taskExecDate;
    }

    public String getTaskFinishDate() {
        return taskFinishDate;
    }

    public void setTaskFinishDate(String taskFinishDate) {
        this.taskFinishDate = taskFinishDate;
    }

    public long getTaskExecDuration() {
        return taskExecDuration;
    }

    public void setTaskExecDuration(long taskExecDuration) {
        this.taskExecDuration = taskExecDuration;
    }

    public int getTaskExecTimes() {
        return taskExecTimes;
    }

    public void setTaskExecTimes(int taskExecTimes) {
        this.taskExecTimes = taskExecTimes;
    }

    public String getTaskExceptInfo() {
        return taskExceptInfo;
    }

    public void setTaskExceptInfo(String taskExceptInfo) {
        this.taskExceptInfo = taskExceptInfo;
    }

    public String getCycleSchduleType() {
        return cycleSchduleType;
    }

    public void setCycleSchduleType(String cycleSchduleType) {
        this.cycleSchduleType = cycleSchduleType;
    }

    public String getMachineNo() {
        return machineNo;
    }

    public void setMachineNo(String machineNo) {
        this.machineNo = machineNo;
    }

    public String getExtParamFlag() {
        return extParamFlag;
    }

    public void setExtParamFlag(String extParamFlag) {
        this.extParamFlag = extParamFlag;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public String getTaskNoVer() {
        return taskNoVer;
    }

    public void setTaskNoVer(String taskNoVer) {
        this.taskNoVer = taskNoVer;
    }

    public int getPieceSeq() {
        return pieceSeq;
    }

    public void setPieceSeq(int pieceSeq) {
        this.pieceSeq = pieceSeq;
    }

    public String toStr() {
        return taskNo + "|" + taskID + "|" + taskType + "|" + taskState + "|" + taskNoVer;
    }

    public String toAllStr() {
        return btime + "|" + etime + "|" + taskNo + "|" + taskID + "|" + taskName + "|" + taskType + "|" + taskServIP
                + "|" + taskServUser + "|" + taskState + "|" + taskParam + "|" + delayTime + "|" + taskCreateDate + "|"
                + taskExecDate + "|" + taskFinishDate + "|" + taskExecDuration + "|" + taskExecTimes + "|"
                + taskExceptInfo + "|" + cycleSchduleType + "|" + taskNoVer + "|" + machineNo + "|" + extParamFlag + "|"
                + pieceSeq + "|" + taskAssignDate;
    }

    public String getTaskAssignDate() {
        return taskAssignDate;
    }

    public void setTaskAssignDate(String taskAssignDate) {
        this.taskAssignDate = taskAssignDate;
    }

}
