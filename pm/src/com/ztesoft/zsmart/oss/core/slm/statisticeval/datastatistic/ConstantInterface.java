package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月9日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.datastatistic <br>
 */
public class ConstantInterface {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(ConstantInterface.class.getName());
    
    /**
     * 参数配置文件目录
     */
    private static String fileName = "../config/server/dataStatistic.properties";
    
    /**
     * 实体表更新粒度 MIN
     */
    public static int updateEntyInfoCycle = 1440;
    
    /**
     *   5分钟统计执行延时的秒数 
     */
    public static int fiveStatSecondDelay = 120;

    /**
     *  60分钟以上粒度各个统计task执行延时的分钟数
     */
    public static int hourStatMinDelay = 10;

    /**
     * dayStatMinDelay <br>
     */
    public static int dayStatMinDelay = 60;

    /**
     * wkStatMinDelay <br>
     */
    public static int wkStatMinDelay = 120;

    /**
     * monStatMinDelay <br>
     */
    public static int monStatMinDelay = 180;

    /**
     * 历史数据相对于当前时间延时分钟数 <br>
     */
    public static int fiveHistoryStatMinDelay = 2;

    /**
     * hourHistoryStatMinDelay <br>
     */
    public static int hourHistoryStatMinDelay = 20;

    /**
     * dayHistoryStatMinDelay <br>
     */
    public static int dayHistoryStatMinDelay = 120;

    /**
     * wkHistoryStatMinDelay <br>
     */
    public static int wkHistoryStatMinDelay = 180;

    /**
     * monHistoryStatMinDelay <br>
     */
    public static int monHistoryStatMinDelay = 180;

    /**
     * failedCron <br>
     */
    public static String failedCron = "1 1 1 1 1 ? 2020";

    /**
     * 天分表执行建表任务的cron表达式
     */
    public static String dayCrttablemethCron = "0 0 0 * * ?";

    /**
     * 月分表执行建表任务的cron表达式
     */
    public static String monCrttablemethCron = "0 0 0 1 * ?";

    /**
     * 年分表执行建表任务的cron表达式
     */
    public static String yearCrttablemethCron = "0 0 0 1 * ?";

    /**
     * 指定统计的开始时间和结束时间，默认不指定
     */
    public static String stbtime = "";

    /**
     *指定统计的开始时间和结束时间，默认不指定
     */
    public static String stetime = "";

    static {
        try {
            Properties prop = new Properties();
            FileInputStream in = new FileInputStream(fileName);
            prop.load(in);
            in.close();

            if (prop.containsKey("updateEntyInfoCycle")) {
                updateEntyInfoCycle = Integer.parseInt(prop.getProperty("updateEntyInfoCycle").trim());
            }

            if (prop.containsKey("fiveStatSecondDelay")) {
                fiveStatSecondDelay = Integer.parseInt(prop.getProperty("fiveStatSecondDelay").trim());
            }

            if (prop.containsKey("hourStatMinDelay")) {
                hourStatMinDelay = Integer.parseInt(prop.getProperty("hourStatMinDelay").trim());
            }

            if (prop.containsKey("dayStatMinDelay")) {
                dayStatMinDelay = Integer.parseInt(prop.getProperty("dayStatMinDelay").trim());
            }

            if (prop.containsKey("wkStatMinDelay")) {
                wkStatMinDelay = Integer.parseInt(prop.getProperty("wkStatMinDelay").trim());
            }

            if (prop.containsKey("monStatMinDelay")) {
                monStatMinDelay = Integer.parseInt(prop.getProperty("monStatMinDelay").trim());
            }

            if (prop.containsKey("fiveHistoryStatMinDelay")) {
                fiveHistoryStatMinDelay = Integer.parseInt(prop.getProperty("fiveHistoryStatMinDelay").trim());
            }

            if (prop.containsKey("hourHistoryStatMinDelay")) {
                hourHistoryStatMinDelay = Integer.parseInt(prop.getProperty("hourHistoryStatMinDelay").trim());
            }

            if (prop.containsKey("dayHistoryStatMinDelay")) {
                dayHistoryStatMinDelay = Integer.parseInt(prop.getProperty("dayHistoryStatMinDelay").trim());
            }

            if (prop.containsKey("wkHistoryStatMinDelay")) {
                wkHistoryStatMinDelay = Integer.parseInt(prop.getProperty("wkHistoryStatMinDelay").trim());
            }

            if (prop.containsKey("monHistoryStatMinDelay")) {
                monHistoryStatMinDelay = Integer.parseInt(prop.getProperty("monHistoryStatMinDelay").trim());
            }

            if (prop.containsKey("dayCrttablemethCron")) {
                dayCrttablemethCron = prop.getProperty("dayCrttablemethCron").trim();
            }

            if (prop.containsKey("monCrttablemethCron")) {
                monCrttablemethCron = prop.getProperty("monCrttablemethCron").trim();
            }

            if (prop.containsKey("yearCrttablemethCron")) {
                yearCrttablemethCron = prop.getProperty("yearCrttablemethCron").trim();
            }

            if (prop.containsKey("failedCron")) {
                failedCron = prop.getProperty("failedCron").trim();
            }

            if (prop.containsKey("stbtime")) {
                stbtime = prop.getProperty("stbtime").trim();
            }

            if (prop.containsKey("stetime")) {
                stetime = prop.getProperty("stetime").trim();
            }

        }
        catch (IOException e) {
            logger.error("ConstantInterface get dataStatistic.properties error!", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public static void printInfo() {
        logger.info("\n updateEntyInfoCycle[" + updateEntyInfoCycle + "]" + "\n fiveStatSecondDelay[" + fiveStatSecondDelay + "]"
            + "\n hourStatMinDelay[" + hourStatMinDelay + "]" + "\n dayStatMinDelay[" + dayStatMinDelay + "]"
            + "\n wkStatMinDelay[" + wkStatMinDelay + "]" + "\n monStatMinDelay[" + monStatMinDelay + "]" + "\n failedCron["
            + failedCron + "]" + "\n dayCrttablemethCron[" + dayCrttablemethCron + "]" + "\n monCrttablemethCron[" + monCrttablemethCron
            + "]" + "\n yearCrttablemethCron[" + yearCrttablemethCron + "]" + "\n stbtime[" + stbtime + "]" + "\n stetime[" + stetime + "]");
    }

 
}
