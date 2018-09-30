package com.ericsson.inms.pm.service.impl.meta.model.busi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.meta.model.busi.ModelBusiService;
import com.ericsson.inms.pm.service.impl.meta.model.busi.bll.ModelBusiManager;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/** 
 * Description: <br> 
 *  
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月14日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.model.busi.service <br>
 */
@Service("modelBusiServ")
public class ModelBusiServiceImpl implements ModelBusiService {
    /**
     * modelBusiManager <br>
     */
    @Autowired
    private ModelBusiManager modelBusiManager;
    
    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public JSONObject getModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.modelBusiManager.getModelBusiInfo(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public JSONObject getModelBusiField(JSONObject dict) throws BaseAppException {
        return this.modelBusiManager.getModelBusiField(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public JSONObject addModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.modelBusiManager.addModelBusiInfo(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public JSONObject editModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.modelBusiManager.editModelBusiInfo(dict);
    }

    /**
     * Description: <br> 
     *  
     * @author XXX<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException  <br>
     */ 
    public JSONObject delModelBusiInfo(JSONObject dict) throws BaseAppException {
        return this.modelBusiManager.delModelBusiInfo(dict);
    }
}
