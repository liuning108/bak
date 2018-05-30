package com.ztesoft.zsmart.oss.itnms.parameter.dto;

import java.io.Serializable;

import com.ztesoft.zsmart.core.jdbc.api.BaseBean;

public class ParaMeterDto extends BaseBean implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = 6822265960036408759L;

    private String paraId;

    private String paraName;

    private String paraValue;

    private String paraFName;

    private String paraDesc;

    public String getParaId() {
        return paraId;
    }

    public void setParaId(String paraId) {
        this.paraId = paraId;
    }

    public String getParaName() {
        return paraName;
    }

    public void setParaName(String paraName) {
        this.paraName = paraName;
    }

    public String getParaValue() {
        return paraValue;
    }

    public void setParaValue(String paraValue) {
        this.paraValue = paraValue;
    }

    public String getParaFName() {
        return paraFName;
    }

    public void setParaFName(String paraFName) {
        this.paraFName = paraFName;
    }

    public String getParaDesc() {
        return paraDesc;
    }

    public void setParaDesc(String paraDesc) {
        this.paraDesc = paraDesc;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
