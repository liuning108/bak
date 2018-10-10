package com.ericsson.inms.pm.schedule.jobsys.tool;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.jobsys.tool <br>
 */
public class TimeProcess {
    /**
     * log <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(TimeProcess.class.getName(), "PM");

    /**
     * timeProcess <br>
     */
    private volatile static TimeProcess timeProcess;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public static TimeProcess getInstance() {
        if (timeProcess == null) {
            synchronized (TimeProcess.class) {
                if (timeProcess == null) timeProcess = new TimeProcess();
            }
        }
        return timeProcess;
    }

    private TimeProcess() {

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

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param min
     * @return  <br>
     */
    public String getCronMin(java.util.Date date, String min) {
        if (Integer.parseInt(min) > 60) {
            logger.error("SCHEDU-E-001", "getCronMin PROFILE PROPER callMinutes SET ERROR!");
            return null;
        }
        String dateFormat = "0 */" + min + " * * * ? *";
        return formatDateByPattern(date, dateFormat);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param min
     * @return  <br>
     */
    public String getaddMin(java.util.Date date, String min) {
        if (Integer.parseInt(min) > 60) {
            logger.error("SCHEDU-E-001", "getaddMin PROFILE PROPER callMinutes SET ERROR!");
            return null;
        }
        String dateFormat = "0 */" + min + " * * * ? *";
        return formatDateByPattern(date, dateFormat);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param seconds
     * @return  <br>
     */
    public Date getTimeWithIntime(int seconds) {
        Date date = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.SECOND, seconds);
        date = c.getTime();
        return date;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @return  <br>
     */
    public long getSecond(String date) {
        Date time = getStrTime(date);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(time);
        return time.getTime() / 1000;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getNowMinutes() {
        Calendar calendar = Calendar.getInstance();
        int min = calendar.get(Calendar.MINUTE);
        return min;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return  <br>
     */
    public int getNowHour() {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        return hour;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param fTime
     * @param sTime
     * @return  <br>
     */
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

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @return  <br>
     */
    public String getTimeStr(java.util.Date date) {
        String dateFormat = "yyyy-MM-dd HH:mm:ss";
        return formatDateByPattern(date, dateFormat);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param begin
     * @param end
     * @return  <br>
     */
    public long getDiff(Date begin, Date end) {
        long interval = (end.getTime() - begin.getTime()) / 1000;
        return interval;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param str
     * @param len
     * @param c
     * @return  <br>
     */
    public String getFixedLenString(String str, int len, String c) {
        if (str == null || str.length() == 0) {
            str = "";
        }
        if (str.length() > len) return str.substring(str.length() - len);
        if (str.length() == len) {
            return str;
        }
        while (str.length() < len) {
            str = c + str;
        }
        return str;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param num
     * @param str
     * @return  <br>
     */
    public String getTaskidStr(java.util.Date date, int num, String str) {
        String dateFormat = "yyyyMMddHH";
        String day = formatDateByPattern(date, dateFormat);
        return "PMI-" + day + "-TA" + getFixedLenString(str, num, "0");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param dateStr
     * @return  <br>
     */
    public Date getStrTime(String dateStr) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = sdf.parse(dateStr);
        }
        catch (ParseException e) {
            logger.error("SCHEDU-E-001", "getStrTime dateStr [" + dateStr + "] ParseException :", e);
        }
        return date;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @return  <br>
     */
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

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @return  <br>
     */
    public String getSpecialTime(String time) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = sdf.parse(time);
        }
        catch (ParseException e) {
            logger.error("SCHEDU-E-001", "getSpecialTime [" + time + "] ParseException :", e);
        }
        String dateFormat = "yyyyMMddHHmmss";
        return formatDateByPattern(date, dateFormat);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param dayN
     * @return  <br>
     */
    public Date getEndTime(Date date, int dayN) {
        Date day = (new TimeProcess()).getDayTime(date);
        Calendar c = Calendar.getInstance();
        c.setTime(day);
        c.add(Calendar.DATE, dayN);
        return c.getTime();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param frequency
     * @return  <br>
     */
    public String getDeadline(Date date, int frequency) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, frequency);
        Date new_date = calendar.getTime();
        return this.getTimeStr(new_date);
    }

    /**
     * [方法描述] 获取前N天btime<br>
     * @author [作者名]<br>
     * @param etime
     * @param n
     * @return  <br>
     */
    public Date getTimeBeforeDay(Date etime, int n) {
        Calendar btime = Calendar.getInstance();
        btime.setTime(etime);
        btime.add(Calendar.DATE, -n);
        return btime.getTime();
    }
}
