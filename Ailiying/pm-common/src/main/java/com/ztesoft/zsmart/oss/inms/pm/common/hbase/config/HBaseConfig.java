package com.ztesoft.zsmart.oss.inms.pm.common.hbase.config;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HConstants;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ztesoft.zsmart.oss.inms.pm.common.hbase.constant.HBaseConstant;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.common.hbase.config <br>
 */
@Configuration
public class HBaseConfig {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "hbaseConfiguration")
    public org.apache.hadoop.conf.Configuration hbaseConfiguration() {
        org.apache.hadoop.conf.Configuration configuration = HBaseConfiguration.create();

        // 设置configuration参数
        String zkCluster = CommonHelper.getProperty(HBaseConstant.HBASE_CLUSTER_KEY, false);
        if (StringUtils.isEmpty(zkCluster)) {
            zkCluster = "127.0.0.1:2181";
        }
        configuration.set(HConstants.ZOOKEEPER_QUORUM, zkCluster);

        String clientPause = CommonHelper.getProperty(HBaseConstant.HBASE_CLIENT_PAUSE_KEY, false);
        if (StringUtils.isNotEmpty(clientPause)) {
            configuration.set(HConstants.HBASE_CLIENT_PAUSE, clientPause);
        }

        String clientRetryNum = CommonHelper.getProperty(HBaseConstant.HBASE_CLIENT_RETRY_NUMBER_KEY, false);
        if (StringUtils.isNotEmpty(clientRetryNum)) {
            configuration.set(HConstants.HBASE_CLIENT_RETRIES_NUMBER, clientRetryNum);
        }

        String rpcTimeout = CommonHelper.getProperty(HBaseConstant.HBASE_RPC_TIMEOUT_KEY, false);
        if (StringUtils.isNotEmpty(rpcTimeout)) {
            configuration.set(HConstants.HBASE_RPC_TIMEOUT_KEY, rpcTimeout);
        }

        String clientOperTimeout = CommonHelper.getProperty(HBaseConstant.HBASE_CLIENT_OPER_TIMEOUT_KEY, false);
        if (StringUtils.isNotEmpty(clientOperTimeout)) {
            configuration.set(HConstants.HBASE_CLIENT_OPERATION_TIMEOUT, clientOperTimeout);
        }

        String clientScanTimeoutPeriod = CommonHelper.getProperty(HBaseConstant.HBASE_CLIENT_SCAN_TIMEOUT_PERIOD_KEY,
            false);
        if (StringUtils.isNotEmpty(clientScanTimeoutPeriod)) {
            configuration.set(HConstants.HBASE_CLIENT_SCANNER_TIMEOUT_PERIOD, clientScanTimeoutPeriod);
        }
        configuration.set("fs.file.impl", org.apache.hadoop.fs.LocalFileSystem.class.getName());
        return configuration;
    }

}
