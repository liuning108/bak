package com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.domain.AbstractWinEvalInst;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * [描述] <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.slaeval.dashboard.service <br>
 */
public class SlaDashboardService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MSLM_SLADASHBOARD_SERVICE".equals(serviceName)) {
            slaDashboard(dict);
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
    private void slaDashboard(DynamicDict dict) throws BaseAppException {

        String action = dict.getString("ACTION");
        if ("getSlaWinEvalOverview".equals(action)) {
            getSlaWinEvalOverview(dict);
        }
        else if ("getSlaTrendWinEvalOverview".equals(action)) {
            getSlaTrendWinEvalOverview(dict);
        }
        else if ("getSlaWinEvalInst".equals(action)) {
            getSlaWinEvalInst(dict);
        }

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
    private void getSlaWinEvalInst(DynamicDict dict) throws BaseAppException {
        List<HashMap<String, String>> slaWinInstDataList = getWinEvalInstDmo().getSlaWinEvalInst(dict);
        dict.set("SLA_INST_LIST", slaWinInstDataList);
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
    private void getSlaTrendWinEvalOverview(DynamicDict dict) throws BaseAppException {
        List<HashMap<String, String>> resultDataList = getWinEvalInstDmo().getSlaTrendWinEvalOverview(dict);
        if (resultDataList.size() > 0) {
            Collections.sort(resultDataList, new Comparator<HashMap<String, String>>() {
                public int compare(HashMap<String, String> o1, HashMap<String, String> o2) {
                    return o1.get("TIME").compareTo(o2.get("TIME"));
                }
            });
        }
        dict.set("SLA_INST_LIST", resultDataList);
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
    private void getSlaWinEvalOverview(DynamicDict dict) throws BaseAppException {
        HashMap<String, String> resultDataList = getWinEvalInstDmo().getSlaWinEvalOverview(dict);
        dict.set("SLA_INST_DATA", resultDataList);
    }

    /**
     * 
     * [方法描述] <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private AbstractWinEvalInst getWinEvalInstDmo() throws BaseAppException {
        return (AbstractWinEvalInst) GeneralDMOFactory.create(AbstractWinEvalInst.class);
    }

}
