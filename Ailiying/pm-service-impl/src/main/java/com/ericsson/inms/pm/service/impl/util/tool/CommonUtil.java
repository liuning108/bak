package com.ericsson.inms.pm.service.impl.util.tool;

import java.util.Date;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
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
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.tool <br>
 */
public final class CommonUtil {

    /**
     * 根据key查找属性文件属性，未配置则返回默认值
     * 
     * @param key
     * @param defaultValue
     * @return
     */
    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param key key
     * @param defaultValue defaultValue
     * @return <br>
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
     * @param map map
     * @param key key
     * @param def def
     * @return <br>
     */
    public static String getStrFromMap(Map map, String key, String def) {
        Object obj = map.get(key);
        if (null == obj) {
            return def;
        }

        return (String) obj;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param map map
     * @param key key
     * @return String
     * @throws BaseAppException <br>
     */
    public static String getStrFromMapWithExc(Map map, String key) throws BaseAppException {
        Object obj = map.get(key);
        if (null == obj) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_PARAM_REQUIRED, "NO " + key, key);
        }

        return String.valueOf(obj);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param obj obj
     * @return <br>
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
     * @return <br>
     */
    public static Date object2Date(Object obj) {
        if (null == obj) {
            return null;
        }
        return (Date) obj;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return <br>
     */
    public static Date getCurrentDate() {
        return new Date();
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param seqIdKey seqIdKey
     * @return <br>
     */
    public static String getSeq(String seqIdKey) {
    	String seq = SeqUtils.getSeq(seqIdKey);
        if (seq.length() > 8) {
            seq = seq.substring(seq.length() - 8, seq.length());
        }
        return seq;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param s String
     * @return Boolean
     * @throws BaseAppException <br>
     */
    public static Boolean checkSQLinject(String s) throws BaseAppException {
        if (StringUtils.isEmpty(s)) {
            return Boolean.valueOf(true);
        }
        Boolean boolean1 = Boolean.valueOf(false);
        String as[] = {
            " select ", "(select ", "chr(", "("
        };
        String s1 = s.toLowerCase();
        int i = 0;
        do {
            if (i >= as.length) {
                break;
            }
            if (s1.indexOf(as[i]) >= 0) {
                boolean1 = Boolean.valueOf(true);
                break;
            }
            i++;
        }
        while (true);
        if (!boolean1.booleanValue()) {
            String s2 = "";
            String as1[] = s1.split(",");
            for (int j = 0; j < as1.length; j++) {
                String s3 = as1[j];
                s3 = s3.trim();
                int k = s3.indexOf(" ");
                int l = s3.lastIndexOf(" ");
                if (k != l) {
                    boolean1 = Boolean.valueOf(true);
                }
            }

        }
        return boolean1;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return String <br>
     */
    public static String getCurrentUserId() {
        try {
            PortalUser user = PrincipalUtil.getPrincipal();
            if (null != user) {
                return String.valueOf(user.getUserId());
            }
        }
        catch (Exception e) {
            return null;
        }
        return null;
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
            return null;
        }

        return null;
    }
}
