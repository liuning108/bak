package com.ztesoft.zsmart.oss.core.slm.config.sli.service;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.slm.config.sli.domain.AbstractSliInfo;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * SLI配置管理相关服务处理类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sli.service <br>
 */
public class SliService implements IAction {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());
    
    @Override
    public int perform(DynamicDict dict) throws BaseAppException {

        SessionManage.putSession(dict);
        String serviceName = dict.getServiceName();
        if ("MSLM_SLIMGR_SERVICE".equals(serviceName)) {
            mgrSliData(dict);
        }
        return 0;
    }

    /**
     * 
     * MSLM_SLIMGR_SERVICE 服务对应的处理方法 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void mgrSliData(DynamicDict dict) throws BaseAppException {

        String action = dict.getString("ACTION");

        if ("checkSliState".equals(action)) {
            checkSliState(dict);
        }
        else if ("checkSliExists".equals(action)) {
            checkSliExists(dict);
        }
        else {
            DynamicDict sliDict = dict.getBO("SLI_DATA");
            if ("addSli".equals(action)) {
                getDmo().addSliInfo(sliDict);
            }
            else if ("modifySli".equals(action)) {
                getDmo().modifySliInfo(sliDict);
            }
            else if ("removeSli".equals(action)) {
                getDmo().removeSliInfo(sliDict);
            }
        }
    }

    /**
     * 
     * 检查SLI_NO是否已经存在 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void checkSliExists(DynamicDict dict) throws BaseAppException {
        String sliNo = dict.getString("SLI_NO");
        HashMap<String, String> sliData = getDmo().getSliByNo(sliNo);
        dict.set("IS_EXISTS", !"0".equals(sliData.get("COUNT")));
    }

    /**
     * 
     * 删除SLI时，检查SLI是否被SLO引用 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    private void checkSliState(DynamicDict dict) throws BaseAppException {
        String sliNo = dict.getString("SLI_NO");
        List<HashMap<String, String>> sloNameList = getDmo().getSloBySli(sliNo);
        dict.set("SLO_LIST", sloNameList);
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
    private AbstractSliInfo getDmo() throws BaseAppException {
        return (AbstractSliInfo) GeneralDMOFactory.create(AbstractSliInfo.class);
    }

}
