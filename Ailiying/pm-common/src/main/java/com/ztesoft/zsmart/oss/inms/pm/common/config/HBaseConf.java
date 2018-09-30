package com.ztesoft.zsmart.oss.inms.pm.common.config;

import java.io.Serializable;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月4日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.common.config <br>
 */
public class HBaseConf implements Serializable {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = -7302718523508458359L;

    /**
     * zkCluster <br>
     */
    private String zkCluster;

    public String getZkCluster() {
        return zkCluster;
    }

    public void setZkCluster(String zkCluster) {
        this.zkCluster = zkCluster;
    }
}
