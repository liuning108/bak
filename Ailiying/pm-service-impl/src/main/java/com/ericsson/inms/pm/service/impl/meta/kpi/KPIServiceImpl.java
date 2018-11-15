package com.ericsson.inms.pm.service.impl.meta.kpi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.kpi.KPIService;
import com.ericsson.inms.pm.service.impl.meta.kpi.bll.KPIManager;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * PM元数据-指标管理相关服务处理类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-5 <br>
 * @since JDK7.0<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.kpi.service <br>
 */
@Service("kpiServ")
public class KPIServiceImpl implements KPIService {

    /**
     * kpiManager <br>
     */
    @Autowired
    private KPIManager kpiManager;
    
    @Override
    public JSONObject getKPIInfo(JSONObject dict) throws BaseAppException {
        return this.kpiManager.getKPIInfo(dict);
    }
    
    @Override
    public JSONObject getCLASSInfo(JSONObject dict) throws BaseAppException {
        return this.kpiManager.getCLASSInfo(dict);
    }

    @Override
    public JSONObject getKPIFormular(JSONObject dict) throws BaseAppException {
        return this.kpiManager.getKPIFormular(dict);
    }

    @Override
    public JSONObject addKPIInfo(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return this.kpiManager.addKPIInfo(dict);
    }

    @Override
    public JSONObject editKPIInfo(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return this.kpiManager.editKPIInfo(dict);
    }

    @Override
    public JSONObject delKPIInfo(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return this.kpiManager.delKPIInfo(dict);
    }

}
