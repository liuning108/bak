package com.ztesoft.zsmart.oss.itnms.trigger.dao.mysql;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.itnms.trigger.dao.ExpFunDao;

public class ExpFunDaoMysqlImpl extends ExpFunDao{


    @Override
    public List<Map<String, Object>> queryItnmsExpFunc() {
        String sql = "SELECT FUNC_NAME,DECRIPTION,SUPPORTED_DATA_TYPES,RETURN_VALUE_RESTRICTION,"
                + "PROTOTYPE,DESCRIPTION_CN,IN_PARAM_IDS FROM ITNMS_EXP_FUNC";
        return  this.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> queryItnmsExpFuncPara() {
        String sql = "SELECT PARA_ID,PARA_NAME,VALUE_TYPE,VALUE_RESTRICTION,MARK,PARA_NAME_CN FROM ITNMS_EXP_FUNC_PARA";
        return  this.queryForList(sql);
    }

}
