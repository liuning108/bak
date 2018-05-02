/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.service;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import com.alibaba.fastjson.JSON;
import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.core.pm.dashboard.domain.AbstractDashBoardMgr;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.DashBoardFTPUtil;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.DashBoardUtil;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.SendMailUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * [描述] <br>
 * 
 * @author [刘宁]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年8月12日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.dashboard.service <br>
 */

public class DashBoardService implements IAction {

    @Override
    public int perform(DynamicDict dict) throws BaseAppException {
        SessionManage.putSession(dict);
        String userId = SessionManage.getSession().getUserId();
        if ("-1".equalsIgnoreCase(userId)) {
            userId = dict.getString("userId");
            if (userId == null) {
                userId = "-1";
            }
        }

        dict.set("USERID", userId);
        String methodName = dict.getString("method");
        try {
            Method method = this.getClass().getMethod(methodName, DynamicDict.class);
            method.invoke(this, dict);
        }
        catch (Exception e) {
            new BaseAppException(e.getMessage());
            e.printStackTrace();
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
    public void addDashBoardClass(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("name", dict.getString("name"));
        param.put("userId", dict.getString("userId"));

        dict.add("result", bsm.addDashBoardClass(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void queryDashBoardClassByUserID(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("userId", dict.getString("userId"));
        dict.add("result", bsm.queryDashBoardClassByUserID(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void delDashBoardClassByID(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("classId", dict.getString("classId"));
        dict.add("result", bsm.delDashBoardClassByID(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void changeDashBoardClassNameByID(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("classId", dict.getString("classId"));
        param.put("name", dict.getString("name"));
        dict.add("result", bsm.changeDashBoardClassNameByID(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void saveUpdateDashBoard(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, Object> param = new HashMap<String, Object>();
        DynamicDict dashboardDict = dict.getBO("json");
        param.put("id", dashboardDict.getString("id"));
        param.put("name", dashboardDict.getString("name"));
        param.put("classNo", dashboardDict.getString("classNo"));
        param.put("isShare", dashboardDict.getString("isShare"));
        param.put("state", dashboardDict.getString("state"));
        param.put("userId", dashboardDict.getString("userId"));
        String canvasAttrs = JSON.toJSONString(DashBoardUtil.dic2Map2((DynamicDict) dashboardDict.get("canvasAttrs")));
        param.put("canvasAttrs", canvasAttrs);
        Map nodesAttrs = DashBoardUtil.dic2Map2((DynamicDict) dashboardDict.get("attrs"));
        List<Map<String, Object>> nodes = (List<Map<String, Object>>) nodesAttrs.get("nodes");
        param.put("nodesAttrs", nodes);
        dict.add("result_input", param);
        dict.add("result", bsm.saveUpdateDashBoard(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void queryDashBoarListByClassId(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("classId", dict.getString("classId"));
        param.put("userId", dict.getString("userId"));
        dict.add("result", bsm.queryDashBoarListByClassId(param));
    }

    /**
     * [方法描述] <br>
     * 
     * @author [刘宁]<br>
     * @taskId <br>
     * @param dict
     * @throws BaseAppException <br>
     */
    public void queryDashBoardById(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("id", dict.getString("id"));
        dict.add("result", bsm.queryDashBoardById(param));
    }

    public void updateSysClass(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("topicId", dict.getString("topicId"));
        param.put("classType", dict.getString("classType"));
        param.put("userId", dict.getString("userId"));
        param.put("isDel", dict.getString("isDel"));
        dict.add("result", bsm.updateSysClass(param));
    }

    public void querySysClassTopList(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("num", dict.getString("num"));
        param.put("classType", dict.getString("classType"));
        param.put("userId", dict.getString("userId"));
        dict.add("result", bsm.querySysClassTopList(param));
    }

    public void sendTopicPic(DynamicDict dict) throws BaseAppException {
        String urlRoot = dict.getString("urlRoot");
        String urlPage = dict.getString("urlPage");
        String fileName = dict.getString("fileName");
        String emails = dict.getString("emails");
        String url = urlRoot + urlPage;
        Map<String, String> param = new HashMap<String, String>();
        param.put("url", url);
        param.put("fileName", fileName);
        param.put("topicName", dict.getString("topicName"));
        param.put("emails", emails);
        SendMailUtil.sendPicMail(param);

    }

    public void saveOrUpdateSendTopic(DynamicDict dict) throws BaseAppException {
        Map<String, String> param = DashBoardUtil.getHashMap(dict, DashBoardUtil.TOPIC_SEND_MODEL);
        param.put("userId", dict.getString("USERID"));
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        bsm.saveOrUpdateSendTopic(param);
        dict.add("result", "succeed");
    }

    public void delSendTopic(DynamicDict dict) throws BaseAppException {
        Map<String, String> param = DashBoardUtil.getHashMap(dict, DashBoardUtil.querySendTopicByTopicNo_MODEL);
        param.put("userId", dict.getString("USERID"));
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        dict.add("result", bsm.delSendTopic(param));

    }

    public void querySendTopicByNo(DynamicDict dict) throws BaseAppException {
        Map<String, String> param = DashBoardUtil.getHashMap(dict, DashBoardUtil.querySendTopicByTopicNo_MODEL);
        param.put("userId", dict.getString("USERID"));
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        dict.add("result", bsm.querySendTopicByNo(param));

    }

    public void isEmailSendOn(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        dict.add("result", bsm.isEmailSendOn());
    }

    public void delDashBoardById(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("id");
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("id", topicNo);
        param.put("userId", dict.getString("USERID"));
        dict.add("result", bsm.delDashBoardById(param));
    }

    public void addExportTask(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        String topicNo = dict.getString("topicNo");
        String exportFileName = dict.getString("filename");
        String exportDate = dict.getString("exportDate");
        String userId = dict.getString("USERID");
        String  type   = dict.getString("type");
        
        String jsonParam = dict.getString("jsonParam");
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("topicNo", topicNo);
        param.put("exportFileName", exportFileName);
        param.put("exportDate", exportDate);
        param.put("userId", userId);
        param.put("jsonParam", jsonParam);
        param.put("type", type);
        dict.add("result", bsm.addExportTask(param));
    }

    public void getExportTaskListByUserId(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        String userId = dict.getString("USERID");
        Map<String, String> param = new HashMap<String, String>();
        param.put("userId", userId);
        dict.add("result", bsm.getExportTaskListByUserId(param));
    }

    public void getExportTaskListByUserIdAndFilter(DynamicDict dict) throws BaseAppException {
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        String userId = dict.getString("USERID");
        String filter = dict.getString("filter");
        Map<String, String> param = new HashMap<String, String>();
        param.put("userId", userId);
        param.put("filter", filter);
        dict.add("result", bsm.getExportTaskListByUserIdAndFilter(param));
    }
    
    public void moveFTPFile(DynamicDict dict) throws BaseAppException{
        String filepath = dict.getString("filepath");
        File target = new File(filepath);
        if(target.exists()) {
           //move  file to web upload
            String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory");
            File webPathDir =new File(fileDirectory);
            try {
                FileUtils.copyFileToDirectory(target, webPathDir);
            }
            catch (IOException e) {
                dict.add("filename","");
                dict.add("moveFTPFile error",e.getMessage());
                return;
            }
            dict.add("filename",target.getName());
        }else {
            File file    =DashBoardFTPUtil.downlaodFtpFile(target);
            if(file==null) {
                file =DashBoardFTPUtil.downlaodSFtpFile(target);
            }
            dict.add("filename", file.getName());
        }
        
        
        
    }
    
    
    public void getTaskParam(DynamicDict dict) throws Exception{
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        String taskid= dict.getString("taskid");
        dict.add("result", bsm.getTaskParam(taskid));
    }

    public static void main(String[] args) throws BaseAppException {
//        DashBoardService s = new DashBoardService();
//        DynamicDict dict = new DynamicDict();
//        dict.set("method", "getTaskParam");
//        dict.set("taskid", "PMI-2017112509-TA20088860");
//        s.perform(dict);
//        System.err.println(dict.get("result"));
        
        
        DashBoardService s = new DashBoardService();
        DynamicDict dict = new DynamicDict();
        dict.set("method", "moveFTPFile");
        dict.set("filepath", "/home/oss_pm/oss_pm_ftp/20171126141410-63666.xlsx");
        s.perform(dict);
        System.err.println(dict.get("filename"));
    }

}
