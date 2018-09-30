package com.ztesoft.zsmart.oss.inms.pm.utils;

import java.io.IOException;
import java.util.Collections;

import org.apache.http.HttpEntity;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;

import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.inms.pm.common.es.constant.ElasticSearchConstant;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018Äê8ÔÂ10ÈÕ <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.utils <br>
 */
public abstract class ElasticSearchUtil {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ElasticSearchUtil.class);

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param idx String
     * @return <br>
     */
    public static boolean isIndexExist(String idx) {
        Response response = null;
        try {
            response = ((RestClient) SpringContext.getBean("esRestClient"))
                .performRequest(ElasticSearchConstant.MethodType.HEAD, idx, Collections.emptyMap());
            return "OK".equals(response.getStatusLine().getReasonPhrase());
        }
        catch (IOException e) {
            LOG.error(e);
        }
        return false;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param idxName String
     * @param entity HttpEntity
     * @return Response
     * @throws Exception <br>
     */
    public static Response buildIndex(String idxName, HttpEntity entity) throws Exception {
        return ((RestClient) (SpringContext.getBean("esRestClient")))
            .performRequest(ElasticSearchConstant.MethodType.PUT, idxName, Collections.emptyMap(), entity);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param idxName String
     * @return Response
     * @throws Exception <br>
     */
    public static Response deleteIndex(String idxName) throws Exception {
        return ((RestClient) (SpringContext.getBean("esRestClient")))
            .performRequest(ElasticSearchConstant.MethodType.DELETE, idxName, Collections.emptyMap());
    }
}
