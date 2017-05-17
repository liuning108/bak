package com.ztesoft.zsmart.oss.core.pm.bscreen.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

public class BScreenUtil {
	
  public static  List<String> splitByNumbers(String text,int number){
	    List<String> strings = new ArrayList<String>();
		int index = 0;
		while (index < text.trim().length()) {
		    strings.add(text.substring(index, Math.min(index + number,text.length())));
		    index += number;
		}
		return strings;
  }
  public static String toString(Object o) throws BaseAppException{
	  String temp = o+"";
	  System.out.println(temp);
	  return temp.trim();
  }
  
  public static String getSeq(String paramString ) throws BaseAppException {
      String codePrefix  = "PMS";
      StringBuffer seq = new StringBuffer(SeqUtil.getSeq(paramString));
      while (seq.length() < 6) {
          seq.insert(0, "0");
      }
      String adapterNo = codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq;
      return adapterNo;
  }
}
