package com.ztesoft.zsmart.oss.core.pm.bscreen.service;

import java.io.File;
import java.lang.reflect.Method;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;

import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.core.pm.bscreen.util.BScreenUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.bscreen.service <br>
 */
public class BScreenService implements IAction {

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @return int
     * @throws BaseAppException <br>
     */
    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);

        String methodName = dict.getString("method");
        try {
            Method method = this.getClass().getMethod(methodName, DynamicDict.class);
            method.invoke(this, dict);
        }
        catch (Exception e) {
            new BaseAppException(e.getMessage());
        }
        return 0;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void getServerSkeleton(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("Id", dict.getString("Id"));
        dict.add("serverSkeleton", bsm.getServerSkeleton(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */

    public void saveOrUpdate(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        bsm.saveOrUpdate(dict);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void queryBScreenById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        bsm.queryBScreenById(dict);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void queryBScreenListByUserID(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Long userId = dict.getLong("userId");
        List<Map<String, Object>> topiclist = bsm.queryBScreenListByUserID(userId);
        dict.add("topiclist", topiclist);

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void deleteBScreenById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        String id = dict.getString("topicId");
        boolean b = bsm.deleteBScreenById(id);
        dict.add("deleteTopic", b);

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br> 
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void saveOrUpdateSourceService(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        DynamicDict json = dict.getBO("json");
        Map<String, String> map = new HashMap<String, String>();
        map.put("no", json.getString("no"));
        map.put("name", json.getString("name"));
        map.put("type", json.getString("type"));
        map.put("source", json.getString("source"));
        map.put("userId", json.getString("userId"));
        String attrs = JSON.toJSONString(BScreenUtil.dic2Map2((DynamicDict) json.get("attrs")));
        map.put("attrs", attrs);
        dict.add("saveUpdateSourceService", bsm.saveOrUpdateSourceService(map));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void getFields(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("source", dict.getString("source"));
        param.put("sql", dict.getString("sql"));
        dict.add("fields", bsm.getFields(param));

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void getSourceServiceList(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("userId", dict.getString("userId"));
        dict.add("serviceList", bsm.getSourceServiceList(param));

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void getSourceServiceById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("Id", dict.getString("Id"));
        dict.add("sourceService", bsm.getSourceServiceById(param));

    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void delSourceServiceById(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("Id", dict.getString("Id"));
        dict.add("delSourceService", bsm.delSourceServiceById(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void getSource(DynamicDict dict) throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        dict.add("sourceList", bsm.getSource());

    }
    
    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */
    public void delFile(DynamicDict dict) throws BaseAppException {
        String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
        String fileName = dict.getString("fileName");
        String filePath = fileDirectory + "/" + fileName;
        File file = new File(filePath);
        file.delete();
    }
    

   

}
