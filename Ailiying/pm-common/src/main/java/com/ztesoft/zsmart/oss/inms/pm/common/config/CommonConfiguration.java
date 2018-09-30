package com.ztesoft.zsmart.oss.inms.pm.common.config;

import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dangdang.ddframe.job.reg.base.CoordinatorRegistryCenter;
import com.dangdang.ddframe.job.reg.zookeeper.ZookeeperConfiguration;
import com.dangdang.ddframe.job.reg.zookeeper.ZookeeperRegistryCenter;

import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;

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
@Configuration
public class CommonConfiguration {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "pmKafkaConf")
    public KafkaConf pmKafakaConfiguration() {
        KafkaConf kafka = new KafkaConf();
        kafka.setServerList(CommonHelper.getProperty(CommonConstant.PM_KAFKA_BOOTSTRAP_SERVER, false));
        kafka.setZkCluster(CommonHelper.getProperty(CommonConstant.PM_KAFKA_ZOOKEEPER_ADDRESS, false));

        return kafka;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "pmRedisConf")
    public RedisConf pmRedisConfiguration() {
        RedisConf redis = new RedisConf();
        redis.setServerList(CommonHelper.getProperty(CommonConstant.PM_REDIS_SERVER_LIST, false));
        return redis;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "pmZkConf")
    public ZookeeperConf pmZookeeperConfiguration() {
        ZookeeperConf zk = new ZookeeperConf();
        zk.setServerList(CommonHelper.getProperty(CommonConstant.PM_ZOOKEEPER_SERVER_LIST, false));

        return zk;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "pmHBaseConf")
    public HBaseConf pmHBaseConfiguration() {
        HBaseConf hbase = new HBaseConf();
        hbase.setZkCluster(CommonHelper.getProperty(CommonConstant.PM_HBASE_ZOOKEEPER_CLUSTER));
        return hbase;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "pmESConf")
    public ElasticSearchConf pmElasticSearchConfiguration() {
        ElasticSearchConf esConf = new ElasticSearchConf();
        esConf.setServerList(CommonHelper.getProperty(CommonConstant.PM_ES_SERVER_LIST));
        return esConf;
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @return  <br>
     */ 
    @Bean(name = "pmTaskZKRegistryCenter")
    public CoordinatorRegistryCenter jobZKRegistryCenter() {
        String zkCluster = CommonHelper.getProperty(CommonConstant.PM_EJ_ZK_CLUSTER_KEY);
        String regNamespace = CommonHelper.getProperty(CommonConstant.PM_EJ_ZK_NAMESPACE, false);
        if (StringUtils.isEmpty(regNamespace)) {
            regNamespace = "inms-pm-distribute-task";
        }
        CoordinatorRegistryCenter regCenter = new ZookeeperRegistryCenter(
            new ZookeeperConfiguration(zkCluster, regNamespace));
        regCenter.init();
        return regCenter;
    }
}
