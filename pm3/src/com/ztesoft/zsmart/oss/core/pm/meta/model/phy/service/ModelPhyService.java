package com.ztesoft.zsmart.oss.core.pm.meta.model.phy.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.model.phy.domain.AbstractModelPhyInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM元数据-物理模型管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-10 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.service <br>
 */
public class ModelPhyService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_META_MODEL_PHY_QUERY".equals(serviceName)) {
            this.getModelPhyInfo(dict);
        }
        else if ("MPM_META_MODEL_PHY_SCRIPT_QUERY".equals(serviceName)) {
            this.getModelPhyScript(dict);
        }
        else if ("MPM_META_MODEL_PHY_DATA_SOURCE_QUERY".equals(serviceName)) {
            this.getModelPhyDataSource(dict);
        }
        else if ("MPM_META_MODEL_PHY_OPER".equals(serviceName)) {
            this.operModelPhyInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_META_ModelPhy_QUERY:物理模型信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getModelPhyInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getModelPhyInfo(dict);

    }

    /**
     * MPM_META_ModelPhy_QUERY:物理模型信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getModelPhyScript(DynamicDict dict) throws BaseAppException {

        getDmo().getModelPhyScript(dict);

    }

    /**
     * MPM_META_ModelPhy_QUERY:物理模型信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getModelPhyDataSource(DynamicDict dict) throws BaseAppException {

        getDmo().getModelPhyDataSource(dict);

    }

    /**
     * MPM_META_ModelPhy_OPER:指标信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operModelPhyInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmo().addModelPhyInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmo().editModelPhyInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmo().delModelPhyInfo(dict);
        }
        else if ("add-data-src".equals(operType)) {
            getDmo().addModelPhyDataSource(dict);
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
    private AbstractModelPhyInfo getDmo() throws BaseAppException {
        return (AbstractModelPhyInfo) GeneralDMOFactory.create(AbstractModelPhyInfo.class);
    }

}
