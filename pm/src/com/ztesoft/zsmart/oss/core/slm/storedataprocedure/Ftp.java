package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.TimeZone;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPClientConfig;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.apache.log4j.Logger;

/**
 * [描述] <br>
 * 
 * @author [作者名] <br>
 * @version 1.0 <br>
 * @taskId <br>
 * @CreateDate 2016年10月9日 <br>
 * @since V7.0 <br>
 * @see Ftp <br>
 */
public class Ftp extends Thread {
    /**
     * ftpClient <br>
     */
    private FTPClient ftpClient;

    /**
     * strIp <br>
     */
    private String strIp;

    /**
     * intPort <br>
     */
    private int intPort;

    /**
     * user
     */
    private String user;

    /**
     * password <br>
     */
    private String password;

    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(Ftp.class.getName());

    /**
     * remoteBackDir <br>
     */
    private String remoteBackDir = "";
    
    /**
     * isLogin <br>
     */
    private static boolean isLogin = false;
    
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @param strIp i
     * @param intPort  t
     * @param user u 
     * @param Password p
     */ 
    public Ftp(String strIp, int intPort, String user, String Password) {
        this.strIp = strIp;
        this.intPort = intPort;
        this.user = user;
        this.password = Password;
        this.ftpClient = new FTPClient();
        this.remoteBackDir = LoadConfig.instance().getFtpRemoteDir() + "_bak";
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public boolean ftpLogin() {
        FTPClientConfig ftpClientConfig = new FTPClientConfig();
        ftpClientConfig.setServerTimeZoneId(TimeZone.getDefault().getID());
        this.ftpClient.setControlEncoding("GBK");
        this.ftpClient.configure(ftpClientConfig);
        try {
            if (this.intPort > 0) {
                this.ftpClient.connect(this.strIp, this.intPort);
            }
            else {
                this.ftpClient.connect(this.strIp);
            }
            // FTP服务器连接回答
            int reply = this.ftpClient.getReplyCode();
            if (!FTPReply.isPositiveCompletion(reply)) {
                this.ftpClient.disconnect();
                logger.error("登录FTP服务失败！");
                return isLogin;
            }
            this.ftpClient.login(this.user, this.password);
            // 设置传输协议
            this.ftpClient.enterLocalPassiveMode();
            this.ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
            logger.info("恭喜" + this.user + "成功登陆FTP服务器");
            isLogin = true;
        }
        catch (Exception e) {
            logger.error(this.user + "登录FTP服务失败！" + e.getMessage());
        }
        this.ftpClient.setBufferSize(1024 * 2);
        this.ftpClient.setDataTimeout(30 * 1000);
        return isLogin;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     *         <br>
     */
    public void ftpLogOut() {
        if (null != this.ftpClient && this.ftpClient.isConnected()) {
            try {
                // 退出FTP服务器
                boolean reuslt = this.ftpClient.logout();
                if (reuslt) {
                    logger.info("成功退出服务器");
                }
            }
            catch (IOException e) {
                logger.warn("退出FTP服务器异常！" + e.getMessage());
            }
            finally {
                try {
                    // 关闭FTP服务器的连接
                    this.ftpClient.disconnect();
                }
                catch (IOException e) {
                    logger.warn("关闭FTP服务器的连接异常！");
                }
            }
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param localFile <br>
     * @param romotUpLoadePath <br>
     * @return <br>
     */
    public boolean uploadFile(File localFile, String romotUpLoadePath) {
        BufferedInputStream inStream = null;
        boolean success = false;
        try {
            // 改变工作路径
            this.ftpClient.changeWorkingDirectory(romotUpLoadePath);
            inStream = new BufferedInputStream(new FileInputStream(localFile));
            logger.info(localFile.getName() + "开始上传.....");
            success = this.ftpClient.storeFile(localFile.getName(), inStream);
            if (success) {
                logger.info(localFile.getName() + "上传成功");
                return success;
            }
        }
        catch (FileNotFoundException e) {
            logger.error(localFile + "未找到");
        }
        catch (IOException e) {
            logger.error(localFile + e.getMessage());
        }
        finally {
            if (inStream != null) {
                try {
                    inStream.close();
                }
                catch (IOException e) {
                    logger.error(localFile + e.getMessage());
                }
            }
        }
        return success;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param remoteFileName <br>
     * @param localDires <br>
     * @param remoteDownLoadPath <br>
     * @return <br>
     */
    public boolean downloadFile(String remoteFileName, String localDires, String remoteDownLoadPath) {
        String strFilePath = localDires + remoteFileName;
        String strFilePathTemp = localDires + remoteFileName + ".temp";
        BufferedOutputStream outStream = null;
        boolean success = false;
        try {
            this.ftpClient.changeWorkingDirectory(remoteDownLoadPath);
            outStream = new BufferedOutputStream(new FileOutputStream(strFilePathTemp));
            logger.info(remoteFileName + "开始下载....");
            success = this.ftpClient.retrieveFile(remoteFileName, outStream);
            if (success) {
                logger.info(remoteFileName + "成功下载到" + strFilePathTemp);
                return success;
            }
        }
        catch (Exception e) {
            logger.error(remoteFileName + "下载失败");
        }
        finally {
            if (null != outStream) {
                try {
                    outStream.flush();
                    outStream.close();
                }
                catch (IOException e) {
                    logger.error(remoteFileName + e.getMessage());
                }
            }
            reName(strFilePathTemp, strFilePath);
        }
        if (!success) {
            logger.error(remoteFileName + "下载失败!!!");
        }
        return success;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param remoteFileName 
     * @param remoteDownLoadPath 
     * @param remoteBackDir 
     * @throws IOException  <br>
     */ 
    private void backFile(String remoteFileName, String remoteDownLoadPath, String remoteBackDir) throws IOException {
        if ("2".equals(LoadConfig.instance().getFtpBackOrDelete())) {
            ftpClient.changeWorkingDirectory(remoteDownLoadPath);
            ftpClient.deleteFile(remoteFileName);
            return;
        }
        InputStream in = null;  
        ByteArrayOutputStream fos = new ByteArrayOutputStream();

        try {
            ftpClient.setBufferSize(1024 * 2);
            // 变更工作路径  
            ftpClient.changeWorkingDirectory(remoteDownLoadPath);  
            // 设置以二进制流的方式传输  
            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);  
            ftpClient.retrieveFile(new String(remoteFileName.getBytes("GBK"), "iso-8859-1"), fos);  

            in = new ByteArrayInputStream(fos.toByteArray());  
            
            if (in != null) {  
                ftpClient.changeWorkingDirectory(remoteBackDir);  
                ftpClient.storeFile(new String(remoteFileName.getBytes("GBK"), "iso-8859-1"), in);  
            }

            ftpClient.changeWorkingDirectory(remoteDownLoadPath);
            ftpClient.deleteFile(remoteFileName);
            
        }
        catch (IOException e) {
            logger.error("bak file error:", e);
        }
        finally {
            if (in != null) {
                in.close();
            }  
            if (fos != null) {  
                fos.close();  
            }
        }  

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param src s 
     * @param dst d <br>
     */ 
    private void reName(String src, String dst) {
        File s = new File(src);
        File d = new File(dst);
       
        if (!s.exists()) {
            return;
        }
        
        if (d.exists() && d.isFile()) {
            d.delete();
        }
        s.renameTo(d);
    }
    
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param localDirectory <br>
     * @param remoteDirectoryPath <br>
     * @return <br>
     */
    public boolean uploadDirectory(String localDirectory, String remoteDirectoryPath) {
        File src = new File(localDirectory);
        try {
            remoteDirectoryPath = remoteDirectoryPath + "/" + src.getName();
            logger.info(remoteDirectoryPath);
            this.ftpClient.makeDirectory(remoteDirectoryPath);
            // ftpClient.listDirectories();
        }
        catch (IOException e) {
            logger.info(remoteDirectoryPath + "目录创建失败");
        }
        File[] allFile = src.listFiles();
        for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
            if (!allFile[currentFile].isDirectory()) {
                String srcName = allFile[currentFile].getPath().toString();
                uploadFile(new File(srcName), remoteDirectoryPath);
            }
        }
        for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
            if (allFile[currentFile].isDirectory()) {
                // 递归
                uploadDirectory(allFile[currentFile].getPath().toString(), remoteDirectoryPath);
            }
        }
        return true;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param localDirectoryPath l
     * @param remoteDirectory r
     * @param remoteBackDir r
     * @return t <br>
     */ 
    public boolean downLoadDirectory(String localDirectoryPath, String remoteDirectory, String remoteBackDir) {
        try {
            if (!("2".equals(LoadConfig.instance().getFtpBackOrDelete()))) {
                ftpClient.makeDirectory(remoteBackDir);
            }

            File local = new File(localDirectoryPath);
            if (!local.exists() && !local.isDirectory()) {
                local.mkdirs();
            }
            
            FTPFile[] allFile = this.ftpClient.listFiles(remoteDirectory);
            for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
                if (!allFile[currentFile].isDirectory()) {
                    downloadFile(allFile[currentFile].getName(), localDirectoryPath + "/", remoteDirectory);
                    backFile(allFile[currentFile].getName(), remoteDirectory, remoteBackDir);
                }
            }
            for (int currentFile = 0; currentFile < allFile.length; currentFile++) {
                if (allFile[currentFile].isDirectory()) {
                    String strremoteDirectoryPath = remoteDirectory + "/" + allFile[currentFile].getName();
                    String strremoteBackDir = remoteBackDir + "/" + allFile[currentFile].getName();
                    //String strlocalDirectoryPath = localDirectoryPath + "/" + allFile[currentFile].getName();
                    downLoadDirectory(localDirectoryPath, strremoteDirectoryPath, strremoteBackDir);
                    ftpClient.changeWorkingDirectory(remoteDirectory);
                    ftpClient.removeDirectory(allFile[currentFile].getName());
                }
            }
        }
        catch (IOException e) {
            logger.error("下载文件夹失败");
            return false;
        }
        return true;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public FTPClient getFtpClient() {
        return ftpClient;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpClient <br>
     */
    public void setFtpClient(FTPClient ftpClient) {
        this.ftpClient = ftpClient;
    }

    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getRemoteBackDir() {
        return remoteBackDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param remoteBackDir <br>
     */ 
    public void setRemoteBackDir(String remoteBackDir) {
        this.remoteBackDir = remoteBackDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void run() {
        while (true) {
            logger.info("ftp to download file.");
            if (!isLogin) {
                this.ftpLogin();
            }
            
            this.downLoadDirectory(LoadConfig.instance().getFileDir(), LoadConfig.instance().getFtpRemoteDir(), this.getRemoteBackDir());
            
            try {
                Thread.sleep(30000);
            } 
            catch (InterruptedException e) {
                logger.error("ftp:", e);
            }
        }
    }
    
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param args <br>
     * @throws IOException <br>
     */
    public static void main(String[] args) throws IOException {
        Ftp ftp = new Ftp("10.45.50.133", 21, "oss_wfm", "oss_wfm");
        ftp.ftpLogin();
        // 上传文件夹
       // ftp.uploadDirectory("D://SLM//ZSmart_OPB_R8.0.2-0622//ZSmart_OPB_R8.0.2//lib//", "/home/oss_wfm/lk");
        // 下载文件夹
        ftp.downLoadDirectory("D://Downloads", "/home/oss_wfm/lj", ftp.getRemoteBackDir());
        
        ftp.ftpLogOut();
    }
    
}
