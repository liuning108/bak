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
public class KafkaConf implements Serializable {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 6331645912891128122L;

    /**
     * serverList <br>
     */
    private String serverList;

    /**
     * zkAddr <br>
     */
    private String zkCluster;

    public String getZkCluster() {
        return zkCluster;
    }

    public void setZkCluster(String zkCluster) {
        this.zkCluster = zkCluster;
    }

    public String getServerList() {
        return serverList;
    }

    public void setServerList(String serverList) {
        this.serverList = serverList;
    }
}
