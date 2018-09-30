package com.ericsson.inms.pm.service.impl.meta.dim.bll;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.dto.meta.dim.DimDto;
import com.ericsson.inms.pm.service.impl.meta.constant.Constant;
import com.ericsson.inms.pm.service.impl.meta.dim.dao.DimDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.transaction.Timeout;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

/**
 * Description: <br>
 * 
 * @author 0027010454<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.dim.bll <br>
 */
@Component
public class DimManager {

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
        return this.getDAO().getDimInfo(params);
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
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public JSONObject delDimInfo(String dimCode) throws BaseAppException {
        this.getDAO().delDimInfo(dimCode);

        JSONObject result = new JSONObject();

        result.put(Constant.Return.RETURN_CODE, Constant.ReturnCode.SUCC);

        return result;
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void addDimInfo(DimDto dim) throws BaseAppException {
        this.getDAO().addDimInfo(dim);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    @Transactional(timeout = Timeout.LEVEL_ONE, propagation = Propagation.REQUIRED)
    public void editDimInfo(DimDto dim) throws BaseAppException {
        this.getDAO().editDimInfo(dim);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @return <br>
     */
    private DimDAO getDAO() {
        DimDAO dao = (DimDAO) GeneralDAOFactory.create(DimDAO.class, JdbcUtil.OSS_PM);
        return dao;
    }
}
