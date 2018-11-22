package com.ericsson.inms.pm.service.impl.resmgr.dao;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

public abstract class ResMgrDAO extends GeneralDAO {
    public abstract JSONObject loadTree(JSONObject dict) throws BaseAppException;
    public abstract JSONObject qurRes(JSONObject dict) throws BaseAppException;
    public abstract JSONObject qurTmpInfo(JSONObject dict) throws BaseAppException;
    public abstract JSONObject getSubTreeData(JSONObject dict) throws BaseAppException;
}
