package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.apache.log4j.Logger;

/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月22日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.storedataprocedure <br>
 */
public class LoadConfig {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());

    /* 参数配置文件目录 */
    /**
     * fileName <br>
     */
    private String fileName = "../config/server/storedataprocedure.properties";

    /**
     * config <br>
     */
    private static LoadConfig config = new LoadConfig();

    /* 入库数据目录配置绝对路径 */
    /**
     * xmlDir <br>
     */
    private String xmlDir = "./xml";

    /* 入库数据目录配置绝对路径 */
    /**
     * fileDir <br>
     */
    private String fileDir = "./dbfiledir";

    /* 1 备份 2 删除 */
    /**
     * backOrDelete <br>
     */
    private String backOrDelete = "2";

    /* 入库数据备份目录配置绝对路径 */
    /**
     * fileDirBack <br>
     */
    private String fileDirBack = "./dbfiledirback";

    /* 数据库类型 [ORACLE|SYBASEIQ|GP] */
    /**
     * DBType <br>
     */
    private String dBType = "ORACLE";

    /**
     * dbThreadNum 入库线程数<br>
     */
    private int dbThreadNum = 1;


    /* url=jdbc:postgresql://191.168.14.11:5432/cems */
    /**
     * url <br>
     */
    private String url = "jdbc:oracle:thin:@10.45.50.133:1521:oss";
    /* driver=oracle.jdbc.driver.OracleDriver */
    /**
     * driver <br>
     */
    private String driver = "oracle.jdbc.driver.OracleDriver";
    /**
     * userName <br>
     */
    private String userName = "oss_wfm";
    /**
     * pssword <br>
     */
    private String pssword = "oss_wfm";
    /**
     * tnsAlias <br>
     */
    private String tnsAlias = "oss_10.45.50.133";

    /**
     * path <br>
     */
    private static String path = "";

    /**
     * ftpIp <br>
     */
    private String ftpIp = "";
    
    /**
     * ftpPort <br>
     */
    private int ftpPort = 21;
    
    /**
     * ftpUser <br>
     */
    private String ftpUser = "";
    
    /**
     * ftpPasswd <br>
     */
    private String ftpPasswd = "";
    
    /**
     * ftpRemoteDir <br>
     */
    private String ftpRemoteDir = "";
    
    /* 1 备份 2 删除 */
    /**
     * ftpBackOrDelete <br>
     */
    private String ftpBackOrDelete = "1";
    
            
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    private void readConfig() {
        try {
            Properties prop = new Properties();
            FileInputStream in;
            in = new FileInputStream(fileName);
            prop.load(in);
            in.close();
            if (prop.containsKey("xmlDir")) {
                xmlDir = prop.getProperty("xmlDir").trim();
            }

            if (prop.containsKey("fileDir")) {
                fileDir = prop.getProperty("fileDir").trim();
            }

            if (prop.containsKey("backOrDelete")) {
                backOrDelete = prop.getProperty("backOrDelete").trim();
            }

            if (prop.containsKey("fileDirBack")) {
                fileDirBack = prop.getProperty("fileDirBack").trim();
            }
            if (prop.containsKey("dbThreadNum")) {
                dbThreadNum = Integer.parseInt(prop.getProperty("dbThreadNum").trim());
            }

            if (prop.containsKey("DBType")) {
                dBType = prop.getProperty("DBType").trim();
            }

            if (prop.containsKey("url")) {
                url = prop.getProperty("url").trim();
            }

            if (prop.containsKey("driver")) {
                driver = prop.getProperty("driver").trim();
            }

            if (prop.containsKey("userName")) {
                userName = prop.getProperty("userName").trim();
            }

            if (prop.containsKey("pssword")) {
                pssword = prop.getProperty("pssword").trim();
            }
            
            if (prop.containsKey("tnsAlias")) {
                tnsAlias = prop.getProperty("tnsAlias").trim();
            }
            readFtpConfig(prop);

        } 
        catch (IOException e) {
            logger.error("ConstantInterface get adaptationLayerStatistics.properties error!", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param prop <br>
     */ 
    public void readFtpConfig(Properties prop) {
        if (prop.containsKey("ftpIp")) {
            ftpIp = prop.getProperty("ftpIp").trim();
        }
        
        if (prop.containsKey("ftpPort")) {
            ftpPort = Integer.parseInt(prop.getProperty("ftpPort").trim());
        }
        
        if (prop.containsKey("ftpUser")) {
            ftpUser = prop.getProperty("ftpUser").trim();
        }        
        
        if (prop.containsKey("ftpPasswd")) {
            ftpPasswd = prop.getProperty("ftpPasswd").trim();
        }
        
        if (prop.containsKey("ftpRemoteDir")) {
            ftpRemoteDir = prop.getProperty("ftpRemoteDir").trim();
        }
        
        if (prop.containsKey("ftpBackOrDelete")) {
            ftpBackOrDelete = prop.getProperty("ftpBackOrDelete").trim();
        }
    }
    
    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public boolean initConfig() {
        this.readConfig();
        this.printConfigInfo();

        File directory = new File(".");
        try {
            path = directory.getCanonicalPath();
            File dir = new File(this.getFileDirBack());
            if (!dir.exists() && !dir.isDirectory()) {
                logger.info("dir[" + this.getFileDirBack() + "] is not exist and will auto create it.");
                dir.mkdirs();
            }
            File dbdir = new File(this.getFileDir());
            if (!dbdir.exists() && !dbdir.isDirectory()) {
                logger.info("dbdir[" + this.getFileDir() + "] is not exist and will auto create it.");
                dbdir.mkdirs();
            }
            File xmldir = new File(this.getXmlDir());
            if (!xmldir.exists() && !xmldir.isDirectory()) {
                logger.info("xmldir[" + this.getXmlDir() + "] is not exist and will auto create it.");
                xmldir.mkdirs();
            }

        } 
        catch (IOException e) {
            logger.error("get current path error", e);
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
    public static LoadConfig instance() {
        return config;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     *         <br>
     */
    public void printConfigInfo() {
        logger.info("\n xmlDir:" + this.getXmlDir() + "\n fileDir:" + this.getFileDir() + "\n backOrDelete:"
                + backOrDelete + "\n fileDirBack:" + this.getFileDirBack() + "\n  DBType:" + dBType + "\n dbThreadNum:"
                + dbThreadNum + "\n url:" + url + "\n driver:" + driver + "\n userName:" + userName + "\n pssword:"
                + pssword + "\n ftpIp:" + ftpIp + "\n ftpPort:" + ftpPort + "\n ftpUser:" + ftpUser + "\n ftpPasswd:" + ftpPasswd
                + "\n ftpRemoteDir:" + ftpRemoteDir + "\n ftpBackOrDelete:" + ftpBackOrDelete);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFileName() {
        return fileName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param fileName <br>
     */ 
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getXmlDir() {
        return path + "/" + xmlDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param xmlDir <br>
     */ 
    public void setXmlDir(String xmlDir) {
        this.xmlDir = xmlDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFileDir() {
        return path + "/" + fileDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param fileDir <br>
     */ 
    public void setFileDir(String fileDir) {
        this.fileDir = fileDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getBackOrDelete() {
        return backOrDelete;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param backOrDelete <br>
     */ 
    public void setBackOrDelete(String backOrDelete) {
        this.backOrDelete = backOrDelete;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFileDirBack() {
        return path + "/" + fileDirBack;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param fileDirBack <br>
     */ 
    public void setFileDirBack(String fileDirBack) {
        this.fileDirBack = fileDirBack;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDBType() {
        return dBType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dBType <br>
     */ 
    public void setDBType(String dBType) {
        this.dBType = dBType;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getDbThreadNum() {
        return dbThreadNum;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param dbThreadNum <br>
     */ 
    public void setDbThreadNum(int dbThreadNum) {
        this.dbThreadNum = dbThreadNum;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getUrl() {
        return url;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param url <br>
     */ 
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getDriver() {
        return driver;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param driver <br>
     */ 
    public void setDriver(String driver) {
        this.driver = driver;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getUserName() {
        return userName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param userName <br>
     */ 
    public void setUserName(String userName) {
        this.userName = userName;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getPssword() {
        return pssword;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param pssword <br>
     */ 
    public void setPssword(String pssword) {
        this.pssword = pssword;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getTnsAlias() {
        return tnsAlias;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param tnsAlias <br>
     */ 
    public void setTnsAlias(String tnsAlias) {
        this.tnsAlias = tnsAlias;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFtpIp() {
        return ftpIp;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpIp <br>
     */ 
    public void setFtpIp(String ftpIp) {
        this.ftpIp = ftpIp;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public int getFtpPort() {
        return ftpPort;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpPort <br>
     */ 
    public void setFtpPort(int ftpPort) {
        this.ftpPort = ftpPort;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFtpUser() {
        return ftpUser;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpUser <br>
     */ 
    public void setFtpUser(String ftpUser) {
        this.ftpUser = ftpUser;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFtpPasswd() {
        return ftpPasswd;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpPasswd <br>
     */ 
    public void setFtpPasswd(String ftpPasswd) {
        this.ftpPasswd = ftpPasswd;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFtpRemoteDir() {
        return ftpRemoteDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpRemoteDir <br>
     */ 
    public void setFtpRemoteDir(String ftpRemoteDir) {
        this.ftpRemoteDir = ftpRemoteDir;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */ 
    public String getFtpBackOrDelete() {
        return ftpBackOrDelete;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param ftpBackOrDelete <br>
     */ 
    public void setFtpBackOrDelete(String ftpBackOrDelete) {
        this.ftpBackOrDelete = ftpBackOrDelete;
    }

}
