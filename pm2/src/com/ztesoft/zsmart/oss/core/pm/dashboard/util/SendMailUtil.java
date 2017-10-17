/***************************************************************************************** 
 * Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       *
 * transmission in whole or in part, in any form or by any means, electronic, mechanical *
 * or otherwise, is prohibited without the prior written consent of the copyright owner. *
 ****************************************************************************************/
package com.ztesoft.zsmart.oss.core.pm.dashboard.util;

import java.io.BufferedReader;
import java.io.File;
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

import com.ztesoft.zsmart.core.configuation.ConfigurationMgr;
import com.ztesoft.zsmart.oss.opb.message.domain.AbstractEmailMessage;
import com.ztesoft.zsmart.oss.opb.message.domain.AbstractMessage;
import com.ztesoft.zsmart.oss.opb.message.domain.EmailSender;
import com.ztesoft.zsmart.oss.opb.message.domain.MessageGlobalData;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;

import ch.qos.logback.core.net.SyslogOutputStream;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年10月11日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.dashboard.util <br>
 */

public class SendMailUtil {
    public static Map<String,String> sendPicMail(Map<String,String> param){
       
        Map result = new HashMap<String, String>();
        
        String fileDirectory = ConfigurationMgr.instance().getString("upload.uploadFileDirectory")+"/sendMailPic";
        File Dirs = new File(fileDirectory);
        Dirs.mkdirs();
        
        
        Runtime rt = Runtime.getRuntime();    
        String url = param.get("url");
        String savePngFile =fileDirectory+"/"+param.get("fileName");
       
            try {
                Process p = rt.exec("phantomjs /home/oss_pm/ossCaptureUrl/capture.js " + url +" "+savePngFile);
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
                    Map<String,String> params = new HashMap<String, String>();
                    params.put("pngFile", sendPngFile.getAbsolutePath());
                    params.put("Name", param.get("topicName"));
                    params.put("emails", param.get("emails"));
                    
                    SendMailUtil.sendMail(params);
                }
                
            }
        }
        catch (Exception e) {
            // TODO Auto-generated catch block <br>
            e.printStackTrace();
        }
        return result;
    }
    
    
    public static void sendMail(Map<String,String> param) throws Exception{
        
        String pngFile = param.get("pngFile");
        String name = param.get("Name");
        AbstractEmailMessage message = (AbstractEmailMessage) GeneralDMOFactory.create(AbstractMessage.class, MessageGlobalData.MESSAGE_TYPE_EMAIL);
       
        EmailSender sender = message.getDefaultEmailSender();
        
        System.err.println(sender.getHostauth());
        
        
        
        Properties props = new Properties();  
        
        // 开启debug调试  
        props.setProperty("mail.debug", ""+sender.isDebugMode());  
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
//        props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory"); 
//        props.setProperty("mail.smtp.socketFactory.port", sender.getHostport()); 

        
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
        String [] emailArray =emails.split(";");
        for (String email: emailArray){
            emailsAddress.add(new InternetAddress(email));
        }
        System.err.println(emailsAddress.toArray(new Address[emailsAddress.size()]));
        transport.sendMessage(msg, emailsAddress.toArray(new Address[emailsAddress.size()]));  
        // 关闭连接  
        transport.close();  
        
    }
    
    
   
    
}
