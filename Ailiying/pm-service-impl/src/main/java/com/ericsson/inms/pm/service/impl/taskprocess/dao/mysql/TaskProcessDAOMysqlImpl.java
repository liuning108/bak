package com.ericsson.inms.pm.service.impl.taskprocess.dao.mysql;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.core.util.DateUtil;


public class TaskProcessDAOMysqlImpl extends TaskProcessDAO {
	private static final long serialVersionUID = 1L;
	private static final ZSmartLogger LOG = ZSmartLogger.getLogger(TaskProcessDAOMysqlImpl.class);

	@Override
	public String exportExcel(List<Map<String, Object>> colModel, String runSql, ParamArray params)
			throws BaseAppException {
		Integer rowCnt = queryInt("select count(1) as count from (" + runSql + ") w", params);
        Integer maxRowCnt = queryInt("select para_value from pm_parameter where para_id = 'rowExportMaxSize'");
        Integer windowRowCnt = queryInt("select para_value from pm_parameter where para_id = 'rowAccessWindowSize'");
        if (maxRowCnt == 0) {
            maxRowCnt =100000;
        }

        if (windowRowCnt == 0) {
            windowRowCnt = 500;
        }

        if (rowCnt > maxRowCnt) {
            rowCnt = maxRowCnt;
        }

        Workbook wb = new SXSSFWorkbook(windowRowCnt);
         //创建sheet对象
        Sheet sheet1 = (Sheet) wb.createSheet("sheet1");
        Row row = (Row) sheet1.createRow(0);
        for (int j = 0, size = colModel.size(); j < size; j++) {
            Cell cell = row.createCell(j);
            cell.setCellValue(String.valueOf(colModel.get(j).get("label")));
        }
        Integer rowNum = 1000;
        // logger.info("runSql()="+runSql);
        for (int x = 0; x < Math.ceil((rowCnt * 100) / (rowNum * 100.0)); x++) {
         	ParamArray param = new ParamArray();

            String eSql = "select w.* \n" + 
                   " from ( \n" + " select s.* from ( " + runSql + ") s \n"
                + ") w \n" + " limit ? , ?";

            param.clear();
            // logger.info("params.getCount()="+params.getCount());
            for (int p = 0; p < params.getCount(); p++) {
                param.set("", params.getValue(p).toString());
            }
            	  long startNum = x*rowNum;
             
            param.set("", startNum);
            param.set("", rowNum);
            System.err.println(startNum+"--"+rowNum);

            // logger.info("param.getCount()="+param.getCount());
            List<Map<String, String>> dataList = queryList(eSql, param);

            // 循环写入行数据
            for (int i = 0, size = dataList.size(); i < size; i++) {
                Row datarow = (Row) sheet1.createRow(x * rowNum + i + 1);
                Map dataItem = dataList.get(i);
                // 循环写入列数据
                for (int j = 0; j < colModel.size(); j++) {
                    Cell cell = datarow.createCell(j);
                    Object cellVal = dataItem.get(String.valueOf(colModel.get(j).get("name")));
                    if (cellVal == null) {
                        cellVal = "";
                    }
                    cell.setCellValue(cellVal.toString());
                }
            }
        }

        // 创建文件流

        SimpleDateFormat simpleDateFormat;
        simpleDateFormat = new SimpleDateFormat("yyyyMM");
        Date date = new Date();
        String str = simpleDateFormat.format(date);

        String fileDirectory = CommonHelper.getProperty("file.download.directory") + File.separator;
        Random random = new Random();
        String randomFileName = DateUtil.formatString(new Date(), DateUtil.DateConstants.DATETIME_FORMAT_2);
        int rannum = (int) (random.nextDouble() * (99999 - 10000 + 1)) + 10000;
        String fileName = str + File.separator + randomFileName + "-" + rannum + ".xlsx";
        OutputStream stream;

        String filePath = fileDirectory + fileName;

        try {
            File destFile = new File(filePath);

            if (!destFile.getParentFile().exists()) {
                // 目标文件所在目录不存在
                if (!destFile.getParentFile().mkdirs()) {
                    LOG.error("mkdir error[" + destFile.getParentFile() + "] ");
                }
            }
            stream = new FileOutputStream(filePath);
            wb.write(stream);
            stream.close();
        }
        catch (FileNotFoundException e) {
            LOG.error(e);
        }
        catch (IOException e) {
            LOG.error(e);
        }
        return fileName;
	}

}
