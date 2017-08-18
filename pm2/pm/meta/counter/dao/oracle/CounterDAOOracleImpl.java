package com.ztesoft.zsmart.oss.core.pm.meta.counter.dao.oracle;

import java.util.HashMap;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.counter.dao.CounterDAO;
import com.ztesoft.zsmart.oss.core.pm.util.tool.PMTool;

/**
 * PM-Meta Counter相关服务处理类 <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-6-8 <br>
 * @since JDK7.0<br>
 */
public class CounterDAOOracleImpl extends CounterDAO {
    /**
     * sql
     */
    String sql = "";
    /**
     * tool 
     */
    PMTool tool = new PMTool();
    
    /**
     * getCounterInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void getCounterInfo(DynamicDict dict) throws BaseAppException {

        String moCode = (String) dict.getValueByName("MO_NO", "");

        sql = "select a.field_name,a.field_code,a.field_no from PM_MO_DETAIL a where 1 = 1        \n"
                + tool.ternaryExpression("".equals(moCode), "", " and a.mo_code = ?    and a.field_type ='1'   \n")
                + " order by a.field_code    \n";
        ParamArray params = new ParamArray();
        if (!("".equals(moCode))) {
            params.set("", moCode);
        }
        dict.set("couterList", queryList(sql, params));
    }
    
    /**
     * getDimInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void getDimInfo(DynamicDict dict) throws BaseAppException {

        String moCode = (String) dict.getValueByName("MO_NO", "");

        sql = "select a.field_name,a.field_code,a.field_no from PM_MO_DETAIL a where 1 = 1        \n"
                + tool.ternaryExpression("".equals(moCode), "", " and a.mo_code = ?    and a.field_type ='0'   \n")
                + " order by a.field_code    \n";
        ParamArray params = new ParamArray();
        if (!("".equals(moCode))) {
            params.set("", moCode);
        }
        dict.set("dimList", queryList(sql, params));
    }

    @Override
    public int delete(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public void insert(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    @Override
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int update(DynamicDict arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

}
