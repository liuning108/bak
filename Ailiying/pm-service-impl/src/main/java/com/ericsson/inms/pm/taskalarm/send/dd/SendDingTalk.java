package com.ericsson.inms.pm.taskalarm.send.dd;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

// 
public class SendDingTalk {
	public static String WEBHOOK_TOKEN = "https://oapi.dingtalk.com/robot/send?access_token=2c05986209ca7873facd44ccdfd3eb8e154edc7c9d8e06925c1e430df993db32";

	public static void main(String args[]) throws Exception {

		HttpClient httpclient = HttpClients.createDefault();

		HttpPost httppost = new HttpPost(WEBHOOK_TOKEN);
		httppost.addHeader("Content-Type", "application/json; charset=utf-8");

		String textMsg = "{ \"msgtype\": \"text\", \"text\": {\"content\": \"告警消息发送：大家好，测试程序发送。。。打扰打扰，哈哈\"}}";
		StringEntity se = new StringEntity(textMsg, "utf-8");
		httppost.setEntity(se);

		HttpResponse response = httpclient.execute(httppost);
		if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
			String result = EntityUtils.toString(response.getEntity(), "utf-8");
			System.out.println(result);
		}
	}
}
