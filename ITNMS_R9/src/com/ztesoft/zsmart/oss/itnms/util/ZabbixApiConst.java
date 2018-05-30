package com.ztesoft.zsmart.oss.itnms.util;

public abstract class ZabbixApiConst {

    public static final String ZABBIX_REQUEST_METHOD = "method";

    public static final String ZABBIX_REQUEST_PARAMS = "params";

    public static final String ZABBIX_REQUEST_ID = "id";

    public static final String ZABBIX_REQUEST_JSONRPC = "jsonrpc";

    public static final String ZABBIX_REQUEST_AUTH = "auth";

    public interface ZabbixUserLoginInfo {
        String USER = "user";

        String PWD = "password";

        String LOGIN_RE_SESSION = "result";
    }

    public interface ZabbixServerConfig {
        String PWD_CONFIG_KEY = "zPWD";

        String SERVERURL_CONFIG_KEY = "zURL";
    }

}
