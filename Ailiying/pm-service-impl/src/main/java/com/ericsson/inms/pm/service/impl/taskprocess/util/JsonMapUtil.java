package com.ericsson.inms.pm.service.impl.taskprocess.util;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class JsonMapUtil {
	@SuppressWarnings("unchecked")
	public static Map<String, Object> Json2Map(JSONObject json){  
        Map<String, Object> map = new HashMap<String, Object>();  
        for(Object k : json.keySet()){  
            Object v = json.get(k);   
            if(v instanceof JSONArray){  
                List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();  
                Iterator<Object> it = ((JSONArray) v).iterator(); 
                while(it.hasNext()){  
                    JSONObject json2 = (JSONObject) it.next();  
                    list.add(Json2Map(json2));  
                }  
                map.put(k.toString(), list);  
            } else {  
                map.put(k.toString(), v);  
            }  
        }  
        return map;  
    } 
	
	public static JSONObject map2Json(Map<String,Object> map){
		JSONObject json = new JSONObject();
		Set<String> set = map.keySet();
		for (Iterator<String> it = set.iterator();it.hasNext();) {
			String key = it.next();
			json.put(key, map.get(key));
		}		
		return json;
	}
	
	public static void main(String[] args) {
		JSONObject json = new JSONObject();
		JSONObject json2 = new JSONObject();
		json2.put("json", "json");
		json2.put("json2", "json2");
		JSONArray ja = new JSONArray();
		ja.add(json2);
		json.put("id", ja);
		json.put("name", "{\"33\",\"ddssa\"}");
		json.put("age", "s2dee");
		System.out.println(Json2Map(json));
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("id", "sdeee");
		map.put("name", "{\"name1\":\"xiaoming\",\"name2\":\"daming\",}");
		map.put("age", "s2dee");
		System.out.println(map2Json(map));
	}
}
