package com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.impl;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.Request;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestBuilder;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.RequestWithArrayParams;
import com.ztesoft.zsmart.oss.itnms.host.util.zabbixapi.ZabbixApi;
public class DefaultZabbixApi implements ZabbixApi  {
	
	private CloseableHttpClient httpClient;
	private URI uri;
	private volatile String auth;
	
	public DefaultZabbixApi(String url) {
		try {
			uri = new URI(url.trim());
		} catch (URISyntaxException e) {
			throw new RuntimeException("url invalid", e);
		}
	}
	
	public DefaultZabbixApi(URI uri) {
		this.uri = uri;
	}
	
	public DefaultZabbixApi(String url, CloseableHttpClient httpClient) {
		this(url);
		this.httpClient = httpClient;
	}
	
	public DefaultZabbixApi(URI uri, CloseableHttpClient httpClient) {
		this(uri);
		this.httpClient = httpClient;
	}

	
	@Override
	public void init() {
		// TODO Auto-generated method stub
		if (httpClient == null) {
			httpClient = HttpClients.custom().build();
		}
		
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		if (httpClient != null) {
			try {
				httpClient.close();
			} catch (Exception e) {
			   e.printStackTrace();
			}
		}
	}

	@Override
	public String apiVersion() {
		Request request = RequestBuilder.newBuilder().method("apiinfo.version").build();
		JSONObject response = call(request);
		return response.getString("result");
	}

	@Override
	public JSONObject call(Request request) {
		if (request.getAuth() == null) {
			request.setAuth(this.auth);
		}

		try {
			HttpUriRequest httpRequest = org.apache.http.client.methods.RequestBuilder.post().setUri(uri)
					.addHeader("Content-Type", "application/json")
					.setEntity(new StringEntity(JSON.toJSONString(request), ContentType.APPLICATION_JSON)).build();

			CloseableHttpResponse response = httpClient.execute(httpRequest);
			HttpEntity entity = response.getEntity();
			System.err.println(JSON.toJSONString(request));
			byte[] data = EntityUtils.toByteArray(entity);
			return (JSONObject) JSON.parse(data);
		} catch (IOException e) {
			e.printStackTrace(); 
			throw new RuntimeException("DefaultZabbixApi call exception!", e);
		}
	}

	@Override
    public JSONObject call(RequestWithArrayParams request) {
        if (request.getAuth() == null) {
            request.setAuth(this.auth);
        }

        try {
            HttpUriRequest httpRequest = org.apache.http.client.methods.RequestBuilder.post().setUri(uri)
                    .addHeader("Content-Type", "application/json")
                    .setEntity(new StringEntity(JSON.toJSONString(request), ContentType.APPLICATION_JSON)).build();

            CloseableHttpResponse response = httpClient.execute(httpRequest);
            HttpEntity entity = response.getEntity();
            System.err.println(JSON.toJSONString(request));
            byte[] data = EntityUtils.toByteArray(entity);
            return (JSONObject) JSON.parse(data);
        } catch (IOException e) {
            throw new RuntimeException("DefaultZabbixApi call exception!", e);
        }
    }
	
	@Override
	public String login(String user, String password) {
		
		this.auth = null;
		Request request =
				RequestBuilder.newBuilder().paramEntry("user", user).paramEntry("password", password)
				.method("user.login").build();
		JSONObject response = call(request);
		String auth = response.getString("result");
		if (auth != null && !auth.isEmpty()) {
			this.auth = auth;
		}
		return this.auth;
	}
	

}
