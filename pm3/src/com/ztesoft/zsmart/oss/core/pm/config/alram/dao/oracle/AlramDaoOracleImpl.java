/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.config.alram.dao.oracle;

import java.util.HashMap;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.pm.config.alram.dao.AlramDao;
import com.ztesoft.zsmart.oss.core.pm.config.alram.util.AlramUtil;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月3日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.alram.dao.oracle <br>
 */

public class AlramDaoOracleImpl extends AlramDao {

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param param
     * @return
     * @throws BaseAppException <br>
     */ 
    @Override
    public Map<String, Object> queryAlramList(Map<String, String> param) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        String time  = param.get("time");
        String level  = param.get("level");
        Long  page  =AlramUtil.toLong(param.get("page"),1L);
        Long  nums  =AlramUtil.toLong(param.get("rowNums"),20L);
        
        
        
        Map<String,Object > result = new HashMap<String, Object>();
        String sql = ""
            + "select b.alarm_name, COUNT(a.warn_instid) warn_times,B.ALARM_LEVEL,B.COLOR from PM_WARN_INST a, pmp_dim_alarmlevel b "
            + "where a.WARN_LEVEL (+)= b.alarm_level "+setTime(time,"(+)")
            + "group by b.alarm_name,B.ALARM_LEVEL,B.COLOR "
            + "order by B.ALARM_LEVEL";
        ParamArray pa = new ParamArray();
        System.err.println(sql);
        result.put("chartsData", this.queryList(sql, pa));
        
        String sql2 = ""
            + "with WARN_spec_INFO as ( "
            + "select task_no,task_name from pm_task_info where task_type = '03' and seq = 0 "
            + ") "
            + "select WARN_DESC || ' received in [' || ALARMOBJ_TYPE_NAME || '] ' || "
            + "       ALARMOBJ_INST_NAME || ' for the profile [' || b.task_name || '] at ' || "
            + "       to_char(a.create_date, 'yyyy-mm-dd hh24:mi:ss') WARN_DESC, "
            + "       a.warn_code, "
            + "       a.alarmobj_type_name, "
            + "       a.alarmobj_inst_name, "
            + "       a.warn_kpivalue, "
            + "       c.alarm_name, "
            + "       c.color, "
            + "       to_char(a.create_date, 'yyyy-mm-dd hh24:mi:ss') WARN_TIME "
            + "  from PM_WARN_INST a,  WARN_spec_INFO b, pmp_dim_alarmlevel  C "
            + " where a.task_no = b.task_no "
            + "   AND a.warn_level = c.alarm_level "
            +setTime(time,"")
            +setLevel(level)
            + "order by a.create_date desc";
        String sqlCount = AlramUtil.getCountSql(sql2);
        long  start = (page-1)* nums;
        long  end = page*nums;
        String sqlPage  =AlramUtil.getPageSql(sql2, start, end);
        result.put("alramListCount", this.queryLong(sqlCount, pa));
        result.put("alramListPerData", this.queryList(sqlPage, pa));
    
        return result;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param level
     * @return <br>
     */ 
    private String setLevel(String level) {
        // TODO Auto-generated method stub <br>
        if(level.length()<=0) {
            return "";
        }
        return " and a.warn_level in ("+level+") ";
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time
     * @return <br>
     */ 
    private String setTime(String time,String tag) {
        if(time.contains("custom")) {
            String [] array= time.split(",");
            String st = array[1];
            String et = array[2];
           
            System.err.println(array[1]);
            System.err.println(array[2]);
            
            return  " and a.CREATE_DATE"+tag+">=to_date( '"+array[1]+"','yyyy-MM-dd HH24:mi:ss')  and A.CREATE_DATE"+tag+"<= to_date('"+array[2]+"','yyyy-MM-dd HH24:mi:ss')  ";
        }
        if("today".equalsIgnoreCase(time)) {
            return " and to_char(A.CREATE_DATE"+tag+",'dd')=to_char(sysdate,'dd') ";
        }
        if("yday".equalsIgnoreCase(time)) {
            return " and to_char(A.CREATE_DATE"+tag+",'dd')=to_char(sysdate-1,'dd') ";
        }
        if("7d".equalsIgnoreCase(time)) {
            return " and a.CREATE_DATE"+tag+">sysdate-interval "+"'"+7+"'"+" day "+"  and A.CREATE_DATE"+tag+"<sysdate ";
        }
        if("30d".equalsIgnoreCase(time)) {
            return " and a.CREATE_DATE"+tag+">sysdate-interval  "+"'"+30+"'"+" day "+"  and A.CREATE_DATE"+tag+"<sysdate ";
        }
        if("90d".equalsIgnoreCase(time)) {
            return " and a.CREATE_DATE"+tag+">sysdate-interval  "+"'"+90+"'"+" day "+"  and A.CREATE_DATE"+tag+"<sysdate ";
        }
        if("week".equalsIgnoreCase(time)) {
            return " and to_char(A.CREATE_DATE"+tag+",'iw')=to_char(sysdate,'iw') ";
        }
        if("month".equalsIgnoreCase(time)) {
            return " and to_char(A.CREATE_DATE"+tag+",'mm')=to_char(sysdate,'mm')";
        }
        
        //90d
       
        return " and a.CREATE_DATE"+tag+">sysdate-interval  "+"'"+time+"'"+" hour "+"  and A.CREATE_DATE"+tag   +"<sysdate ";
    }

    

}
