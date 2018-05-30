package com.ztesoft.zsmart.oss.itnms.util;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.oss.itnms.exception.ExceptionConstants;

public class RestClient {

    private Class respClazz;

    private String url;

    private String methodType;

    private Map<String, Object> reqBody = null;

    private HttpHeaders reqHeader = null;

    private RestClient(String url, String methodType, Class respClazz, Map<String, Object> body, HttpHeaders header) {
        this.url = url;
        this.methodType = methodType;
        this.respClazz = respClazz;
        this.reqBody = body;
        this.reqHeader = header;
    }

    public static class Builder {

        private Class respClazz;

        private String url;

        private String methodType;

        private Map<String, Object> reqBody;

        private HttpHeaders reqHeader;

        public Builder url(String url) {
            this.url = url;
            return this;
        }

        public Builder methodType(String methodType) {
            this.methodType = methodType;
            return this;
        }

        public Builder reqHeader(HttpHeaders header) {
            this.reqHeader = header;
            return this;
        }

        public Builder reqBody(Map<String, Object> body) {
            this.reqBody = body;
            return this;
        }

        public Builder respType(Class clazz) {
            this.respClazz = clazz;
            return this;
        }

        public RestClient build() {
            return new RestClient(url, methodType, respClazz, reqBody, reqHeader);
        }

    }

    public Object call() throws BaseAppException {
        Object obj = null;
        try {
            obj = this.callWithRetRespHeader().getBody();
        }
        catch (Exception e) {
            ExceptionHandler.publish(ExceptionConstants.ITNMS_COMMON_REST_ERROR, "Error on call Rest API", 0, e, this.url, this.methodType,
                this.reqHeader, this.reqBody);
        }
        return obj;
    }

    @SuppressWarnings("unchecked")
    public ResponseEntity callWithRetRespHeader() throws Exception {

        RestTemplate restTemplate = new RestTemplate();

        switch (this.methodType) {
            case "Get":
                return restTemplate.getForEntity(url, respClazz, reqBody);
            case "Post":
                HttpEntity<Map<String, Object>> request = new HttpEntity<Map<String, Object>>(reqBody, reqHeader);
                return restTemplate.postForEntity(url, request, respClazz);
            case "Delete":
                restTemplate.delete(url, reqBody);
                break;
            case "Put":
                restTemplate.put(url, reqBody);
                break;
            case "Patch":
                // TODO
                break;
            default:
                throw ExceptionHandler.publish("ERROR", "ERROR");
        }

        return null;
    }
}
