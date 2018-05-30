package com.ztesoft.zsmart.oss.itnms.trigger.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.framework.jdbc.GeneralDAO;

public abstract class ExpFunDao extends GeneralDAO<Map<String, String>> {
    
    public abstract List<Map<String, Object>> queryItnmsExpFunc();

    public abstract  List<Map<String,Object>> queryItnmsExpFuncPara();
}
