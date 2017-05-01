package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.dao.oracle;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.apache.log4j.Logger;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.DataStatistic;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMBasicStatisticTask;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMEntyExtInfoTask;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.SLMEntyInfo;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.TimePeriod;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.dao.DataStatisticDAO;


/** 
 * [描述] <br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年9月9日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.util.datastatistic.dao.oracle <br>
 */
public class DataStatisticDAOOracleImpl extends DataStatisticDAO {
    /**
     * logger <br>
     */
    private static Logger logger = Logger.getLogger(DataStatistic.class.getName());

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @param _time 
     * @throws BaseAppException <br>
     */ 
    public void executeCreateSqlTpl(SLMEntyExtInfoTask task, Calendar _time) throws BaseAppException {
        int ret = -1;
        String sql = "";
        try {
            String destTableName = task.getentyTableCode()
                    + DataStatistic.getTableLimitTimeStr(task.getcrtTableMeth(), task.getcaculateCycle(), _time);
            ParamArray pa = new ParamArray();
            sql = "CREATE TABLE " + destTableName + " AS SELECT * FROM " + task.getinterfaceTableCode()
                    + " WHERE 1 = 2";
            if (!isExistTable(destTableName)) {
                ret = executeUpdate(sql, pa);
                logger.info("[" + task.getjobName() + "] careate table sql[" + sql + "] result[" + ret + "]");
            }
            else {
                logger.warn("[" + task.getjobName() + "] careate table [" + destTableName + "] is exist!");
            }
        } 
        catch (Exception e) {
            logger.error("[" + task.getjobName() + "] careate table sql[" + sql + "]");
            logger.error("[" + task.getjobName() + "] create table error!", e);
        }
    };
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sql <br>
     */ 
    public void executeSql(String sql) {
        int ret = -1;
        try {
            ParamArray pa = new ParamArray();
            ret = executeUpdate(sql, pa);
            logger.info("execute sql[" + sql + "] result[" + ret + "]");
        } 
        catch (Exception e) {
            logger.error("execute sql careate table sql[" + sql + "]");
            logger.error("execute sql careatecreate table error!", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param sliNoEntyTableCodeMap 
     * @param kpiAlgorithmMap 
     * @throws BaseAppException <br>
     */ 
    public void getSliNoEntyInfo(HashMap<String, String> sliNoEntyTableCodeMap, HashMap<String, String> kpiAlgorithmMap) throws BaseAppException {
        String sql = "";
        try {
            ParamArray pa = new ParamArray();
            sql = "select a.COL_NO,b.ENTY_TABLE_CODE from SLM_ENTY_COL a,slm_enty_info b "
                    + "where a.ENTY_ID = b.ENTY_ID and a.COL_TYPE = '01'";
            List<HashMap<String, String>> slaList = this.queryList(sql, pa);
            sliNoEntyTableCodeMap.clear();
            for (int i = 0; i < slaList.size(); i++) {
                String col_no = slaList.get(i).get("COL_NO").toUpperCase();
                String entyTableCode = slaList.get(i).get("ENTY_TABLE_CODE").toUpperCase();
                sliNoEntyTableCodeMap.put(col_no, entyTableCode + "_EVAL");
            }

            kpiAlgorithmMap.clear();
            sql = "select DISTINCT SLI_NO,SLI_FORMULA from SLM_SLI_INFO";
            List<HashMap<String, String>> sliList = this.queryList(sql, pa);
            for (int i = 0; i < sliList.size(); i++) {
                String sli_no = sliList.get(i).get("SLI_NO").toUpperCase();
                String sli_formula = sliList.get(i).get("SLI_FORMULA").toUpperCase();
                kpiAlgorithmMap.put(sli_no, sli_formula);
            }
        }
        catch (Exception e) {
            logger.error("execute getSliNoEntyInfo sql[" + sql + "]");
            logger.error("getSliNoEntyInfo error!", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param task 
     * @throws BaseAppException <br>
     */ 
    public void executeStatSqlTpl(SLMBasicStatisticTask task) throws BaseAppException {
        Calendar inserttime = Calendar.getInstance();
        inserttime.setTime(new Date());
        int ret = -1;
        String sql = "";
        try {
            ParamArray pa = new ParamArray();
            sql = "";
            pa.set("", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(inserttime.getTime()));
            
            sql = "INSERT INTO " + task.getDstTableName() + "(BTIME,ETIME,INSERTTIME,WK,HH,MI" + task.getDims() + task.getKpisCode()
                        + ")" + " SELECT to_date('" + task.getBtime() + "','yyyy-MM-dd hh24:mi:ss') AS BTIME ,to_date('"
                        + task.getEtime() + "','yyyy-MM-dd hh24:mi:ss') AS ETIME, to_date('"
                        + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(inserttime.getTime())
                        + "','yyyy-MM-dd hh24:mi:ss') AS INSERTTIME," + task.getWk() + "," + task.getHh() + ","
                        + task.getMi() + task.getDims() + task.getKpis() + " FROM (" + task.getFrom() + ") " + task.getGroupDims();
            
            ret = executeUpdate(sql, pa);
            logger.info("[" + task.getJobName() + "] result[" + ret + "]execute statistic task sql[" + sql + "]");
        } 
        catch (Exception e) {
            logger.error("[" + task.getJobName() + "] task sql[" + sql + "] statistic task error!", e);
        }

    };

    /* 表存在返回true */
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param destTableName 
     * @return r
     * @throws BaseAppException <br>
     */ 
    public boolean isExistTable(String destTableName) throws BaseAppException {
        String sql = "";
        try {
            ParamArray pa = new ParamArray();
            sql = "SELECT * FROM USER_TABLES WHERE TABLE_NAME = \'" + destTableName.toUpperCase() + "\'";
            List<HashMap<String, String>> slaList = this.queryList(sql, pa);
            if (1 == slaList.size()) {
                return true;
            }
        } 
        catch (Exception e) {
            logger.error("execute isExistTable sql[" + sql + "]");
            logger.error("table name [" + destTableName + "] isExistTable error!", e);
        }
        return false;
    }

    /* 获取适配层表SLM_ENTY_INFO信息 */
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param slmEntyInfoMap 
     * @param entyIDDIMInfoMap 
     * @param entyIDKPIInfoMap 
     * @throws BaseAppException <br>
     */ 
    public void getSLMEntyInfo(HashMap<String, SLMEntyInfo> slmEntyInfoMap,
            HashMap<String, List<String>> entyIDDIMInfoMap, HashMap<String, List<String>> entyIDKPIInfoMap) throws BaseAppException {
        String sql = "";
        try {
            ParamArray pa = new ParamArray();
            sql = "SELECT DISTINCT ENTY_ID,ENTY_TABLE_CODE,CAL_CYCLE,CYCLE_UNITS,CRT_TABLE_METH FROM "
                    + "SLM_ENTY_INFO ORDER BY ENTY_TABLE_CODE,CYCLE_UNITS";
            List<HashMap<String, String>> slaList = this.queryList(sql, pa);
            slmEntyInfoMap.clear();
            entyIDDIMInfoMap.clear();
            entyIDKPIInfoMap.clear();
            for (int i = 0; i < slaList.size(); i++) {
                //int cal_cycle = Integer.parseInt(slaList.get(i).get("CAL_CYCLE"));
                String cycle_units = slaList.get(i).get("CYCLE_UNITS");
                String entyTableCode = slaList.get(i).get("ENTY_TABLE_CODE").toUpperCase();
                String entyID = slaList.get(i).get("ENTY_ID");
                String caculateCycle = DataStatistic.getCycle(cycle_units);
                if ("".equals(caculateCycle)) {
                    continue;
                }
                String crtTableMeth = slaList.get(i).get("CRT_TABLE_METH");
                SLMEntyInfo info = new SLMEntyInfo();
                info.setentyID(entyID);
                info.setentyTableCode(entyTableCode);
                info.setcrtTableMeth(crtTableMeth);
                info.setcaculateCycle(caculateCycle);
                slmEntyInfoMap.put(entyID, info);

                getEntyIDFieldInfo(entyID, entyIDDIMInfoMap, entyIDKPIInfoMap);
            }
        } 
        catch (Exception e) {
            logger.error("execute getSLMEntyInfo sql[" + sql + "]");
            logger.error("getSLMEntyInfo error!", e);
        }
    }

    /* 获取各个实体的字段信息 */
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param entyID 
     * @param entyIDDIMInfoMap 
     * @param entyIDKPIInfoMap 
     * @throws BaseAppException <br>
     */ 
    public void getEntyIDFieldInfo(String entyID, HashMap<String, List<String>> entyIDDIMInfoMap,
            HashMap<String, List<String>> entyIDKPIInfoMap) throws BaseAppException {

        String sql = "";
        try {
            ParamArray pa = new ParamArray();
            sql = "SELECT COL_NO FROM SLM_ENTY_COL WHERE COL_TYPE = \'00\' AND ENTY_ID=\'" + entyID + "\'";
            List<HashMap<String, String>> slaList = this.queryList(sql, pa);
            List<String> dim = new ArrayList<String>();
            for (int i = 0; i < slaList.size(); i++) {
                dim.add(slaList.get(i).get("COL_NO").toUpperCase());
            }
            entyIDDIMInfoMap.put(entyID, dim);

            sql = "SELECT COL_NO FROM SLM_ENTY_COL WHERE COL_TYPE = \'01\' AND ENTY_ID=\'" + entyID + "\'";
            List<HashMap<String, String>> kpiList = this.queryList(sql, pa);
            List<String> kpi = new ArrayList<String>();
            for (int i = 0; i < kpiList.size(); i++) {
                kpi.add(kpiList.get(i).get("COL_NO").toUpperCase());
            }
            entyIDKPIInfoMap.put(entyID, kpi);
        } 
        catch (Exception e) {
            logger.error("execute getSLMEntyInfo sql[" + sql + "]");
            logger.error("getEntyIDFieldInfo error!", e);
        }
    }

    /* 获取预统计表SLM_ENTY_EXT_INFO信息 */
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param slmEntyExtInfoMap 
     * @throws BaseAppException <br>
     */ 
    public void getSLMEntyExtInfo(HashMap<String, SLMEntyExtInfoTask> slmEntyExtInfoMap) throws BaseAppException {

        ParamArray pa = new ParamArray();
        String sql = "SELECT DISTINCT A.ENTY_ID,B.ENTY_TABLE_CODE,A.CRT_TABLE_METH,A.CAL_CYCLE,A.CYCLE_UNITS "
                + "FROM SLM_ENTY_EXT_INFO A,SLM_ENTY_INFO B WHERE A.ENTY_ID = B.ENTY_ID ORDER BY ENTY_TABLE_CODE,CYCLE_UNITS";

        List<HashMap<String, String>> slaList = this.queryList(sql, pa);
        logger.debug("get enty info records[" + slaList.size() + "],last slmEntyExtInfoMap Size["
                + slmEntyExtInfoMap.size() + "]");
        slmEntyExtInfoMap.clear();
        for (int i = 0; i < slaList.size(); i++) {
            //int cal_cycle = Integer.parseInt(slaList.get(i).get("CAL_CYCLE"));
            String cycle_units = slaList.get(i).get("CYCLE_UNITS");
            String entyTableCode = slaList.get(i).get("ENTY_TABLE_CODE").toUpperCase();
            String entyID = slaList.get(i).get("ENTY_ID");
            String caculateCycle = DataStatistic.getCycle(cycle_units);
            if ("".equals(caculateCycle)) {
                continue;
            }
            String crtTableMeth = slaList.get(i).get("CRT_TABLE_METH");
            String cronExpression = DataStatistic.getCreateCron(crtTableMeth);
            if ("".equals(cronExpression)) {
                continue;
            }

            SLMEntyExtInfoTask info = new SLMEntyExtInfoTask();
            info.setjobName(entyTableCode + "_EVAL_" + caculateCycle);
            info.setjobGroup("CREATE_" + entyTableCode + "_GROUP");
            info.setcronExpression(cronExpression);
            info.setentyID(entyID);
            info.setentyTableCode(entyTableCode + "_EVAL");
            info.setcaculateCycle(caculateCycle);
            info.setcrtTableMeth(crtTableMeth);
            info.setinterfaceTableCode(entyTableCode);
            slmEntyExtInfoMap.put(info.getjobName(), info);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param statisticTask 
     * @throws BaseAppException <br>
     */ 
    public void insertStatisticTaskDB(HashMap<String, SLMBasicStatisticTask> statisticTask) throws BaseAppException {
        String sql = "";
        try {
            for (Entry<String, SLMBasicStatisticTask> entry : statisticTask.entrySet()) {
                SLMBasicStatisticTask task = entry.getValue();
                String _srcTableName = "";
                for (Entry<String, TimePeriod> _ret : task.srcTableMap.entrySet()) {
                    _srcTableName = _srcTableName + _ret.getKey() + "\n";
                }

                ParamArray pa = new ParamArray();
                sql = "INSERT INTO SLM_BASIC_STATISTIC_TASK(JOBNAME, JOBGROUP, WK, HH, MI, JOBSTATUS, "
                        + "CRONEXPRESSION, ENTYID, SRCTABLENAME, DSTTABLENAME, CACULATECYCLE, BTIME, "
                        + "ETIME, EXECUTETIME, INSERTTIME,SRCTABLEMAP_SIZE,INTERFACE_TABLE_CYCLE)" + "VALUES(\'"
                        + task.getJobName() + "\', \'" + task.getJobGroup() + "\', " + task.getWk() + "," + task.getHh()
                        + "," + task.getMi() + "," + task.getJobStatus() + ", \'" + task.getCronExpression() + "\', \'"
                        + task.getEntyID() + "\', \'" + _srcTableName + "\', \'" + task.getDstTableName() + "\', \'"
                        + task.getCaculateCycle() + "\', to_date('" + task.getBtime()
                        + "','yyyy-MM-dd hh24:mi:ss'), to_date('" + task.getEtime() + "','yyyy-MM-dd hh24:mi:ss'), "
                        + "to_date('1990-01-01 00:00:00','yyyy-MM-dd hh24:mi:ss'), to_date('" + task.getInsertTime()
                        + "','yyyy-MM-dd hh24:mi:ss')," + task.srcTableMap.size() + ",\'" + task.getCaculateCycle()
                        + "\')";

                int ret = executeUpdate(sql, pa);
                //entry.getValue().printJobInfo();
                logger.debug("[" + task.getJobName() + "] insert statistic sql result[" + ret + "]");
                logger.debug("[" + task.getJobName() + "] insert statistic task sql[" + sql + "]");
            }
        } 
        catch (Exception e) {
            logger.error("insert insertstatistic task sql[" + sql + "]");
            logger.error("insert insertstatistic task sql to db error!", e);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0 
     * @return r
     * @throws BaseAppException <br>
     */ 
    public int delete(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0 
     * @return r 
     * @throws BaseAppException <br>
     */ 
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void insert(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub

    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0 
     * @return r
     * @throws BaseAppException <br>
     */ 
    public HashMap selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return null;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param arg0 
     * @return r
     * @throws BaseAppException <br>
     */ 
    public int update(Object arg0) throws BaseAppException {
        // TODO Auto-generated method stub
        return 0;
    }

}
