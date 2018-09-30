package com.ztesoft.zsmart.oss.inms.pm.common.es.constant;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月27日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.constant <br>
 */
public final class ElasticSearchConstant {
    /**
     * ES_HOST_INFO_KEY <br>
     */
    public static final String ES_SERVER_LIST_KEY = "pm.elasticsearch.server-list";

    /**
     * ES_HOST_NAME_DEFAULT <br>
     */
    public static final String ES_SERVER_NAME_DEFAULT = "127.0.0.1";

    /**
     * ES_HOST_PORT_DEFAULT <br>
     */
    public static final int ES_SERVER_PORT_DEFAULT = 9200;

    /**
     * ES_COLON_SEP <br>
     */
    public static final String ES_COLON_SEP = ":";

    /**
     * ES_COMMA_SEQ <br>
     */
    public static final String ES_COMMA_SEQ = ",";

    /**
     * ES_SEARCH_KEY <br>
     */
    public static final String ES_SEARCH_KEY = "_search";

    /**
     * ES_SEARCH_PATH_SEP <br>
     */
    public static final String ES_PATH_SEP = "/";

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年7月27日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.constant <br>
     */
    public interface MethodType {
        /**
         * PUT <br>
         */
        String PUT = "PUT";

        /**
         * POST <br>
         */
        String POST = "POST";

        /**
         * GET <br>
         */
        String GET = "GET";

        /**
         * HEAD <br>
         */
        String HEAD = "HEAD";

        /**
         * DELETE <br>
         */
        String DELETE = "DELETE";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年7月27日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.constant <br>
     */
    public interface EsRespKey {
        /**
         * HITS <br>
         */
        String HITS = "hits";

        /**
         * TOTAL <br>
         */
        String TOTAL = "total";

        /**
         * INDEX <br>
         */
        String INDEX = "_index";

        /**
         * TYPE <br>
         */
        String TYPE = " _type";

        /**
         * ID <br>
         */
        String ID = "_id";

        /**
         * SCOPE <br>
         */
        String SCOPE = "_score";

        /**
         * SOURCE <br>
         */
        String SOURCE = "_source";

        /**
         * MAX_SCORE <br>
         */
        String MAX_SCORE = "max_score";

        /**
         * RETID <br>
         */
        String RETID = "id";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年7月27日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.constant <br>
     */
    public interface RetCode {
        /**
         * SUCC <br>
         */
        String SUCC = "0";

        /**
         * ERR <br>
         */
        String ERR = "1";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月1日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.es.constant <br>
     */
    public interface EsReqKey {
        /**
         * PREFIX <br>
         */
        String PREFIX = "prefix";

        /**
         * QUERY <br>
         */
        String QUERY = "query";

        /**
         * FILTER <br>
         */
        String FILTER = "filter";

        /**
         * MATCH <br>
         */
        String MATCH = "match";

        /**
         * TERM <br>
         */
        String TERM = "term";

        /**
         * SORT <br>
         */
        String SORT = "sort";

        /**
         * ORDER <br>
         */
        String ORDER = "order";

        /**
         * ORDER_DESC <br>
         */
        String ORDER_DESC = "desc";

        /**
         * ORDER_ASC <br>
         */
        String ORDER_ASC = "asc";

        /**
         * RANGE <br>
         */
        String RANGE = "range";

        /**
         * RANGE_LTE <br>
         */
        String RANGE_LTE = "lte";

        /**
         * RANGE_GTE <br>
         */
        String RANGE_GTE = "gte";

        /**
         * BOOL <br>
         */
        String BOOL = "bool";

        /**
         * BOOL_MUST <br>
         */
        String BOOL_MUST = "must";
    }
}
