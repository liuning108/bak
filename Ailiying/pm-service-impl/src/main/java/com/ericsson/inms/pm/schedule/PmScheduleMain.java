//package com.ericsson.inms.pm.schedule;
//
//import java.util.concurrent.CompletableFuture;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//public class PmScheduleMain implements CommandLineRunner {
//
//    @Override
//    public void run(String... arg0) {
//        CompletableFuture.runAsync(new Runnable() {
//
//            @Override
//            public void run() {
//                RegisterScheduleTool st = new RegisterScheduleTool();
//                st.registerJobProduceSpecInstInfo();
//                st.registerJobAssignTaskInst();
//                st.registerJobExecuteTaskInst();
//            }
//
//        });
//    }
//
//}
