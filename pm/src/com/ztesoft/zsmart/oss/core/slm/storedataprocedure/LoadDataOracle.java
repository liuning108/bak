package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

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
public class LoadDataOracle extends Thread {

    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());

    /**
     * con <br>
     */
    private Connection con = null;

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br> <br>
     */ 
    public void run() {
        while (true) {
            DbFileStruct info;
            synchronized (ScanFileToLoad.fileDbQueue) {
                if (ScanFileToLoad.fileDbQueue.size() == 0) {
                    try {
                        Thread.sleep(5000);
                    } 
                    catch (InterruptedException e) {
                        logger.error("InterruptedException" , e);
                    }
                    continue;
                }
                info = ScanFileToLoad.fileDbQueue.poll();
            }

            if (!TablesInfoByXml.tableInfoMap.containsKey(info.getTempleteName())) {
                logger.error("load table xml info can not find templete info:" + info.getTempleteName());
                continue;
            }

            try {
                if (con == null) {
                    con = DriverManager.getConnection(LoadConfig.instance().getUrl(),
                            LoadConfig.instance().getUserName(), LoadConfig.instance().getPssword());
                }

                writeCtl(info);
                String loadSql = getLoadSql(info);
                loadFile(loadSql, info);

            } 
            catch (FileNotFoundException e1) {
                logger.error("load file load data oracle error.", e1);
            }
            catch (SQLException e1) {
                logger.error("load file load data oracle error.", e1);
            }
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param loadSql 
     * @param info <br>
     */ 
    private void loadFile(String loadSql, DbFileStruct info) {
        Process proc = null;
        String result = "failed";
        String log = "";
        long time = 0;
        try {
            if (!CreateTables.tableIsExist(info.getTableName(), this.con)) {
                CreateTables.executeCreate(TablesInfoByXml.tableInfoMap.get(info.getTempleteName()),
                        info.getTableName(), con);
            }

            Date btime = new Date();
            proc = Runtime.getRuntime().exec(loadSql);
            Date etime = new Date();
            time = etime.getTime() - btime.getTime();
            proc.waitFor();
            proc.destroy();
            log = fileToStrng(info.getAbsoluteLogName());

        } 
        catch (Exception e) {
            logger.error("exec shell command exception[" + loadSql + "]", e);
            log = e.toString();
        } 
        finally {
            if (proc.exitValue() == 0) {
                result = "success";
                if (("1").equals(LoadConfig.instance().getBackOrDelete())) {
                    deleteFile(info.getAbsoluteFileName());
                    deleteFile(info.getAbsoluteCtlName());
                    deleteFile(info.getAbsoluteLogName());
                } 
                else {
                    bakFile(info.getAbsoluteFileName());
                    bakFile(info.getAbsoluteCtlName());
                    bakFile(info.getAbsoluteLogName());
                }
            } 
            else {
                bakFileFailed(info.getAbsoluteFileName());
            }

            // 向结果表插入掉load 日志
            if (log.length() > 4000) {
                insertResult(info, log.substring(0, 40000), result, time);
            } 
            else {
                insertResult(info, log, result, time);
            }

            if (proc != null) {
                proc.destroy();
            }
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @param log 
     * @param result 
     * @param time  <br>
     */ 
    private void insertResult(DbFileStruct info, String log, String result, long time) {
        String sql = "";
        try {
            if (this.con == null) {
                throw new RuntimeException("insertResult getconnection is null");
            }
            Calendar now = Calendar.getInstance();
            now.setTime(new Date());
            sql = "INSERT INTO OSS_WFM.SLM_STORE_DATA_LOG(TABLENAME, EXECUTETIME, RESULT, TIME_CONSUMING, LOG)  VALUES"
                    + "(\'" + info.getTableName() + "\', to_date('"
                    + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(now.getTime())
                    + "','yyyy-MM-dd hh24:mi:ss'), \'" + result + "\', " + time + ", \'" + log + "\')";
            PreparedStatement state = this.con.prepareStatement(sql.toString());
            state.executeUpdate();
        } 
        catch (SQLException e) {
            logger.error("insertResult error[" + sql + "]", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param name 
     * @return t
     * @throws IOException  <br>
     */ 
    private String fileToStrng(String name) throws IOException {
        InputStreamReader inputReader = null;
        BufferedReader bufferReader = null;
        File file = new File(name);
        StringBuffer sb = new StringBuffer();

        inputReader = new InputStreamReader(new FileInputStream(file), "UTF-8");
        bufferReader = new BufferedReader(inputReader);
        String line = "";
        while ((line = bufferReader.readLine()) != null) {
            if (line.length() == 0 || ("\n").equals(line)) {
                continue;
            }
            line = line.replace("'", "");
            sb.append(line + "\n");
        }

        if (bufferReader != null) {
            bufferReader.close();
        }
        if (inputReader != null) {
            inputReader.close();
        }

        return sb.toString();

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     */ 
    private void deleteFile(String name) {
        File f = new File(name);
        if (f.exists() && f.isFile()) {
            f.delete();
        }
        logger.info("delete[" + name + "]");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     */ 
    private void bakFileFailed(String name) {
        File f = new File(name);
        if (!f.exists() || !f.isFile()) {
            return;
        }
        File bf = new File(name + ".failed");
        if (bf.exists() && bf.isFile()) {
            bf.delete();
        }
        f.renameTo(bf);
        logger.info("bakFileFailed[" + name + "] To [" + bf.getAbsolutePath() + "]");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param name <br>
     */ 
    private void bakFile(String name) {
        File f = new File(name);
        if (!f.exists() || !f.isFile()) {
            return;
        }
        String str[] = name.split("/");
        String f1 = str[str.length - 1];
        File bf = new File(LoadConfig.instance().getFileDirBack() + "/" + f1);
        if (!bf.exists() || !bf.isFile()) {
            bf.delete();
        }
        f.renameTo(bf);
        logger.info("bakFile[" + name + "] To [" + bf.getAbsolutePath() + "]");
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @return t <br>
     */ 
    private String getLoadSql(DbFileStruct info) {
        StringBuffer str = new StringBuffer();
        str.append("sqlldr userid=");
        str.append(LoadConfig.instance().getUserName());
        str.append("/");
        str.append(LoadConfig.instance().getPssword());
        str.append("@");
        str.append(LoadConfig.instance().getTnsAlias());
        str.append(" control=");
        str.append(info.getAbsoluteCtlName());
        str.append(" log=");
        str.append(info.getAbsoluteLogName());
        str.append(" silent=feedback direct=true  multithreading=true");
        //logger.info(str.toString());
        return str.toString();
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @throws FileNotFoundException <br>
     */ 
    private void writeCtl(DbFileStruct info) throws FileNotFoundException {
        StringBuffer str = new StringBuffer();
        str.append("load data\ninfile '");
        str.append(info.getAbsoluteFileName());
        str.append("'\nappend\ninto table ");
        str.append(info.getTableName());
        str.append("\nfields terminated by ','\noptionally enclosed by '\"'\n(");
        for (int i = 0; i < TablesInfoByXml.tableInfoMap.get(info.getTempleteName()).fields.size(); i++) {
            String name = TablesInfoByXml.tableInfoMap.get(info.getTempleteName()).fields.get(i).field;
            String type = TablesInfoByXml.tableInfoMap.get(info.getTempleteName()).fields.get(i).type;
            str.append(name);
            if (("date").equals(type)) {
                str.append(" \"to_date(substr(:");
                str.append(name);
                str.append(",1,19),'YYYY-MM-DD HH24:MI:SS')\"");
            }
            if (("timestamp").equals(type)) {
                str.append(" timestamp \"YYYY-MM-DD HH24:MI:SSXFF3\"");
            }
            if (i != TablesInfoByXml.tableInfoMap.get(info.getTempleteName()).fields.size() - 1) {
                str.append(",\n");
            } 
            else {
                str.append(")");
            }
        }

        try {
            FileWriter write;
            write = new FileWriter(info.getAbsoluteCtlName());
            write.write(str.toString());
            write.close();
        } 
        catch (IOException e) {
            logger.error("write ctl[" + info.getAbsoluteCtlName() + "] error", e);
        }

    }

}
