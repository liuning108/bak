package com.ericsson.inms.pm.service.impl.meta.dim;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.dto.meta.dim.DimDto;
import com.ericsson.inms.pm.api.dto.meta.dim.DimScriptDto;
import com.ericsson.inms.pm.api.service.meta.dim.DimService;
import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ericsson.inms.pm.service.impl.meta.constant.Constant;
import com.ericsson.inms.pm.service.impl.meta.dim.bll.DimManager;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.log.ZSmartLogger;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.service <br>
 */
@Service("dimServ")
public class DimServiceImpl implements DimService {

    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(DimServiceImpl.class);

    /**
     * dimManager <br>
     */
    @Autowired
    private DimManager dimManager;

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param params params
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject getDimInfo(JSONObject params) throws BaseAppException {
        return this.dimManager.getDimInfo(params);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dimCode dimCode
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject delDimInfo(String dimCode) throws BaseAppException {
        return this.dimManager.delDimInfo(dimCode);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject addDimInfo(JSONObject param) throws BaseAppException {

        DimDto dim = transDimInfo(param);
        checkRequestDim(dim);
        this.dimManager.addDimInfo(dim);

        JSONObject result = new JSONObject();
        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param param param
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    public JSONObject editDimInfo(JSONObject param) throws BaseAppException {
        DimDto dim = transDimInfo(param);
        checkRequestDim(dim);
        this.dimManager.editDimInfo(dim);

        JSONObject result = new JSONObject();
        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author <br>
     * @taskId <br>
     * @param param param
     * @return DimDto
     * @throws BaseAppException BaseAppException
     */
    private DimDto transDimInfo(JSONObject param) throws BaseAppException {
        DimDto dim = new DimDto();

        dim.setDimCode(CommonUtil.getStrFromMapWithExc(param, "DIM_CODE"));
        dim.setDimName(CommonUtil.getStrFromMapWithExc(param, "DIM_NAME"));
        dim.setDimDesc(param.getString("DIM_DESC"));

        JSONArray scriptArr = param.getJSONArray("scriptList");

        int count = scriptArr.size();
        if (count > 0) {
            List<DimScriptDto> scriptList = new ArrayList<DimScriptDto>();
            for (int i = 0; i < count; i++) {
                JSONObject curScript = (JSONObject) scriptArr.get(i);
                DimScriptDto scriptDto = new DimScriptDto();
                scriptDto.setDimCode(CommonUtil.getStrFromMapWithExc(curScript, "DIM_CODE"));
                scriptDto.setDimScript(curScript.getString("DIM_SCRIPT"));
                scriptDto.setScriptType(CommonUtil.getStrFromMapWithExc(curScript, "SCRIPT_TYPE"));
                scriptList.add(scriptDto);
            }
            dim.setScriptList(scriptList);
        }

        return dim;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    private void checkRequestDim(DimDto dim) throws BaseAppException {
        if (StringUtils.isEmpty(dim.getDimCode())) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_PARAM_REQUIRED, "DIM_CODE 为空.", "DIM_CODE");
        }
        if (StringUtils.isEmpty(dim.getDimName())) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_PARAM_REQUIRED, "DIM_NAME 为空.", "DIM_NAME");
        }
    }

}
