package com.ztesoft.zsmart.oss.core.pm.config.machine.util;


import java.util.Date;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/** 
 * [描述] <br> 
 *  
 * @author liuning <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-5 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.machine.util <br>
 */
public class MachineMgrUtil {
     /**
     * [方法描述] <br>
     * 
     * @author liuning <br>
     * @taskId <br>
     * @return String 
     * @throws BaseAppException 
     */
    public static String getMachineSeq() throws BaseAppException {
        String codePrefix  = "PMS";
        StringBuffer seq = new StringBuffer(SeqUtil.getSeq("PM_MACHINE_SEQ"));
        while (seq.length() < 6) {
            seq.insert(0, "0");
        }
        String adapterNo = codePrefix + "_" + DateUtil.date2String(new Date(), DateUtil.DATETIME_FORMAT_2) + "_" + seq;
        return adapterNo;
    }
    

}
