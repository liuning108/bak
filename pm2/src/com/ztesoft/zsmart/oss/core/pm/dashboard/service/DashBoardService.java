/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.service;


import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.dashboard.domain.AbstractDashBoardMgr;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.DashBoardUtil;
import com.ztesoft.zsmart.oss.core.pm.dashboard.util.SendMailUtil;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

import ch.qos.logback.core.net.SyslogOutputStream;

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
         String   userId=SessionManage.getSession().getStaffId();
         if("-1".equalsIgnoreCase(userId)){
             userId=dict.getString("userId"); 
             if(userId==null){
                 userId="-1";
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
        }
        return 0;
    }
     
    /**
     * 
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
     * 
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
     * 
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
     * 
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
     * 
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
      * 
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
     * 
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
    
    public void updateSysClass(DynamicDict dict) throws BaseAppException{
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("topicId", dict.getString("topicId"));
        param.put("classType", dict.getString("classType"));
        param.put("userId", dict.getString("userId"));
        param.put("isDel", dict.getString("isDel"));
        dict.add("result", bsm.updateSysClass(param));
    }
    
    
    
    public void querySysClassTopList(DynamicDict dict) throws BaseAppException{
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        Map<String, String> param = new HashMap<String, String>();
        param.put("num", dict.getString("num"));
        param.put("classType", dict.getString("classType"));
        param.put("userId", dict.getString("userId"));
        dict.add("result", bsm.querySysClassTopList(param));
    }
    
    
    public void sendTopicPic(DynamicDict dict) throws BaseAppException{
        String urlRoot = dict.getString("urlRoot");
        String urlPage = dict.getString("urlPage");        
        String fileName=dict.getString("fileName");
        String emails = dict.getString("emails") ;
        String url = urlRoot + urlPage;
        Map<String,String> param = new HashMap<String, String>();
        param.put("url", url);
        param.put("fileName", fileName);
        param.put("topicName",dict.getString("topicName") );
        param.put("emails", emails);
        SendMailUtil.sendPicMail(param);

    }
    
    
   
    public void saveOrUpdateSendTopic(DynamicDict dict) throws BaseAppException{
        Map<String,String> param = DashBoardUtil.getHashMap(dict,DashBoardUtil.TOPIC_SEND_MODEL);
        param.put("userId",dict.getString("USERID"));
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        bsm.saveOrUpdateSendTopic(param);
        dict.add("result","succeed");
    }
    
    
    
    public void delSendTopic(DynamicDict dict )throws BaseAppException{
        Map<String,String> param = DashBoardUtil.getHashMap(dict,DashBoardUtil.querySendTopicByTopicNo_MODEL);
        param.put("userId",dict.getString("USERID"));
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        dict.add("result", bsm.delSendTopic(param)); 
      
    }
    
    
    public void querySendTopicByNo(DynamicDict dict )throws BaseAppException{
        Map<String,String> param = DashBoardUtil.getHashMap(dict,DashBoardUtil.querySendTopicByTopicNo_MODEL);
        param.put("userId",dict.getString("USERID"));
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        dict.add("result", bsm.querySendTopicByNo(param)); 
      
    }
    
    public void isEmailSendOn(DynamicDict dict) throws BaseAppException{
        AbstractDashBoardMgr bsm = (AbstractDashBoardMgr) GeneralDMOFactory.create(AbstractDashBoardMgr.class);
        dict.add("result", bsm.isEmailSendOn()); 
    }
  
    
    
    
    
   
    
    
    
   

    public static void main(String[] args) throws BaseAppException {
         DashBoardService s = new DashBoardService();
         DynamicDict dict = new DynamicDict();
//         dict.set("method", "saveOrUpdateSendTopic");
//         dict.set("userId", "1");
//        dict.set("topicType", DashBoardUtil.ADHOC_TYPE);
//         dict.set("topicNo", "PMS-20170920-TP10351276");
//         dict.set("SubjectName","Adhoc Test Report");
//         dict.set("Recipent","122273014@qq.com,2437018365@qq.com");
//         dict.set("ReportType",DashBoardUtil.REPORT_DAY+","+DashBoardUtil.REPORT_MONTH);
//         dict.set("EffDate","2017-10-17 09:54:00");
//        dict.set("ExpDate","2017-10-30 09:54:00");
         
//         dict.set("userId", "1");
//         dict.set("method", "querySendTopicByNo");
//         dict.set("topicType", DashBoardUtil.ADHOC_TYPE);
//         dict.set("topicNo", "PMS-20170920-TP10351276");
         dict.set("method", "isEmailSendOn");
         s.perform(dict);
         System.out.println(dict.get("result"));
         
    }
    
    
    
    
 
    
    
    
    
    
   

}
