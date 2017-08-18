package com.ztesoft.zsmart.oss.core.pm.meta.model.busi.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.model.busi.domain.AbstractModelBusiInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM元数据-测量对象管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.busi.service <br>
 */
public class ModelBusiService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_META_MODEL_BUSI_QUERY".equals(serviceName)) {
            this.getModelBusiInfo(dict);
        }
        else if ("MPM_META_MODEL_BUSI_FIELD_QUERY".equals(serviceName)) {
            this.getModelBusiField(dict);
        }
        else if ("MPM_META_MODEL_BUSI_OPER".equals(serviceName)) {
            this.operModelBusiInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_META_ModelBusi_QUERY:测量对象信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getModelBusiInfo(DynamicDict dict) throws BaseAppException {

        getDmodelBusi().getModelBusiInfo(dict);

    }

    /**
     * MPM_META_ModelBusi_QUERY:测量对象信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getModelBusiField(DynamicDict dict) throws BaseAppException {

        getDmodelBusi().getModelBusiField(dict);

    }

    /**
     * MPM_META_ModelBusi_OPER:测量对象信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operModelBusiInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmodelBusi().addModelBusiInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmodelBusi().editModelBusiInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmodelBusi().delModelBusiInfo(dict);
        }
    }

    /**
     * 获取DOMAIN对象 <br>
     * 
     * @author Srd <br>
     * @taskId <br>
     * @return AbstractModelBusiInfo <br>
     * @throws BaseAppException <br>
     */
    private AbstractModelBusiInfo getDmodelBusi() throws BaseAppException {
        return (AbstractModelBusiInfo) GeneralDMOFactory.create(AbstractModelBusiInfo.class);
    }

}
