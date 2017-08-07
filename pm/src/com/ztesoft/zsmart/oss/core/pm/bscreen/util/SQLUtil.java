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

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.util <br>
 */
public class SQLUtil {
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @return <br>
     */
    public static DataSource getJdbcTemplate(Map<String, String> info) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(info.get("driver"));
        dataSource.setUrl(info.get("url"));
        dataSource.setUsername(info.get("usrName"));
        dataSource.setPassword(info.get("password"));
        return dataSource;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dataSource 
     * @param sql 
     * @return <br>
     */
    public static Map<String, Object> getDatas(DataSource dataSource, String sql) {
        Map<String, Object> param = new HashMap<String, Object>();
        List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            datas = jdbcTemplate.queryForList(sql);
            param.put("message", "ok");
            param.put("datas", datas);
        }
        catch (Exception e) {
            param.put("message", e.getMessage());
            param.put("fields", new ArrayList<String>());
        }
        return param;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dataSource 
     * @param sql 
     * @return <br>
     */
    public static Map<String, Object> getFields(DataSource dataSource, String sql) {
        Map<String, Object> param = new HashMap<String, Object>();
        List<String> fields = new ArrayList<String>();
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            SqlRowSet sqlRowSet = jdbcTemplate.queryForRowSet(sql);
            SqlRowSetMetaData sqlRsmd = sqlRowSet.getMetaData();
            int columnCount = sqlRsmd.getColumnCount();
            for (int i = 1; i <= columnCount; i++) {
                fields.add(sqlRsmd.getColumnName(i));
            }
            param.put("message", "ok");
            param.put("fields", fields);
        }
        catch (Exception e) {
            param.put("message", e.getMessage());
            param.put("fields", new ArrayList<String>());
        }

        return param;
    }

}
