package com.ztesoft.zsmart.oss.core.slm.adaptationlayerstatistics;
/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月12日 <br>
 * @since V7.0<br>
 * @see <br>
 */
public class SlmStDevfault {

    /**
     * btime <br>
     */
    String btime;
    /**
     * etime <br>
     */
    String etime;
    /**
     * inserttime <br>
     */
    String inserttime;
    /**
     * wk <br>
     */
    int wk;
    /**
     * hh <br>
     */
    int hh;
    /**
     * mi <br>
     */
    int mi;
    /**
     * participantNO <br>
     */
    String participantNO;

    /**
     * ppb1000001 <br>
     */
    long ppb1000001;

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
    public String getInserttime() {
        return inserttime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param inserttime <br>
     */ 
    public void setInserttime(String inserttime) {
        this.inserttime = inserttime;
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
    public String getParticipantNO() {
        return participantNO;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param participantNO <br>
     */ 
    public void setParticipantNO(String participantNO) {
        this.participantNO = participantNO;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public long getppb1000001() {
        return ppb1000001;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ppb1000001 <br>
     */ 
    public void setppb1000001(long ppb1000001) {
        this.ppb1000001 = ppb1000001;
    }

    /**
     * [方法描述] 获取数据的字符串<br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getString() {
        return btime + "," + etime + "," + inserttime + "," + wk + "," + hh + "," + mi + "," + participantNO + "," + ppb1000001;
    }

    /**
     * [方法描述] 返回各个元素的字符串数组<br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String[] getStrings() {
        String str[] = {"", "", "", "", "", "", "", ""};
        str[0] = btime;
        str[1] = etime;
        str[2] = inserttime;
        str[3] = "0";
        str[4] = "0";
        str[5] = "0";
        str[6] = participantNO;
        str[7] = "" + ppb1000001;
        return str;
    }
    
}
