package com.ztesoft.zsmart.oss.core.slm.adaptationlayerstatistics;


import java.text.ParseException;

import org.apache.log4j.PropertyConfigurator;

/**
 * [描述] 定制适配层文件读取和入库<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月12日 <br>
 * @since V7.0<br>
 * @see <br>
 */
/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月12日 <br>
 * @since V7.0<br>
 * @see <br>
 */
public class AdaptationLayerStatisticsMain {
    
    /** 
     * readFileThread  <br>
     */
    public static ReadFileAdaptStat readFileThread = new ReadFileAdaptStat();

    /**
     * [方法描述]  <br> 
     *  
     * @author  [作者名]<br>
     * @taskId <br>
     * @param args 
     * @throws ParseException 
     * @throws InterruptedException <br>
     */ 
    public static void main(String args[]) throws ParseException, InterruptedException {
        PropertyConfigurator.configure("../config/server/adaptationLayerStatisticslog4j.properties");
        
        if (!LoadConfig.instance().initConfig()) {
            return;
        }

        readFileThread.start();
    }
}
