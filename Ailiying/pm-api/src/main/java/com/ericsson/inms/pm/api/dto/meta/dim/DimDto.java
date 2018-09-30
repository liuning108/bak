package com.ericsson.inms.pm.api.dto.meta.dim;

import java.util.List;

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
public class DimDto extends OpbBaseDto {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = -2785729014530688410L;

    /**
     * dimName <br>
     */
    private String dimName;

    /**
     * dimCode <br>
     */
    private String dimCode;

    /**
     * dimDisp <br>
     */
    private Integer dimDisp;

    /**
     * dimDesc <br>
     */
    private String dimDesc;

    /**
     * bpId <br>
     */
    private String bpId;
    
    /**
     * scriptList <br>
     */
    private List<DimScriptDto> scriptList;

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public List<DimScriptDto> getScriptList() {
        return scriptList;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param scriptList <br>
     */ 
    public void setScriptList(List<DimScriptDto> scriptList) {
        this.scriptList = scriptList;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDimName() {
        return dimName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dimName <br>
     */ 
    public void setDimName(String dimName) {
        this.dimName = dimName;
    }

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
    public Integer getDimDisp() {
        return dimDisp;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dimDisp <br>
     */ 
    public void setDimDisp(Integer dimDisp) {
        this.dimDisp = dimDisp;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDimDesc() {
        return dimDesc;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dimDesc <br>
     */ 
    public void setDimDesc(String dimDesc) {
        this.dimDesc = dimDesc;
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
