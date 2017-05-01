package com.ztesoft.zsmart.oss.core.slm.adaptationlayerstatistics;
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
 * @see com.ztesoft.zsmart.oss.core.slm.util.adaptationlayerstatistics <br>
 */
public class LoadConfig {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());
    
    /**  参数配置文件目录 
     * fileName <br>
     */
    private String fileName = "../config/server/adaptationLayerStatistics.properties";

    /**
     * config <br>
     */
    private static LoadConfig config = new LoadConfig();

    /*  */
    /** 接口文件目录配置相对路径
     * interfaceFileDir <br>
     */
    private String interfaceFileDir = "./interfaceFileDir";

    /** 1 备份 2 删除
     * backOrDelete <br>
     */
    private String backOrDelete = "1";

    /** 接口文件备份目录配置相对路径 
     * interfaceFileDirBack <br>
     */
    private String interfaceFileDirBack = "./interfaceFileDirBack";
 
    /**
     * DbFileDir 入库文件相对目录 <br>
     */
    private String dbFileDir = "./dbfiledir";

    /**
     * fileWaitTime 入库写文件的等待时间<br>
     */
    private long fileWaitTime = 30;

    /**
     * path <br>
     */
    private static String path = "";

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
            if (prop.containsKey("interfaceFileDir")) {
                interfaceFileDir = prop.getProperty("interfaceFileDir").trim();
            }

            if (prop.containsKey("backOrDelete")) {
                backOrDelete = prop.getProperty("backOrDelete").trim();
            }

            if (prop.containsKey("interfaceFileDirBack")) {
                interfaceFileDirBack = prop.getProperty("interfaceFileDirBack").trim();
            }

            if (prop.containsKey("dbFileDir")) {
                dbFileDir = prop.getProperty("dbFileDir").trim();
            }

            if (prop.containsKey("fileWaitTime")) {
                fileWaitTime = Long.parseLong(prop.getProperty("fileWaitTime").trim());
            }

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
     * @return <br>
     */
    public boolean initConfig() {
        this.readConfig();
        this.printConfigInfo();
        File directory = new File(".");
        try {
            path = directory.getCanonicalPath();
            File interdir = new File(this.getInterfaceFileDir());
            if (!interdir.exists() && !interdir.isDirectory()) {
                logger.info("dir[" + this.getInterfaceFileDir() + "] is not exist and will auto create it.");
                interdir.mkdirs();
            }

            File dir = new File(this.getInterfaceFileDirBack());
            if (!dir.exists() && !dir.isDirectory()) {
                logger.info("dir[" + this.getInterfaceFileDirBack() + "] is not exist and will auto create it.");
                dir.mkdirs();
            }
            File dbdir = new File(this.getDbFileDir());
            if (!dbdir.exists() && !dbdir.isDirectory()) {
                logger.info("dir[" + this.getDbFileDir() + "] is not exist and will auto create it.");
                dbdir.mkdirs();
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
     * @param fileName
     *            <br>
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
    public String getInterfaceFileDir() {
        return path + "/" + interfaceFileDir;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param interfaceFileDir
     *            <br>
     */
    public void setInterfaceFileDir(String interfaceFileDir) {
        this.interfaceFileDir = interfaceFileDir;
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
     * @param backOrDelete
     *            <br>
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
    public String getInterfaceFileDirBack() {
        return path + "/" + interfaceFileDirBack;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param interfaceFileDirBack
     *            <br>
     */
    public void setInterfaceFileDirBack(String interfaceFileDirBack) {
        this.interfaceFileDirBack = interfaceFileDirBack;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getDbFileDir() {
        return path + "/" + dbFileDir;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dbFileDir
     *            <br>
     */
    public void setDbFileDir(String dbFileDir) {
        this.dbFileDir = dbFileDir;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public long getFileWaitTime() {
        return fileWaitTime;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param fileWaitTime
     *            <br>
     */
    public void setFileWaitTime(long fileWaitTime) {
        this.fileWaitTime = fileWaitTime;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     *         <br>
     */
    public void printConfigInfo() {
        logger.info("\n interfaceFileDir:" + this.getInterfaceFileDir() + "\n backOrDelete:" + backOrDelete
                + "\n interfaceFileDirBack:" + this.getInterfaceFileDirBack() + "\n dbFileDir:" + this.getDbFileDir()
                + "\n fileWaitTime:" + fileWaitTime);
    }
}
