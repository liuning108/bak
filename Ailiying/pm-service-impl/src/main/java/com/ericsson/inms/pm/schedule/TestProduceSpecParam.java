package com.ericsson.inms.pm.schedule;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import com.ericsson.inms.pm.schedule.jobsys.jobsysimpl.JobProduceSpecInstInfo;
import com.ztesoft.zsmart.oss.opb.base.constant.Const;
@SpringBootApplication
public class TestProduceSpecParam {
    public static void main(String args[]) {
        String path = System.getProperty("user.dir");
        System.out.println(path);
        String srvRunPath = "pm";
        // System.setProperty("ZSMART_HOME", "/ztesoft/spark/luojun/r9-zsmart");
        System.setProperty("z_app", "pm");
        System.setProperty(Const.SRVRUNPATH, srvRunPath);
        ConfigurableApplicationContext appContext = new SpringApplicationBuilder(TestProduceSpecParam.class)
                .run(new String[] {});
        appContext.registerShutdownHook();
        JobProduceSpecInstInfo xx = new JobProduceSpecInstInfo();

        xx.execute(null);
    }
}
