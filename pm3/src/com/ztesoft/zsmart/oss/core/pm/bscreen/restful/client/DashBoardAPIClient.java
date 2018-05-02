/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.bscreen.restful.client;

import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年11月2日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.restful.client <br>
 */

public class DashBoardAPIClient {
    public static final String METATYPE="meta";
    public static final String DATATYPE="data";
    
    public static Map<String,Object> call(String url,String type) {
        Map<String,Object> result = new HashMap<String,Object>();
        try {
            HttpClient client = new HttpClient();
            JSONObject jsonParam = new JSONObject();  
            jsonParam.put("type", type);
            StringRequestEntity requestEntity = new StringRequestEntity(
                jsonParam.toJSONString(),
                "application/json",
                "UTF-8");        
            
            
            PostMethod httpPost = new PostMethod(url);
            httpPost.setRequestEntity(requestEntity);
            int returnCode= client.executeMethod(httpPost);
            StringBuffer sb = new StringBuffer();
            if (returnCode == HttpStatus.SC_OK) {

                BufferedReader  br = new BufferedReader(new InputStreamReader(httpPost.getResponseBodyAsStream(), "UTF-8"));
                String inputLineRep;
                while (((inputLineRep = br.readLine()) != null)) {
                    sb.append(inputLineRep);
                }
                
                
                return JSON.parseObject(sb.toString());

            }
            
        }catch(Exception e){
            result.put("code", 0);
            result.put("msg", "[DashBoardAPIClient error]"+e.getMessage());
        }
        return result ;
        
    }
    public static void main(String[] args) {
        Map<String,Object> result = DashBoardAPIClient.call("http://127.0.0.1:8080/oss/rest/test/zteCELL", DashBoardAPIClient.DATATYPE);
        System.err.println(result.get("msg"));
    }

}
