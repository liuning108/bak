package com.ztesoft.zsmart.oss.core.pm.meta.util.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.util.domain.AbstractKPIRELAInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * MetadataService <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.util.service <br>
 */
public class MetadataService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        logger.debug("PM call service begin \n" + dict.asXML("utf-8"));
        String serviceName = dict.getServiceName();
        if ("MPM_META_UTIL_KPIRELA_QUERY".equals(serviceName)) {
            this.getKPIRELAInfo(dict);
        }
        else if ("MPM_META_UTIL_MO_PLUGIN_QUERY".equals(serviceName)) {
            this.getMOPluginInfo(dict);
        }
        logger.debug("PM call service end \n" + dict.asXML("utf-8"));
        return 0;
    }

    /**
     * getKPIRELAInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getKPIRELAInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getKPIRELAInfo(dict);

    }

    /**
     * getMOPluginInfo <br>
     * 
     * @author wen.yongjun <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getMOPluginInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getMOPluginInfo(dict);

    }

    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author wen.yongjun <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractKPIRELAInfo getDmo() throws BaseAppException {
        return (AbstractKPIRELAInfo) GeneralDMOFactory.create(AbstractKPIRELAInfo.class);
    }

    /**
     * main <br>
     * 
     * @author wen.yongjun <br>
     * @param args <br>
     * @throws BaseAppException <br>
     */
    public static void main(String[] args) throws BaseAppException {
        // TODO Auto-generated method stub
        MetadataService ms = new MetadataService();
        DynamicDict dict = new DynamicDict();
        // dict.serviceName = "MPM_META_UTIL_KPIRELA_QUERY";
        dict.serviceName = "MPM_META_UTIL_MO_PLUGIN_QUERY";
        ms.perform(dict);

        /*
         * DynamicDict dict1 = new DynamicDict(); dict1.serviceName = "MPM_META_MEASURE_FIELD_QUERY"; dict1.setValueByName("MO_CODE", "HLRLOAS");
         * ServiceFlow.callService(dict1); System.out.println("PM call service end \n" + dict1.asXML("utf-8"));
         */
    }

}
