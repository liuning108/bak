package com.ztesoft.zsmart.oss.core.pm.meta.dim.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.dim.domain.AbstractDimInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM元数据-维度管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-3 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.service <br>
 */
public class DimService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_META_DIM_QUERY".equals(serviceName)) {
            this.getDimInfo(dict);
        }
        else if ("MPM_META_DIM_OPER".equals(serviceName)) {
            this.operDimInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_META_DIM_QUERY:维度信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getDimInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getDimInfo(dict);

    }

    /**
     * MPM_META_DIM_OPER:维度信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operDimInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmo().addDimInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmo().editDimInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmo().delDimInfo(dict);
        }
        else {
            logger.debug("OPER_TYPE is rong:" + dict.asXML("utf-8"));
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
    private AbstractDimInfo getDmo() throws BaseAppException {
        return (AbstractDimInfo) GeneralDMOFactory.create(AbstractDimInfo.class);
    }

}
