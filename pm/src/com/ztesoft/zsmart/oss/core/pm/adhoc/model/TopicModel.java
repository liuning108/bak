package com.ztesoft.zsmart.oss.core.pm.adhoc.model;

import java.util.ArrayList;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;


/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sla.model <br>
 */
public class TopicModel {
    
    /**
     * slaNo <br>
     */
    private String slaNo;
    
    /**
     * slaName <br>
     */
    private String slaName;
    
    /**
     * seq <br>
     */
    private int seq;
    
    /**
     * slaType <br>
     */
    private String slaType;
    
    /**
     * slaClass <br>
     */
    private String slaClass;
    
    /**
     * serviceLevel <br>
     */
    private int serviceLevel;
    
    /**
     * evaluateCycle <br>
     */
    private String evaluateCycle;
    
    /**
     * effDate <br>
     */
    private String effDate;
    
    /**
     * expDate <br>
     */
    private String expDate;
    
    /**
     * state <br>
     */
    private String state;
    
    /**
     * description <br>
     */
    private String description;
    
    /**
     * rewardInfo <br>
     */
    private String rewardInfo;
    
    /**
     * punishInfo <br>
     */
    private String punishInfo;
    
    /**
     * specificDay <br>
     */
    private ArrayList<DynamicDict> specificDay;
    
    /**
     * scItem <br>
     */
    private ArrayList<DynamicDict> scItem;
    
    /**
     * slo <br>
     */
    private ArrayList<DynamicDict> slo;
    
    /**
     * pushAction <br>
     */
    private ArrayList<DynamicDict> pushAction;
    
    /**
     * staffId <br>
     */
    private String staffId;
    
    /**
     * staffJobId <br>
     */
    private String staffJobId;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getStaffId() {
        return staffId;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param staffId <br>
     */ 
    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getStaffJobId() {
        return staffJobId;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param staffJobId <br>
     */ 
    public void setStaffJobId(String staffJobId) {
        this.staffJobId = staffJobId;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSlaNo() {
        return slaNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaNo <br>
     */ 
    public void setSlaNo(String slaNo) {
        this.slaNo = slaNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSlaName() {
        return slaName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaName <br>
     */ 
    public void setSlaName(String slaName) {
        this.slaName = slaName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getSeq() {
        return seq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param seq <br>
     */ 
    public void setSeq(int seq) {
        this.seq = seq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSlaType() {
        return slaType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaType <br>
     */ 
    public void setSlaType(String slaType) {
        this.slaType = slaType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSlaClass() {
        return slaClass;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaClass <br>
     */ 
    public void setSlaClass(String slaClass) {
        this.slaClass = slaClass;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getServiceLevel() {
        return serviceLevel;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param serviceLevel <br>
     */ 
    public void setServiceLevel(int serviceLevel) {
        this.serviceLevel = serviceLevel;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getEvaluateCycle() {
        return evaluateCycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param evaluateCycle <br>
     */ 
    public void setEvaluateCycle(String evaluateCycle) {
        this.evaluateCycle = evaluateCycle;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getEffDate() {
        return effDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param effDate <br>
     */ 
    public void setEffDate(String effDate) {
        this.effDate = effDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getExpDate() {
        return expDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param expDate <br>
     */ 
    public void setExpDate(String expDate) {
        this.expDate = expDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getState() {
        return state;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param state <br>
     */ 
    public void setState(String state) {
        this.state = state;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDescription() {
        return description;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param description <br>
     */ 
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getRewardInfo() {
        return rewardInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param rewardInfo <br>
     */ 
    public void setRewardInfo(String rewardInfo) {
        this.rewardInfo = rewardInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getPunishInfo() {
        return punishInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param punishInfo <br>
     */ 
    public void setPunishInfo(String punishInfo) {
        this.punishInfo = punishInfo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public ArrayList<DynamicDict> getSpecificDay() {
        return specificDay;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param specificDay <br>
     */ 
    public void setSpecificDay(ArrayList<DynamicDict> specificDay) {
        this.specificDay = specificDay;
    }  
    
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public ArrayList<DynamicDict> getScItem() {
        return scItem;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param scItem <br>
     */ 
    public void setScItem(ArrayList<DynamicDict> scItem) {
        this.scItem = scItem;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public ArrayList<DynamicDict> getSlo() {
        return slo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slo <br>
     */ 
    public void setSlo(ArrayList<DynamicDict> slo) {
        this.slo = slo;
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */
    public ArrayList<DynamicDict> getPushAction() {
        return pushAction;
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param pushAction <br>
     */
    public void setPushAction(ArrayList<DynamicDict> pushAction) {
        this.pushAction = pushAction;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void init(DynamicDict dict) throws BaseAppException {
        setSlaNo((String) dict.getValueByName("SLA_NO", ""));
        setSlaName(dict.getString("SLA_NAME"));
        //setSeq(dict.getString("CATALOG_ID"));
        setSlaType(dict.getString("SLA_TYPE"));
        setSlaClass(dict.getString("SLA_CLASS"));
        setServiceLevel(Integer.parseInt(dict.getString("SERVICE_LEVEL")));
        setEvaluateCycle(dict.getString("EVALUATE_CYCLE"));
        setEffDate(dict.getString("EFF_DATE"));
        setExpDate(dict.getString("EXP_DATE"));
        setState(dict.getString("STATE"));
        setStaffId(SessionManage.getSession().getStaffId());
        setStaffJobId(SessionManage.getSession().getStaffId());
        setDescription(dict.getString("DESCRIPTION"));
        setRewardInfo(dict.getString("REWARD_INFO"));
        setPunishInfo(dict.getString("PUNISH_INFO"));
        //剔除日期
        ArrayList<DynamicDict> specificDay = (ArrayList<DynamicDict>) dict.getList("SPECIFIC_DAY");
        setSpecificDay(specificDay);
        //服务目标
        ArrayList<DynamicDict> slos = (ArrayList<DynamicDict>) dict.getList("SLOS");
        ArrayList<DynamicDict> sc_item = (ArrayList<DynamicDict>) dict.getList("SC_ITEM");
        setScItem(sc_item);
        setSlo(slos);
        //违约推送
        ArrayList<DynamicDict> pushAction = (ArrayList<DynamicDict>) dict.getList("PUSHACTION");
        setPushAction(pushAction);
    }   
}