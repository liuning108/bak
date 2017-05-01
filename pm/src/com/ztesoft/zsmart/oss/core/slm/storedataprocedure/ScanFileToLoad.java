package com.ztesoft.zsmart.oss.core.slm.storedataprocedure;

import java.io.File;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.apache.log4j.Logger;

/**
 * [描述] 扫描文件至队列中，文件名规范 为点分割 [模板表名称].[粒度].[数据日期].[].[序号].[csv].[db]
 * slm_st_dev_fault.15.201609121000_201609121015.1.csv.db
 * 第一个"."之前的位置为模板表名称，以此规则去匹配XML中表信息<br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月19日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.storedataprocedure <br>
 */
public class ScanFileToLoad extends Thread {

    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(LoadConfig.class.getName());

    /**
     * fileDbQueue 入库文件队列 全路径<br>
     */
    public static Queue<DbFileStruct> fileDbQueue = new ConcurrentLinkedQueue<DbFileStruct>();

    /**
     * [方法描述] 扫描以.db结尾的文件至队列中 修改文件名称增加后缀.doing<br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     *         <br>
     */
    public void run() {
        while (true) {
            String dir = LoadConfig.instance().getFileDir();
            File files = new File(dir);
            String file[] = files.list();
            for (int i = 0; i < file.length; i++) {

                DbFileStruct dbFile = new DbFileStruct();
                if (!getDbFileStruct(dir, file[i], dbFile)) {
                    continue;
                }
                String name = dir + "/" + file[i];
                File src = new File(name);
                File dst = new File(name + ".doing");
                if (dst.exists() && dst.isFile()) {
                    dst.delete();
                }
                if (!src.renameTo(dst)) {
                    logger.error("can not recognize this file . rename failed," + name);
                    continue;
                }
                synchronized (fileDbQueue) {
                    fileDbQueue.add(dbFile);
                }
                logger.info("add db file to queue:" + dst.getAbsolutePath());
            }
            try {
                Thread.sleep(10000);
            } 
            catch (InterruptedException e) {
                logger.error("scan db file error", e);
            } 
            finally {
                logger.info("fileDbQueue wait to load size:" + fileDbQueue.size());
            }
        }
    }

    /**
     * [方法描述] 入库文件必须以.db 结尾 同时以.分割文件名<br>
  
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param path 
     * @param name 
     * @param dbFile 
     * @return t <br>
     */ 
    private boolean getDbFileStruct(String path, String name, DbFileStruct dbFile) {
        String str[] = name.split("\\.");
        if (!(str.length == 6) || !("db").equals(str[5])) {
            return false;
        }
        dbFile.setAbsoluteFileName(path + "/" + name + ".doing");
        dbFile.setAbsoluteCtlName(path + "/" + name + ".ctl");
        dbFile.setAbsoluteLogName(path + "/" + name + ".log");
        dbFile.setFileName(name + ".doing");
        dbFile.setTempleteName(str[0] + "_" + str[1]);
        if (!TablesInfoByXml.tableInfoMap.containsKey(str[0] + "_" + str[1])) {
            logger.error("Xml Info [tableInfoMap] can not find this table :" + name);
            return false;
        }
        boolean state = true;
        // 不分表
        if (TablesInfoByXml.tableInfoMap.get(str[0] + "_" + str[1]).getSeparateTableRule() == 4) {
            dbFile.setTableName(str[0] + "_" + str[1]);
        }
        // 按年分表
        else if (TablesInfoByXml.tableInfoMap.get(str[0] + "_" + str[1]).getSeparateTableRule() == 3) {
            if (str[2].length() < 4) {
                logger.error("by year separate table rule db file time str is error :" + name);
                state =  false;
            }
            dbFile.setTableName(str[0] + "_" + str[1] + "_" + str[2].substring(0, 4));
        }
        // 按月分表
        else if (TablesInfoByXml.tableInfoMap.get(str[0] + "_" + str[1]).getSeparateTableRule() == 2) {
            if (str[2].length() < 6) {
                logger.error("by mon separate table rule db file time str is error :" + name);
                state =  false;
            }
            dbFile.setTableName(str[0] + "_" + str[1] + "_" + str[2].substring(0, 6));
        }
        // 按周/天分表
        else {
            if (str[2].length() < 8) {
                logger.error("by day/wk separate table rule db file time str is error :" + name);
                state =  false;
            }
            dbFile.setTableName(str[0] + "_" + str[1] + "_" + str[2].substring(0, 8));
        }
        return state;
    }
}
