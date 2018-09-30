package com.ericsson.inms.pm.api.dto.meta.dim;

import com.ztesoft.zsmart.oss.opb.base.dto.OpbBaseDto;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.dto <br>
 */
public class DimScriptDto extends OpbBaseDto {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 8386760749565163478L;

    /**
     * dimCode <br>
     */
    private String dimCode;

    /**
     * scriptType <br>
     */
    private String scriptType;

    /**
     * dimScript <br>
     */
    private String dimScript;

    /**
     * dimScriptNo <br>
     */
    private Integer dimScriptNo;

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
    public String getDimCode() {
        return dimCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dimCode <br>
     */ 
    public void setDimCode(String dimCode) {
        this.dimCode = dimCode;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getScriptType() {
        return scriptType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param scriptType <br>
     */ 
    public void setScriptType(String scriptType) {
        this.scriptType = scriptType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDimScript() {
        return dimScript;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dimScript <br>
     */ 
    public void setDimScript(String dimScript) {
        this.dimScript = dimScript;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Integer getDimScriptNo() {
        return dimScriptNo;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dimScriptNo <br>
     */ 
    public void setDimScriptNo(Integer dimScriptNo) {
        this.dimScriptNo = dimScriptNo;
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
}
