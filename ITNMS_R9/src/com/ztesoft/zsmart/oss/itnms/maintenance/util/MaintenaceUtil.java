package com.ztesoft.zsmart.oss.itnms.maintenance.util;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.alibaba.fastjson.JSONObject;

public class MaintenaceUtil {
 
	public static JSONObject  getMainList(JSONObject param,String stateName) {
		if(param.get("error")!=null) {
			return param;
		}
		List<Map<String,Object>> result = (List<Map<String,Object>>)param.get("result");
		for(Map<String,Object> item : result) {
			Long time =System.currentTimeMillis();
			Long activeTill =Long.parseLong((String)item.get("active_till"))*1000;
			Long activeSince = Long.parseLong((String)item.get("active_since"))*1000;
			String state ="";
			if (activeTill<time) {
				state="EXPIRED";
			}else if (activeSince>time) {
				state="APPROACH";
			}else {
				state="ACTIVE";
			}
			item.put("state", state);
		}
		result=result.stream().filter(d->{
			if("Any".equalsIgnoreCase(stateName)) {
				return true;
			}else {
				String state = (String)d.get("state");
				if(state.equalsIgnoreCase(stateName)) {
					return true;
				}else {
					return false;
				}
			}
		}).collect(Collectors.toList());
		param.put("result", result);
		return param;
	}
}
