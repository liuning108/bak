package com.ztesoft.zsmart.oss.core.pm.meta.util.domain;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.pm.meta.util.dao.KPIRELADAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * KPIRELAInfo <br>
 * 
 * @author wen.yongjun <br>
 * @version V8.0.1<br>
 * @CreateDate 2017-4-11 <br>
 * @since JDK7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.util.domain <br>
 */

public class KPIRELAInfo extends AbstractKPIRELAInfo {

    @Override
    public void getKPIRELAInfo(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        this.getDao().getKPIRELAInfo(dict);
    }

    @Override
    public void getMOPluginInfo(DynamicDict dict) throws BaseAppException {
        // TODO Auto-generated method stub
        this.getDao().getMOPluginInfo(dict);
    }

    /**
     * getMOPluginInfo <br>
     * 
     * @author wen.yongjun <br>
     * @return KPIRELADAO 
     * @throws BaseAppException <br>
     */    
    private KPIRELADAO getDao() throws BaseAppException {
        return (KPIRELADAO) GeneralDAOFactory.create(KPIRELADAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
    }

}
