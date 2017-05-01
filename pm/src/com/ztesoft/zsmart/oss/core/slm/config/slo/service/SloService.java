package com.ztesoft.zsmart.oss.core.slm.config.slo.service;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.service.ServiceFlow;
import com.ztesoft.zsmart.oss.core.slm.config.slo.domain.AbstractSloInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * SLO配置管理相关服务处理类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.slo.service <br>
 */
public class SloService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.serviceName;
        if ("MSLM_SLOMGR_SERVICE".equals(serviceName)) {
            mgrSloData(dict);
        }
        return 0;
    }

    /**
     * 
     * MSLM_SLOMGR_SERVICE 服务对应的处理方法 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void mgrSloData(DynamicDict dict) throws BaseAppException {

        String action = dict.getString("ACTION");

        if ("getServiceAndSloCatalog".equals(action)) {
            getServiceAndSloCatalog(dict);
        }
        else if ("getSloInfo".equals(action)) {
            getSloInfo(dict);
        }
        else if ("checkSloState".equals(action)) {
            checkSloState(dict);
        }
        else {
            DynamicDict sloDict = dict.getBO("SLO_DATA");
            if ("addSlo".equals(action)) {
                getDmo().addSloInfo(sloDict);
            }
            else if ("modifySlo".equals(action)) {
                getDmo().modifySloInfo(sloDict);
            }
            else if ("removeSlo".equals(action)) {
                getDmo().removeSloInfo(sloDict);
            }
        }
    }

    /**
     * 
     * 删除SLO时，检查SLO是否被SLA引用 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void checkSloState(DynamicDict dict) throws BaseAppException {
        String sloNo = dict.getString("SLO_NO");
        List<HashMap<String, String>> sloNameList = getDmo().getSlaBySlo(sloNo);
        dict.set("SLA_LIST", sloNameList);
    }

    /**
     * 
     * 查询SLO-SC的关系目录树 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getServiceAndSloCatalog(DynamicDict dict) throws BaseAppException {

        List<DynamicDict> serviceCatalog = getServiceCatalog();
        List<HashMap<String, String>> serviceSloCatalog = getDmo().getServiceAndSloCatalog();
        for (HashMap<String, String> sloCatalog : serviceSloCatalog) {
            DynamicDict sloCatalogDict = new DynamicDict();
            sloCatalogDict.valueMap.putAll(sloCatalog);
            serviceCatalog.add(sloCatalogDict);
        }
        dict.set("SC_SLO_CATALOG", serviceCatalog);
    }

    /**
     * 
     * 查询SC的目录树<br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    @SuppressWarnings("unchecked")
    private List<DynamicDict> getServiceCatalog() throws BaseAppException {
        DynamicDict serviceDict = new DynamicDict();
        serviceDict.setServiceName("QSLM_PROD_CATALOG");
        ServiceFlow.callService(serviceDict, true);
        return serviceDict.getList("z_d_r");
    }

    /**
     * 
     * 查询SC名称 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param scNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private String getServiceNameByNo(String scNo) throws BaseAppException {
        List<DynamicDict> serviceCatalog = getServiceCatalog();
        for (DynamicDict serviceDict : serviceCatalog) {
            if (serviceDict.getString("ID").equals(scNo)) {
                return serviceDict.getString("NAME");
            }
        }
        return "";
    }

    /**
     * 
     * 根据SLO_NO，获取SLO，SLO-SLI_RULE信息 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void getSloInfo(DynamicDict dict) throws BaseAppException {

        DynamicDict sloDict = dict.getBO("SLO_DATA");

        HashMap<String, String> sloInfo = getDmo().getSloInfoByNo(sloDict);
        List<HashMap<String, String>> sloRuleInfo = getDmo().getSloRuleInfoByNo(sloDict);

        DynamicDict sloInfoDict = new DynamicDict();
        sloInfoDict.valueMap.putAll(sloInfo);
        sloInfoDict.set("SC_NAME", getServiceNameByNo(sloInfoDict.getString("SC_ITEM_NO")));
        sloInfoDict.set("RULE_DATA", sloRuleInfo);
        dict.set("SLO_INFO", sloInfoDict);
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
    private AbstractSloInfo getDmo() throws BaseAppException {
        return (AbstractSloInfo) GeneralDMOFactory.create(AbstractSloInfo.class);
    }
}
