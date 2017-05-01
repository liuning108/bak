package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.Session;
import com.ztesoft.zsmart.core.jdbc.SessionContext;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.DataStatistic;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliInstTableDAO;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SliTaskTableDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月27日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job <br>
 */
public class SystemGenerateJob implements Job {
    /**
     * log <br>
     */
    private static Logger log = Logger.getLogger(SliJob.class);

    /**
     * cycle_5 <br>
     */
    private static String cycleFive = "00";

    /**
     * cycle_15 <br>
     */
    private static String cycleFifty = "01";

    /**
     * cycle_30 <br>
     */
    private static String cycleThirty = "02";

    /**
     * cycle_60 <br>
     */
    private static String cycleSixty = "03";

    /**
     * cycle_day <br>
     */
    private static String cycleDay = "04";

    /**
     * cycle_week <br>
     */
    private static String cycleWeek = "05";

    /**
     * cycle_mon <br>
     */
    private static String cycleMon = "06";

    /**
     * cycle_year <br>
     */
    private static String cycleYear = "07";

    /**
     * cycle_equal <br>
     */
    private static String cycleEqual = "99";

    /**
     * <br>
     */
    public SystemGenerateJob() {
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cycle <br>
     * @return <br>
     */
    private int getCycle(String cycle) {
        int value = 1440;
        if ("00".equals(cycle)) {
            value = 5;
        }
        if ("01".equals(cycle)) {
            value = 15;
        }
        if ("02".equals(cycle)) {
            value = 30;
        }
        if ("03".equals(cycle)) {
            value = 60;
        }
        if ("04".equals(cycle)) {
            value = 1440;
        }
        if ("05".equals(cycle)) {
            value = 1440 * 7;
        }
        if ("06".equals(cycle)) {
            java.util.Date now = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(now);
            int totalDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
            value = totalDay * 1440 * 7;
        }
        return value;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param ttype <br>
     * @param inst <br>
     * @param taskNum <br>
     * @param btime <br>
     * @param etime <br>
     * @throws BaseAppException <br>
     */
    private void insertSliTaskDb(int ttype, HashMap<String, String> inst, int taskNum, String btime, String etime) throws BaseAppException {
        SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
        DecimalFormat monOrDay = new DecimalFormat("00");
        Date date = new Date();
        Date dBtime = new Date();
        Date dEtime = new Date();
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int mon = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        HashMap<String, String> localHashMap = new HashMap<String, String>();

        String serial = SeqUtil.getSeq("SLM_TASK_ID");
        serial = getFixedLenString(serial, 10, "0");
        log.info("----------------------" + serial);
        if ("".equals(serial)) {
            return;
        }
        localHashMap.put("taskId", "TASK-" + year + monOrDay.format(mon) + monOrDay.format(day) + "-" + serial);
        log.info("the task id is: " + inst.get("sli_instid".toUpperCase()) + +taskNum);
        localHashMap.put("btime", btime);
        localHashMap.put("etime", etime);
        localHashMap.put("sla_instid", inst.get("sla_instid".toUpperCase()));
        localHashMap.put("slo_instid", inst.get("slo_instid".toUpperCase()));
        localHashMap.put("sli_instid", inst.get("sli_instid".toUpperCase()));
        localHashMap.put("sli_no", inst.get("sli_no".toUpperCase()));
        localHashMap.put("task_type", ttype + "");
        localHashMap.put("st_table", "TASK-" + year + monOrDay.format(mon) + monOrDay.format(day) + "-" + serial);

        try {
            dBtime = dateFormater.parse(btime);
            dEtime = dateFormater.parse(etime);
        }
        catch (ParseException e) {
            // e.printStackTrace();
            log.error("TIME error!", e);
        }

        List<String> st_table = DataStatistic.getTableNameList(inst.get("sli_no".toUpperCase()), inst.get("cycle_units".toUpperCase()),
            inst.get("daypattern_id".toUpperCase()), inst.get("timepattern_id".toUpperCase()), dBtime, dEtime);
        if (st_table.size() > 0) {
            for (int i = 0; i < st_table.size(); i++) {
                log.info("Get Table Name is: " + st_table.get(i));
            }
        }
        else {
            log.info("No kpi table!!!!!!!!!!");
        }

        localHashMap.put("evaluate_cycle", inst.get("time_win".toUpperCase()));
        localHashMap.put("cal_cycle", inst.get("cal_cycle".toUpperCase()));
        localHashMap.put("cycle_units", inst.get("cycle_units".toUpperCase()));
        localHashMap.put("operator", inst.get("operator".toUpperCase()));
        localHashMap.put("daypattern_id", inst.get("daypattern_id".toUpperCase()));
        localHashMap.put("timepattern_id", inst.get("timepattern_id".toUpperCase()));
        localHashMap.put("warn_value", inst.get("warn_value".toUpperCase()));
        localHashMap.put("objectives_value", inst.get("objectives_value".toUpperCase()));
        localHashMap.put("delayTime", "1.2");
        localHashMap.put("delayTimeSlo", "1.4");
        localHashMap.put("time_win", inst.get("time_win".toUpperCase()));

        localHashMap.put("taskcreatetime", dateFormater.format(date));
        localHashMap.put("state", "1");
        SliInstTableDAO sst;
        SliTaskTableDAO sliTask;

        sst = (SliInstTableDAO) GeneralDAOFactory.create(SliInstTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        sliTask = (SliTaskTableDAO) GeneralDAOFactory.create(SliTaskTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));

        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            sst.insertSliTaskList(localHashMap);
            sst.insertSloTaskList(localHashMap);
            sliTask.insertTableNameData(localHashMap.get("taskId"), st_table);
            ses.commitTrans();

        }
        catch (BaseAppException e) {
            log.error("execute GemerateJob error! insert task data into table error", e);
        }
        finally {
            if (ses != null) {
                try {
                    ses.releaseTrans();
                }
                catch (BaseAppException e) {
                    // TODO Auto-generated catch block
                    log.error(e.toString());
                }
            }
        }

    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param week <br>
     * @return <br>
     */
    public static Date getNextMonday(int week) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, 1);
        calendar.add(Calendar.DAY_OF_WEEK, 1 + week * 7);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        return calendar.getTime();
    } // 获取下周一时间

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static Date getNnextMonday() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, 1);
        calendar.add(Calendar.DAY_OF_WEEK, 1 + 7);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        return calendar.getTime();
    } // 获取下下周一时间

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static Date getTimesMonthmorning() {
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return cal.getTime();
    }

    /**
     * [获取以后任意月1号0点日期] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param mon <br>
     * @return <br>
     */
    public static Date nextMonthFirstDate(int mon) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.add(Calendar.MONTH, mon + 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        return calendar.getTime();
    }

    /**
     * [获取本周一时间] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static Date getMondayOfThisWeek() {
        Calendar c = Calendar.getInstance();
        int day_of_week = c.get(Calendar.DAY_OF_WEEK) - 1;
        if (day_of_week == 0) {
            day_of_week = 7;
        }
        c.add(Calendar.DATE, -day_of_week + 1);
        return c.getTime();
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param date <br>
     * @return <br>
     */
    private String getWeekTime(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int year = cal.get(Calendar.YEAR);
        int mon = cal.get(Calendar.MONTH);
        int day = cal.get(Calendar.DAY_OF_MONTH);
        String time = "" + year + "-" + mon + "-" + day + " " + "00:" + "00:" + "00";
        return time;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param monOrYear <br>
     * @return <br>
     */
    private boolean checkIflaskweek(int monOrYear) {
        if (monOrYear == 0) {
            Calendar calendar = Calendar.getInstance();
            int thisMon = calendar.get(Calendar.MONTH);
            calendar.set(Calendar.DAY_OF_WEEK, 1);
            calendar.add(Calendar.DAY_OF_WEEK, 1 + 7);
            int nextWeekMon = calendar.get(Calendar.MONTH);
            if (thisMon != nextWeekMon) {
                return true;
            }
        }
        else if (monOrYear == 1) {
            Calendar calendar = Calendar.getInstance();
            int thisYear = calendar.get(Calendar.YEAR);
            calendar.set(Calendar.DAY_OF_WEEK, 1);
            calendar.add(Calendar.DAY_OF_WEEK, 1 + 7);
            int nextMonYear = calendar.get(Calendar.YEAR);
            if (thisYear != nextMonYear) {
                return true;
            }
        }
        return false;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    private boolean checkIflaskMon() {
        Calendar calendar = Calendar.getInstance();
        int thisYear = calendar.get(Calendar.YEAR);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.add(Calendar.MONTH, 1);
        int nextMonYear = calendar.get(Calendar.YEAR);
        if (thisYear != nextMonYear) {
            return true;
        }
        return false;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param min <br>
     * @param timeWin <br>
     * @return <br>
     */
    public static String getbtime(int min, String timeWin) {
        SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        if (!timeWin.equals(cycleWeek) && !timeWin.equals(cycleMon) && !timeWin.equals(cycleYear)) {
            calendar.setTime(date);
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.add(Calendar.MINUTE, min);
            date = calendar.getTime();
        }
        else {
            if (timeWin.equals(cycleWeek)) {
                date = getMondayOfThisWeek();
                calendar.setTime(date);
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                calendar.add(Calendar.MINUTE, 0);
                date = calendar.getTime();
            }
            else if (timeWin.equals(cycleMon)) {
                log.info("run getBtime time_win is: " + timeWin);
                date = getTimesMonthmorning();
                calendar.setTime(date);
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                calendar.add(Calendar.MINUTE, 0);
                date = calendar.getTime();
            }
            else if (timeWin.equals(cycleYear)) {
                calendar.setTime(date);
                calendar.set(Calendar.MONTH, 0);
                calendar.set(Calendar.DAY_OF_MONTH, 1);
                calendar.set(Calendar.HOUR_OF_DAY, 0);
                calendar.set(Calendar.MINUTE, 0);
                calendar.set(Calendar.SECOND, 0);
                calendar.add(Calendar.MINUTE, 0);
                date = calendar.getTime();
            }
        }
        return dateFormater.format(date);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param min <br>
     * @return <br>
     */
    public static String addMint(int min) {
        SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.add(Calendar.MINUTE, min);
        date = calendar.getTime();

        return dateFormater.format(date);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param timeStr <br>
     * @return <br>
     */
    public static int getHour(String timeStr) {
        int hour = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(timeStr);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            hour = calendar.get(Calendar.HOUR_OF_DAY);
        }
        catch (ParseException e) {
            log.error(e.getMessage());
        }
        return hour;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param timeStr <br>
     * @return <br>
     */
    public static int getMin(String timeStr) {
        int min = 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(timeStr);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            min = calendar.get(Calendar.MINUTE);
        }
        catch (ParseException e) {
            log.error(e.getMessage());
        }
        return min;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param str <br>
     * @param len <br>
     * @param c <br>
     * @return <br>
     */
    public static String getFixedLenString(String str, int len, String c) {
        if (str == null || str.length() == 0) {
            str = "";
        }
        if (str.length() == len || str.length() > len) {
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
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param dateString <br>
     * @return <br>
     */
    private static boolean getCycleFive(String time_win, String timepattern_id, String dateString) {
        boolean flag = false;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int min = calendar.get(Calendar.MINUTE);
            if (time_win.equals(cycleFifty)) {
                if (0 == min || 30 == min || 15 == min) {
                    flag = true;
                }
            }
            if (time_win.equals(cycleFive)) {
                if (0 == min || 30 == min || 15 == min || 5 == min) {
                    flag = true;
                }
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param dateString <br>
     * @return <br>
     */
    private static boolean getCycleHour(String time_win, String timepattern_id, String dateString) {
        boolean flag = false;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int min = calendar.get(Calendar.MINUTE);
            if (time_win.equals(cycleSixty)) {
                if (0 == min) {
                    flag = true;
                }
            }
            if (time_win.equals(cycleThirty)) {
                if (0 == min || 30 == min) {
                    flag = true;
                }
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return flag;
    }
    
    
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param dateString <br>
     * @return <br>
     */
    private static boolean getCycleDay(String time_win, String timepattern_id, String dateString) {
        boolean flag = false;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            int min = calendar.get(Calendar.MINUTE);
            if (time_win.equals(cycleDay)) {
                if (("S01".equals(timepattern_id) || "S03".equals(timepattern_id)) && (min == 0 && hour == 0)) {
                    flag = true;
                }
                if ("S02".equals(timepattern_id) && (min == 0 && hour == 18)) {
                    flag = true;
                }
            }
            date = sdf.parse(dateString);
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param dateString <br>
     * @return <br>
     */
    private static boolean getCycleWeek(String time_win, String timepattern_id, String dateString) {
        boolean flag = false;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            int min = calendar.get(Calendar.MINUTE);
            int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
            if (time_win.equals(cycleWeek)) {
                if (("S01".equals(timepattern_id) || "S03".equals(timepattern_id)) && (min == 0 && hour == 0 && dayOfWeek == 1)) {
                    flag = true;
                }
                if ("S02".equals(timepattern_id) && (min == 0 && hour == 18 && dayOfWeek == 0)) {
                    flag = true;
                }
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param dateString <br>
     * @return <br>
     */
    private static boolean getCycleMon(String time_win, String timepattern_id, String dateString) {
        boolean flag = false;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            int min = calendar.get(Calendar.MINUTE);
            int dayOfLaskMon = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
            if (time_win.equals(cycleMon)) {
                if (("S01".equals(timepattern_id) || "S03".equals(timepattern_id)) && (min == 0 && hour == 0 && day == 1)) {
                    flag = true;
                }
                if ("S02".equals(timepattern_id) && (min == 0 && hour == 18 && day == dayOfLaskMon)) {
                    flag = true;
                }
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param dateString <br>
     * @return <br>
     */
    private static boolean getCycleYear(String time_win, String timepattern_id, String dateString) {
        boolean flag = false;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int mon = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            int min = calendar.get(Calendar.MINUTE);
            if (time_win.equals(cycleYear)) {
                if (("S01".equals(timepattern_id) || "S03".equals(timepattern_id)) && (min == 0 && hour == 0 && day == 1 && mon == 1)) {
                    flag = true;
                }
                if ("S02".equals(timepattern_id) && (min == 0 && hour == 18 && mon == 12)) {
                    flag = true;
                }
            }
            // date = sdf.parse(dateString);
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param etime <br>
     * @return <br>
     */
    private static boolean getFiveFlag(String time_win, String timepattern_id, String etime) {
        String dateString = etime;
        boolean typeFlag = false;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int min = calendar.get(Calendar.MINUTE);
            // 5
            if (time_win.equals(cycleFive) || (time_win.equals(cycleFifty) && (min % 15 == 0))
                || (time_win.equals(cycleThirty) && (min == 30 || min == 0)) || (time_win.equals(cycleSixty) && (min == 0))) {
                typeFlag = true;
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return typeFlag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @param etime <br>
     * @return <br>
     */
    private static boolean getDayFlag(String time_win, String timepattern_id, String etime) {
        String dateString = etime;
        boolean typeFlag = false;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date;
        try {
            date = sdf.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            int min = calendar.get(Calendar.MINUTE);

            // 1440
            if (time_win.equals(cycleDay) && ("S01".equals(timepattern_id) || ("S03".equals(timepattern_id) && (min == 0 && hour == 0))
                || ("S02".equals(timepattern_id) && (min == 0 && hour == 18)))) {
                typeFlag = true;
            }
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
        return typeFlag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param etime <br>
     * @param time_win <br>
     * @param timepattern_id <br>
     * @return <br>
     */
    private static boolean checkType(String etime, String time_win, String timepattern_id) {
        boolean typeFlag = false;

        if (getFiveFlag(time_win, timepattern_id, etime)) {
            typeFlag = getCycleFive(time_win, timepattern_id, etime) || getCycleHour(time_win, timepattern_id, etime);
        }
        if (getDayFlag(time_win, timepattern_id, etime)) {
            typeFlag = getCycleDay(time_win, timepattern_id, etime);
        }
        if (time_win.equals(cycleWeek)) {
            typeFlag = getCycleWeek(time_win, timepattern_id, etime);
        }
        if (time_win.equals(cycleMon)) {
            typeFlag = getCycleMon(time_win, timepattern_id, etime);
        }
        if (time_win.equals(cycleYear)) {
            typeFlag = getCycleYear(time_win, timepattern_id, etime);
        }

        return typeFlag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param task_type <br>
     * @param dayofWeek <br>
     * @param inst <br>
     */
    private void cycleWeekInsertData(String time_win, int task_type, int dayofWeek, HashMap<String, String> inst) {

        if (time_win.equals(cycleWeek)) {
            task_type = 1;
            if (dayofWeek == 1) {
                String btime = getWeekTime(getNextMonday(1));
                String etime = getWeekTime(getNextMonday(2));
                try {
                    insertSliTaskDb(task_type, inst, 0, btime, etime);
                }
                catch (BaseAppException e) {
                    // TODO Auto-generated catch block <br>
                    log.error(e.toString());
                }
            }
        }
        else {
            if (dayofWeek == 1) {
                if ((time_win.equals(cycleMon) && checkIflaskweek(0)) || (time_win.equals(cycleYear) && checkIflaskweek(1))) {
                    task_type = 1;
                }
                else {
                    task_type = 0;
                }
                String btime = getWeekTime(getNextMonday(1));
                String etime = getWeekTime(getNextMonday(2));
                try {
                    insertSliTaskDb(task_type, inst, 0, btime, etime);
                }
                catch (BaseAppException e) {
                    // TODO Auto-generated catch block <br>
                    log.error(e.toString());
                }
            }
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param task_type <br>
     * @param dayofMon <br>
     * @param inst <br>
     */
    private void cycleMonInsertData(String time_win, int task_type, int dayofMon, HashMap<String, String> inst) {

        if (time_win.equals(cycleMon)) {
            task_type = 1;
            if (dayofMon == 1) {
                String btime = getWeekTime(nextMonthFirstDate(0));
                String etime = getWeekTime(nextMonthFirstDate(1));
                try {
                    insertSliTaskDb(task_type, inst, 0, btime, etime);
                }
                catch (BaseAppException e) {
                    // TODO Auto-generated catch block <br>
                    log.error(e.toString());
                }
            }
        }
        else if (time_win.equals(cycleYear)) {
            if (dayofMon == 1) {
                if (time_win.equals(cycleMon) && checkIflaskMon()) {
                    task_type = 1;
                }
                else {
                    task_type = 0;
                }
                String btime = getWeekTime(getNextMonday(0));
                String etime = getWeekTime(getNextMonday(1));
                try {
                    insertSliTaskDb(task_type, inst, 0, btime, etime);
                }
                catch (BaseAppException e) {
                    // TODO Auto-generated catch block <br>
                    log.error(e.toString());
                }
            }
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cal_cycle <br>
     * @param timepattern_id <br>
     * @param etime <br>
     * @return <br>
     */
    private boolean getContinue(String cal_cycle, String timepattern_id, String etime) {
        boolean flag = !cal_cycle.equals(cycleDay) && "S02".equals(timepattern_id)
            && ((getHour(etime) < 9 && (getHour(etime) > 17) || (getHour(etime) == 17 && getMin(etime) > 0)));
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cal_cycle <br>
     * @param timepattern_id <br>
     * @param etime <br>
     * @return <br>
     */
    private boolean getContinue2(String cal_cycle, String timepattern_id, String etime) {
        boolean flag = !cal_cycle.equals(cycleDay) && "S03".equals(timepattern_id) && (((getHour(etime) > 9 && getHour(etime) < 17))
            || (getHour(etime) == 9 && getMin(etime) > 0) || (getHour(etime) == 17 && getMin(etime) == 0));
        return flag;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time_win <br>
     * @param cal_cycle <br>
     * @param timepattern_id <br>
     * @param inst <br>
     */
    private void splitTaskIntoTable(String time_win, String cal_cycle, String timepattern_id, HashMap<String, String> inst) {
        String btime = "";
        String etime = "";
        int min = 0;
        int task_type = 0;
        for (int tasknum = 0; min < 1440; tasknum++) {
            log.debug("Begin split task count NUM is: " + tasknum);
            log.debug("Begin split task time_win is: " + time_win);
            btime = getbtime(min / getCycle(time_win) * getCycle(time_win), time_win);
            etime = addMint(min + getCycle(cal_cycle));
            log.debug("the btime is: " + btime);
            log.debug("the etime is: " + etime);
            if (getContinue(cal_cycle, timepattern_id, etime)) {
                min = min + getCycle(cal_cycle);
                log.debug("the first jump into this logic , cal_cycle is: " + cal_cycle);
                log.debug("into this logic , timepattern_id is: " + timepattern_id);
                log.debug("into this logic , getHour(etime) is: " + getHour(etime));

                continue;
            }
            if (getContinue2(cal_cycle, timepattern_id, etime)) {
                min = min + getCycle(cal_cycle);

                log.debug("the sencond jump into this logic , cal_cycle is: " + cal_cycle);
                log.debug("into this logic , timepattern_id is: " + timepattern_id);
                log.debug("into this logic , getHour(etime) is: " + getHour(etime));

                continue;
            }
            if (checkType(etime, time_win, timepattern_id)) {
                task_type = 1;
            }
            else {
                task_type = 0;
            }
            log.info("into the table the sli_instid is : " + inst.get("sli_instid".toUpperCase()));
            try {
                insertSliTaskDb(task_type, inst, tasknum, btime, etime);
            }
            catch (BaseAppException e) {
                // TODO Auto-generated catch block <br>
                log.error(e.toString());
            }
            min = min + getCycle(cal_cycle);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param inst <br>
     */
    private void cycleInsertData(HashMap<String, String> inst) {
        String daypattern_id = inst.get("daypattern_id".toUpperCase());
        String timepattern_id = inst.get("timepattern_id".toUpperCase());
        String cal_cycle = inst.get("cycle_units".toUpperCase());
        String time_win = inst.get("time_win".toUpperCase());
        java.util.Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        int dayofWeek = cal.get(Calendar.DAY_OF_WEEK) - 1;

        if ("S02".equals(daypattern_id) && (dayofWeek == 5 || dayofWeek == 6)) {
            return;
        }
        if ("S03".equals(daypattern_id) && (dayofWeek != 5 || dayofWeek != 6)) {
            return;
        }

        splitTaskIntoTable(time_win, cal_cycle, timepattern_id, inst);

    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param inst <br>
     * @throws BaseAppException <br>
     */
    private void splitTaskInTable(HashMap<String, String> inst) throws BaseAppException {
        String cal_cycle = inst.get("cycle_units".toUpperCase());
        String time_win = inst.get("time_win".toUpperCase());
        java.util.Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        int dayofWeek = cal.get(Calendar.DAY_OF_WEEK) - 1;
        int dayofMon = cal.get(Calendar.DAY_OF_MONTH);
        if (time_win.equals(cycleEqual)) {
            time_win = cal_cycle;
        }
        int task_type = 0;

        if (cal_cycle == null || "".equals(cal_cycle)) {
            log.warn("cal_cycle is null,return,sli_inst is: " + inst.get("sli_instid".toUpperCase()));
            return;
        }
        log.info("cal_cycle is " + inst.get("cycle_units".toUpperCase()) + ",sli_inst is: " + inst.get("sli_instid".toUpperCase()));
        if (cal_cycle.equals(cycleFive) || cal_cycle.equals(cycleFifty) || cal_cycle.equals(cycleThirty) || cal_cycle.equals(cycleSixty)
            || cal_cycle.equals(cycleDay)) {
            cycleInsertData(inst);
        }

        if (cal_cycle.equals(cycleWeek)) {
            cycleWeekInsertData(time_win, task_type, dayofWeek, inst);
        }
        if (cal_cycle.equals(cycleMon)) {
            cycleMonInsertData(time_win, task_type, dayofMon, inst);

        }

    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @throws BaseAppException <br>
     */
    private void addGenerateJob() throws BaseAppException {
        SliInstTableDAO sliInst = (SliInstTableDAO) GeneralDAOFactory.create(SliInstTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
        List<HashMap<String, String>> instList;
        Session ses = null;
        try {
            ses = SessionContext.newSession();
            ses.beginTrans();
            instList = sliInst.selectSliInst();
            ses.commitTrans();

            HashMap<String, String> inst = new HashMap<String, String>();
            for (int i = 0; i < instList.size(); i++) {
                log.info("map size is : " + instList.size() + "this type is: " + i);
                inst = instList.get(i);
                splitTaskInTable(inst);
            }

        }
        catch (BaseAppException e) {
            log.error("execute GenerateJob error!", e);
        }
        finally {
            if (ses != null) {
                try {
                    ses.releaseTrans();
                }
                catch (BaseAppException e) {
                    // TODO Auto-generated catch block
                    log.error(e.toString());
                }
            }
        }
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        try {
            addGenerateJob();
        }
        catch (BaseAppException e) {
            // TODO Auto-generated catch block <br>
            log.error(e.toString());
        }
    }

}
