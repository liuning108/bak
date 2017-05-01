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
public class SLMEntyInfo {
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
    /** 分表方式:不分表，天，月 */
    /**
     * crtTableMeth <br>
     */
    private String crtTableMeth;
    /** 计算周期 60min以下/60/1440/wk/mon */
    /**
     * caculateCycle <br>
     */
    private String caculateCycle;

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
    public String printJobInfo() {
        return ("\n entyID[" + entyID + "]\n entyTableCode[" + entyTableCode + "]\n crtTableMeth[" + crtTableMeth
                + "]\n caculateCycle[" + caculateCycle + "]");
    }
}
