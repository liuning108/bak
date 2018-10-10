package com.ericsson.inms.pm.utils;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年8月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.core.pm.tool <br>
 */
public class StatTimeDetail {
    /**
     * sttime <br>
     */
    private String sttime = "";
    /**
     * hh <br>
     */
    private String hh = "00";
    /**
     * mi <br>
     */
    private String mi = "00";

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSttime() {
        return sttime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sttime <br>
     */ 
    public void setSttime(String sttime) {
        this.sttime = sttime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getHh() {
        return hh;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param hh <br>
     */ 
    public void setHh(String hh) {
        this.hh = hh;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getMi() {
        return mi;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param mi <br>
     */ 
    public void setMi(String mi) {
        this.mi = mi;
    }

}
