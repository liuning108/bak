/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.test.dto;

import com.ztesoft.zsmart.oss.opb.framework.dto.OpbBaseDto;

/**
 * <Description> <br>
 * 
 * @author zhu.dajiang<br>
 * @version 9.0<br>
 * @taskId <br>
 * @CreateDate 2018年3月28日 <br>
 * @since JDK1.8<br>
 * @see com.test.dto <br>
 */
public class TestDto extends OpbBaseDto {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = -6225775108640146324L;

    /**
     * errCode
     */
    private int errCode;

    /**
     * msg
     */
    private String msg;

    /** 
     *  
     */
    public TestDto() {
    }

    /**
     * Description: <br>
     * 
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @return errCode <br>
     */
    public int getErrCode() {
        return errCode;
    }

    /**
     * Description: <br>
     * 
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param errCode <br>
     */
    public void setErrCode(int errCode) {
        this.errCode = errCode;
    }

    /**
     * Description: <br>
     * 
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @return msg <br>
     */
    public String getMsg() {
        return msg;
    }

    /**
     * Description: <br>
     * 
     * @author zhu.dajiang<br>
     * @taskId <br>
     * @param msg <br>
     */
    public void setMsg(String msg) {
        this.msg = msg;
    }

}
