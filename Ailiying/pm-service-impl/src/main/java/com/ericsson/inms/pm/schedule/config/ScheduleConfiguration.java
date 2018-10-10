package com.ericsson.inms.pm.schedule.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ericsson.inms.pm.schedule.config.ScheduleConf;
import com.ericsson.inms.pm.schedule.config.ScheduleConstant;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月4日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.common.config <br>
 */
@Configuration
public class ScheduleConfiguration {
    @Bean(name = "scheduleConf")
    public ScheduleConf pmScheduleConf() {
        ScheduleConf conf = new ScheduleConf();
        String fre = CommonHelper.getProperty(ScheduleConstant.assignTaskFrequency, false);
        fre = (fre == null || fre.length() == 0) ? "3" : fre;
        conf.setAssignTaskFrequency(Integer.parseInt(fre));

        fre = CommonHelper.getProperty(ScheduleConstant.executeTaskFrequency, false);
        fre = (fre == null || fre.length() == 0) ? "3" : fre;
        conf.setExecuteTaskFrequency(Integer.parseInt(fre));

        String num = CommonHelper.getProperty(ScheduleConstant.pieceNum, false);
        num = (num == null || num.length() == 0) ? "1" : num;
        conf.setPieceNum(Integer.parseInt(num));
        return conf;
    }
}
