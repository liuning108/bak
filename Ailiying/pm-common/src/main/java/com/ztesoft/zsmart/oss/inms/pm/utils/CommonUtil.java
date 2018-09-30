package com.ztesoft.zsmart.oss.inms.pm.utils;

import java.util.Date;

import org.apache.commons.lang3.StringUtils;

import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;
import com.ztesoft.zsmart.pot.dto.PortalUser;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月13日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.kdo.util <br>
 */
public abstract class CommonUtil {

    /**
     * LOG <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(CommonUtil.class);

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param key key
     * @param defaultValue defaultValue
     * @return String <br>
     */
    public static String getProperty(String key, String defaultValue) {
        String value = CommonHelper.getProperty(key, false);
        if (StringUtils.isEmpty(value)) {
            return defaultValue;
        }
        return value;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return String <br>
     */
    public static String getCurrentUserName() {
        try {
            PortalUser user = PrincipalUtil.getPrincipal();
            if (null != user) {
                return user.getUserName();
            }
        }
        catch (Exception e) {
            LOG.error(e);
            return null;
        }

        return null;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param obj obj
     * @return String <br>
     */
    public static String object2String(Object obj) {
        if (null == obj) {
            return null;
        }
        return String.valueOf(obj);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param obj obj
     * @return Date <br>
     */
    public static Date object2Date(Object obj) {
        if (null == obj) {
            return null;
        }
        return (Date) obj;
    }

    public static Date getCurrentDate() {
        return new Date();
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param bool bool
     * @param trueRet trueRet
     * @param falseRet falseRet
     * @return String <br>
     */
    public static String ternaryExpression(boolean bool, String trueRet, String falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param seqIdKey seqIdKey
     * @return String <br>
     */
    public static String getSeq(String seqIdKey) {
        return SeqUtils.getSeq(seqIdKey);
    }

}
