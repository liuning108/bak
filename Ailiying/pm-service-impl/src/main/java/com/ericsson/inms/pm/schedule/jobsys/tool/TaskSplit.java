package com.ericsson.inms.pm.schedule.jobsys.tool;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskInst;
import com.ericsson.inms.pm.schedule.jobsys.model.TaskParamVer;
import com.ericsson.inms.pm.utils.PublicToolUtil;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.schedule.jobsys.tool <br>
 */
public class TaskSplit {

    /**
     * logger <br>
     */
    private OpbLogger logger = OpbLogger.getLogger(TaskSplit.class, "PM");

    /**
     * taskSplit <br>
     */
    private volatile static TaskSplit taskSplit;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public static TaskSplit getInstance() {
        if (taskSplit == null) {
            synchronized (TaskSplit.class) {
                if (taskSplit == null) taskSplit = new TaskSplit();
            }
        }
        return taskSplit;
    }

    private TaskSplit() {

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @param hourMin
     * @return  <br>
     */
    public Date addTimeHour(Date time, String hourMin) {
        Date date = time;
        if (hourMin != null) {
            try {
                Calendar c = Calendar.getInstance();
                c.setTime(time);
                int len = hourMin.indexOf(":");
                if (len > 0) {
                    int hour = Integer.parseInt(hourMin.substring(0, hourMin.indexOf(":")));
                    int min = Integer.parseInt(hourMin.substring(hourMin.indexOf(":") + 1, hourMin.length()));
                    c.add(Calendar.HOUR_OF_DAY, hour);
                    c.add(Calendar.MINUTE, min);
                }
                date = c.getTime();
            }
            catch (Exception e) {
                logger.error("SCHEDU-E-001",
                        "addTimeHour time[" + time + "] hourMin[" + hourMin + "] Exception[" + e + "]");
            }
        }
        return date;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param data
     * @return  <br>
     */
    public Date getLMonthEtime(Date date, Map<String, Object> data) {
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int period = Integer.parseInt(INTERVAL_PERIOD);
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        if (period < 0) {
            int maxDate = c.getActualMaximum(Calendar.DATE);
            c.add(Calendar.DATE, -1 * maxDate + 1);
        }
        else {
            int maxDate = c.getActualMaximum(Calendar.DATE);
            if (period > maxDate) {
                period = maxDate;
            }
            else {
                c.add(Calendar.DATE, -1 * period + 1);
            }
        }

        return c.getTime();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param data
     * @return  <br>
     */
    public Date getLWeekEtime(Date date, Map<String, Object> data) {
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int period = Integer.parseInt(INTERVAL_PERIOD);
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        if (data.get("FIRST_DAY_OF_WEEK").equals("1")) {
            c.add(Calendar.DATE, -1 * period + 1);
        }
        else if (data.get("FIRST_DAY_OF_WEEK").equals("0")) {
            c.add(Calendar.DATE, -1 * period);
        }

        return TimeProcess.getInstance().getDayTime(c.getTime());
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param data
     * @return  <br>
     */
    public Date getBtime(Date date, Map<String, Object> data) {
        Date btime = null;
        String CYCLE_SCHDULE_TYPE = String.valueOf(data.get("CYCLE_SCHDULE_TYPE"));
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int period = Integer.parseInt(INTERVAL_PERIOD);
        btime = getEtime(date, data);
        Calendar c = Calendar.getInstance();
        c.setTime(btime);
        switch (CYCLE_SCHDULE_TYPE) {
        case "1": {
            c.add(Calendar.MINUTE, -1 * period);
            btime = c.getTime();
        }
            break;
        case "2": {
            c.add(Calendar.HOUR_OF_DAY, -1 * period);
            btime = c.getTime();
        }
            break;
        case "3": {
            c.add(Calendar.DATE, -1 * period);
            btime = TimeProcess.getInstance().getDayTime(c.getTime());
        }
            break;
        case "4": {
            c.add(Calendar.WEEK_OF_YEAR, -1);
            btime = c.getTime();
        }
            break;
        case "5": {
            c.set(Calendar.DAY_OF_MONTH, 1);
            c.add(Calendar.MONTH, -1);
            btime = TimeProcess.getInstance().getDayTime(c.getTime());
        }
            break;
        }
        return btime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param date
     * @param data
     * @return  <br>
     */
    public Date getEtime(Date date, Map<String, Object> data) {
        Date etime = null;
        String CYCLE_SCHDULE_TYPE = String.valueOf(data.get("CYCLE_SCHDULE_TYPE"));
        String TRIGGER_TIME = String.valueOf(data.get("TRIGGER_TIME"));
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int hour = Integer.parseInt(TRIGGER_TIME.substring(0, TRIGGER_TIME.indexOf(":")));
        int min = Integer.parseInt(TRIGGER_TIME.substring(TRIGGER_TIME.indexOf(":") + 1));
        int period = Integer.parseInt(INTERVAL_PERIOD);
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.HOUR_OF_DAY, -1 * hour);
        c.add(Calendar.MINUTE, -1 * min);
        Date midDate = c.getTime();
        switch (CYCLE_SCHDULE_TYPE) {

        case "1":
        case "2":
            etime = midDate;
            break;
        case "3": {
            c.add(Calendar.DATE, -1 * period + 1);
            etime = TimeProcess.getInstance().getDayTime(c.getTime());
        }
            break;
        case "4": {
            etime = getLWeekEtime(midDate, data);
        }
            break;
        case "5": {
            etime = getLMonthEtime(midDate, data);
        }
            break;
        }
        return etime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @param data
     * @return  <br>
     */
    public Date getAddTimeHour(Date time, Map<String, Object> data) {
        String TRIGGER_TIME = String.valueOf(data.get("TRIGGER_TIME"));
        int hour = Integer.parseInt(TRIGGER_TIME.substring(0, TRIGGER_TIME.indexOf(":")));
        int min = Integer.parseInt(TRIGGER_TIME.substring(TRIGGER_TIME.indexOf(":") + 1));
        Calendar c = Calendar.getInstance();
        c.setTime(time);
        c.add(Calendar.HOUR_OF_DAY, hour);
        c.add(Calendar.MINUTE, min);

        Date date = c.getTime();
        return date;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @param data
     * @return  <br>
     */
    public Date getExecuDate(Date time, Map<String, Object> data) {
        String TRIGGER_TIME = String.valueOf(data.get("TRIGGER_TIME"));
        int hour = Integer.parseInt(TRIGGER_TIME.substring(0, TRIGGER_TIME.indexOf(":")));
        int min = Integer.parseInt(TRIGGER_TIME.substring(TRIGGER_TIME.indexOf(":") + 1));
        Calendar c = Calendar.getInstance();
        c.setTime(time);
        c.add(Calendar.HOUR_OF_DAY, hour);
        c.add(Calendar.MINUTE, min);
        Date date = c.getTime();
        return date;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @param data
     * @return  <br>
     */
    public Date getAddTimeDay(Date time, Map<String, Object> data) {
        Date triggerTime = null;
        Date dayTime = TimeProcess.getInstance().getDayTime(time);
        Calendar c = Calendar.getInstance();
        c.setTime(dayTime);
        String CYCLE_SCHDULE_TYPE = String.valueOf(data.get("CYCLE_SCHDULE_TYPE"));
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int intPeriod = Integer.parseInt(INTERVAL_PERIOD);
        switch (CYCLE_SCHDULE_TYPE) {
        case "4": {
            if (data.get("FIRST_DAY_OF_WEEK").equals("1")) {
                // 判断要计算的日期是否是周日，如果是则减一天计算周六的，否则会出问题，计算到下一周去了
                int dayWeek = c.get(Calendar.DAY_OF_WEEK);// 获得当前日期是一个星期的第几天
                if (1 == dayWeek) {
                    c.add(Calendar.DAY_OF_MONTH, -1);
                }

                c.setFirstDayOfWeek(Calendar.MONDAY);// 设置一个星期的第一天，按中国的习惯一个星期的第一天是星期一
            }
            int day = c.get(Calendar.DAY_OF_WEEK);// 获得当前日期是一个星期的第几天
            c.add(Calendar.DATE, c.getFirstDayOfWeek() - day);// 根据日历的规则，给当前日期减去星期几与一个星期第一天的差值
            c.add(Calendar.DATE, intPeriod - 1);
            triggerTime = c.getTime();
        }
            break;
        case "5": {
            if (intPeriod < 0) {
                c.add(Calendar.MONTH, 1);
                c.set(Calendar.DAY_OF_MONTH, 0);
            }
            else {
                c.set(Calendar.DAY_OF_MONTH, 1);
                c.add(Calendar.DATE, intPeriod - 1);
            }
            triggerTime = c.getTime();
        }
            break;
        }
        // triggerTime = addTimeHour(triggerTime,
        // String.valueOf(data.get("TRIGGER_TIME")));
        return triggerTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @param data
     * @return  <br>
     */
    public Date getTriggerTime(Date time, Map<String, Object> data) {
        Date triggerTime = null;
        String cycleType = String.valueOf(data.get("CYCLE_SCHDULE_TYPE"));
        switch (cycleType) {
        case "1":
        case "2": {
            triggerTime = getAddTimeHour(time, data);
        }
            break;
        case "3":
        case "4":
        case "5": {
            triggerTime = getAddTimeDay(time, data);
        }
            break;
        }
        return triggerTime;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param time
     * @param data
     * @return  <br>
     */
    public Date getNextTime(Date time, Map<String, Object> data) {
        Date triggerTime = null;
        Calendar c = Calendar.getInstance();
        c.setTime(time);
        String CYCLE_SCHDULE_TYPE = String.valueOf(data.get("CYCLE_SCHDULE_TYPE"));
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int intPeriod = Integer.parseInt(INTERVAL_PERIOD);
        switch (CYCLE_SCHDULE_TYPE) {
        case "1": {
            c.add(Calendar.MINUTE, intPeriod);
        }
            break;
        case "2": {
            c.add(Calendar.HOUR_OF_DAY, intPeriod);
        }
            break;
        case "3": {
            c.add(Calendar.DATE, intPeriod);
        }
            break;
        case "4": {
            c.add(Calendar.WEEK_OF_YEAR, 1);
        }
            break;
        case "5": {
            c.add(Calendar.MONTH, 1);
        }
            break;
        }
        triggerTime = c.getTime();
        return triggerTime;
    }

    /**
     * [方法描述] 第一次执行时间，>= 生效时间 and >= 当前时间<br> 
     *  
     * @author [作者名]<br>
     * @param data
     * @param date
     * @return  <br>
     */
    public Date getFirstTrigTime(Map<String, Object> data, Date date) {
        Date effDate = TimeProcess.getInstance().getStrTime(String.valueOf(data.get("EFF_DATE")));
        Date first = (effDate.before(date)) ? date : effDate;
        Date firstTriggerTime = getFirstTime(first, data);
        return firstTriggerTime;
    }

    public Date getFirstTime(Date date, Map<String, Object> data) {
        String CYCLE_SCHDULE_TYPE = PublicToolUtil.ObjectToStr(data.get("CYCLE_SCHDULE_TYPE"));
        String INTERVAL_PERIOD = PublicToolUtil.ObjectToStr(data.get("INTERVAL_PERIOD"));
        int intPeriod = Integer.parseInt(INTERVAL_PERIOD);
        switch (CYCLE_SCHDULE_TYPE) {
        case "1":
            return getMin(date, intPeriod);
        case "2":
            return getHour(date, intPeriod);
        case "3":
            return getDay(date);
        case "4":
            return getMonday(date, PublicToolUtil.ObjectToStr(data.get("FIRST_DAY_OF_WEEK")));
        case "5":
            return getMonthDay(date);
        }
        return null;
    }

    public Date getMonthDay(Date src) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
        String formatTimeStr = sdf.format(src);
        Calendar cc = Calendar.getInstance();
        cc.setTime(TimeProcess.getInstance().getStrTime(formatTimeStr));
        cc.add(Calendar.DATE, -(cc.get(Calendar.DAY_OF_MONTH) - 1));
        return cc.getTime();
    }

    public Date getMonday(Date src, String ret) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
        String formatTimeStr = sdf.format(src);
        Calendar cc = Calendar.getInstance();
        cc.setTime(TimeProcess.getInstance().getStrTime(formatTimeStr));
        if ("1".equals(ret)) {
            cc.setFirstDayOfWeek(Calendar.MONDAY);
            cc.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
            return cc.getTime();
        }
        else {
            cc.setFirstDayOfWeek(Calendar.SUNDAY);
            cc.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
            return cc.getTime();
        }
    }

    public Date getMin(Date src, int cycle) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:00");
        String formatTimeStr = sdf.format(src);
        Calendar c = Calendar.getInstance();
        c.setTime(TimeProcess.getInstance().getStrTime(formatTimeStr));
        int ret = c.get(Calendar.MINUTE) % cycle;
        c.add(Calendar.MINUTE, -ret);
        return c.getTime();
    }

    public Date getHour(Date src, int cycle) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:00:00");
        String formatTimeStr = sdf.format(src);
        Calendar c = Calendar.getInstance();
        c.setTime(TimeProcess.getInstance().getStrTime(formatTimeStr));
        int ret = c.get(Calendar.HOUR_OF_DAY) % cycle;
        c.add(Calendar.HOUR_OF_DAY, -ret);
        return c.getTime();
    }

    public Date getDay(Date src) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
        String formatTimeStr = sdf.format(src);
        return TimeProcess.getInstance().getStrTime(formatTimeStr);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param data
     * @param taskParamVer
     * @param instData4creat
     * @return  <br>
     */
    public List<TaskInst> taskSplit(Map<String, Object> data, TaskParamVer taskParamVer,
            Map<String, String> instData4creat) {
        List<TaskInst> listTaskInst = new ArrayList<TaskInst>();
        Date firstTriggerTime = (Date) data.get("first_triggerDate");// 第一条有效触发时间，没有返回null
        Date endTime = (Date) data.get("endTime");
        Date date = new Date();

        while (firstTriggerTime.before(endTime)) {
            TaskInst taskInst = new TaskInst();
            // insert data to inst table min
            String btime = TimeProcess.getInstance().getTimeStr(firstTriggerTime);
            Date retEtime = getNextTime(firstTriggerTime, data);
            String etime = TimeProcess.getInstance().getTimeStr(retEtime);
            String execDate = TimeProcess.getInstance().getTimeStr(getExecuDate(retEtime, data));
            String serial = "";
            try {
                serial = SeqUtils.getSeq("PM_TASK_SEQ");
            }
            catch (Exception e) {
                logger.error("SCHEDU-E-001", "taskNo[" + taskParamVer.getTaskNo()
                        + "] taskSplit get getSeq exception stop produce task inst [" + e + "]");
                return new ArrayList<TaskInst>();
            }

            serial = TimeProcess.getInstance().getTaskidStr(firstTriggerTime, 8, serial);
            taskInst.setTaskID(serial);
            taskInst.setBtime(btime);
            taskInst.setEtime(etime);
            taskInst.setTaskNo(taskParamVer.getTaskNo());
            taskInst.setTaskNoVer(taskParamVer.getTaskNoVer());
            taskInst.setTaskName((String) data.get("TASK_NAME"));
            taskInst.setTaskType((String) data.get("TASK_TYPE"));
            taskInst.setTaskCreateDate(TimeProcess.getInstance().getTimeStr(date));
            taskInst.setTaskExecDate(execDate);
            taskInst.setCycleSchduleType(taskParamVer.getCycleSchduleType());

            firstTriggerTime = getNextTime(firstTriggerTime, data);
            listTaskInst.add(taskInst);
        }

        instData4creat.put("OPERATE_DATE", TimeProcess.getInstance().getTimeStr(date));
        instData4creat.put("TASK_TRRIGER_DATE", TimeProcess.getInstance().getTimeStr(firstTriggerTime));
        instData4creat.put("TASK_NO", taskParamVer.getTaskNo());
        instData4creat.put("TASK_NO_VER", taskParamVer.getTaskNoVer());
        instData4creat.put("CYCLE_SCHDULE_TYPE", taskParamVer.getCycleSchduleType());
        return listTaskInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param data
     * @param begintime
     * @param endtime
     * @param listTaskInst
     * @return  <br>
     */
    public List<TaskInst> taskSplit(Map<String, Object> data, Date begintime, Date endtime,
            List<TaskInst> listTaskInst) {
        List<TaskInst> list = new ArrayList<TaskInst>();
        data.put("FIRST_DAY_OF_WEEK", "1");
        // 第一条有效触发时间，没有返回null
        Date firstTriggerTime = getFirstTrigTime(data, begintime);
        logger.debug("taskNO:" + data.get("TASK_NO") + " - "
                + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(firstTriggerTime) + " - "
                + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(endtime));
        if (firstTriggerTime != null) {
            while (firstTriggerTime.before(endtime)) {
                TaskInst inst = new TaskInst();
                inst.setBtime(TimeProcess.getInstance().getTimeStr(firstTriggerTime));
                inst.setEtime(TimeProcess.getInstance().getTimeStr(getNextTime(firstTriggerTime, data)));
                inst.setTaskNo(PublicToolUtil.ObjectToStr(data.get("TASK_NO")));
                firstTriggerTime = getNextTime(firstTriggerTime, data);
                list.add(inst);
            }
        }
        else {
            logger.error("SCHEDU-E-001",
                    "taskNo[" + PublicToolUtil.ObjectToStr(data.get("TASK_NO")) + "] getTriggerDate is null .");
        }
        return list;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param args
     * @throws Exception  <br>
     */
    public static void main(String[] args) throws Exception {
        String date2 = "2017-11-31 9:35:00";
        Date date = TimeProcess.getInstance().getStrTime(date2);
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("INTERVAL_PERIOD", "28");
        TaskSplit ts = new TaskSplit();
        String date3 = TimeProcess.getInstance().getTimeStr(ts.getLMonthEtime(date, map));
        System.out.println(date3);
    }
}
