package com.ericsson.inms.pm.service.impl.taskprocess.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;

public class JsonMapUtil {

	public static final String DOWANLOAD_STATE_TODO = "00";
	public static final String DOWANLOAD_STATE_DONE = "01";
	public static final String DOWANLOAD_STATE_ERROR = "02";
	public static final String DOWANLOAD_STATE_DOWN = "03";

	public static Date parse(String format, String dateStr) throws BaseAppException {
		SimpleDateFormat bartDateFormat = new SimpleDateFormat(format);
		Date date = null;
		try {
			date = bartDateFormat.parse(dateStr);
		} catch (Exception e) {
			throw new BaseAppException(e.getMessage());
		}
		return date;
	}
	
	public static String parseStr(String format,Date d) {
		DateFormat sdf = new SimpleDateFormat(format); 
		return sdf.format(d);
	}
	
	public static Timestamp parse(String format,Date d) throws BaseAppException {
		DateFormat sdf = new SimpleDateFormat(format);   
		try {
			String dateStr =sdf.format(d);   
			Timestamp ts= Timestamp.valueOf(dateStr);
			return ts;
		} catch (Exception e) {
			throw new BaseAppException(e.getMessage());
		}
	}
	
	public static Timestamp parseTimestamp(String format,String dateStr) throws BaseAppException {
		try {
			Date d =JsonMapUtil.parse(format, dateStr);
			Timestamp ts= JsonMapUtil.parse(format,d);
			return ts;
		} catch (Exception e) {
			throw new BaseAppException(e.getMessage());
		}
	}

	@SuppressWarnings("unchecked")
	public static Map<String, Object> Json2Map(JSONObject json) {
		Map<String, Object> map = new HashMap<String, Object>();
		for (Object k : json.keySet()) {
			Object v = json.get(k);
			if (v instanceof JSONArray) {
				List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
				Iterator<Object> it = ((JSONArray) v).iterator();
				while (it.hasNext()) {
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

	public static JSONObject map2Json(Map<String, Object> map) {
		JSONObject json = new JSONObject();
		Set<String> set = map.keySet();
		for (Iterator<String> it = set.iterator(); it.hasNext();) {
			String key = it.next();
			json.put(key, map.get(key));
		}
		return json;
	}

	public static List<String> splitByNumbers(String text, int number) {
		List<String> strings = new ArrayList<String>();
        int index = 0;
        while (index < text.length()) {
            strings.add(text.substring(index, Math.min(index + number, text.length())));
            index += number;
        }
        return strings;
	}
}
