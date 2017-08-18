package com.ztesoft.zsmart.oss.core.pm.util.tool;

import java.util.Date;

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
}
