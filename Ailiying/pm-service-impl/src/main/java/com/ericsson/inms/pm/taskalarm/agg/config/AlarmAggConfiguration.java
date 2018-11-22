package com.ericsson.inms.pm.taskalarm.agg.config;

import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AlarmAggConfiguration {

    @Bean(name = "alarmAggConf")
    public AlarmAggConf pmAlarmAggConf() {
        AlarmAggConf conf = new AlarmAggConf();

        String value = CommonHelper.getProperty("pm.alarmagg.redis.nodes", false);
        conf.setRedisAddress((value == null || value.length() == 0) ? "" : value);

        value = CommonHelper.getProperty("pm.alarmagg.redis.auth", false);
        conf.setRedisAuth((value == null || value.length() == 0) ? null : value);

        return conf;
    }
}
