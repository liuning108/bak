package com.ztesoft.zsmart.oss.inms.pm.jobsys.tool;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.jobsys.tool <br>
 */
public class TimeProcess {
    /**
     * log <br>
     */
    private Logger logger = LoggerFactory.getLogger(TimeProcess.class.getName());

    /**
     * timeProcess <br>
     */
    private final static TimeProcess timeProcess = new TimeProcess();

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public static TimeProcess getInstance() {
        return timeProcess;
    }

    /***
     * 功能描述：日期转换cron表达式
     * 
     * @param date
     * @param dateFormat : e.g:yyyy-MM-dd HH:mm:ss
     * @return
     */
    public String formatDateByPattern(Date date, String dateFormat) {
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        String formatTimeStr = null;
        if (date != null) {
            formatTimeStr = sdf.format(date);
        }
        return formatTimeStr;
    }

    /***
     * convert Date to cron ,eg. "0 07 10 * * ? *"
     * 
     * @param date : 时间点
     * @return
     */
    public String getCronDay(java.util.Date date) {
        String dateFormat = "ss mm HH * * ? *";
        return formatDateByPattern(date, dateFormat);
    }

    public String getCronMin(java.util.Date date, String min) {
        if (Integer.parseInt(min) > 60) {
            logger.error("getCronMin PROFILE PROPER callMinutes SET ERROR!");
            return null;
        }
        String dateFormat = "0 */" + min + " * * * ? *";
        return formatDateByPattern(date, dateFormat);
    }

    public String getaddMin(java.util.Date date, String min) {
        if (Integer.parseInt(min) > 60) {
            logger.error("getaddMin PROFILE PROPER callMinutes SET ERROR!");
            return null;
        }
        String dateFormat = "0 */" + min + " * * * ? *";
        return formatDateByPattern(date, dateFormat);
    }

    public Date getTimeWithIntime(int seconds) {
        Date date = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.SECOND, seconds);
        date = c.getTime();
        return date;
    }

    public long getSecond(String date) {
        Date time = getStrTime(date);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(time);
        return time.getTime() / 1000;
    }

    public int getNowMinutes() {
        Calendar calendar = Calendar.getInstance();
        int min = calendar.get(Calendar.MINUTE);
        return min;
    }

    public int getNowHour() {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        return hour;
    }

    public int compareTime(Date fTime, java.util.Date sTime) {
        return sTime.compareTo(fTime);
    }

    /***
     * convert Date to cron ,eg. "0 07 10 15 1 ? 2016"
     * 
     * @param date : 时间点
     * @return
     */
    public String getCron(java.util.Date date) {
        String dateFormat = "ss mm HH dd MM ? yyyy";
        return formatDateByPattern(date, dateFormat);
    }

    public String getTimeStr(java.util.Date date) {
        String dateFormat = "yyyy-MM-dd HH:mm:ss";
        return formatDateByPattern(date, dateFormat);
    }

    public long getDiff(Date begin, Date end) {
        long interval = (end.getTime() - begin.getTime()) / 1000;
        return interval;
    }

    public String getFixedLenString(String str, int len, String c) {
        if (str == null || str.length() == 0) {
            str = "";
        }
        if(str.length() > len) return str.substring(str.length() - len);
        if (str.length() == len) {
            return str;
        }
        while (str.length() < len) {
            str = c + str;
        }
        return str;
    }

    public String getTaskidStr(java.util.Date date, int num, String str) {
        String dateFormat = "yyyyMMddHH";
        String day = formatDateByPattern(date, dateFormat);
        return "PMI-" + day + "-TA" + getFixedLenString(str, num, "0");
    }

    public Date getStrTime(String dateStr) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = sdf.parse(dateStr);
        }
        catch (ParseException e) {
            logger.error("getStrTime dateStr [" + dateStr + "] ParseException [" + e + "]");
        }
        return date;
    }

    public Date getDayTime(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
        Date day = null;
        String formatTimeStr = null;
        if (date != null) {
            formatTimeStr = sdf.format(date);
            day = getStrTime(formatTimeStr);
        }
        return day;
    }

    public String getSpecialTime(String time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = sdf.parse(time);
        }
        catch (ParseException e) {
            logger.error("getSpecialTime [" + time + "] ParseException [" + e + "]");
        }
        String dateFormat = "yyyyMMddHHmmss";
        return formatDateByPattern(date, dateFormat);
    }

    public HashMap<String, String> transformMap(Map<String, Object> src) {
        HashMap<String, String> dst = new HashMap<String, String>();
        if (null == src) {
            return dst;
        }
        for (Entry<String, Object> en : src.entrySet()) {
            dst.put(en.getKey(), String.valueOf(en.getValue()));
        }
        return dst;
    }

    public List<HashMap<String, String>> transformListMap(List<Map<String, Object>> src) {
        List<HashMap<String, String>> dst = new ArrayList<HashMap<String, String>>();
        if (null == src) {
            return dst;
        }
        for (Map<String, Object> ret : src) {
            HashMap<String, String> d = new HashMap<String, String>();
            for (Entry<String, Object> en : ret.entrySet()) {
                d.put(en.getKey(), String.valueOf(en.getValue()));
            }
            dst.add(d);
        }
        return dst;
    }
    public Date getEndTime(Date date, int dayN) {
        Date day = (new TimeProcess()).getDayTime(date);
        Calendar c = Calendar.getInstance();
        c.setTime(day);
        c.add(Calendar.DATE, dayN);
        return c.getTime();
    }   
    public String getDeadline(Date date, int frequency) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, frequency);
        Date new_date = calendar.getTime();
        return this.getTimeStr(new_date);
    }
}
