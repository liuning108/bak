/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.inms.pm.common.utils;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月18日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.common.utils <br>
 */

public class PmSeqUtil {
    /**
     * Fields TODO
     * 
     * @author lin<br>
     * @version 1.0<br>
     * @CreateDate 下午2:18:27<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_PARAVALUE_LIST_ID = "S_PM_PARAVALUE_LIST_ID";

    /**
     * Fields TODO
     * 
     * @author lin<br>
     * @version 1.0<br>
     * @CreateDate 下午2:18:25<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_TRIGGER_ID = "S_PM_TRIGGER_ID";

    /**
     * Fields TODO
     * 
     * @author lin<br>
     * @version 1.0<br>
     * @CreateDate 下午2:18:22<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_FUNC_PROTOTYPE_ID = "S_PM_FUNC_PROTOTYPE_ID";

    /**
     * Fields TODO
     * 
     * @author lin<br>
     * @version 1.0<br>
     * @CreateDate 下午1:53:03<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_MSG_ID = "S_PM_MSG_ID";

    /**
     * Fields TODO
     * 
     * @author que.longjiang<br>
     * @version 1.0<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_FILTER_ITEM_ID = "S_PM_FILTER_ITEM_ID";

    /**
     * Fields TODO
     * 
     * @author que.longjiang<br>
     * @version 1.0<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_FILTER_ID = "S_PM_FILTER_ID";

    /**
     * Fields TODO
     * 
     * @author que.longjiang<br>
     * @version 1.0<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_FILTER_ALARM_ID = "S_PM_FILTER_ALARM_ID";

    /**
     * Fields 模板管理-模板ID序列
     * 
     * @author que.longjiang<br>
     * @version 1.0<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_FILTER_TEMPLATE_ID = "S_PM_FILTER_TEMPLATE_ID";

    /**
     * Fields 监测点管理-监测点ID序列
     * 
     * @author que.longjiang<br>
     * @version 1.0<br>
     * @since R8.0<br>
     * @see com.ztesoft.zsmart.oss.inms.pm.common.utils<br>
     */
    private static final String S_PM_FILTER_CHEKCKPOINT_ID = "S_PM_FILTER_CHECKPOINT_ID";

    /**
     * Methods Description: 检测点ID <br>
     * 
     * @author: Lycan <br>
     * @return S_FM_PARAVALUE_LIST_ID
     * @throws BaseAppException <br>
     */
    public static String getCheckPointID() throws BaseAppException {
        return SeqUtils.getSrvDateTimeSeq(S_PM_FILTER_CHEKCKPOINT_ID);
    }

    /**
     * Methods Description: 获取模板ID <br>
     * 
     * @author: Lycan <br>
     * @return S_FM_PARAVALUE_LIST_ID
     * @throws BaseAppException <br>
     */
    public static String getTemplateID() throws BaseAppException {
        return SeqUtils.getSrvDateTimeSeq(S_PM_FILTER_TEMPLATE_ID);
    }

    /**
     * Methods Description: TODO <br>
     * 
     * @author: Lycan <br>
     * @return S_FM_PARAVALUE_LIST_ID
     * @throws BaseAppException <br>
     */
    public static String getParaValueListId() throws BaseAppException {
        return SeqUtils.getSrvDateTimeSeq(S_PM_PARAVALUE_LIST_ID);
    }

    /**
     * Methods Description: TODO <br>
     * 
     * @author: Lycan <br>
     * @return S_FM_EVENT_ID
     * @throws BaseAppException <br>
     */
    public static String getTrriggerId() {
        return SeqUtils.getSrvDateTimeSeq(S_PM_TRIGGER_ID);
    }

    /**
     * Methods Description: TODO <br>
     * 
     * @author: Lycan <br>
     * @return S_FM_TRACE_ID<br>
     */
    public static String getFuncPrototypeId() {
        // TODO Auto-generated method stub
        return SeqUtils.getSrvDateTimeSeq(S_PM_FUNC_PROTOTYPE_ID);
    }

    /**
     * Methods Description: TODO <br>
     * 
     * @author: Lycan <br>
     * @return S_FM_MSG_ID<br>
     */
    public static String getMsgId() {
        // TODO Auto-generated method stub
        return SeqUtils.getSrvDateTimeSeq(S_PM_MSG_ID);
    }

    /**
     * 设置过滤项编号
     * 
     * @return <br/>
     * @author que.longjiang <br/>
     * @throws <br/>
     */
    public static String getFilterItemId() {
        return SeqUtils.getSrvDateTimeSeq(S_PM_FILTER_ITEM_ID);
    }

    /**
     * 设置过滤模板编号
     * 
     * @return <br/>
     * @author que.longjiang <br/>
     * @throws <br/>
     */
    public static String getFilterId() {
        return SeqUtils.getSrvDateTimeSeq(S_PM_FILTER_ID);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    public static String getFilterAlarmId() {
        return SeqUtils.getSrvDateTimeSeq(S_PM_FILTER_ALARM_ID, "alarm");
    }

}
