package com.ztesoft.zsmart.oss.inms.pm.jobsys.tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

public class PublicToolUtil {

    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(PublicToolUtil.class);

    public static GeneralDAO<?> getDao(Class<?> paramClass) {
        return (GeneralDAO<?>) GeneralDAOFactory.create(paramClass, JdbcUtil.OSS_KDO);
    }

    public static String ObjectToStr(Object obj) {
        if (obj == null) return "";
        String str = String.valueOf(obj);
        return (str.equals("null")) ? "" : str;
    }

    public static int ObjectToInt(Object obj) {
        if (obj == null) return 0;
        String str = String.valueOf(obj);
        return (str.equals("null")) ? 0 : Integer.parseInt(str);
    }
}
