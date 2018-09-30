package com.ztesoft.zsmart.oss.inms.pm.common.constant;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月1日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
 */
public final class PerformanceDataConstant {

    /**
     * INDEX_NAME_SEP <br>
     */
    public static final String INDEX_NAME_SEP = "_";

    /**
     * FIELD_SEP <br>
     */
    public static final String FIELD_SEP = ":";

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月1日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
     */
    public interface HistoryIndex {
        /**
         * indexPrefix <br>
         */
        String INDEXPREFIX = "history";

        /**
         * indexType <br>
         */
        String INDEXTYPE = "history";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月1日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
     */
    public interface TrendIndex {
        /**
         * indexPrefix <br>
         */
        String INDEXPREFIX = "trend";

        /**
         * indexType <br>
         */
        String INDEXTYPE = "trend";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月1日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
     */
    public interface PerformFiled {
        /**
         * ME_GID <br>
         */
        String ME_GID = "me_gid";

        /**
         * COLLECT_TIME <br>
         */
        String COLLECT_TIME = "collect_time";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月1日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
     */
    public interface PerformOutFiled {
        /**
         * MEGID <br>
         */
        String MEGID = "megid";

        /**
         * COLLECT_TIME <br>
         */
        String COLLECT_TIME = "collectTime";

        /**
         * ITEM_ID <br>
         */
        String ITEM_ID = "itemId";

        /**
         * CHECK_POINT <br>
         */
        String CHECK_POINT = "checkPoint";

        /**
         * VALUE <br>
         */
        String VALUE = "value";

        /**
         * TIMESTAMP <br>
         */
        String TIMESTAMP = "timeStamp";

        /**
         * MIN <br>
         */
        String MIN = "min";

        /**
         * MAX <br>
         */
        String MAX = "max";

        /**
         * SUM <br>
         */
        String SUM = "sum";

        /**
         * COUNT <br>
         */
        String COUNT = "count";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月3日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
     */
    public interface AggType {
        /**
         * ALL <br>
         */
        String ALL = "all";

        /**
         * LATEST <br>
         */
        String LATEST = "latest";

        /**
         * AVG <br>
         */
        String AVG = "avg";

        /**
         * MAX <br>
         */
        String MAX = "max";

        /**
         * MIN <br>
         */
        String MIN = "min";

        /**
         * SUM <br>
         */
        String SUM = "sum";
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年8月10日 <br>
     * @since V8<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.constant <br>
     */
    public interface HBaseTable {
        /**
         * HISTORY_TABLE <br>
         */
        String HISTORY_TABLE = "history";

        /**
         * TRENDS_TABLE <br>
         */
        String TRENDS_TABLE = "trends";

        /**
         * COLUMN_FAMILY <br>
         */
        String COLUMN_FAMILY = "item_inst";
    }
}
