package com.ztesoft.zsmart.oss.core.pm.adhoc.model;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;


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
public class TopicClassModel {
        
    /**
     * classNO <br>
     */
    private String classNO;
    
    /**
     * className <br>
     */
    private String className;

    /**
     * seq <br>
     */
    private String seq;

    /**
     * operUser <br>
     */
    private String operUser;

    /**
     * operDate <br>
     */
    private String operDate;

    /**
     * bpId <br>
     */
    private String bpId;

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getClassNO() {
        return classNO;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param classNO <br>
     */ 
    public void setClassNO(String classNO) {
        this.classNO = classNO;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getClassName() {
        return className;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param className <br>
     */ 
    public void setClassName(String className) {
        this.className = className;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getSeq() {
        return seq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param seq <br>
     */ 
    public void setSeq(String seq) {
        this.seq = seq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getOperUser() {
        return operUser;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param operUser <br>
     */ 
    public void setOperUser(String operUser) {
        this.operUser = operUser;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getOperDate() {
        return operDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param operDate <br>
     */ 
    public void setOperDate(String operDate) {
        this.operDate = operDate;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getBpId() {
        return bpId;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param bpId <br>
     */ 
    public void setBpId(String bpId) {
        this.bpId = bpId;
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
        setClassNO(dict.getString("CLASS_NO"));
        setClassName(dict.getString("CLASS_NAME"));
        setSeq(dict.getString("SEQ"));
        setOperUser(dict.getString("OPER_USER"));
        setOperDate(dict.getString("OPER_DATE"));
        setBpId(dict.getString("BP_ID"));
    }
}