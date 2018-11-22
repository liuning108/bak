package com.ericsson.inms.pm.taskalarm.send.weixin.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;

import net.sf.json.JSONException;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ericsson.inms.pm.taskalarm.send.weixin.pojo.AccessToken;
import com.ericsson.inms.pm.taskalarm.send.weixin.thread.TokenThread;

/**
 */
public class WeixinUtil {
	private static Logger log = LoggerFactory.getLogger(WeixinUtil.class);
	
	public final static String access_token_url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=APPID&corpsecret=APPSECRET";

	/**
	 */
	public static AccessToken getAccessToken(String corpid, String appsecret) {
		AccessToken accessToken = null;

		String requestUrl = access_token_url.replace("APPID", corpid).replace("APPSECRET", appsecret);
		JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
		if (null != jsonObject) {
			try {
				accessToken = new AccessToken();
				accessToken.setToken(jsonObject.getString("access_token"));
				accessToken.setExpiresIn(jsonObject.getInt("expires_in"));
			} catch (JSONException e) {
				accessToken = null;
				log.error("errcode:{} errmsg:{}", jsonObject.getInt("errcode"), jsonObject.getString("errmsg"));
			}
		}
		return accessToken;
	}

	/**
	 */
	public static JSONObject httpRequest(String requestUrl, String requestMethod, String outputStr) {
		JSONObject jsonObject = null;
		StringBuffer buffer = new StringBuffer();
		try {
			TrustManager[] tm = { new MyX509TrustManager() };
			SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");
			sslContext.init(null, tm, new java.security.SecureRandom());
			SSLSocketFactory ssf = sslContext.getSocketFactory();

			URL url = new URL(requestUrl);
			HttpsURLConnection httpUrlConn = (HttpsURLConnection) url.openConnection();
			httpUrlConn.setSSLSocketFactory(ssf);

			httpUrlConn.setDoOutput(true);
			httpUrlConn.setDoInput(true);
			httpUrlConn.setUseCaches(false);
			
			httpUrlConn.setRequestMethod(requestMethod);

			if ("GET".equalsIgnoreCase(requestMethod))
				httpUrlConn.connect();

			if (null != outputStr) {
				OutputStream outputStream = httpUrlConn.getOutputStream();
				outputStream.write(outputStr.getBytes("UTF-8"));
				outputStream.close();
			}

			InputStream inputStream = httpUrlConn.getInputStream();
			InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");
			BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

			String str = null;
			while ((str = bufferedReader.readLine()) != null) {
				buffer.append(str);
			}
			bufferedReader.close();
			inputStreamReader.close();
			
			inputStream.close();
			inputStream = null;
			httpUrlConn.disconnect();
			jsonObject = JSONObject.fromObject(buffer.toString());
		} catch (ConnectException ce) {
			log.error("Weixin server connection timed out.");
		} catch (Exception e) {
			log.error("https request error:{}", e);
		}
		return jsonObject;
	}
	
	public static boolean sendMessage(String accessToken, String jsonMsg){
		System.out.println("accessToken：{"+accessToken+"}");  
		System.out.println("消息内容：{"+jsonMsg+"}");  
        boolean result = false;  
        //请求地址  
        String requestUrl = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=ACCESS_TOKEN";  
        requestUrl = requestUrl.replace("ACCESS_TOKEN", accessToken);  
        //发送客服消息  
        JSONObject jsonObject = WeixinUtil.httpRequest(requestUrl, "POST", jsonMsg);  
        if(null != jsonObject){  
            int errorCode = jsonObject.getInt("errcode");  
            String errorMsg = jsonObject.getString("errmsg");  
            if(0 == errorCode){  
                result = true;  
                log.info("机器人消息发送成功errorCode:{"+errorCode+"},errmsg:{"+errorMsg+"}");  
                System.out.println("客服消息发送成功errorCode:{"+errorCode+"},errmsg:{"+errorMsg+"}");  
            }else{  
            	log.info("机器人消息发送失败errorCode:{"+errorCode+"},errmsg:{"+errorMsg+"}");  
                System.out.println("机器人消息发送失败errorCode:{"+errorCode+"},errmsg:{"+errorMsg+"}");  
                if(errorCode == 40001 || errorCode == 42001 ){  
                    System.out.println("12321");  
                    new Thread(new TokenThread()).start();  
                }  
            }  
        }  
        return result;  
    }
	/*
	 * 	AgentId
		1000002
		Secret
		YwYyozRm6dfQunQ4Y14mFtIPM4WgE0wF3mHa-qwPgnA
		
		企业ID
		ww7ac731db516261c2
	 */
	
	public static void main(String args[]) throws Exception {
		AccessToken at = WeixinUtil.getAccessToken("ww7ac731db516261c2", "YwYyozRm6dfQunQ4Y14mFtIPM4WgE0wF3mHa-qwPgnA");
		System.out.println(at.getToken());
		WeixinUtil.sendMessage(at.getToken(), "{\r\n" + 
				"   \"touser\" : \"@all\",\r\n" + 
				"   \"toparty\" : \"1000002\",\r\n" + 
				"   \"totag\" : \"@all\",\r\n" + 
				"   \"msgtype\" : \"text\",\r\n" + 
				"   \"agentid\" : 1000002,\r\n" + 
				"   \"text\" : {\r\n" + 
				"       \"content\" : \"性能告警推送测试，哈哈哈.\"\r\n" + 
				"   },\r\n" + 
				"   \"safe\":0\r\n" + 
				"}");
	}
}