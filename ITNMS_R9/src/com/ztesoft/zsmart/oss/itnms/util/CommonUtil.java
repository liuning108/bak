package com.ztesoft.zsmart.oss.itnms.util;

import org.apache.commons.lang3.StringUtils;

import com.ztesoft.zsmart.oss.opb.common.util.CommonHelper;

public final class CommonUtil {
    /**
     * 根据key查找属性文件属性，未配置则返回默认值
     * 
     * @param key
     * @param defaultValue
     * @return
     */
    public static String getProperty(String key, String defaultValue) {
        String value = CommonHelper.getProperty(key, false);
        if (StringUtils.isEmpty(value)) {
            return defaultValue;
        }
        return value;
    }
}
