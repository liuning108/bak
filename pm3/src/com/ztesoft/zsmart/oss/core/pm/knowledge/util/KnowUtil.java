/***************************************************************************************** 
 * Copyright © 2003-2017 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.knowledge.util;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

/** 
 * [描述] <br> 
 *  
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年12月24日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.knowledge.util <br>
 */

public class KnowUtil {
    
    public static  String getCountSql(String sql){
        return  MessageFormat.format("select count(1) from ({0})", sql);
      }
      
      public static String getPageSql(String sql,Long start , Long end) {
          return  MessageFormat.format("select * from (select rownum rn,t.* from ({0}) t ) where rn  between {1} and {2}", sql,""+start,""+end);

      }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param context
     * @param i
     * @return <br>
     */ 
    public static List<String> splitByNumbers(String text, int number) {
        List<String> strings = new ArrayList<String>();
        int index = 0;
        while (index < text.length()) {
            strings.add(text.substring(index, Math.min(index + number, text.length())));
            index += number;
        }
        return strings;
    }

}
