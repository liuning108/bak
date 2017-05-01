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
public class TimePeriod {
    /**
     * btime <br>
     */
    String btime;
    /**
     * etime <br>
     */
    String etime;

    /** b e
     * @param b  
     * @param e  
     */ 
    public TimePeriod(String b, String e) {
        this.btime = b;
        this.etime = e;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param b <br>
     */ 
    public void setbtime(String b) {
        this.btime = b;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param e <br>
     */ 
    public void setetime(String e) {
        this.etime = e;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getbtime() {
        return this.btime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getetime() {
        return this.etime;
    }
}