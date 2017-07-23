package com.ztesoft.zsmart.oss.core.pm.bscreen.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;



public class SQLUtil {
	 public static DataSource getJdbcTemplate(Map<String,String> info)  {
		  DriverManagerDataSource dataSource = new DriverManagerDataSource();
		   dataSource.setDriverClassName(info.get("driver"));
		   dataSource.setUrl(info.get("url"));
	       dataSource.setUsername(info.get("usrName"));
	       dataSource.setPassword(info.get("password"));
	       return dataSource;
	 }
	 
	 
	 public static Map<String,Object> getFields(DataSource dataSource,String sql){
		 Map<String,Object > param = new HashMap<String, Object>();
		 List<String> fields =new ArrayList<String>();
		 try {
		    JdbcTemplate jdbcTemplate =new JdbcTemplate(dataSource);	     
			SqlRowSet sqlRowSet  = jdbcTemplate.queryForRowSet(sql);
			SqlRowSetMetaData sqlRsmd = sqlRowSet.getMetaData();  
			int columnCount = sqlRsmd.getColumnCount();
			for (int i = 1; i <= columnCount; i++) {  
				fields.add(sqlRsmd.getColumnName(i));  
			}
			 param.put("message", "ok");
			 param.put("fields", fields);
		 }catch(Exception e){
			 param.put("message", e.getMessage());
			 param.put("fields", new ArrayList<String>());
		 }
				
			
			return param;
	 }

}
