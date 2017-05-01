package com.ztesoft.zsmart.oss.core.slm.util;

import java.util.Date;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.utils.DateUtil;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/**
 * [描述] <br>
 * 
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-12 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util <br>
 */
public class SlmSeqUtil {

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param prefix 
     * @param suffix 
     * @param length 
     * @param seqCode 
     * @return String 
     * @throws BaseAppException <br>
     */
    public static String getSlmSeq(String prefix, String suffix, int length, String seqCode) throws BaseAppException {

        StringBuffer seqBuffer = new StringBuffer(prefix);

        StringBuffer aBuffer = new StringBuffer(SeqUtil.getSeq(seqCode));

        while (aBuffer.length() < length) {
            aBuffer.insert(0, "0");
        }
        seqBuffer.append("-").append(DateUtil.date2String(new Date(), DateUtil.DATE_FORMAT_2)).append("-").append(suffix).append(aBuffer);

        return seqBuffer.toString();
    }

}
