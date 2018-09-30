package com.ztesoft.zsmart.oss.inms.pm.jobsys.tool;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskInst;
import com.ztesoft.zsmart.oss.inms.pm.jobsys.model.TaskParamVer;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;

public class TaskSplit {

    /**
     * logger <br>
     */
    private Logger logger = LoggerFactory.getLogger(TaskSplit.class);

    /**
     * taskSplit <br>
     */
    private final static TaskSplit taskSplit = new TaskSplit();

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @return <br>
     */
    public static TaskSplit getInstance() {
        return taskSplit;
    }

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
                logger.error("addTimeHour time[" + time + "] hourMin[" + hourMin + "] Exception[" + e + "]");
            }
        }
        return date;
    }

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

    public Date getAddTimeDay(Date time, Map<String, Object> data) {
        Date triggerTime = null;
        Date dayTime = TimeProcess.getInstance().getDayTime(time);
        Calendar c = Calendar.getInstance();
        c.setTime(dayTime);
        String CYCLE_SCHDULE_TYPE = String.valueOf(data.get("CYCLE_SCHDULE_TYPE"));
        String INTERVAL_PERIOD = String.valueOf(data.get("INTERVAL_PERIOD"));
        int intPeriod = Integer.parseInt(INTERVAL_PERIOD);
        switch (CYCLE_SCHDULE_TYPE) {
        case "3": {
            triggerTime = c.getTime();
        }
            break;
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
        triggerTime = addTimeHour(triggerTime, String.valueOf(data.get("TRIGGER_TIME")));
        return triggerTime;
    }

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

    public Date getFirstTrigTime(Map<String, Object> data, Date date) {
        Date EFF_DATE = TimeProcess.getInstance().getStrTime(String.valueOf(data.get("EFF_DATE")));
        Date EXP_DATE = TimeProcess.getInstance().getStrTime(String.valueOf(data.get("EXP_DATE")));

        Date firstTriggerTime = getTriggerTime(EFF_DATE, data);
        if (firstTriggerTime != null) {
            while (firstTriggerTime.before(date) && firstTriggerTime.before(EXP_DATE)) {
                firstTriggerTime = getNextTime(firstTriggerTime, data);
            }
        }

        return firstTriggerTime;
    }

    public List<TaskInst> taskSplit(Map<String, Object> data, TaskParamVer taskParamVer,
            Map<String, String> instData4creat) {
        List<TaskInst> listTaskInst = new ArrayList<TaskInst>();
        Date firstTriggerTime = (Date) data.get("first_triggerDate");// 第一条有效触发时间，没有返回null
        Date endTime = (Date) data.get("endTime");
        Date date = new Date();

        while (firstTriggerTime.before(endTime)) {
            TaskInst taskInst = new TaskInst();
            // insert data to inst table min
            String btime = TimeProcess.getInstance().getTimeStr(getBtime(firstTriggerTime, data));
            String etime = TimeProcess.getInstance().getTimeStr(getEtime(firstTriggerTime, data));
            String serial = "";
            try {
                serial = SeqUtils.getSeq("PM_TASK_SEQ");
            }
            catch (Exception e) {
                logger.error("taskNo[" + taskParamVer.getTaskNo()
                        + "] taskSplit get getSeq exception stop produce task inst [" + e + "]");
                return new ArrayList<TaskInst>();
            }

            serial = TimeProcess.getInstance().getTaskidStr(getEtime(firstTriggerTime, data), 8, serial);
            taskInst.setTaskID(serial);
            taskInst.setBtime(btime);
            taskInst.setEtime(etime);
            taskInst.setTaskNo(taskParamVer.getTaskNo());
            taskInst.setTaskNoVer(taskParamVer.getTaskNoVer());
            taskInst.setTaskName((String) data.get("TASK_NAME"));
            taskInst.setTaskType((String) data.get("TASK_TYPE"));
            taskInst.setTaskCreateDate(TimeProcess.getInstance().getTimeStr(date));
            taskInst.setTaskExecDate(TimeProcess.getInstance().getTimeStr(firstTriggerTime));
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
