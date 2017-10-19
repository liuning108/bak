/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.plugin.email;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.collections4.map.HashedMap;
import org.apache.log4j.Logger;

import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.pm.etl.aggregate.action.AggReturnValue;
import com.ztesoft.zsmart.oss.core.pm.plugin.cleanmidtable.ArchivePluginBase;
import com.ztesoft.zsmart.oss.core.pm.plugin.cleanmidtable.PluginObject;
import com.ztesoft.zsmart.oss.core.pm.plugin.email.dao.SendEmailDao;
import com.ztesoft.zsmart.oss.opb.message.domain.AbstractEmailMessage;
import com.ztesoft.zsmart.oss.opb.message.domain.AbstractMessage;
import com.ztesoft.zsmart.oss.opb.message.domain.EmailSender;
import com.ztesoft.zsmart.oss.opb.message.domain.MessageGlobalData;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;


/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年10月18日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.plugin.email <br>
 */

public class SendEmailPlug extends  ArchivePluginBase {
    private static final Logger log = Logger.getLogger(SendEmailPlug.class);
   
    public final static Map<String,String> Dictionaries  =new HashedMap<String,String>();
    static{
        Dictionaries.put("3", "_D"); //日
        Dictionaries.put("4", "_W"); //周
        Dictionaries.put("5", "_M"); //月
       
        Dictionaries.put("_D", "Daily report"); //日
        Dictionaries.put("_W", "Weekly report"); //周
        Dictionaries.put("_M", "Month report"); //月
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param taskNo
     * @param taskID
     * @param btime
     * @param etime
     * @param param
     * @param pObj
     * @return <br>
     */ 
    @Override
    public AggReturnValue invokePlugin(String taskNo, String taskID, String btime, String etime, String param, PluginObject pObj) {
        AggReturnValue result=new  AggReturnValue();
        try {
             //是否开启Email功能
            if(!isEmailOnOff()){
                result.setState(3);
                result.setCause("Email发送功能没有开启");
                log.error("Email发送功能没有开启");
                return result;
            }
            
            //周期只能为： 日，周，月
            String cycle  = Dictionaries.get(param);
            if(cycle==null){
                result.setState(3);
                result.setCause("周期只能为： 日，周，月, value:"+param);
                log.error("周期只能为： 日，周，月, value:"+param);
                return result; 
            }
            
            String webRoot = getParamter("emailCaptureWebRoot");
            if(webRoot==null){
                result.setState(3);
                result.setCause("pm_parameter 没有配 emailCaptureWebRoot");
                log.error("pm_parameter 没有配 emailCaptureWebRoot");
                return result; 
            }
            
            String emailScriptPostion = getParamter("emailScriptPostion");
            if(emailScriptPostion==null){
                result.setState(3);
                result.setCause("pm_parameter 没有配 emailScriptPostion 脚本");
                log.error("pm_parameter 没有配 emailScriptPostion 脚本");
                return result; 
            }
            
            //获得当前周期，今天需要发的邮件列表
            List<HashMap<String, String>>  sendList = getTopicSendListByCycle(cycle);
            if(sendList.size()<=0){
                result.setState(1);
                result.setCause("没有需要发送的邮件");
                log.info("没有需要发送的邮件");
                return result;    
            }
            int err_count =0;
            StringBuffer err_sb = new StringBuffer();
            for (HashMap<String, String> sendEmailParam : sendList ){
                sendEmailParam.put("btime", btime);
                sendEmailParam.put("etime", etime);
                boolean e =TopicSendEmail(webRoot,emailScriptPostion,sendEmailParam,cycle);
                if(!e){
                    err_count++;
                    //不能超出200个字符
                    if(err_sb.length()>200){
                        err_sb.append(sendEmailParam.get("TOPIC_NO")+",");
                    }
                   
                }
            }
            result.setState(1);
            result.setCause("发送成功");
            if(err_count>=sendList.size()-1){ //少发一个，也当是全部出错
                result.setState(3);
                result.setCause("发送失败:"+err_sb.toString());
            }else if(err_count>0){
                result.setState(7);
                result.setCause("发送失败:"+err_sb.toString());
            }
            
           
            
            log.info("SendEmailPlug");
            log.debug("开始时间："+btime);
            log.debug("开始时间："+etime);
            log.error("周期:"+param+"->"+Dictionaries.get(param));
        }catch(Exception e){
            result.setState(3);
            result.setCause("异常事件发生:"+e.getMessage());
            log.error("异常事件发生:"+e.getMessage());
        }
        return result;
    }
    
   

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param string
     * @return <br>
     * @throws BaseAppException 
     */ 
    private String getParamter(String key) throws BaseAppException {
        SendEmailDao dao = (SendEmailDao) GeneralDAOFactory.create(SendEmailDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.getParamter(key);
    }



    



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param emailScriptPostion 
     * @param webRoot 
     * @taskId <br>
     * @param sendEmailParam <br>
     * {TOPIC_TYPE=01, RECIPIENT=122273014@qq.com, TOPIC_NO=PMS_20170901105237_10000118, SUBJECT_NAME=test}
     * @param cycle 
     * @return 
     * @throws BaseAppException 
     */ 
    private boolean TopicSendEmail(String webRoot, String emailScriptPostion, HashMap<String, String> sendEmailParam, String cycle) throws BaseAppException {
        String type= sendEmailParam.get("TOPIC_TYPE");
        if ("00".equalsIgnoreCase(type)){
          return   AdHocSendMail(webRoot,emailScriptPostion,sendEmailParam,cycle);
        }else if("01".equalsIgnoreCase(type)){
          return DashBoardSendMail(webRoot,emailScriptPostion,sendEmailParam,cycle);
        }
        log.error("找不到相应的类型处理Email发送");
        return false;
        
        
    }



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param emailScriptPostion 
     * @param webRoot 
     * @taskId <br>
     * @param sendEmailParam <br>
     * @param cycle 
     * @return 
     * @throws BaseAppException 
     */ 
    private boolean DashBoardSendMail(String webRoot, String emailScriptPostion, HashMap<String, String> sendEmailParam, String cycle) throws BaseAppException {
        // TODO Auto-generated method stub <br>
       
        String topicNo =sendEmailParam.get("TOPIC_NO");
        if(!hasDashBoard(topicNo)){
            return false;
        }
        
        
        String url = webRoot+"/oss_core/pm/dashboard/bghtml.html?id="+topicNo;
        Map<String,Object> catureResult = captureURLtoPic(emailScriptPostion,url,topicNo,"01");
        File sendFile =(File)catureResult.get("sendFile");
        if(sendFile==null){ 
            System.err.println(""+catureResult.get("message"));
            return false;
        }
        Map<String,String> params = new HashMap<String, String>();
        params.put("pngFile", sendFile.getAbsolutePath());
        params.put("Name",  sendEmailParam.get("SUBJECT_NAME")+"["+Dictionaries.get(cycle)+"]" );
        params.put("emails", sendEmailParam.get("RECIPIENT"));
        try{
          sendMail(params);
        }catch(BaseAppException e){
            log.error("01_"+topicNo+"发送邮件时出错"+e.getMessage());
            
            System.err.println(e.getMessage());
            e.printStackTrace();
            return false;
        }
        return true;
    }



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param topicNo
     * @return <br>
     * @throws BaseAppException 
     */ 
    private boolean hasDashBoard(String topicNo) throws BaseAppException {
        SendEmailDao dao = (SendEmailDao) GeneralDAOFactory.create(SendEmailDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.hasDashBoard(topicNo);
    }



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param emailScriptPostion
     * @param url
     * @param topicNo
     * @return <br>
     * @throws BaseAppException 
     */ 
    private Map<String,Object> captureURLtoPic(String emailScriptPostion, String url, String topicNo,String type) throws BaseAppException {
        Map<String,Object> result  = new HashMap<String,Object>();
        String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory")+"/sendMailPic";
        File Dirs = new File(fileDirectory);
        Dirs.mkdirs();
        String savePngFile =fileDirectory+"/"+type+"_"+topicNo+".png";
        Runtime rt = Runtime.getRuntime(); 
        try {
            log.info("phantomjs "+emailScriptPostion+" "+ url +" "+savePngFile);
            System.err.println("phantomjs "+emailScriptPostion+" "+ url +" "+savePngFile);
            Process p = rt.exec("phantomjs "+emailScriptPostion+" "+ url +" "+savePngFile);
        
            InputStream is = p.getInputStream();     
            BufferedReader br = new BufferedReader(new InputStreamReader(is));     
            StringBuffer sbf = new StringBuffer();     
            String tmp = "";     
            while((tmp = br.readLine())!=null){     
                sbf.append(tmp);     
            }     
            //System.out.println(sbf.toString());     
            if("success".equalsIgnoreCase(sbf.toString())){
                File sendPngFile= new File(savePngFile);
                if(sendPngFile.exists()){
                    result.put("sendFile", sendPngFile);
                }else{
                 result.put("message", "方法执行成功，但没有文件");
                }
            }else{
                log.error("脚本执行:"+sbf.toString());
                result.put("message", "脚本执行:"+sbf.toString()); 
            }
            
        }
        catch (IOException e) {
            throw  new  BaseAppException(e.getMessage());
        }
        return result;

      
    }
    
    
        public  void sendMail(Map<String,String> param) throws BaseAppException {
        try {
        String pngFile = param.get("pngFile");
        String name = param.get("Name");
        AbstractEmailMessage message = (AbstractEmailMessage) GeneralDMOFactory.create(AbstractMessage.class, MessageGlobalData.MESSAGE_TYPE_EMAIL);
       
        EmailSender sender = message.getDefaultEmailSender();
       
        
        
        
        Properties props = new Properties();  
        
        // 开启debug调试  
      //  props.setProperty("mail.debug", ""+sender.isDebugMode());  
        // 发送服务器需要身份验证  
        if("1".equalsIgnoreCase(sender.getHostauth())){
            props.setProperty("mail.smtp.auth",  "true");  
        }else{
            props.setProperty("mail.smtp.auth",  "false");  
        }
        
        // 设置邮件服务器主机名  
        props.setProperty("mail.host", sender.getHostsmtp());  
        // 发送邮件协议名称  
        props.setProperty("mail.transport.protocol", "smtp");  
        props.setProperty("mail.smtp.port",sender.getHostport());  

        
        Session session = Session.getInstance(props);  
        Message msg = new MimeMessage(session);  
        msg.setSubject(name);  
        msg.setFrom(new InternetAddress(sender.getHostfrom()));  
        MimeBodyPart text = new MimeBodyPart();  
        // setContent(“邮件的正文内容”,”设置邮件内容的编码方式”)  
        text.setContent("Hello, the topic of your subscription: "+name+" to send to your mailbox, please check!\n<img src='cid:a'>",  
                "text/html;charset=utf-8");    
        
        
     
        // 创建图片  
        MimeBodyPart img = new MimeBodyPart();  
        DataHandler dh = new DataHandler(new FileDataSource(pngFile));//图片路径  
        
        img.setDataHandler(dh);  
        img.setContentID("a"); 
            
        
        MimeMultipart mm = new MimeMultipart();  
        mm.addBodyPart(text);  
       mm.addBodyPart(img);  
        mm.setSubType("related");// 设置正文与图片之间的关系  
        
         
        
        msg.setContent(mm);  
        msg.saveChanges(); // 保存修改  
  
        
        Transport transport = session.getTransport();  
        // 连接邮件服务器  
        transport.connect(sender.getHostacct(), sender.getHostpasswd());  
        // 发送邮件  
        String emails = param.get("emails");
        List<Address> emailsAddress = new ArrayList<Address>();
        String [] emailArray =emails.split(",");
        for (String email: emailArray){
            emailsAddress.add(new InternetAddress(email));
        }
        System.err.println(emailsAddress.toArray(new Address[emailsAddress.size()]));
        transport.sendMessage(msg, emailsAddress.toArray(new Address[emailsAddress.size()]));  
        // 关闭连接  
        transport.close();  
        }catch(BaseAppException e){
            throw e;
        }catch(Exception e){
            throw new BaseAppException(e.getMessage());
        }
        
    }



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @param emailScriptPostion 
     * @param webRoot 
     * @taskId <br>
     * @param sendEmailParam <br>
     * @param cycle 
     * @return 
     * @throws BaseAppException 
     */ 
    private boolean AdHocSendMail(String webRoot, String emailScriptPostion, HashMap<String, String> sendEmailParam, String cycle) throws BaseAppException {
        String topicNo =sendEmailParam.get("TOPIC_NO");
        if(!hasAdHoc(topicNo)){
            return false;
        }
        String btime = sendEmailParam.get("btime");
        String etime = sendEmailParam.get("etime");
        
        String url = "\""+webRoot+"/oss_core/pm/dashboard/adhtml.html?id="+topicNo+"&cycle="+cycle+"&btime="+btime+"&etime="+etime+"\"";
        Map<String,Object> catureResult = captureURLtoPic(emailScriptPostion,url,topicNo,"01");
        File sendFile =(File)catureResult.get("sendFile");
        if(sendFile==null){ 
            System.err.println(""+catureResult.get("message"));
            return false;
        }
        Map<String,String> params = new HashMap<String, String>();
        params.put("pngFile", sendFile.getAbsolutePath());
        params.put("Name",  sendEmailParam.get("SUBJECT_NAME")+"["+Dictionaries.get(cycle)+"]" );
        params.put("emails", sendEmailParam.get("RECIPIENT"));
        try{
          sendMail(params);
        }catch(BaseAppException e){
         log.error("00_"+topicNo+"发送邮件时出错"+e.getMessage());
            System.err.println(e.getMessage());
            e.printStackTrace();
            return false;
        }
        return true;
    }



    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param topicNo
     * @return <br>
     * @throws BaseAppException 
     */ 
    private boolean hasAdHoc(String topicNo) throws BaseAppException {
        SendEmailDao dao = (SendEmailDao) GeneralDAOFactory.create(SendEmailDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.hasAdHoc(topicNo);
    }



    /**
     * 
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     * @throws  
     */ 
    private boolean isEmailOnOff() throws BaseAppException {
        SendEmailDao dao = (SendEmailDao) GeneralDAOFactory.create(SendEmailDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return dao.isEmailSendOn();
  
    }
    
    private  List<HashMap<String, String>>  getTopicSendListByCycle(String cycle) throws BaseAppException{
        SendEmailDao dao = (SendEmailDao) GeneralDAOFactory.create(SendEmailDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        return  dao.getTopicSendListByCycle(cycle);
    }
    
     

}
