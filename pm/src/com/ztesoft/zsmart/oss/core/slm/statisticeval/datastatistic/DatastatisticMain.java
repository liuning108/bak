package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import com.ztesoft.zsmart.core.exception.BaseAppException;


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
public class DatastatisticMain extends Thread {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(DatastatisticMain.class.getName());


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param argvs <br>
     */ 
   
    public static void main(String argvs[]) {
        DatastatisticMain _main = new DatastatisticMain();
        _main.start();
        
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void run() {
        PropertyConfigurator.configure("../config/server/slmProcesslog4j.properties");
        ConstantInterface.printInfo();
        while (true) {
            logger.info("* * * * * Begin Master Thread ! * * * * * UPDATE CYCLE:"
                    + 60000 * ConstantInterface.updateEntyInfoCycle);
            try {
                DataStatistic dataStatistic = new DataStatistic();
                dataStatistic.run();
                Thread.sleep(60000 * ConstantInterface.updateEntyInfoCycle);
            } 
            catch (BaseAppException e) {
                logger.error("main run error!", e);
            }
            catch (InterruptedException e) {
                logger.error("main run error!", e);
            }
        }
    }
}
