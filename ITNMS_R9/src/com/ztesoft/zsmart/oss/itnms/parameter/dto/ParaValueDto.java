package com.ztesoft.zsmart.oss.itnms.parameter.dto;

import java.io.Serializable;

import com.ztesoft.zsmart.core.jdbc.api.BaseBean;

public class ParaValueDto extends BaseBean implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 915479564849754396L;

    private String paraId;

    private String paraValue;

    private Integer paraOrder;

    private String paraName;

    private String paraFName;

    private String paraDesc;

    private String paraNameCn;

    public String getParaId() {
        return paraId;
    }

    public void setParaId(String paraId) {
        this.paraId = paraId;
    }

    public String getParaValue() {
        return paraValue;
    }

    public void setParaValue(String paraValue) {
        this.paraValue = paraValue;
    }

    public Integer getParaOrder() {
        return paraOrder;
    }

    public void setParaOrder(Integer paraOrder) {
        this.paraOrder = paraOrder;
    }

    public String getParaName() {
        return paraName;
    }

    public void setParaName(String paraName) {
        this.paraName = paraName;
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

    public String getParaNameCn() {
        return paraNameCn;
    }

    public void setParaNameCn(String paraNameCn) {
        this.paraNameCn = paraNameCn;
    }

}
