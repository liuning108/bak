package com.ztesoft.zsmart.oss.core.pm.util.domain;

import java.util.ArrayList;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.util.dao.UtilDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * PM-Util的DOMAIN类 <br>
 * 
 * @author Srd <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-3-28 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.util.domain <br>
 */
public class UtilInfo extends AbstractUtilInfo {

    @Override
    public void getEMSInfo(DynamicDict dict) throws BaseAppException {
        getDao().getEMSInfo(dict);
    }

    @Override
    public void getParavalue(DynamicDict dict) throws BaseAppException {
        getDao().getParavalue(dict);
    }

    @Override
    public void getParameter(DynamicDict dict) throws BaseAppException {
        getDao().getParameter(dict);
    }

    @Override
    public void getDataSource(DynamicDict dict) throws BaseAppException {
        getDao().getDataSource(dict);
    }

    @Override
    public void getPluginSpec(DynamicDict dict) throws BaseAppException {
        getDao().getPluginSpec(dict);
    }

    @Override
    public void getPluginParam(DynamicDict dict) throws BaseAppException {
        getDao().getPluginParam(dict);
    }

    @Override
    public void operPluginParam(DynamicDict dict) throws BaseAppException {
        getDao().operPluginParam(dict);
    }

    @Override
    public void getScriptResult(DynamicDict dict) throws BaseAppException {
        getDao().getScriptResult(dict);
    }

    @Override
    public String exportExcel(ArrayList<DynamicDict> colModel, String runSql, ParamArray params) throws BaseAppException {
        return getDao().exportExcel(colModel, runSql, params);
    }

    /**
     * 获取DAO对象 <br>
     * 
     * @author Srd <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private UtilDAO getDao() throws BaseAppException {
        return (UtilDAO) GeneralDAOFactory.create(UtilDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
