package com.ztesoft.zsmart.oss.core.pm.meta.measure.service;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.measure.domain.AbstractMeasureInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * PM元数据-测量对象管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-7 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.measure.service <br>
 */
public class MeasureService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MPM_META_MEASURE_QUERY".equals(serviceName)) {
            this.getMeasureInfo(dict);
        }
        else if ("MPM_META_MEASURE_FIELD_QUERY".equals(serviceName)) {
            this.getMeasureField(dict);
        }
        else if ("MPM_META_MEASURE_OPER".equals(serviceName)) {
            this.operMeasureInfo(dict);
        }
        return 0;
    }

    /**
     * MPM_META_Measure_QUERY:测量对象信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getMeasureInfo(DynamicDict dict) throws BaseAppException {

        getDmo().getMeasureInfo(dict);

    }

    /**
     * MPM_META_Measure_QUERY:测量对象信息查询服务 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getMeasureField(DynamicDict dict) throws BaseAppException {

        getDmo().getMeasureField(dict);

    }

    /**
     * MPM_META_Measure_OPER:测量对象信息增删改处理方法 <br>
     * 
     * @author Srd <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void operMeasureInfo(DynamicDict dict) throws BaseAppException {

        String operType = (String) dict.getValueByName("OPER_TYPE");

        if ("add".equals(operType)) {
            getDmo().addMeasureInfo(dict);
        }
        else if ("edit".equals(operType)) {
            getDmo().editMeasureInfo(dict);
        }
        else if ("del".equals(operType)) {
            getDmo().delMeasureInfo(dict);
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
    private AbstractMeasureInfo getDmo() throws BaseAppException {
        return (AbstractMeasureInfo) GeneralDMOFactory.create(AbstractMeasureInfo.class);
    }

}
