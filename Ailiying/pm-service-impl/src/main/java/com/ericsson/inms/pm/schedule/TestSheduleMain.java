package com.ericsson.inms.pm.schedule;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import com.ztesoft.zsmart.oss.opb.base.constant.Const;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年7月30日 <br>
 * @since V7.0<br>
 * @see com.ericsson.nfvo.oss.core.fm.common.schedule <br>
 */
@SpringBootApplication
public class TestSheduleMain {

    /**
     * logger <br>
     */
    private static OpbLogger logger = OpbLogger.getLogger(TestSheduleMain.class, "PM");

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param args  <br>
     */
    public static void main(String args[]) {

        String path = System.getProperty("user.dir");
        System.out.println(path);

        String srvRunPath = "pm";
        // System.setProperty("ZSMART_HOME", "/ztesoft/spark/luojun/r9-zsmart");
        System.setProperty("z_app", "pm");
        System.setProperty(Const.SRVRUNPATH, srvRunPath);
        ConfigurableApplicationContext appContext = new SpringApplicationBuilder(TestSheduleMain.class)
                .run(new String[] {});
        appContext.registerShutdownHook();

        // ScheduleServer.getInstance().start();
        // if (!ScheduleServer.getInstance().isStarted()) return;
        try {
            RegisterScheduleTool st = new RegisterScheduleTool();

            st.registerJobProduceSpecInstInfo();
            st.registerJobAssignTaskInst();
            st.registerJobExecuteTaskInst();
        }
        catch (RuntimeException e) {
            logger.error("SCHEDU-E-001", "exception =======:" + e);
            System.exit(-1);
        }

    }

}
