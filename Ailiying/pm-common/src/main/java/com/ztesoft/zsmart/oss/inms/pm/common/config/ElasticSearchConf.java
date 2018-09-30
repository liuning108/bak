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
public class ElasticSearchConf implements Serializable {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 2908184424109047696L;

    /**
     * serverList <br>
     */
    private String serverList;

    public String getServerList() {
        return serverList;
    }

    public void setServerList(String serverList) {
        this.serverList = serverList;
    }

}
