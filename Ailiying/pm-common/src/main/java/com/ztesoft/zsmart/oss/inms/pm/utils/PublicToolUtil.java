package com.ztesoft.zsmart.oss.inms.pm.utils;


public class PublicToolUtil {


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
