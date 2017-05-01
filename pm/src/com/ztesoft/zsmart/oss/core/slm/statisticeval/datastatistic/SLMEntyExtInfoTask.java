package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

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
public class SLMEntyExtInfoTask {

    /** 任务名称st_msc_5 */
    /**
     * jobName <br>
     */
    private String jobName;
    /** 任务分组 create_st_msc_group */
    /**
     * jobGroup <br>
     */
    private String jobGroup;
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
    /** 实体表编码 ENTY_TABLE_CODE */
    /**
     * entyTableCode <br>
     */
    private String entyTableCode;
    /** 计算周期:5/60/1440/wk/mon */
    /**
     * caculateCycle <br>
     */
    private String caculateCycle;
    /** 分表方式:不分表，天，月 */
    /**
     * crtTableMeth <br>
     */
    private String crtTableMeth;
    /** 接口表名称 */
    /**
     * interfaceTableCode <br>
     */
    private String interfaceTableCode;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param interfaceTableCode <br>
     */ 
    public void setinterfaceTableCode(String interfaceTableCode) {
        this.interfaceTableCode = interfaceTableCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobName <br>
     */ 
    public void setjobName(String jobName) {
        this.jobName = jobName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param jobGroup <br>
     */ 
    public void setjobGroup(String jobGroup) {
        this.jobGroup = jobGroup;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param entyID <br>
     */ 
    public void setentyID(String entyID) {
        this.entyID = entyID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param cronExpression <br>
     */ 
    public void setcronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param entyTableCode <br>
     */ 
    public void setentyTableCode(String entyTableCode) {
        this.entyTableCode = entyTableCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param caculateCycle <br>
     */ 
    public void setcaculateCycle(String caculateCycle) {
        this.caculateCycle = caculateCycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param crtTableMeth <br>
     */ 
    public void setcrtTableMeth(String crtTableMeth) {
        this.crtTableMeth = crtTableMeth;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getjobName() {
        return this.jobName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getjobGroup() {
        return this.jobGroup;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getentyID() {
        return this.entyID;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getcronExpression() {
        return this.cronExpression;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getentyTableCode() {
        return this.entyTableCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getcaculateCycle() {
        return this.caculateCycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getcrtTableMeth() {
        return this.crtTableMeth;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getinterfaceTableCode() {
        return this.interfaceTableCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String printJobInfo() {
        return ("\n jobName[" + jobName + "]\n jobGroup[" + jobGroup + "]\n entyID[" + entyID + "]\n"
                + " cronExpression[" + cronExpression + "]\n entyTableCode[" + entyTableCode + "]\n" + " caculateCycle["
                + caculateCycle + "]\n crtTableMeth[" + crtTableMeth + "]\n interfaceTableCode[" + interfaceTableCode
                + "]");
    }
}
