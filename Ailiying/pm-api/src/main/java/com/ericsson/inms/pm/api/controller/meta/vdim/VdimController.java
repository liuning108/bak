package com.ericsson.inms.pm.api.controller.meta.vdim;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ericsson.inms.pm.api.service.meta.vdim.IVdimSrv;
import com.ztesoft.zsmart.pot.annotation.PublicServ;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-5 <br>
 * @since V7.0<br>
 * @see com.ericsson.inms.pm.api.controller.meta.vdim <br>
 */
@RestController
//@IgnoreSession
@RequestMapping("vdim")
public class VdimController {
    
    /**
     * vdimSrv <br>
     */
    @Autowired
    private IVdimSrv vdimSrv;
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br> 
     * @return Map
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "loadVdimList", method = RequestMethod.GET)
    @PublicServ
    public Map<String, Object> loadVdimList() throws BaseAppException {
        return vdimSrv.loadVdimList();
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "saveVdim", method = RequestMethod.POST)
    @PublicServ
    public void saveVdim(@RequestBody Map<String, Object> params) throws BaseAppException {
        vdimSrv.saveVdim(params);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    @RequestMapping(value = "deleteVdim", method = RequestMethod.POST)
    @PublicServ
    public void deleteVdim(@RequestBody Map<String, Object> params) throws BaseAppException {
        vdimSrv.deleteVdim(params);
    }
    
}


