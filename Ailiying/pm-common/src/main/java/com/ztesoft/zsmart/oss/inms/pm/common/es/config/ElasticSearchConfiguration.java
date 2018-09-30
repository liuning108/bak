package com.ztesoft.zsmart.oss.inms.pm.common.es.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.alibaba.druid.util.StringUtils;

import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.inms.pm.common.es.constant.ElasticSearchConstant;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月27日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.config <br>
 */
@Configuration
public class ElasticSearchConfiguration {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ElasticSearchConfiguration.class);

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    @Bean(name = "esRestClient")
    public RestClient esRestClient() {
        String hostInfo = CommonHelper.getProperty(ElasticSearchConstant.ES_SERVER_LIST_KEY, false);

        if (StringUtils.isEmpty(hostInfo)) {
            hostInfo = ElasticSearchConstant.ES_SERVER_NAME_DEFAULT + ElasticSearchConstant.ES_COLON_SEP
                + ElasticSearchConstant.ES_SERVER_PORT_DEFAULT;
            LOG.warn(ElasticSearchConstant.ES_SERVER_LIST_KEY + " is Empty, use default hostInfo : " + hostInfo + "!");
        }

        List<String> hostStrList = Arrays.asList(hostInfo.split(ElasticSearchConstant.ES_COMMA_SEQ));

        int hostSize = hostStrList.size();

        List<HttpHost> hostList = new ArrayList<HttpHost>();
        for (int i = 0; i < hostSize; i++) {
            String[] tmpArr = hostStrList.get(i).split(ElasticSearchConstant.ES_COLON_SEP);
            if (tmpArr.length < 2) {
                LOG.warn("current hostInfo is incorrect: " + hostStrList.get(i) + " , will continue!");
                continue;
            }
            hostList.add(new HttpHost(tmpArr[0], Integer.parseInt(tmpArr[1])));
        }

        if (CollectionUtils.isEmpty(hostList)) {
            LOG.warn("none effective hostinfo, will use deault: " + hostInfo + "!");
            hostList.add(new HttpHost(ElasticSearchConstant.ES_SERVER_NAME_DEFAULT,
                ElasticSearchConstant.ES_SERVER_PORT_DEFAULT));
        }

        RestClient restClient = RestClient.builder(hostList.toArray(new HttpHost[hostList.size()])).build();
        return restClient;
    }
}
