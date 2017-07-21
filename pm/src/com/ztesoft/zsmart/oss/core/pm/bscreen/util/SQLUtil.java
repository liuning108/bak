package com.ztesoft.zsmart.oss.core.pm.bscreen.util;

import java.sql.SQLException;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;



public class SQLUtil {
	
	/**
	 * 先打通逻辑，以后需要换置
	 * @param info
	 * @return
	 * @throws  
	 */
	 public static JdbcTemplate getJdbcTemplate(Map<String,String> info)  {
		  DriverManagerDataSource dataSource = new DriverManagerDataSource();
		   dataSource.setDriverClassName(info.get("driver"));
		   dataSource.setUrl(info.get("url"));
	       dataSource.setUsername(info.get("usrName"));
	       dataSource.setPassword(info.get("password"));
	       JdbcTemplate jdbc =new JdbcTemplate(dataSource);	     
	       return jdbc;
	 }
	 

}
