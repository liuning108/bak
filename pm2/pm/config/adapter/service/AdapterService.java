package com.ztesoft.zsmart.oss.core.pm.config.adapter.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.config.adapter.domain.AbstractAdapterInfo;
import com.ztesoft.zsmart.oss.core.pm.util.domain.AbstractUtilInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM配置管理-适配器管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-16 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.config.adapter.service <br>
 */
public class AdapterService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_CONFIG_ADAPTER_QUERY".equals(serviceName)) {
            this.getAdapterInfo(dict);
        }
        else if ("MPM_CONFIG_ADAPTER_MAPPING_QUERY".equals(serviceName)) {
            this.getAdapterMapping(dict);
        }
        else if ("MPM_CONFIG_ADAPTER_OPER".equals(serviceName)) {
            this.operAdapterInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_META_ADAPTER_QUERY:适配器信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getAdapterInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getAdapterInfo(dict);

    }

    /**
     * MPM_META_ADAPTER_QUERY:适配器信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getAdapterMapping(DynamicDict dict) throws BaseAppException {

        getDmo().getAdapterMapping(dict);
        getUtilDmo().getPluginParam(dict);
    }

    /**
     * MPM_META_ADAPTER_OPER:适配器信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operAdapterInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmo().addAdapterInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmo().editAdapterInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmo().delAdapterInfo(dict);
        }
        getUtilDmo().operPluginParam(dict);
    }

    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractAdapterInfo getDmo() throws BaseAppException {
        return (AbstractAdapterInfo) GeneralDMOFactory.create(AbstractAdapterInfo.class);
    }

    /**
     * 获取Util DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractUtilInfo getUtilDmo() throws BaseAppException {
        return (AbstractUtilInfo) GeneralDMOFactory.create(AbstractUtilInfo.class);
    }
}
