package com.ztesoft.zsmart.oss.itnms.config;

import javax.sql.DataSource;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import com.ztesoft.zsmart.core.jdbc.mybatis.CoreSqlSessionFactoryBean;
import com.ztesoft.zsmart.core.jdbc.mybatis.annotation.CoreMapperScan;

@Configuration
@CoreMapperScan(basePackages = {"com.ztesoft.zsmart.oss.itnms.**.mapper"})
@ComponentScan(basePackages="com.ztesoft.zsmart.oss.itnms")
// @CoreMapperScan(basePackages = {"com.ztesoft.zsmart.oss.itnms.**.mapper" }, sqlSessionFactoryRef = "itnmsSqlSessionFactoryBean")
public class ItnmsConfig {
    
    // @Bean
    public SqlSessionFactoryBean itnmsSqlSessionFactoryBean(DataSource dataSource) {
        CoreSqlSessionFactoryBean sqlSessionFactoryBean = new CoreSqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        return sqlSessionFactoryBean;
    }
}