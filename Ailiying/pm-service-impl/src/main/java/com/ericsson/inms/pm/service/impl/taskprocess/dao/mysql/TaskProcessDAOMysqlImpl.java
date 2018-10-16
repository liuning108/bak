package com.ericsson.inms.pm.service.impl.taskprocess.dao.mysql;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.codehaus.jettison.json.JSONArray;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.service.taskoneexec.ITaskOneExecService;
import com.ericsson.inms.pm.schedule.ScheduleServer;
import com.ericsson.inms.pm.service.impl.taskprocess.dao.TaskProcessDAO;
import com.ericsson.inms.pm.service.impl.taskprocess.util.JsonMapUtil;
import com.ericsson.inms.pm.taskoneexec.service.TaskOneExecService;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.opb.base.util.CommonHelper;
import com.ztesoft.zsmart.oss.opb.component.sequence.util.SeqUtils;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;
import com.ztesoft.zsmart.core.util.DateUtil;

public class TaskProcessDAOMysqlImpl extends TaskProcessDAO {
	private static final long serialVersionUID = 1L;
	private OpbLogger logger = OpbLogger.getLogger(TaskProcessDAOMysqlImpl.class, "PM");

	@Override
	public String exportExcel(List<Map<String, Object>> colModel, String runSql, ParamArray params)
			throws BaseAppException {
		Integer rowCnt = queryInt("select count(1) as count from (" + runSql + ") w", params);
		Integer maxRowCnt = queryInt("select para_value from pm_parameter where para_id = 'rowExportMaxSize'");
		Integer windowRowCnt = queryInt("select para_value from pm_parameter where para_id = 'rowAccessWindowSize'");
		if (maxRowCnt == 0) {
			maxRowCnt = 100000;
		}
		if (windowRowCnt == 0) {
			windowRowCnt = 500;
		}
		if (rowCnt > maxRowCnt) {
			rowCnt = maxRowCnt;
		}

		Workbook wb = new SXSSFWorkbook(windowRowCnt);
		// 创建sheet对象
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

			String eSql = "select w.* \n" + " from ( \n" + " select s.* from ( " + runSql + ") s \n" + ") w \n"
					+ " limit ? , ?";

			param.clear();
			// logger.info("params.getCount()="+params.getCount());
			for (int p = 0; p < params.getCount(); p++) {
				param.set("", params.getValue(p).toString());
			}
			long startNum = x * rowNum;

			param.set("", startNum);
			param.set("", rowNum);
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

		String fileDirectory = CommonHelper.getProperty("file.download.directory") + File.separator + "taskexpdata"
				+ File.separator;
		Random random = new Random();
		String randomFileName = DateUtil.formatString(new Date(), DateUtil.DateConstants.DATETIME_FORMAT_2);
		int rannum = (int) (random.nextDouble() * (99999 - 10000 + 1)) + 10000;
		String fileName = str + File.separator + randomFileName + "-" + rannum + ".xlsx";
		OutputStream stream;
		String filePath = fileDirectory + fileName;
		File destFile = new File(filePath);
		try {

			if (!destFile.getParentFile().exists()) {
				// 目标文件所在目录不存在
				if (!destFile.getParentFile().mkdirs()) {
					logger.info("mkdir error[" + destFile.getParentFile() + "] ");
				}
			}
			stream = new FileOutputStream(filePath);
			wb.write(stream);
			stream.close();
		} catch (Exception e) {
			logger.info("exportExcel Error" + e.getMessage());
		}
		return destFile.getAbsolutePath();
	}

	@Override
	public JSONObject addExportTask(JSONObject dict) throws BaseAppException {
		JSONObject result = new JSONObject();
		// TODO Auto-generated method stub
		String type = dict.getString("type");
		String classPath = "";
		dict.put("class_path", classPath);
		String exportDateStr = "" + dict.getString("exportDate");
		Date exportDate = null;
		boolean flag = true;
		if ("-1".equalsIgnoreCase(exportDateStr)) {
			flag = false;
		}
		if (flag) {
			exportDate = JsonMapUtil.parseTimestamp("yyyy-MM-dd HH:mm:ss", exportDateStr);
		} else {
			exportDate = JsonMapUtil.parse("yyyy-MM-dd HH:mm:ss", new Date());
		}
		dict.put("exec_date", exportDate);
		JSONObject taskParam = addTask(dict);
		String sql = "" + "INSERT INTO pm_dataexp_log ( " + "    export_type, " + "    topic_no, " + "    task_id, "
				+ "    export_filename, " + "    export_path, " + "    spec_export_date, " + "    state, "
				+ "    commit_date, " + "    oper_user " + ") VALUES ( " + "    ?, " + "    ?, " + "    ?, " + "    ?, "
				+ "    null, " + "    ?, " + "    ?, " + "    sysdate(), " + "    ? " + ")";
		String taskId = taskParam.getString("TASK_ID");
		String topicNo = dict.getString("topicNo");
		String exportFileName = dict.getString("exportFileName");
		String userId = dict.getString("userId");
		ParamArray pa = new ParamArray();
		pa.set("", type);
		pa.set("", topicNo);
		pa.set("", taskId);
		pa.set("", dict.get("exportFileName"));
		pa.set("", exportDate);
		pa.set("", JsonMapUtil.DOWANLOAD_STATE_TODO);
		pa.set("", "" + dict.get("userId"));
		try {
			this.update(sql, new Object[] { type, topicNo, taskId, exportFileName, exportDate,
					JsonMapUtil.DOWANLOAD_STATE_TODO, userId });
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("addExportTask Error" + e.getMessage());
		}
		String jsonParam = dict.getString("jsonParam");
		this.addTaskParam(taskId, jsonParam);
		result.put("flag", true);
		return result;
	}

	private void addTaskParam(String taskId, String jsonParam) {
		try {
			String sql = "" + "INSERT INTO pm_dataexp_log_param ( " + "    task_id, " + "    task_param, "
					+ "    param_seq " + ") VALUES ( " + "    ?, " + "    ?, " + "    ? " + ")";

			List<String> attrs_parts = JsonMapUtil.splitByNumbers(jsonParam, 1024);
			int count = 0;
			for (String part : attrs_parts) {
				System.err.println(count + "==>" + part);
				ParamArray pa = new ParamArray();
				pa.set("", taskId);
				pa.set("", part);
				pa.set("", count);
				this.executeUpdate(sql, pa);
				count++;
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("addTaskParam Error" + e.getMessage());
		}

	}

	private JSONObject addTask(JSONObject dict) {
		// TODO Auto-generated method stub
		JSONObject result = new JSONObject();
		ITaskOneExecService taskOneExecService = (ITaskOneExecService) SpringContext.getBean(TaskOneExecService.class);
		Map<String, Object> mapParam = new HashMap<String, Object>();
		Date exportDate = dict.getDate("exec_date");
		String exportDateStr = JsonMapUtil.parseStr("yyyy-MM-dd HH:mm:ss", exportDate);
		mapParam.put("EXEC_TIME", exportDateStr);
		mapParam.put("CLASS_PATH", "com.ericsson.inms.pm.service.impl.taskprocess.tasks.DownloadPlug");
		mapParam.put("PARAM", "{}");
		String TASK_ID = taskOneExecService.insertInst(mapParam);
		result.put("TASK_ID", TASK_ID);
		return result;
	}

	@Override
	public JSONObject exportTasklist(JSONObject dict) throws BaseAppException {
		JSONObject result = new JSONObject();
		String userId = dict.getString("userId");
		String sql = "" + "SELECT EXPORT_TYPE AS EXPORT_TYPE, " + "    TOPIC_NO AS TOPIC_NO, "
				+ "    TASK_ID AS  TASK_ID , " + "    EXPORT_FILENAME AS EXPORT_FILENAME, "
				+ "    EXPORT_PATH AS EXPORT_PATH , " + "    SPEC_EXPORT_DATE AS SPEC_EXPORT_DATE, "
				+ "    STATE AS STATE, " + "    COMMIT_DATE AS COMMIT_DATE, " + "    OPER_USER AS  OPER_USER " + "FROM "
				+ "    PM_DATAEXP_LOG " + "WHERE " + "   OPER_USER=?" + "   AND  " + " EXPORT_TYPE ='01' " + "   AND  "
				+ " COMMIT_DATE >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) ORDER BY COMMIT_DATE DESC ";
		ParamArray pa = new ParamArray();
		pa.set("", userId);
		result.put("taskList", this.queryList(sql, pa));
		return result;
	}

	@Override
	public JSONObject getDataExpParam(JSONObject dict) throws BaseAppException {
		try {
			String id = dict.getString("id");
			String sql = "select PARAM_SEQ PARAM_SEQ,TASK_PARAM ATTR from pm_dataexp_log_param where TASK_ID= ? order by PARAM_SEQ";
			List<Map<String, String>> partList = this.queryForMapList(sql, new Object[] { id });
			StringBuffer sb = new StringBuffer();
			for (Map<String, String> part : partList) {
				sb.append(part.get("ATTR"));
			}
			JSONObject json = JSONObject.parseObject(sb.toString());
			return json;
		} catch (Exception e) {
			logger.info("getDataExpParam Error" + e.getMessage());
			throw new BaseAppException(e.getMessage());
		}
	}

	@Override
	public void savefilePath(JSONObject dict) throws BaseAppException {
		// TODO Auto-generated method stub
		String sql = "update PM_DATAEXP_LOG set export_path=? , state= ? where task_id= ? ";
		String filePath = dict.getString("filePath");
		String state = dict.getString("state");
		String taks_id = dict.getString("id");
		try {
			this.update(sql, new Object[] { filePath, state, taks_id });
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseAppException(e.getMessage());
		}

	}

	@Override
	public String getParamter(String key) throws BaseAppException {
		// TODO Auto-generated method stub
		String sql = "select  PARA_VALUE from pm_parameter t  where t.para_id=?";
		ParamArray pa = new ParamArray();
		pa.set("", key);
		try {
			return this.queryString(sql, pa);
		} catch (Exception e) {
			return "";
		}
	}

	@Override
	public JSONObject getDelList(String day) throws BaseAppException {
		// TODO Auto-generated method stub
		JSONObject result = new JSONObject();
		String sql = "select t.task_id ID ,t.export_path PATH,T.STATE STATE ,t.export_type ETYPE,SPEC_EXPORT_DATE EDATE from PM_DATAEXP_LOG T  where TO_DAYS(NOW())-TO_DAYS(T.SPEC_EXPORT_DATE) >= ?";
		try {
			result.put("datas", this.queryForMapList(sql, new Object[] { day }));
		} catch (Exception e) {
			logger.info("getDelList Error" + e.getMessage());
			result.put("datas", new JSONArray());
		}
		return result;
	}

	@Override
	public boolean delDataExpLogById(String id) throws BaseAppException {
		// TODO Auto-generated method stub
		String sql = "delete from  pm_dataexp_log_param where task_id= ?";
		String sql2 = "delete from PM_DATAEXP_LOG where task_id= ?";
		try {
			this.delete(sql, new Object[] { id });
			this.delete(sql2, new Object[] { id });
			return true;
		} catch (Exception e) {
			logger.info("delDataExpLogById Error:" + e.getMessage());
			return false;
		}
	}

}
