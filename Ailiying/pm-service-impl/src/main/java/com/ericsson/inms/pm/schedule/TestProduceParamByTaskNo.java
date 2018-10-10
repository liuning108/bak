package com.ericsson.inms.pm.schedule;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ztesoft.zsmart.oss.opb.base.constant.Const;
@SpringBootApplication
public class TestProduceParamByTaskNo {
    public static void main(String args[]) {
        String taskNo = (args.length == 0) ? "PPMS_20170419165127_TA10000014" : args[0];
        System.out.println(taskNo);
        String srvRunPath = "pm";
        System.setProperty("z_app", "pm");
        System.setProperty(Const.SRVRUNPATH, srvRunPath);
        ConfigurableApplicationContext appContext = new SpringApplicationBuilder(TestProduceParamByTaskNo.class)
                .run(new String[] {});
        appContext.registerShutdownHook();
        JobProduceSpecInstInfo xx = new JobProduceSpecInstInfo();

        xx.executeByTaskNo(taskNo);
    }
}
