package com.ztesoft.zsmart.oss.inms.pm.utils;

import java.util.List;

import org.apache.commons.collections.CollectionUtils;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年8月6日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.inms.pm.utils <br>
 */
public abstract class AggCalcUtil {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param valueList List<String>
     * @return <br>
     */
    public static float calculateMax(List<String> valueList) {
        if (CollectionUtils.isEmpty(valueList)) {
            return 0;
        }
        Float result = Float.valueOf(valueList.get(0));
        for (int i = 1, size = valueList.size(); i < size; i++) {
            Float curValue = Float.valueOf(valueList.get(i));
            if (curValue.compareTo(result) == 1) {
                result = curValue;
            }
        }
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param valueList List<String>
     * @return <br>
     */
    public static float calculateMin(List<String> valueList) {
        if (CollectionUtils.isEmpty(valueList)) {
            return 0;
        }
        Float result = Float.valueOf(valueList.get(0));
        for (int i = 1, size = valueList.size(); i < size; i++) {
            Float curValue = Float.valueOf(valueList.get(i));
            if (curValue.compareTo(result) == -1) {
                result = curValue;
            }
        }
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param valueList List<String>
     * @return <br>
     */
    public static float calculateSum(List<String> valueList) {
        if (CollectionUtils.isEmpty(valueList)) {
            return 0;
        }
        float sum = 0;
        for (String str : valueList) {
            sum += Float.valueOf(str);
        }

        return sum;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param valueList List<String>
     * @return <br>
     */
    public static float calculateAvg(List<String> valueList) {
        if (CollectionUtils.isEmpty(valueList)) {
            return 0;
        }

        return AggCalcUtil.calculateSum(valueList) / valueList.size();
    }

}
