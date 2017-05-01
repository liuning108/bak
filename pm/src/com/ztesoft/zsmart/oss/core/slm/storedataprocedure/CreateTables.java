package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map.Entry;

import org.apache.log4j.Logger;


/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月22日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.storedataprocedure <br>
 */
public class CreateTables {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());

    /**
     * logTable <br>
     */
    private String logTable = "CREATE TABLE SLM_STORE_DATA_LOG(\n" + "TABLENAME VARCHAR(32),\n" + "EXECUTETIME DATE,\n"
            + "RESULT VARCHAR(10),\n" + "TIME_CONSUMING NUMERIC(24,0),\n" + "LOG VARCHAR(4000))";


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param type 
     * @param length 
     * @return <br>
     */ 
    public static String getOracleType(String type, int length) {
        String str = "unkown";
        if (("date").equals(type)) {
            str = "TIMESTAMP";
        } 
        else if (("char").equals(type)) {
            str = "VARCHAR(" + length + ")";
        } 
        else if (("smallint").equals(type)) {
            str = "NUMERIC(6,0)";
        } 
        else if (("int").equals(type)) {
            str = "NUMERIC(12,0)";
        }
        else if (("long").equals(type)) {
            str = "NUMERIC(24,0)";
        } 
        else if (("float").equals(type)) {
            str = "NUMERIC(24,4)";
        } 
        else if (("double").equals(type)) {
            str = "NUMERIC(24,8)";
        } 
        else {
            logger.error("can not recognize this type:" + type);
        }
        return str;
    }


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void createCurrentTable() {
        Calendar toDay = Calendar.getInstance();
        toDay.setTime(new Date());
        Connection con = null;
        String name = "";
        try {
            con = DriverManager.getConnection(LoadConfig.instance().getUrl(), LoadConfig.instance().getUserName(),
                    LoadConfig.instance().getPssword());
            if (!tableIsExist("SLM_STORE_DATA_LOG", con)) {
                executeCreate(logTable, con);
            }

            for (Entry<String, TablesInfo> entry : TablesInfoByXml.tableInfoMap.entrySet()) {
                name = getCurrentTableName(entry.getValue(), toDay);
                if (!tableIsExist(name, con)) {
                    executeCreate(entry.getValue(), name, con);
                }
            }
        } 
        catch (SQLException e) {
            logger.error("prepareStatement error.[" + name + "]", e);
        } 
        finally {
            try {
                if (con != null) {
                    con.close();
                }
            } 
            catch (SQLException e) {
                logger.error("SQLException error.[" + name + "]", e);
            }
        }

    }


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param toDay 
     * @return t <br>
     */ 
    private String getCurrentTableName(TablesInfo info, Calendar toDay) {
        String s = info.getTableNmae();
        if (info.getSeparateTableRule() == 0) {
            s = s + "_" + new SimpleDateFormat("yyyyMMdd").format(toDay.getTime());
        } 
        else if (info.getSeparateTableRule() == 1) {
            if (toDay.get(Calendar.DAY_OF_WEEK) > 1) {
                toDay.add(Calendar.DATE, -(toDay.get(Calendar.DAY_OF_WEEK) - 2));
            }
            else {
                toDay.add(Calendar.DATE, 1);
            }
            s = s + "_" + new SimpleDateFormat("yyyyMMdd").format(toDay.getTime());
        }
        else if (info.getSeparateTableRule() == 2) {
            s = s + "_" + new SimpleDateFormat("yyyyMM").format(toDay.getTime());
        } 
        else if (info.getSeparateTableRule() == 3) {
            s = s + "_" + new SimpleDateFormat("yyyy").format(toDay.getTime());
        }

        return s;
    }


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId  <br>
     * @param sql 
     * @param con 
     * @throws SQLException  <br>
     */ 
    private void executeCreate(String sql, Connection con) throws SQLException {
        if (con == null) {
            throw new RuntimeException("executeCreate getconnection is null");
        }
        PreparedStatement state = con.prepareStatement(sql.toString());
        int i = state.executeUpdate();
        logger.info(sql.toString() + "[result:" + i + "]");
    }

    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId  <br>
     * @param info 
     * @param name 
     * @param con 
     * @throws SQLException  <br>
     */ 
    public static void executeCreate(TablesInfo info, String name, Connection con) throws SQLException {
        if (con == null) {
            throw new RuntimeException("executeCreate getconnection is null");
        }
        StringBuffer s = new StringBuffer("create table ");
        s.append(name);
        s.append("(\n");
        for (int i = 0; i < info.fields.size(); i++) {
            s.append(info.fields.get(i).field);
            s.append("    ");
            s.append(getOracleType(info.fields.get(i).type, info.fields.get(i).length));
            if (i != info.fields.size() - 1) {
                s.append(",\n");
            }
            else {
                s.append(")\n");
            }
        }

        PreparedStatement state = con.prepareStatement(s.toString());
        int i = state.executeUpdate();
        logger.info(s.toString() + "[result:" + i + "]");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param name 
     * @param con 
     * @return t <br>
     */ 
    public static boolean tableIsExist(String name, Connection con) {
        if (con == null) {
            throw new RuntimeException("tableIsExist getconnection is null");
        }
        String sql = "SELECT * FROM USER_TABLES WHERE TABLE_NAME = \'" + name.toUpperCase() + "\'";
        try {
            PreparedStatement state = con.prepareStatement(sql.toString());
            int i = state.executeUpdate();
            if (i != 0) {
                logger.debug(name + " is exist");
                return true;
            }
            else {
                return false;
            }
        } 
        catch (SQLException e) {
            logger.error("tableIsExist error.", e);
        }
        return true;
    }
}
