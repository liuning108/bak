/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.config.alram.util;

import java.text.MessageFormat;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月7日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.alram.util <br>
 */

public class AlramUtil {
    
        /**
         * [方法描述] <br> 
         *  
         * @author [作者名]<br>
         * @taskId <br>
         * @param sql2
         * @param start
         * @param end
         * @return <br>
         */ 
        public static String getPageMysqlSql(String sql, long start, long end) {
            return  MessageFormat.format(" {0}  LIMIT {1} , {2}", sql,""+start,""+end);
        }
     public static  String getCountSql(String sql){
       return  MessageFormat.format("select count(1) from ({0}) t ", sql);
     }
     
     public static String getPageSql(String sql,Long start , Long end) {
         return  MessageFormat.format("select * from (select rownum rn,t.* from ({0}) t ) where rn  between {1} and {2}", sql,""+start,""+end);

     }
     public static void main(String[] args) {
         String sql ="with WARN_spec_INFO as ( select task_no,task_name from pm_task_info where task_type = '03' and seq = 0 ) select WARN_DESC || ' received in [' || ALARMOBJ_TYPE_NAME || '] ' ||        ALARMOBJ_INST_NAME || ' for the profile [' || b.task_name || '] at ' ||        to_char(a.create_date, 'yyyy-mm-dd hh24:mi:ss') WARN_DESC,        a.warn_code,        a.alarmobj_type_name,        a.alarmobj_inst_name,        a.warn_kpivalue,        c.alarm_name,        c.color,        to_char(a.create_date, 'yyyy-mm-dd hh24:mi:ss') WARN_TIME   from PM_WARN_INST a,  WARN_spec_INFO b, pmp_dim_alarmlevel  C  where a.task_no = b.task_no    AND a.warn_level = c.alarm_level  and a.CREATE_DATE>=to_date( '2017-11-01 16:19:16','yyyy-MM-dd HH24:mi:ss')  and A.CREATE_DATE<= to_date('2017-12-31 16:19:16','yyyy-MM-dd HH24:mi:ss')   and a.warn_level in (0,1,2,3,4,5) order by a.create_date desc";
        System.out.println(getCountSql(sql));
        
        int page =3;
        int nums =10;
        long start = (page-1)*nums;
        long end = page*nums;
        System.out.println(getPageSql(sql,1000L,2000L));
        
    
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param string
     * @param i
     * @return <br>
     */ 
    public static Long toLong(String value, Long i) {
        try {
            return  Long.parseLong(value);
        }catch(Exception e) {
            return i;
        }
    }

    
}
