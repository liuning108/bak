/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.plugin.email;

import org.quartz.JobExecutionException;

import com.ztesoft.zsmart.oss.core.pm.dataprocess.pmtask.job.CleanJob;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年10月18日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.plugin.email <br>
 */

public class TestMain {
   public static void main(String[] args) {
     CleanJob job = new CleanJob();
        try {
            job.execute(null);
        }
        catch (JobExecutionException e) {
            // TODO Auto-generated catch block <br>
            e.printStackTrace();
        }
  }
}
