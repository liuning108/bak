package com.ericsson.inms.pm.utils;

import java.io.Serializable;

/**
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年4月20日 <br>
 * @since V7.0<br>
 * @see <br>
 */
public class DBSourceInfo implements Serializable {
    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    /**
     * userName <br>
     */
    private String userName;

    /**
     * passwd <br>
     */
    private String passwd;

    /**
     * ip <br>
     */
    private String ip;

    /**
     * port <br>
     */
    private String port;

    /**
     * dbName <br>
     */
    private String dbName;

    /**
     * <br>
     */
    private String url;

    /**
     * driver <br>
     */
    private String driver;

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
    public String getPasswd() {
        return passwd;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param passwd <br>
     */
    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getIp() {
        return ip;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param ip <br>
     */
    public void setIp(String ip) {
        this.ip = ip;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getPort() {
        return port;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param port <br>
     */
    public void setPort(String port) {
        this.port = port;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String getDbName() {
        return dbName;
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param dbName <br>
     */
    public void setDbName(String dbName) {
        this.dbName = dbName;
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
     * @param db DBSourceInfo
     * @return <br>
     */
    public boolean equal(DBSourceInfo db) {
        return db.userName.equals(this.userName) && db.passwd.equals(this.passwd) && db.ip.equals(this.ip)
            && db.port.equals(this.port) && db.dbName.equals(this.dbName) && db.url.equals(this.url)
            && db.driver.equals(this.driver);
    }

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @return <br>
     */
    public String print() {
        return ("userName;" + userName + " passwd:" + passwd + " ip:" + ip + " port:" + port + " dbName:" + dbName
            + " url:" + url + " driver" + driver);
    }
}
