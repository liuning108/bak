package com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.utils.ExceptionUtil;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.domain.AbstractEvalInst;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * SLA监控相关服务处理类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-19 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.slamonitor.service <br>
 */
public class SlaMonitorService implements IAction {

    /**
     * logger <br>
     */
    private final ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
    
    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MSLM_SLAMONITOR_SERVICE".equals(serviceName)) {
            slaMonitor(dict);
        }
        return 0;
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void slaMonitor(DynamicDict dict) throws BaseAppException {

        String action = dict.getString("ACTION");

        if ("getSlaEvalInst".equals(action)) {
            getSlaEvalInst(dict);
        }
        if ("getSlaEvalServiceInstBySla".equals(action)) {
            getSlaEvalServiceInstBySla(dict);
        }
        else if ("getSloEvalInstBySla".equals(action)) {
            getSloEvalInstBySla(dict);
        }
        else if ("getSliRuleEvalInstBySlo".equals(action)) {
            getSliRuleEvalInstBySlo(dict);
        }
    }

    /**
     * 
     * 获取当前的正在执行的SLA的实例 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getSlaEvalInst(DynamicDict dict) throws BaseAppException {
        List<HashMap<String, String>> slaInstList = new ArrayList<HashMap<String, String>>();
        try {
            slaInstList = getEvalInstDmo().getSlaEvalInst();
        }
        catch (BaseAppException e) {
            logger.error("getSlaEvalInst : " + ExceptionUtil.exToString(e));
        }
        dict.set("SLA_INST_INFO", slaInstList);
    }

    /**
     * 
     * 根据SLA_INSTID获取关联的服务信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getSlaEvalServiceInstBySla(DynamicDict dict) throws BaseAppException {
        List<HashMap<String, String>> slaInstList = getEvalInstDmo().getSlaEvalServiceInst(dict);
        dict.set("SLA_INST_SERVICE_INFO", slaInstList);
    }

    /**
     * 
     * 根据SLA_INSTID获取关联的SLO信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getSloEvalInstBySla(DynamicDict dict) throws BaseAppException {
        List<HashMap<String, String>> sloInstList = getEvalInstDmo().getSloEvalInst(dict);
        dict.set("SLO_INST_INFO", sloInstList);
    }

    /**
     * 
     * 根据SLO_INSTID获取关联的SLI的信息，以及当前评估周期内的SLI的计算实例数据 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getSliRuleEvalInstBySlo(DynamicDict dict) throws BaseAppException {
        List<HashMap<String, String>> sliInstList = getEvalInstDmo().getSliRuleInst(dict);
        List<HashMap<String, String>> sliInstEvalList = getEvalInstDmo().getSliRuleEvalInst(dict);
        dict.set("SLI_INST_INFO", sliInstList);
        dict.set("SLI_EVAL_INST_INFO", sliInstEvalList);
    }

    /**
     * 
     * 获取DOMAIN对象 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractEvalInst getEvalInstDmo() throws BaseAppException {
        return (AbstractEvalInst) GeneralDMOFactory.create(AbstractEvalInst.class);
    }
}
