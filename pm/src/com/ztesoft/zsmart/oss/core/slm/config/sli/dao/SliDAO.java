package com.ztesoft.zsmart.oss.core.slm.config.sli.dao;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAO;

/**
 * SLI管理相关的DAO操作抽象类 <br>
 * 
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sli.dao <br>
 */
public abstract class SliDAO extends GeneralDAO<DynamicDict> {

    @Override
    public int deleteById(String sliNo) throws BaseAppException {
        return 0;
    }

    /**
     * 根据SLI_NO查询出关联的SLO <br>
     * 
     * @author lwch <br>
     * @taskId <br>
     * @param sliNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    public abstract List<HashMap<String, String>> selectSloBySli(String sliNo) throws BaseAppException;

}
