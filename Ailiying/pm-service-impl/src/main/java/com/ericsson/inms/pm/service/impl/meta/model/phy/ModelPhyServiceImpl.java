package com.ericsson.inms.pm.service.impl.meta.model.phy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.model.phy.ModelPhyService;
import com.ericsson.inms.pm.service.impl.meta.model.phy.bll.ModelPhyManager;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月13日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.phy.service <br>
 */
@Service("modelPhyServ")
public class ModelPhyServiceImpl implements ModelPhyService {
    /**
     * modelPhyManager <br>
     */
    @Autowired
    private ModelPhyManager modelPhyManager;

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.modelPhyManager.getModelPhyInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelPhyScript(JSONObject dict) throws BaseAppException {
        return this.modelPhyManager.getModelPhyScript(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict JSONObject
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getModelPhyDataSource(JSONObject dict) throws BaseAppException {
        return this.modelPhyManager.getModelPhyDataSource(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject delModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.modelPhyManager.delModelPhyInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @throws BaseAppException <br>
     */
    public void addModelPhyDataSource(JSONObject dict) throws BaseAppException {
        this.modelPhyManager.addModelPhyDataSource(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject editModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.modelPhyManager.editModelPhyInfo(dict);
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject addModelPhyInfo(JSONObject dict) throws BaseAppException {
        return this.modelPhyManager.addModelPhyInfo(dict);
    }

}
