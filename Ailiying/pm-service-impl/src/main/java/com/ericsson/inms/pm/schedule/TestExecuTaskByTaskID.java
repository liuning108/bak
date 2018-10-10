package com.ericsson.inms.pm.schedule;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobExecuteTaskInst;
import com.ztesoft.zsmart.oss.opb.base.constant.Const;
@SpringBootApplication
public class TestExecuTaskByTaskID {
    public static void main(String args[]) {
        String taskID = (args.length == 0) ? "PMI-2019100619-TA00000232" + 
        		"" : args[0];
        System.out.println(taskID);
        String srvRunPath = "pm";
        System.setProperty("ZSMART_HOME", "/Users/liuning/ericssonR9Env/pm_zsmart_home");
        System.setProperty("z_app", "inms_pm");
        System.setProperty(Const.SRVRUNPATH, srvRunPath);
        ConfigurableApplicationContext appContext = new SpringApplicationBuilder(TestExecuTaskByTaskID.class)
                .run(new String[] {});
        appContext.registerShutdownHook();
        
        System.err.println("------------");
        JobExecuteTaskInst xx = new JobExecuteTaskInst();
        xx.executeTaskID(taskID);
        System.err.println("---end--------");
    }
}
