package com.ztesoft.zsmart.oss.core.slm.adaptationlayerstatistics;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

import com.csvreader.CsvReader;
import com.csvreader.CsvWriter;

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
public class ReadFileAdaptStat extends Thread {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(ReadFileAdaptStat.class.getName());

    /**
     * waitWritefileMap 等待写入数据的文件<br>
     */
    private static HashMap<String, CsvWriter> waitWriteFileMap = new HashMap<String, CsvWriter>();

    /**
     * waitWriteFileDateMap 等待写入数据的文件的初次打开时间<br>
     */
    private static HashMap<String, Date> waitWriteFileDateMap = new HashMap<String, Date>();

    /**
     * [方法描述] 读取 slm_adp_dia_info 文件<br>

     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param f 
     * @return t
     * @throws IOException 
     * @throws ParseException  <br>
     */ 
    private boolean readFileStyle1(File f) throws IOException, ParseException {
        CsvReader r = new CsvReader(f.toString(), ',', Charset.forName("UTF-8"));

        if (!r.readHeaders()) {
            logger.error("file[" + f.toString() + "] can not get header!");
            return false;
        }

        if (5 > r.getHeaderCount()) {
            logger.error("file[" + f.toString() + "] can get header column[" + r.getHeaderCount()
                    + "] error.should be get 5 column!");
            return false;
        }
        long cnt = 0;
        while (r.readRecord()) {
            Calendar now = Calendar.getInstance();
            now.setTime(new Date());

            String btime = r.get(0);
            String etime = r.get(1);
            String custNo = r.get(2);
            double traffic = Double.parseDouble(r.get(3));
            long duration = Long.parseLong(r.get(4));

            SlmStDia info = new SlmStDia();
            info.setBtime(btime);
            info.setEtime(etime);
            info.setInserttime(new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(now.getTime()));
            info.setparticipantNO(custNo);
            info.setTraffic(traffic);
            info.setppb0000001(duration);
            double ppc0000003 = duration > 0 ? (traffic / duration) : 0;
            if (ppc0000003 > 6) {
                info.setppb0000002(duration);
            }
            info.setPPC0000003(ppc0000003);
            writeFileStyle1(info);
            cnt++;
        }
        logger.info("file:" + f.getName() + " read count:" + cnt);
        r.close();
        return true;
    }

    /**
     * [方法描述] slm_adp_dia_info btime 按天 切割写到一个文件中，每个文件等待时间自定义<br>

     * @author [作者名] <br>
     * @taskId <br>
     * @param info 
     * @throws ParseException 
     * @throws IOException  <br>
     */ 
    private void writeFileStyle1(SlmStDia info) throws ParseException, IOException {
        if ("".equals(getTimeStr(info.getBtime()))) {
            logger.error("slm_adp_dia1 [" + info.getString() + "]this data can not get btime");
            return;
        }
        String key = "slm_adp_dia1.15." + getTimeStr(info.getBtime());
        if (!waitWriteFileMap.containsKey(key)) {
            logger.info("open and write record file:" + LoadConfig.instance().getDbFileDir() + "/" + key
                    + ".1.csv.writing");
            CsvWriter wr = new CsvWriter(LoadConfig.instance().getDbFileDir() + "/" + key + ".1.csv.writing", ',',
                    Charset.forName("UTF-8"));
            waitWriteFileMap.put(key, wr);
            waitWriteFileDateMap.put(key, new Date());
            wr.writeRecord(info.getStrings());
            wr.flush();
        } 
        else {
            waitWriteFileMap.get(key).writeRecord(info.getStrings());
            waitWriteFileMap.get(key).flush();
        }
    }


    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param f 
     * @return t
     * @throws IOException  
     * @throws ParseException  <br>
     */ 
    private boolean readFileStyle2(File f) throws IOException, ParseException {
        CsvReader r = new CsvReader(f.toString(), ',', Charset.forName("UTF-8"));

        if (!r.readHeaders()) {
            logger.error("file[" + f.toString() + "] can not get header!");
            return false;
        }

        if (4 > r.getHeaderCount()) {
            logger.error("file[" + f.toString() + "] can get header column[" + r.getHeaderCount()
                    + "] error.should be get 5 column!");
            return false;
        }
        long cnt = 0;
        while (r.readRecord()) {
            Calendar now = Calendar.getInstance();
            now.setTime(new Date());

            String btime = r.get(0);
            String etime = r.get(1);
            String devId = r.get(2);
            long faultDuration = Long.parseLong(r.get(3));

            SlmStDevfault info = new SlmStDevfault();
            info.setBtime(btime);
            info.setEtime(etime);
            info.setInserttime(new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(now.getTime()));
            info.setParticipantNO(devId);
            info.setppb1000001(faultDuration);
            writeFileStyle2(info);
            cnt++;
        }
        logger.info("file:" + f.getName() + " read count:" + cnt);
        r.close();
        return true;
    }

    /**
     * [方法描述] slm_adp_devfault_info<br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param info 
     * @throws ParseException 
     * @throws IOException 
     *             <br>
     */
    private void writeFileStyle2(SlmStDevfault info) throws ParseException, IOException {
        if ("".equals(getTimeStr(info.getBtime()))) {
            logger.error("slm_adp_d1 [" + info.getString() + "]this data can not get btime");
            return;
        }
        String key = "slm_adp_d1.15." + getTimeStr(info.getBtime());
        if (!waitWriteFileMap.containsKey(key)) {
            logger.info("open and write record file:" + LoadConfig.instance().getDbFileDir() + "/" + key
                    + ".1.csv.writing");
            CsvWriter wr = new CsvWriter(LoadConfig.instance().getDbFileDir() + "/" + key + ".1.csv.writing", ',',
                    Charset.forName("UTF-8"));
            waitWriteFileMap.put(key, wr);
            waitWriteFileDateMap.put(key, new Date());
            wr.writeRecord(info.getStrings());
            wr.flush();
        } 
        else {
            waitWriteFileMap.get(key).writeRecord(info.getStrings());
            waitWriteFileMap.get(key).flush();
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time  
     * @return  str
     * @throws ParseException  <br>
     */ 
    private static String getTimeStr(String time) throws ParseException {
        String str = "";
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Calendar ctime = Calendar.getInstance();
        Date _btime = format.parse(time);
        ctime.setTime(_btime);
        str = new SimpleDateFormat("yyyyMMdd").format(ctime.getTime());
        return str;
    }

    /**
     * [方法描述] 读取文件下所2种格式文件<br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     *            <br>
     */
    public void run() {
        String path = LoadConfig.instance().getInterfaceFileDir();
        while (true) {
            File files = new File(path);
            String[] str = files.list();
            for (int i = 0; i < str.length; i++) {
                File f = new File(path + "\\" + str[i]);
                if (f.getName().length() > 11 && f.isFile() && "slm_adp_dia.".equals(f.getName().substring(0, 12))) {
                    logger.info("scan file:" + f.toString());
                    try {
                        readFileStyle1(f);
                        backOrDelete(f);
                    } 
                    catch (IOException e) {
                        logger.error("IOException," , e);
                    } 
                    catch (ParseException e1) {
                        logger.error("ParseException," , e1);
                    } 
                }

                if (f.getName().length() > 16 && f.isFile() && "slm_adp_devfault.".equals(f.getName().substring(0, 17))) {
                    logger.info("scan file:" + f.toString());
                    try {
                        readFileStyle2(f);
                        backOrDelete(f);
                    } 
                    catch (IOException e) {
                        logger.error("IOException," , e);
                    } 
                    catch (ParseException e) {
                        logger.error("ParseException," , e);
                    } 
                }
            }
            writeFileToDbFile();
            try {
                Thread.sleep(10000);
            } 
            catch (InterruptedException e) {
                logger.error("InterruptedException," , e);
            }
        }
    }

    /**
     * [方法描述] 删除或者备份文件<br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param f
     *            <br>
     */
    public void backOrDelete(File f) {
        if ("2".equals(LoadConfig.instance().getBackOrDelete())) {
            logger.info("delete file:" + f.toString());
            f.delete();
        } 
        else {
            String dst = LoadConfig.instance().getInterfaceFileDirBack() + "/" + f.getName();
            File fdst = new File(dst);
            logger.info(f.getName() + " bak to " + fdst.getName());
            if (fdst.exists() && fdst.isFile()) {
                fdst.delete();
            }
            f.renameTo(fdst);
        }
    }

    /**
     * [方法描述] 将写入数据的超时文件修改为入库文件<br>
     * 
     * @author [作者名]<br>
     * @throws InterruptedException
     * @taskId <br>
     *         <br>
     */
    private void writeFileToDbFile() {
        logger.info("begin scan write files to db file.waitWriteFileDateMap size:" + waitWriteFileDateMap.size());
        Date now = new Date();

        Iterator<Entry<String, Date>> it = waitWriteFileDateMap.entrySet().iterator();
        while (it.hasNext()) {
            Entry<String, Date> entry = it.next();

            if (LoadConfig.instance().getFileWaitTime() * 1000 + entry.getValue().getTime() < now.getTime()) {
                waitWriteFileMap.get(entry.getKey()).close();
                File write = new File(LoadConfig.instance().getDbFileDir() + "/" + entry.getKey() + ".1.csv.writing");
                String dbName = LoadConfig.instance().getDbFileDir() + "/" + entry.getKey() + ".1.csv.db";

                File db = new File(dbName);
                String name[] = dbName.split("\\.");
                int seq = Integer.parseInt(name[name.length - 3]);
                while (db.exists() && db.isFile()) {
                    seq = seq + 1;
                    dbName = LoadConfig.instance().getDbFileDir() + "/" + entry.getKey() + "." + seq + ".csv.db";
                    db = new File(dbName);
                    String retname[] = dbName.split("\\.");
                    seq = Integer.parseInt(retname[retname.length - 3]);
                }

                logger.debug(write.getName() + " rename to " + db.getName());
                write.renameTo(db);
                it.remove();
            }
        }
    }

}
