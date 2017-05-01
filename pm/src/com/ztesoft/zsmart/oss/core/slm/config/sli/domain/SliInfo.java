package com.ztesoft.zsmart.oss.core.slm.config.sli.domain;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.core.slm.config.sli.dao.SliDAO;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * SLI管理的DOMAIN类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sli.domain <br>
 */
public class SliInfo extends AbstractSliInfo {

    @Override
    public void addSliInfo(DynamicDict sliInfo) throws BaseAppException {
        getDao().insert(sliInfo);
    }

    @Override
    public void removeSliInfo(DynamicDict sliInfo) throws BaseAppException {
        getDao().delete(sliInfo);
    }

    @Override
    public void modifySliInfo(DynamicDict sliInfo) throws BaseAppException {
        getDao().update(sliInfo);
    }

    @Override
    public List<HashMap<String, String>> getSloBySli(String sliNo) throws BaseAppException {
        return getDao().selectSloBySli(sliNo);
    }

    @Override
    public HashMap<String, String> getSliByNo(String sliNo) throws BaseAppException {
        return getDao().selectById(sliNo);
    }

    /**
     * 
     * 获取DAO对象 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private SliDAO getDao() throws BaseAppException {
        return (SliDAO) GeneralDAOFactory.create(SliDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_SLM));
    }

}
