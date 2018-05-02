package com.ztesoft.zsmart.oss.core.pm.meta.kpi.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.kpi.domain.AbstractKPIInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM元数据-指标管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-5 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.kpi.service <br>
 */
public class KPIService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_META_KPI_QUERY".equals(serviceName)) {
            this.getKPIInfo(dict);
        }
        else if ("MPM_META_KPI_FORMULAR_QUERY".equals(serviceName)) {
            this.getKPIFormular(dict);
        }
        else if ("MPM_META_KPI_OPER".equals(serviceName)) {
            this.operKPIInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_META_KPI_QUERY:指标信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getKPIInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getKPIInfo(dict);

    }

    /**
     * MPM_META_KPI_QUERY:指标信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getKPIFormular(DynamicDict dict) throws BaseAppException {

        getDmo().getKPIFormular(dict);

    }

    /**
     * MPM_META_KPI_OPER:指标信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operKPIInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmo().addKPIInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmo().editKPIInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmo().delKPIInfo(dict);
        }
    }

    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractKPIInfo getDmo() throws BaseAppException {
        return (AbstractKPIInfo) GeneralDMOFactory.create(AbstractKPIInfo.class);
    }

}
