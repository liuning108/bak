package com.ztesoft.zsmart.oss.core.pm.util.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.util.domain.AbstractUtilInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM-Util相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-3-28 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.service <br>
 */
public class UtilService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_UTIL_EMS".equals(serviceName)) {
            this.getEMSInfo(dict);
        }
        else if ("MPM_UTIL_PARAVALUE".equals(serviceName)) {
            this.getParavalue(dict);
        }
        else if ("MPM_UTIL_PARAMETER".equals(serviceName)) {
            this.getParameter(dict);
        }
        else if ("MPM_UTIL_DATA_SOURCE".equals(serviceName)) {
            this.getDataSource(dict);
        }
        else if ("MPM_UTIL_PLUGIN_SPEC".equals(serviceName)) {
            this.getPluginSpec(dict);
        }
        else if ("MPM_UTIL_PLUGIN_PARAM".equals(serviceName)) {
            this.getPluginParam(dict);
        }
        else if ("MPM_UTIL_PLUGIN_PARAM_OPER".equals(serviceName)) {
            this.operPluginParam(dict);
        }
        else if ("MPM_UTIL_SCRIPT_RESULT".equals(serviceName)) {
            this.getScriptResult(dict);
        }
        return 0;
    }

    /**
     * MPM_UTIL_EMS:EMS相关信息查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getEMSInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getEMSInfo(dict);

    }

    /**
     * MPM_UTIL_PARAVALUE:PM系统多值参数查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getParavalue(DynamicDict dict) throws BaseAppException {

        getDmo().getParavalue(dict);

    }

    /**
     * MPM_UTIL_PARAVALUE:PM系统唯一值参数查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getParameter(DynamicDict dict) throws BaseAppException {

        getDmo().getParameter(dict);

    }

    /**
     * MPM_UTIL_DATA_SOURCE:PM系统DB数据源查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getDataSource(DynamicDict dict) throws BaseAppException {

        getDmo().getDataSource(dict);

    }  
    
    /**
     * MPM_CONFIG_UTIL_PLUGIN_SPEC:PM系统插件规格查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getPluginSpec(DynamicDict dict) throws BaseAppException {

        getDmo().getPluginSpec(dict);

    }
    
    /**
     * MPM_CONFIG_UTIL_PLUGIN_PARAM:PM系统插件参数查询服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getPluginParam(DynamicDict dict) throws BaseAppException {

        getDmo().getPluginParam(dict);

    }
    /**
     * MPM_UTIL_PLUGIN_PARAM_OPER:PM系统插件参数操作服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operPluginParam(DynamicDict dict) throws BaseAppException {

        getDmo().operPluginParam(dict);

    }

    /**
     * MPM_UTIL_SCRIPT_RESULT:PM系统SQL脚本查询结果服务对应的处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getScriptResult(DynamicDict dict) throws BaseAppException {

        getDmo().getScriptResult(dict);

    }

    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractUtilInfo getDmo() throws BaseAppException {
        return (AbstractUtilInfo) GeneralDMOFactory.create(AbstractUtilInfo.class);
    }

}
