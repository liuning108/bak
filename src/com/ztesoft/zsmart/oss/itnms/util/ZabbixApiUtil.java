package com.ztesoft.zsmart.oss.itnms.util;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.itnms.exception.ExceptionConstants;
import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaMeterDto;
import com.ztesoft.zsmart.oss.itnms.parameter.service.ParaMeterService;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;
public abstract class ZabbixApiUtil {

    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(ZabbixApiUtil.class);
    
    public  static Map<String,String> getZabbixApiInfo() throws BaseAppException{ 
    	  Long userId = PrincipalUtil.getPrincipal().getUserId();
    	  String sessionId = "zabbixSessionId_"+userId;
    	  SessionRegistry sessionRegistry = SpringContext.getBean(SessionRegistry.class);
    	  SessionInformation  sessionInformation =sessionRegistry.getSessionInformation(sessionId);
    	  Map<String ,String > zabbixInfo =null;
    	  if(sessionInformation==null) {
	       zabbixInfo=loginZabbix(userId);
	    	   sessionRegistry.registerNewSession(sessionId,zabbixInfo );
	    	   return zabbixInfo;
    	  }else{
    	  	return (Map<String ,String >)sessionInformation.getPrincipal();
    	  }
    }

    public static Map<String, String> loginZabbix(Long userId)  throws BaseAppException{
    	    Map<String,String> result = new HashMap<String,String>();
    	    String user = "Admin" ; //现在写死为Admin
    	    Map<String, String> zabbixConfig = ZabbixApiUtil.getZabbixConfig();
    	    String url =zabbixConfig.get(ZabbixApiConst.ZabbixServerConfig.SERVERURL_CONFIG_KEY);
    	    Map<String, Object> userInfo = new HashMap<String, Object>();
        userInfo.put(ZabbixApiConst.ZabbixUserLoginInfo.USER,user);
        userInfo.put(ZabbixApiConst.ZabbixUserLoginInfo.PWD, zabbixConfig.get(ZabbixApiConst.ZabbixServerConfig.PWD_CONFIG_KEY));
        Map<String, Object> reqBody = reBuildZabbixApiParam(userInfo, "user.login");
        reqBody.put(ZabbixApiConst.ZABBIX_REQUEST_JSONRPC, "2.0");
        reqBody.put(ZabbixApiConst.ZABBIX_REQUEST_ID, "1");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        JSONObject respBody = (JSONObject) new RestClient.Builder().methodType("Post").reqBody(reqBody).reqHeader(headers)
            .url(url).respType(JSONObject.class).build().call();
        String sessionId = respBody.getString(ZabbixApiConst.ZabbixUserLoginInfo.LOGIN_RE_SESSION);
        if (StringUtils.isEmpty(sessionId)) {
            ExceptionHandler.publish(ExceptionConstants.ITNMS_ZABBIX_GET_SESSION_ERROR, "ERROR to get sesssion please check user and password");
        }
        result.put("url", url);
        result.put("auth", sessionId);
        return result;
	}
    
	// TODO
    public static String getSessionId() throws BaseAppException {
        // 从缓存读取sessionId
        // 读不到则登录获取

        JSONObject resp = loginZabbix();
        String sessionId = resp.getString(ZabbixApiConst.ZabbixUserLoginInfo.LOGIN_RE_SESSION);
        if (StringUtils.isEmpty(sessionId)) {
            ExceptionHandler.publish(ExceptionConstants.ITNMS_ZABBIX_GET_SESSION_ERROR, "ERROR to get sesssion please check user and password");
        }
        return sessionId;
    }

    public static JSONObject loginZabbix() throws BaseAppException {

        Map<String, String> zabbixConfig = ZabbixApiUtil.getZabbixConfig();

        Map<String, Object> userInfo = new HashMap<String, Object>();
        userInfo.put(ZabbixApiConst.ZabbixUserLoginInfo.USER, "Admin");
        userInfo.put(ZabbixApiConst.ZabbixUserLoginInfo.PWD, zabbixConfig.get(ZabbixApiConst.ZabbixServerConfig.PWD_CONFIG_KEY));

        Map<String, Object> reqBody = reBuildZabbixApiParam(userInfo, "user.login");
        reqBody.put(ZabbixApiConst.ZABBIX_REQUEST_JSONRPC, "2.0");
        reqBody.put(ZabbixApiConst.ZABBIX_REQUEST_ID, "1");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        JSONObject respBody = (JSONObject) new RestClient.Builder().methodType("Post").reqBody(reqBody).reqHeader(headers)
            .url(zabbixConfig.get(ZabbixApiConst.ZabbixServerConfig.SERVERURL_CONFIG_KEY)).respType(JSONObject.class).build().call();

        return respBody;
    }

    // TODO
    public static JSONObject getForObject(Map<String, Object> condition) throws BaseAppException {
        String sessionId = getSessionId();
        return null;
    }

    private static Map<String, Object> enrichRestCondition(Map<String, Object> condition) throws BaseAppException {
        String sessionId = getSessionId();
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_JSONRPC, "2.0");
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_ID, "1");
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_AUTH, sessionId);
        return condition;
    }

    public static JSONObject postForObject(Map<String, Object> condition) throws BaseAppException {

        LOG.debug("Enter ZabbixApiUtil--postForObject,condition = " + JSONObject.toJSONString(condition));

        Map<String, Object> reqBody = enrichRestCondition(condition);
        JSONObject respBody = null;
        Map<String, String> zabbixConfig = ZabbixApiUtil.getZabbixConfig();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        respBody = (JSONObject) new RestClient.Builder().methodType("Post").reqBody(reqBody).reqHeader(headers)
            .url(zabbixConfig.get(ZabbixApiConst.ZabbixServerConfig.SERVERURL_CONFIG_KEY)).respType(JSONObject.class).build().call();

        LOG.debug("Leave ZabbixApiUtil--postForObject");

        return respBody;
    }

    /**
     * @param params
     * @param method
     * @return
     */
    public static Map<String, Object> reBuildZabbixApiParam(Map<String, Object> params, String method) {
        Map<String, Object> condition = new HashMap<String, Object>();
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_PARAMS, params);
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_METHOD, method);
        return condition;
    }

    /**
     * @param params
     * @param method
     * @return
     */
    public static Map<String, Object> reBuildZabbixApiParam4List(List<Map<String, Object>> params, String method) {
        Map<String, Object> condition = new HashMap<String, Object>();
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_PARAMS, params);
        condition.put(ZabbixApiConst.ZABBIX_REQUEST_METHOD, method);
        return condition;
    }

    public static Map<String, String> getZabbixConfig() throws BaseAppException {
        ParaMeterService pmServ = (ParaMeterService) SpringContext.getBean("paraMeterServ");
        Map<String, ParaMeterDto> pmResult = pmServ.selectParaMetersByIds(new StringBuilder(ZabbixApiConst.ZabbixServerConfig.SERVERURL_CONFIG_KEY)
            .append(",").append(ZabbixApiConst.ZabbixServerConfig.PWD_CONFIG_KEY).toString());

        // 处理数据
        Map<String, String> result = new HashMap<String, String>();
        ParaMeterDto urlPara = pmResult.get(ZabbixApiConst.ZabbixServerConfig.SERVERURL_CONFIG_KEY);
        ParaMeterDto pwdPara = pmResult.get(ZabbixApiConst.ZabbixServerConfig.PWD_CONFIG_KEY);

        if (null == urlPara || StringUtils.isEmpty(urlPara.getParaValue())) {
            ExceptionHandler.publish(ExceptionConstants.ITNMS_ZABBIX_URL_CONFIG_ERROR);
        }
        if (null == pwdPara || StringUtils.isEmpty(pwdPara.getParaValue())) {
            ExceptionHandler.publish(ExceptionConstants.ITNMS_ZABBIX_PWD_CONFIG_ERROR);
        }

        result.put(ZabbixApiConst.ZabbixServerConfig.SERVERURL_CONFIG_KEY, urlPara.getParaValue());

        result.put(ZabbixApiConst.ZabbixServerConfig.PWD_CONFIG_KEY, pwdPara.getParaValue());

        return result;
    }
}
