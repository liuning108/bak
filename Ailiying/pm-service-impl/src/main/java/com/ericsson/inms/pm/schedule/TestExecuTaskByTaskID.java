package com.ericsson.inms.pm.schedule;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobExecuteTaskInst;
import com.ericsson.inms.pm.service.impl.resmgr.ResMgrServiceImpl;
import com.ericsson.inms.pm.service.impl.taskprocess.tasks.CleanFilePlug;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.constant.Const;
@SpringBootApplication
public class TestExecuTaskByTaskID {
    public static void main(String args[]) throws BaseAppException {
        String taskID = (args.length == 0) ? "PMI-2018101910-TA00000074" + 
        		"" : args[0];
        System.out.println(taskID);
        String srvRunPath = "pm";
        System.setProperty("ZSMART_HOME", "/Users/liuning/ericssonR9Env/pm_zsmart_home");
        System.setProperty("z_app", "inms_pm");
        System.setProperty(Const.SRVRUNPATH, srvRunPath);
        ConfigurableApplicationContext appContext = new SpringApplicationBuilder(TestExecuTaskByTaskID.class)
                .run(new String[] {});
        appContext.registerShutdownHook();
//        CleanFilePlug c  =new CleanFilePlug();
//        c.process();
//        
        System.err.println("------------");
        ResMgrServiceImpl xx = new ResMgrServiceImpl();
         System.err.println(xx.loadTree(null));
        System.err.println("---end--------");
    }
}
