package com.ericsson.inms.pm.taskalarm.agg.config;

import java.io.Serializable;

public class AlarmAggConf implements Serializable {

    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    private String redisAddress;

    private String redisAuth;


    public String getRedisAuth() {
        return redisAuth;
    }

    public void setRedisAuth(String redisAuth) {
        this.redisAuth = redisAuth;
    }

    public String getRedisAddress() {
        return redisAddress;
    }

    public void setRedisAddress(String redisAddress) {
        this.redisAddress = redisAddress;
    }
}
