package com.ericsson.inms.pm.utils;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.create.table.ColumnDefinition;
import net.sf.jsqlparser.statement.create.table.CreateTable;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.util.TablesNamesFinder;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月21日 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.utils <br>
 */
public class PublicToolUtil {
    /**
     * logger <br>
     */
    private static OpbLogger logger = OpbLogger.getLogger(PublicToolUtil.class, "PM");

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param obj "null"
     * @return  <br>
     */
    public static String ObjectToStr(Object obj) {
        if (obj == null) {
            return "";
        }
        String str = String.valueOf(obj);
        return ("null".equals(str)) ? "" : str;
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param obj  String
     * @return  <br>
     */
    public static int ObjectToInt(Object obj) {
        if (obj == null) {
            return 0;
        }
        String str = String.valueOf(obj);
        return ("null".equals(str)) ? 0 : Integer.parseInt(str);
    }

    /**
     * [getColumnNameBySql] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param sql String
     * @return <br>
     */
    public static List<String> getColumnNameBySql(String sql) {
        sql = proStr(sql);
        sql = getCreateSql(sql);
        // sql = sql.replaceAll("\\$", "");
        // sql = sql.replaceAll("\\/", "");
        // logger.debug("The model physic script is :\n" + sql);
        CCJSqlParserManager parser = new CCJSqlParserManager();
        List<String> list = new ArrayList<String>();
        Statement stmt;
        try {
            stmt = parser.parse(new StringReader(sql));
            if (stmt instanceof Select) {
                Select selectStatement = (Select) stmt;
                TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
                List<String> tableList = tablesNamesFinder.getTableList(selectStatement);
                for (Iterator<String> iter = tableList.iterator(); iter.hasNext();) {
                    String tableName = iter.next().toString();
                    list.add(tableName);
                }
            }
            else if (stmt instanceof CreateTable) {
                CreateTable createStatement = (CreateTable) stmt;
                List<ColumnDefinition> listcolumn = createStatement.getColumnDefinitions();
                for (int i = 0; i < listcolumn.size(); i++) {
                    ColumnDefinition columnDef = (ColumnDefinition) listcolumn.get(i);
                    list.add(columnDef.getColumnName().toUpperCase());
                }
            }
        }
        catch (JSQLParserException e) {
            logger.error("UTIL-E-002", "getColumnNameBySql exception, please check script :\n" + sql);
        }
        return list;
    }

    /**
     * getCreateSql <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param src String
     * @return <br>
     */
    private static String getCreateSql(String src) {
        int cnt = 1;
        int pos = 0;
        for (int i = 0; i < src.length(); i++) {
            if (src.charAt(i) == '(') {
                pos = i;
                break;
            }
        }
        while (cnt != 0 && (pos + 1) < src.length()) {
            if (src.charAt(pos + 1) == '(') {
                cnt += 1;
            }
            if (src.charAt(pos + 1) == ')') {
                cnt -= 1;
            }
            pos++;
        }
        return src.substring(0, pos + 1);
    }

    /**
     * [proStr] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param s String
     * @return <br>
     */
    private static String proStr(String s) {
        String returnValue = "";
        String[] str = s.split("\\$");
        for (int i = 0; i < str.length; i++) {
            if (i == 1) {
                str[i] = str[i].replaceAll("/", "_");
            }
            returnValue = returnValue + str[i];
        }

        /*
         * s = ArrayUtils.toString(str); returnValue = s.substring(1, s.length()-1);
         * System.out.println(returnValue);
         */
        return returnValue;
    }
}
