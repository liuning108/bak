package com.ericsson.inms.pm.service.impl.resmgr;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.resmgr.ResMgrService;
import com.ericsson.inms.pm.service.impl.resmgr.dao.ResMgrDAO;
import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.base.jdbc.JdbcUtil;

@Service("resMgrServiceImpl")
public class ResMgrServiceImpl implements ResMgrService {

    @Override
    public JSONObject loadTree(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().loadTree(dict);
    }

    private ResMgrDAO getDAO() {
        try {
            ResMgrDAO dao = (ResMgrDAO) GeneralDAOFactory.create(ResMgrDAO.class, JdbcUtil.OSS_PM);
            return dao;
        }
        catch (Exception e) {
            return null;
        }
    }

    @Override
    public JSONObject qurRes(JSONObject dict) throws BaseAppException {
        return getDAO().qurRes(dict);
    }

    @Override
    public JSONObject qurTmpInfo(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().qurTmpInfo(dict);
    }

    @Override
    public JSONObject getSubTreeData(JSONObject dict) throws BaseAppException {
        // TODO Auto-generated method stub
        return getDAO().getSubTreeData(dict);
    }

}
