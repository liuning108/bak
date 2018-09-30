package com.ericsson.inms.pm.service.impl.adhoc.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.ztesoft.zsmart.core.exception.BaseAppException;

import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;

/**
 * [描述] <br>
 * 
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-12 <br>
 * @since V7.0<br>
 * @see com.ericsson.core.slm.util <br>
 */
public class AdhocSeqUtil {
    
    /**
     * DATE_FORMAT_2 <br>
     */
    public static final String DATE_FORMAT_2 = "yyyyMMdd";
    
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
    public static String getAdhocSeq(String prefix, String suffix, int length, String seqCode) throws BaseAppException {
        StringBuffer seqBuffer = new StringBuffer(prefix);
        String seq = SeqUtils.getSeq(seqCode);
        if (seq.length() > 8) {
            seq = seq.substring(seq.length() - 8, seq.length());
        }
        StringBuffer aBuffer = new StringBuffer(seq);
        while (aBuffer.length() < length) {
            aBuffer.insert(0, "0");
        }
        seqBuffer.append("-").append(date2String(new Date(), DATE_FORMAT_2)).append("-").append(suffix).append(aBuffer);
        return seqBuffer.toString();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param date 
     * @param format 
     * @return <br>
     */ 
    public static String date2String(java.util.Date date, String format) {
        String retStr = "";
        if (date != null) {
            SimpleDateFormat sdf = new SimpleDateFormat(format);
            retStr = sdf.format(date);
        }
        return retStr;
    }
}