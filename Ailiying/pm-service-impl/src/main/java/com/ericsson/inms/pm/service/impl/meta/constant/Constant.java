package com.ericsson.inms.pm.service.impl.meta.constant;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.inms.pm.service.impl.meta.constant <br>
 */
public final class Constant {
    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年6月12日 <br>
     * @since V8<br>
     */
    private Constant() {

    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年6月12日<br>
     * @since V8<br>
     * @see com.ericsson.inms.pm.service.impl.meta.constant <br>
     */
    public interface Return {
        /**
         * RETURN_CODE <br>
         */
        String RETURN_CODE = "ReturnCode";

        /**
         * RETURN_MSG <br>
         */
        String RETURN_MSG = "ReturnMsg";
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @version 8.0<br>
     * @taskId <br>
     * @CreateDate 2018年6月12日<br>
     * @since V8<br>
     * @see com.ericsson.inms.pm.service.impl.meta.constant <br>
     */
    public interface ReturnCode {
        /**
         * SUCC <br>
         */
        String SUCC = "0";

        /**
         * ERR <br>
         */
        String ERR = "-1";
    }
}
