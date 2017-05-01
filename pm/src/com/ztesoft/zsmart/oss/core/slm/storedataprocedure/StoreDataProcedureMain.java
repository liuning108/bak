package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

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
public class StoreDataProcedureMain {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param args <br>
     */ 
    public static void main(String args[]) {
        PropertyConfigurator.configure("../config/server/storedataprocedurelog4j.properties");
        if (!LoadConfig.instance().initConfig()) {
            return;
        }
        
        TablesInfoByXml.instance().initConfig();
        
        if (0 != LoadConfig.instance().getFtpIp().length()) {
            Ftp ftp = new Ftp(LoadConfig.instance().getFtpIp(), LoadConfig.instance().getFtpPort(), 
                LoadConfig.instance().getFtpUser(), LoadConfig.instance().getFtpPasswd());
            ftp.start();
        }
        
        ScanFileToLoad scan = new ScanFileToLoad();
        scan.start();

        if (("ORACLE").equals(LoadConfig.instance().getDBType())) {
            try {
                Class.forName(LoadConfig.instance().getDriver());
                CreateTables create = new CreateTables();
                // 建立当天表
                create.createCurrentTable();
                for (int i = 0; i < LoadConfig.instance().getDbThreadNum(); i++) {
                    LoadDataOracle oracle = new LoadDataOracle();
                    oracle.start();
                }
            } 
            catch (ClassNotFoundException e) {
                logger.error("load oracel driver error[" + LoadConfig.instance().getDriver() + "]", e);
            }
        } 
        else {
            logger.error("now not supported this DB type:" + LoadConfig.instance().getDBType());
        }
    }
}
