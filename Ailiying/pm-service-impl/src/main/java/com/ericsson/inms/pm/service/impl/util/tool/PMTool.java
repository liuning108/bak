package com.ericsson.inms.pm.service.impl.util.tool;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.create.table.ColumnDefinition;
import net.sf.jsqlparser.statement.create.table.CreateTable;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.util.TablesNamesFinder;

import com.ztesoft.zsmart.core.log.ZSmartLogger;

/**
 * 工具类 <br>
 * 
 * @author Srd<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017-8-7 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.tool <br>
 */
public final class PMTool {

    /** 
     *  PMTool
     */ 
    private PMTool() {

    }

    /**
     * logger
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(PMTool.class);

    /**
     * 三元表达式 - String <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param bool bool
     * @param trueRet trueRet
     * @param falseRet falseRet
     * @return <br>
     */
    public static String ternaryExpression(boolean bool, String trueRet, String falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }

    /**
     * 三元表达式 -int <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param bool bool
     * @param trueRet trueRet
     * @param falseRet falseRet
     * @return <br>
     */
    public static int ternaryExpression(boolean bool, int trueRet, int falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }

    /**
     * 三元表达式 -Date <br>
     * 
     * @author Srd<br>
     * @taskId <br>
     * @param bool bool
     * @param trueRet trueRet
     * @param falseRet falseRet
     * @return <br>
     */
    public static Date ternaryExpression(boolean bool, Date trueRet, Date falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }

    /**
     * [getColumnNameBySql] <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param sql sql
     * @return <br>
     */
    public static List<String> getColumnNameBySql(String sql) {

        sql = proStr(sql);
        sql = getCreateSql(sql);
        // sql = sql.replaceAll("\\$", "");
        // sql = sql.replaceAll("\\/", "");
        LOG.debug("The model physic script is :\n" + sql);

        CCJSqlParserManager parser = new CCJSqlParserManager();
        StringReader reader = new StringReader(sql);
        List<String> list = new ArrayList<String>();
        Statement stmt;
        try {
            stmt = parser.parse(new StringReader(sql));
            if (stmt instanceof Select) {
                Select selectStatement = (Select) stmt;
                TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
                List tableList = tablesNamesFinder.getTableList(selectStatement);
                for (Iterator iter = tableList.iterator(); iter.hasNext();) {
                    String tableName = iter.next().toString();
                    list.add(tableName);
                }
            }
            else if (stmt instanceof CreateTable) {
                CreateTable createStatement = (CreateTable) stmt;
                List listcolumn = createStatement.getColumnDefinitions();
                for (int i = 0; i < listcolumn.size(); i++) {
                    ColumnDefinition columnDef = (ColumnDefinition) listcolumn.get(i);
                    // String column =
                    // "COLLECTTIME DATE, ".substring(0,"COLLECTTIME DATE".indexOf(" "));
                    // System.out.println(columnDef.getColumnName());
                    list.add(columnDef.getColumnName().toUpperCase());
                }
            }
        }
        catch (JSQLParserException e) {
            // TODO Auto-generated catch block
            LOG.error("getColumnNameBySql error, please check script :\n" + sql);
        }

        return list;
    }

    /**
     * getCreateSql <br>
     * 
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param src src
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
     * @param s s
     * @return <br>
     */
    public static String proStr(String s) {
        String returnValue = "";
        String[] str = s.split("\\$");
        for (int i = 0; i < str.length; i++) {
            if (i == 1) {
                str[i] = str[i].replaceAll("/", "_");
            }
            returnValue = returnValue + str[i];
        }

        /*
         * s = ArrayUtils.toString(str); returnValue = s.substring(1, s.length()-1); System.out.println(returnValue);
         */
        return returnValue;
    }
}
