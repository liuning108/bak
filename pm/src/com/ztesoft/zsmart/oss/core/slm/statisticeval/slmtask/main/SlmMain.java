package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.main;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
//import org.apache.log4j.PropertyConfigurator;
import org.quartz.SchedulerException;

import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.DatastatisticMain;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job.SlaMaxData;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job.SystemCallSlmJob;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.job.SystemGenerateJob;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.trigger.SchedulerServer;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月27日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.main <br>
 */
public class SlmMain {
    /**
     * log <br>
     */
    public static final Logger logger = Logger.getLogger(SlmMain.class);

    // 需要控制系统任务启动时间，需要设置参数，任务在系统任务调度之间调度完成且只有一次的任务会消亡，第二次调度不影响
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time <br>
     * @return <br>
     * @throws SchedulerException <br>
     */
    private boolean addSystemJob(String time) throws SchedulerException {
        logger.info("--------------------------- addSysJob -------------------");
        if (SchedulerServer.getInstance().isStartTimerTisk() && (!"".equals(time))) {
            SchedulerServer.getInstance().addSlaMaxJob("SLA", "SLA", "0 0 4 1 * ? *", SlaMaxData.class);
            SchedulerServer.getInstance().addSysJob("SYSGETTASK", "group1", time, SystemCallSlmJob.class);
            return true;
        }
        else if (SchedulerServer.getInstance().isStartTimerTisk() && "".equals(time)) {
            SchedulerServer.getInstance().addSlaMaxJob("SLA", "SLA", "0 0 4 1 * ? *", SlaMaxData.class);
            SchedulerServer.getInstance().addSysJob("SYSGETTASK", "group1", "0 59 23 * * ? *", SystemCallSlmJob.class);
            return true;
        }
        return false;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time <br>
     * @throws Exception <br>
     */
    public void run(String time) throws Exception {
        logger.info("------------------------------- SystemJob started -------------------------------");
        SchedulerServer.getInstance().startTimerTask();
        if (SchedulerServer.getInstance().isStartTimerTisk()) {
            if (!addSystemJob(time)) {
                logger.error("SchedulerServer.getInstance() NOT STARTED!");
            }
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param time <br>
     * @throws SchedulerException <br>
     */
    public void test4GenerateJob(String time) throws SchedulerException {
        logger.info("-------------------------------- GenerateJob started ------------------------------");
        SchedulerServer.getInstance().startTimerTask();
        if (SchedulerServer.getInstance().isStartTimerTisk()) {
            if (!"".equals(time)) {
                SchedulerServer.getInstance().addGenerateJob("GENERATETASK", "group1", time, (SystemGenerateJob.class));
            }
            else {
                // 正常状态下每天生成一次任务
                SchedulerServer.getInstance().addGenerateJob("GENERATETASK", "group1", "0 0 1 * * ?", (SystemGenerateJob.class));
            }
            // return true;
        }
    }

    // private void fortimeTest() throws ParseException {
    // DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss.SSS");
    // dateFormat.setLenient(false);
    // java.util.Date btime = dateFormat.parse("2014-8-15 13:13:13.300");
    // java.util.Date etime = dateFormat.parse("2014-8-15 13:13:14.500");
    // Timestamp begin = new Timestamp(btime.getTime());
    // Timestamp end = new Timestamp(etime.getTime());
    // long taskExceDuration = (end.getNanos() - begin.getNanos()) / 1000000;
    // long task2 = etime.getTime() - btime.getTime();
    //
    // logger.info(taskExceDuration + "");
    // logger.info(task2 + "");
    // }

    /*
     * private void fortimeTest2() throws ParseException { DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss.SSS");
     * dateFormat.setLenient(false); java.util.Date btime = dateFormat.parse("2014-8-15 13:13:13.300"); java.util.Date etime = dateFormat.parse(
     * "2014-8-15 13:13:14.500"); Timestamp begin = new Timestamp(btime.getTime()); Timestamp end = new Timestamp(etime.getTime()); long
     * taskExceDuration = (end.getNanos() - begin.getNanos()) / 1000000; long task2 = etime.getTime() - btime.getTime(); logger.info(begin + "");
     * logger.info(btime + ""); }
     */

    /*
     * private void test4dataStio() throws BaseAppException { try { SlaScItemTableDAO sst = (SlaScItemTableDAO)
     * GeneralDAOFactory.create(SlaScItemTableDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM)); int ScItemFlag =
     * sst.selectDataBySlaNo("123456"); logger.info(ScItemFlag + "++++++++++++++++++++++"); } catch (BaseAppException e) { catch block <br>
     * logger.info("-----------------------" + e.getMessage()); } }
     */

    // private void testSelectDataFromTable() {
    // try {
    // SliDataTableDAOOracleImpl sst = (SliDataTableDAOOracleImpl) GeneralDAOFactory.create(SliDataTableDAO.class,
    // JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
    // List<HashMap<String, String>> ScData = sst.selectDataBySliNameN("slikpi1", "st_4_test", "2015-8-15 12:00:00", "2015-8-15
    // 12:05:00","S01","S01");
    // for (int i = 0; i < ScData.size(); i++) {
    // log.info("KPI value is :" + ScData.get(i).get("slikpi1".toUpperCase()));
    // }
    //
    // }
    // catch (BaseAppException e) {
    // log.info("-----------------------" + e.getMessage());
    // }
    // }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static Date getNextMonday() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, 1);
        calendar.add(Calendar.DAY_OF_WEEK, 1);
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
     * @param i <br>
     * @return <br>
     */
    public static Date getNnextMonday(int i) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, 1);
        calendar.add(Calendar.DAY_OF_WEEK, 1 + i * 7);
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
    public static Date getMondayOfThisWeek() {
        Calendar c = Calendar.getInstance();
        int day_of_week = c.get(Calendar.DAY_OF_WEEK) - 1;
        if (day_of_week == 0) {
            day_of_week = 7;
        }
        c.add(Calendar.DATE, -day_of_week + 1);
        return c.getTime();
    } // 获取本周一时间

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param mon <br>
     * @return <br>
     */
    public static Date nextMonthFirstDate(int mon) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.add(Calendar.MONTH, mon);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        return calendar.getTime();
    }

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
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static int getWeekInMonth() {
        Date thisweek = getMondayOfThisWeek();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(thisweek);
        int totalWeek = calendar.get(Calendar.WEEK_OF_MONTH);
        return totalWeek;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public static String getbtime() {
        SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        date = calendar.getTime();
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

    /*
     * private static boolean checkType(String etime, String time_win) { String dateString = etime; try { SimpleDateFormat sdf = new SimpleDateFormat(
     * "yyyy-MM-dd HH:mm:ss"); Date date = sdf.parse(dateString); Calendar calendar = Calendar.getInstance(); calendar.setTime(date); int dayOfLaskMon
     * = calendar.getActualMaximum(Calendar.DAY_OF_MONTH); int day = calendar.get(Calendar.DAY_OF_MONTH); logger.info("" + dayOfLaskMon + "::::" +
     * day); } catch (ParseException e) { logger.error(e.getMessage()); } return false; }
     */

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param btime <br>
     * @param min <br>
     * @return <br>
     */
    public static String addMint(String btime, int min) {
        SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();
        try {
            date = dateFormater.parse(btime);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.add(Calendar.MINUTE, min);
            date = calendar.getTime();
        }
        catch (ParseException e) {
            logger.error(e.toString());
        }
        return dateFormater.format(date);
    }

    /*
     * private static String string2Time(String cal_cycle, String setime, String sdelay) throws ParseException { DateFormat dateFormat = new
     * SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); dateFormat.setLenient(false); java.util.Date now = new Date(); java.util.Date etime =
     * dateFormat.parse(setime); java.util.Date stime = new Date(); String time = ""; Calendar cal = Calendar.getInstance(); long interval = 0; //
     * 考虑延时或者重算任务调度，若是此类任务直接调度以系统时间等待执行 if (now.getTime() > etime.getTime()) { stime.setTime(now.getTime() + 5 * 60 * 1000); cal.setTime(stime); time
     * = "0 " + cal.get(Calendar.MINUTE) + " " + cal.get(Calendar.HOUR_OF_DAY) + " " + cal.get(Calendar.DAY_OF_MONTH) + " " + (cal.get(Calendar.MONTH)
     * + 1) + " " + cal.get(Calendar.YEAR); logger.info("System time is:" + now.toString() + "SLI task will run at :" + time); return time; } interval
     * = (long) (5 * 60 * 1000 * Double.valueOf(sdelay)); stime.setTime(etime.getTime() + interval); cal.setTime(stime); time = "0 " +
     * cal.get(Calendar.MINUTE) + " " + cal.get(Calendar.HOUR_OF_DAY) + " " + cal.get(Calendar.DAY_OF_MONTH) + " " + (cal.get(Calendar.MONTH) + 1) +
     * " " + cal.get(Calendar.YEAR); logger.info("System time is:" + now.toString() + "SLI task will run at :" + time); return time; }
     */

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
    }

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

    /*
     * private static String getWeekTime(Date date) { Calendar cal = Calendar.getInstance(); cal.setTime(date); int year = cal.get(Calendar.YEAR); int
     * mon = cal.get(Calendar.MONTH) + 1; int day = cal.get(Calendar.DAY_OF_MONTH);// 0123456 String time = "" + year + "-" + mon + "-" + day + " " +
     * "00:" + "00:" + "00"; return time; }
     */

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cycle <br>
     * @return <br>
     */
    /*
     * private static int getCycle(String cycle) { int value = 1440; if ("00".equals(cycle)) { value = 5; } if ("01".equals(cycle)) { value = 15; } if
     * ("02".equals(cycle)) { value = 30; } if ("03".equals(cycle)) { value = 60; } if ("04".equals(cycle)) { value = 1440; } if ("05".equals(cycle))
     * { value = 1440 * 7; } if ("06".equals(cycle)) { java.util.Date now = new Date(); Calendar cal = Calendar.getInstance(); cal.setTime(now); int
     * totalDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH); value = totalDay * 1440 * 7; } return value; }
     */

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param cal_cycle
     * @param setime
     * @param sdelay
     * @param flag
     * @return <>
     * @throws ParseException <br>
     */
    /*
     * private static String string2Time(String cal_cycle, String setime, String sdelay, boolean flag) throws ParseException { DateFormat dateFormat =
     * new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); dateFormat.setLenient(false); java.util.Date now = new Date(); java.util.Date etime =
     * dateFormat.parse(setime); java.util.Date stime = new Date(); String time = ""; Calendar cal = Calendar.getInstance(); long interval = 0; //
     * 考虑延时或者重算任务调度，若是此类任务直接调度以系统时间等待执行 if (now.getTime() > etime.getTime()) { if (!flag) { stime.setTime(now.getTime() + 1 * 60 * 1000); } else {
     * stime.setTime(now.getTime() + 10 * 60 * 1000); } cal.setTime(stime); time = "0 " + cal.get(Calendar.MINUTE) + " " +
     * cal.get(Calendar.HOUR_OF_DAY) + " " + cal.get(Calendar.DAY_OF_MONTH) + " " + (cal.get(Calendar.MONTH) + 1) + " ? " + cal.get(Calendar.YEAR);
     * logger.info("System time is:" + now.toString() + " SLI task will run at :" + time); return time; } // log.info(cal_cycle + ":" + sdelay); if
     * (sdelay != null && cal_cycle != null) { interval = (long) (getCycle(cal_cycle) * 60 * 1000 * Double.valueOf(sdelay)); } else { interval = 0; }
     * stime.setTime(etime.getTime() + interval); cal.setTime(stime); time = "0 " + cal.get(Calendar.MINUTE) + " " + cal.get(Calendar.HOUR_OF_DAY) +
     * " " + cal.get(Calendar.DAY_OF_MONTH) + " " + (cal.get(Calendar.MONTH) + 1) + " ? " + cal.get(Calendar.YEAR); logger.info("System time is:" +
     * now.toString() + "SLI task will run at :" + time); return time; }
     */

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param args <br>
     * @throws Exception <br>
     */
    public static void main(String[] args) throws Exception {

        PropertyConfigurator.configure("../config/server/slmProcesslog4j.properties");

        /*
         * String result = string2Time("03", "2016-10-12 00:00:00", "1.4", false); logger.info(result);
         */

        DatastatisticMain thread = new DatastatisticMain();
        thread.start();
        logger.info("---------------------------------------------task GenerateJob------------------------------");
        SlmMain slm = new SlmMain();

        /*
         * java.util.Date now = new Date(); now = getNextMonday(now); now = getNextMonday(); now = getTimesMonthmorning(); int tnow =
         * getWeekInMonth(); test.run("0 20 15 21 9 ? 2016"); String sli_formula = "SUM(PPB0000004)"; String sk = sli_formula.replace("(", "(all.");
         * log.info(sk);
         */

        if (args.length > 1) {
            logger.info("args[0] is :" + args[0]);
            logger.info("args[1] is :" + args[1]);
            if ("1".equals(args[0])) {
                slm.test4GenerateJob(args[1]);
            }
            else if ("2".equals(args[0])) {
                slm.run(args[1]);
            }
        }
        else {
            slm.test4GenerateJob("");
            slm.run("");
        }

        /*
         * String btime = getWeekTime(getNextMonday(1)); String etime = getWeekTime(getNextMonday(2)); log.info(btime); log.info(etime); DecimalFormat
         * df = new DecimalFormat("0000000000"); int num = 221312313; String id = df.format(num); log.info(id); test.run();// 任务超时测试程序
         * string2Time("02","2016-09-07 17:30:00","1.2"); log.info(addMint("2016-09-15 08:00:00",60)); log.info(tnow+""); checkType(
         * "2016-09-15 00:00:00","S01"); log.info(addMint(60)); test.test4dataStio(); test.testSelectDataFromTable();
         */
    }
}
