package com.liuning.until;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class HttpUtil {
	public static Map<String,Object> HttpMethods=new HashMap<String,Object>();
	static {
		HttpMethods.put("GET", HttpGet.class);
		HttpMethods.put("POST", HttpPost.class);
		HttpMethods.put("PUT", HttpPut.class);
		HttpMethods.put("DELETE", HttpDelete.class);
	}
	
	public static JSONObject requestRemoteURL(String url,String method){
		CloseableHttpClient httpCilent = HttpClients.createDefault();
		JSONObject json = new JSONObject();
		try {
			
		Class calss=(Class) HttpMethods.get(method.trim().toUpperCase());
		HttpRequestBase httpMethod= (HttpRequestBase)  calss.newInstance();
			httpMethod.setURI(new URI(url));
			HttpResponse response= httpCilent.execute(httpMethod);
			//请求成功
			if (response.getStatusLine().getStatusCode()==200){
				String srtResult =EntityUtils.toString(response.getEntity());
				 JSONParser parser = new JSONParser();
				 Object obj = parser.parse(srtResult);
				 json = (JSONObject) obj;
		    }//end of if 
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			try {
				if (httpCilent!=null)httpCilent.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return json;
	}
}
