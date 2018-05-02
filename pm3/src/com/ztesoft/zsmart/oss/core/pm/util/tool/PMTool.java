package com.ztesoft.zsmart.oss.core.pm.util.tool;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.create.table.ColumnDefinition;
import net.sf.jsqlparser.statement.create.table.CreateTable;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.util.TablesNamesFinder;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;

/**
 * 
 * 工具类 <br> 
 *  
 * @author Srd<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017-8-7 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.tool <br>
 */
public class PMTool {
    
    /**
     * logger 
     */
    private Logger logger = LoggerFactory.getLogger(this.getClass().getName());
    
    /**
     * 
     * 三元表达式 - String <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param bool 
     * @param trueRet 
     * @param falseRet 
     * @return <br>
     */
    public String ternaryExpression(boolean bool, String trueRet, String falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }
    
    /**
     * 
     * 三元表达式 -int <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param bool 
     * @param trueRet 
     * @param falseRet 
     * @return <br>
     */
    public int ternaryExpression(boolean bool, int trueRet, int falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }
    
    /**
     * 
     * 三元表达式 -Date <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param bool 
     * @param trueRet 
     * @param falseRet 
     * @return <br>
     */
    public Date ternaryExpression(boolean bool, Date trueRet, Date falseRet) {

        if (bool) {
            return trueRet;
        }
        else {
            return falseRet;
        }
    }

    /**
     * 
     * 将DynamicDict中非DynamicDict对象转成DynamicDict<br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @param name 
     * @param i 
     * @throws BaseAppException <br>
     * @return <br>
     */
    public DynamicDict getDict(DynamicDict dict, String name, int i) throws BaseAppException {
        HashMap h = new HashMap();
        DynamicDict d = new DynamicDict();
        int iCount = dict.getCount(name);
        if (iCount > 0 && i < iCount) {

            if (dict.getValueByName(name, i).getClass().getName().indexOf("HashMap") > 0) {
                h = (HashMap) dict.getValueByName(name, i);
                Iterator it = h.keySet().iterator();
                while (it.hasNext()) {
                    String key = (String) it.next();
                    d.setValueByName(key, (String) h.get(key), 2);
                }
            } 
            else if (dict.getValueByName(name, i).getClass().getName().indexOf("String") > 0) {
                String s = (String) dict.getValueByName(name, i);
                d.setValueByName(name, s);
            } 
            else if (dict.getValueByName(name, i).getClass().getName().indexOf("ArrayList") > 0) {
                ArrayList al = (ArrayList) dict.getValueByName(name, i);
                d.setValueByName(name, al);
            } 
            else {
                d = (DynamicDict) dict.getValueByName(name, i);
            }
        }

        return d;
    }

    /**
     * 
     * 拼接二次过滤条件 - String <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @return <br>
     * @throws BaseAppException 
     */
    public String secondFilter(DynamicDict dict) throws BaseAppException {

        String filter_condition = "";
        String condition_option = dict.getString("condition_option");
        if (condition_option == null) { 
            condition_option = "";
        }
        
        if (!"and".equals(condition_option.toLowerCase()) || !"or".equals(condition_option.toLowerCase())) {
            condition_option = "and";
        }
                
        for (int i = 0; i < dict.getCount("filter_condition"); i++) {
            DynamicDict filterDict = this.getDict(dict, "filter_condition", i);
            String field = filterDict.getString("field");
            String oper  = filterDict.getString("operators");
            String value = filterDict.getString("value");
            String dataType = filterDict.getString("dataType");
            if (field == null || "".equals(field)) {
                continue;
            }
            if (oper == null || "".equals(oper)) {
                oper = "=";
            }  
            if (value == null) {
                value = "";
            }
            else {
                value = value.trim();
            }
            oper = oper.toLowerCase();
            if (!"1".equals(dataType)) { //数值
                value = "'" + value.replaceAll("[',']", "','") + "'";;
            }

            if ("in".equals(oper) || "not in".equals(oper)) {
                value = "(" + value + ")";
            }
            String where = (field + " " + oper + " " + value);
            
            if (filter_condition == null || "".equals(filter_condition)) {
                filter_condition = where;
            }
            else {
                filter_condition += " " + condition_option + " " + where;
            } 
        }
        return filter_condition;
    }
    
    /**
     * 
     * 拼接二次排序条件 - String <br> 
     *  
     * @author Srd<br>
     * @taskId <br>
     * @param dict 
     * @return <br>
     * @throws BaseAppException 
     */
    public String secondOrder(DynamicDict dict) throws BaseAppException {

        String order_condition = "";
        for (int i = 0; i < dict.getCount("order_condition"); i++) {
            DynamicDict orderDict = this.getDict(dict, "order_condition", i);
            String field = orderDict.getString("field");
            String desc_asc = orderDict.getString("desc_asc");
            if (field == null || "".equals(field)) {
                continue;
            }
            if (order_condition == null || "".equals(order_condition)) {
                order_condition = field + " " + desc_asc;
            }
            else {
                order_condition += ", " + field + " " + desc_asc;
            }
        }
        return order_condition;
    }

    /**
     * 
     * [getColumnNameBySql] <br> 
     *  
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param sql 
     * @return <br>
     */
    public List<String> getColumnNameBySql(String sql) {

        sql = proStr(sql);
        sql = getCreateSql(sql);
        // sql = sql.replaceAll("\\$", "");
        // sql = sql.replaceAll("\\/", "");
        logger.debug("The model physic script is :\n" + sql);
        
        CCJSqlParserManager parser = new CCJSqlParserManager();
        StringReader reader = new StringReader(sql);
        List<String> list = new ArrayList<String>();
        Statement stmt;
        try {
            stmt = parser.parse(new StringReader(sql));
            if (stmt instanceof Select) {
                Select selectStatement = (Select) stmt;
                TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
                List tableList = tablesNamesFinder
                        .getTableList(selectStatement);
                for (Iterator iter = tableList.iterator(); iter.hasNext();) {
                    String tableName = iter.next().toString();
                    list.add(tableName);
                }
            }
            else
                if (stmt instanceof CreateTable) {
                    CreateTable createStatement = (CreateTable) stmt;
                    List listcolumn = createStatement.getColumnDefinitions();
                    for (int i = 0; i < listcolumn.size(); i++) {
                        ColumnDefinition columnDef = (ColumnDefinition) listcolumn.get(i);
                        // String column =
                        // "COLLECTTIME    DATE, ".substring(0,"COLLECTTIME    DATE".indexOf(" "));
                        // System.out.println(columnDef.getColumnName());
                        list.add(columnDef.getColumnName().toUpperCase());
                    }
                }
        }
        catch (JSQLParserException e) {
            // TODO Auto-generated catch block
            logger.error("getColumnNameBySql error, please check script :\n" + sql);
        }

        return list;
    }
    
    /**
     * getCreateSql <br> 
     *  
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param src 
     * @return <br>
     */ 
    private String getCreateSql(String src) {
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
     * 
     * [proStr] <br> 
     *  
     * @author wen.yongjun<br>
     * @taskId <br>
     * @param s 
     * @return <br>
     */
    public String proStr(String s) {
        String returnValue = "";
        String[] str = s.split("\\$");
        for (int i = 0; i < str.length; i++) {
            if (i == 1) {
                str[i] = str[i].replaceAll("/", "_");
            }
            returnValue = returnValue + str[i];
        }

        /*
         * s = ArrayUtils.toString(str); returnValue = s.substring(1,
         * s.length()-1); System.out.println(returnValue);
         */
        return returnValue;
    }
}
