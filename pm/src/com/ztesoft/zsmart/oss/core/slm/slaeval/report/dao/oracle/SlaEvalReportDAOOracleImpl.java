package com.ztesoft.zsmart.oss.core.slm.slaeval.report.dao.oracle;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.slm.slaaccept.model.SlaModel;
import com.ztesoft.zsmart.oss.core.slm.slaeval.report.dao.SlaEvalReportDAO;
import com.ztesoft.zsmart.oss.opb.util.SeqUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sla.dao.oracle <br>
 */
public class SlaEvalReportDAOOracleImpl extends SlaEvalReportDAO {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    /**
     
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    @Override
    public void qrySlaEvalReport(DynamicDict dict) throws BaseAppException {
        String slaInstId = dict.getString("SLA_INSTID");
        // String sttime = dict.getString("STTIME");
        String year = dict.getString("YEAR");
        String mon = dict.getString("MON");
        String quarter = dict.getString("QUARTER");
        ParamArray pa = new ParamArray();
        pa.set("", slaInstId);
        String table = "SLM_SLA_EVAL_WIN_INST_" + year;
        if (mon.length() > 1) {
            table += mon;
        }
        else {
            table += "0" + mon;
        }
        StringBuilder sql = new StringBuilder("")
            .append("SELECT ")
            .append("TASK_ID,INST_STATE,SLA_INSTID ")
            .append("FROM ")
            .append(table)
            .append(" WHERE INST_STATE = ( SELECT MAX(INST_STATE) FROM ")
            .append(table)
            .append(" WHERE SLA_INSTID=? ")
            .append(" AND");
        if (null != year) {
            sql.append(" YEAR=?");
            pa.set("", year);
        }
        if (null != mon) {
            sql.append(" AND MON=?");
            pa.set("", mon);
        }
        if (null != quarter) {
            sql.append(" AND QUARTER=?");
            pa.set("", quarter);
        }
        sql.append(") AND");
        if (null != year) {
            sql.append(" YEAR=?");
            pa.set("", year);
        }
        if (null != mon) {
            sql.append(" AND MON=?");
            pa.set("", mon);
        }
        if (null != quarter) {
            sql.append(" AND QUARTER=?");
            pa.set("", quarter);
        }
        List<HashMap<String, String>> slaInstList = this.queryList(sql.toString(), pa);
        dict.set("slaInstList", slaInstList);
        String taskId;
        if (slaInstList.size() > 0) {
            taskId = slaInstList.get(0).get("TASK_ID");
        }
        else {
            return;
        }
        qrySloSli(dict, taskId, year, mon); 
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @param taskId 
     * @param year 
     * @param mon 
     * @throws BaseAppException <br>
     */ 
    public void qrySloSli(DynamicDict dict, String taskId, String year, String mon) throws BaseAppException {
        String sloTable = "SLM_SLO_EVAL_WIN_INST_" + year;
        if (mon.length() > 1) {
            sloTable += mon;
        }
        else {
            sloTable += "0" + mon;
        }
        String sloSql = new StringBuilder("")
            .append("SELECT ")
            .append("DISTINCT SSE.SLO_INSTID,SSI.SLO_NAME,SSE.INST_STATE ")
            .append("FROM ")
            .append(sloTable)
            .append(" SSE LEFT JOIN SLM_SLO_INST SSI ON SSE.SLO_INSTID=SSI.SLO_INSTID WHERE TASK_ID=?").toString();
        ParamArray pa = new ParamArray();
        pa.set("", taskId);
        List<HashMap<String, String>> tmpSloList = this.queryList(sloSql, pa);
        List<HashMap<String, Object>> sloDetailList = new ArrayList<HashMap<String, Object>>();
        for (int i = 0; i < tmpSloList.size(); i++) {
            HashMap<String, String> tmpSlo = tmpSloList.get(i);
            HashMap<String, Object> slo = new HashMap<String, Object>();
            for (Map.Entry<String, String> entry : tmpSlo.entrySet()) {  
                slo.put(entry.getKey(), entry.getValue());                
            }
            sloDetailList.add(slo);
        }
        //
        String sliTable = "SLM_SLI_EVAL_WIN_INST_" + year;
        if (mon.length() > 1) {
            sliTable += mon;
        }
        else {
            sliTable += "0" + mon;
        }
        String sliSql = new StringBuilder("")
            .append("SELECT ")
            .append("BTIME AS STTIME,C.SLI_NAME,A.SLI_INSTID,SC_ITEM_INST_ID,B.DAYPATTERN_ID,B.TIMEPATTERN_ID,")
            .append("B.OBJECTIVES_VALUE,B.WARN_VALUE,A.SLI_VALUE,A.INST_STATE,C.UNITS,A.SLO_INSTID ")
            .append("FROM ")
            .append(sliTable)
            .append("  A,SLM_SLO_SLI_INST B,SLM_SLI_INFO C WHERE A.SLI_INSTID=B.SLI_INSTID AND B.SLI_NO=C.SLI_NO AND C.SEQ=0 AND A.TASK_ID=? ")
            .append("ORDER BY SLI_INSTID,BTIME").toString();
        List<HashMap<String, String>> sliList = this.queryList(sliSql, pa);
        for (int i = 0; i < sloDetailList.size(); i++) {
            String sloInstId = (String) sloDetailList.get(i).get("SLO_INSTID");
            List<Map<String, Object>> sloSliList = new ArrayList<Map<String, Object>>(); 
            for (int j = 0; j < sliList.size(); j++) {
                HashMap sliMap = sliList.get(j);
                if (sliMap.get("SLO_INSTID").equals(sloInstId)) {
                    /*HashMap sliMap = new HashMap();
                    sliMap.put("STTIME", "2016-09-01");
                    sliMap.put("SLI_NAME", "SLI1");
                    sliMap.put("SLI_INSTID", "SLI1");
                    sliMap.put("SC_ITEM_INST_NAME", "CP00001"); //SC_ITEM_INST_ID
                    sliMap.put("DAYPATTERN_TIMEPATTERN", "工作日-忙时"); //DAYPATTERN_ID TIMEPATTERN_ID
                    sliMap.put("OBJECTIVES_VALUE", "90");
                    sliMap.put("WARN_VALUE", "80");
                    sliMap.put("SLI_VALUE", "92");
                    sliMap.put("INST_STATE", "1");
                    sliMap.put("UNITS", "02");*/
                    sloSliList.add(sliMap);
                }
            }
            sloDetailList.get(i).put("sliList", sloSliList);
        }
        dict.set("sloDetailList", sloDetailList);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return int
     * @throws BaseAppException <br>
     */ 
    public int delete(SlaModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return int 
     * @throws BaseAppException <br>
     */ 
    public int deleteById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @throws BaseAppException <br>
     */ 
    public void insert(SlaModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return HashMap
     * @throws BaseAppException <br>
     */ 
    public HashMap<String, String> selectById(String arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return null;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return int
     * @throws BaseAppException <br>
     */ 
    public int update(SlaModel arg0) throws BaseAppException {
        // TODO Auto-generated method stub <br>
        return 0;
    }
    
    /**
     * SLA-YYYYMMDD-I6位序列 <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qrySlaInstId() throws BaseAppException {
        String slaInstId = SeqUtil.getSeq("SLM_SLA_INSTID");
        return slaInstId;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qrySloInstId() throws BaseAppException {
        String sloInstId = SeqUtil.getSeq("SLM_SLO_INSTID");
        return sloInstId;
    }   
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return sliInstId
     * @throws BaseAppException <br>
     */ 
    public String qrySliInstId() throws BaseAppException {
        String sliInstId = SeqUtil.getSeq("SLM_SLI_INSTID");
        return sliInstId;
    }   
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param slaNo 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qrySlaMaxSeq(String slaNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM SLM_SLA_INFO WHERE SLA_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", slaNo);
        String seq = queryString(sql, pa);
        return seq;
    }
    
}