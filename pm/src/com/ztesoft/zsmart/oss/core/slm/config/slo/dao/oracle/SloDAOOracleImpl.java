package com.ztesoft.zsmart.oss.core.slm.config.slo.dao.oracle;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.StringUtil;
import com.ztesoft.zsmart.oss.core.slm.config.slo.dao.SloDAO;
import com.ztesoft.zsmart.oss.core.slm.util.SlmSeqUtil;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * SLO管理相关的Oracle DAO操作实现类 <br>
 * 
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.slo.dao.oracle <br>
 */
public class SloDAOOracleImpl extends SloDAO {

    @Override
    public List<HashMap<String, String>> selectServiceSloCatalog() throws BaseAppException {
        String selectSql = "SELECT SLO_NO,SLO_NO ID,SC_ITEM_NO PARENT_ID,SLO_NAME NAME,'slo' NODE_TYPE " 
                         + "FROM SLM_SLO_INFO " 
                         + "WHERE SEQ = 0";
        return queryList(selectSql, null);
    }

    @Override
    public HashMap<String, String> selectSloInfoByNo(DynamicDict dict) throws BaseAppException {
        String selectSql = "SELECT SC_ITEM_NO,SLO_NO,SLO_NAME,CYCLE_UNITS,TIME_WIN,STATE,DESCRIPTION " 
                         + "FROM SLM_SLO_INFO " + "WHERE SLO_NO = ? "
                         + "AND SEQ = 0";
        ParamArray paramArray = new ParamArray();
        paramArray.set("", dict.getString("SLO_NO"));
        return query(selectSql, paramArray);
    }

    @Override
    public List<HashMap<String, String>> selectSloRuleInfoByNo(DynamicDict dict) throws BaseAppException {
        String selectSql = "SELECT A.RULE_ID,A.SC_ITEM_NO,A.SLO_NO,A.SLI_NO,A.DAYPATTERN_ID,A.TIMEPATTERN_ID,"
                         + "       A.OPERATOR,A.OBJECTIVES_VALUE,A.WARN_VALUE,A.DESCRIPTION,B.SLI_NAME,B.UNITS,B.DIRECTION " 
                         + "FROM SLM_SLO_SLI A, SLM_SLI_INFO B "
                         + "WHERE A.SLO_NO = ? " 
                         + "AND A.SLI_NO = B.SLI_NO " 
                         + "AND B.STATE = '00' " 
                         + "AND A.SEQ = 0 " 
                         + "AND B.SEQ = 0";
        ParamArray paramArray = new ParamArray();
        paramArray.set("", dict.getString("SLO_NO"));
        return queryList(selectSql, paramArray);
    }

    @SuppressWarnings("unchecked")
    @Override
    public void insert(DynamicDict sloInfo) throws BaseAppException {

        String sloNo = (String) sloInfo.getValueByName("SLO_NO", SlmSeqUtil.getSlmSeq("SLO", "S", 6, "SLM_SLO_NO"));
        sloInfo.set("SLO_NO", sloNo);

        String insertSql = "INSERT INTO SLM_SLO_INFO" + 
                           "(SC_ITEM_NO,SLO_NO,SLO_NAME,SEQ,CYCLE_UNITS,TIME_WIN,STATE,DESCRIPTION,CREATE_DATE," + 
                           "OPER_DATE,STAFF_ID,STAFF_JOB_ID) " + 
                           "VALUES (?,?,?,0,?,?,?,?,SYSDATE,SYSDATE,?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sloInfo.getString("SC_ITEM_NO"));
        paramarray.set("", sloNo);
        paramarray.set("", sloInfo.getString("SLO_NAME"));
        paramarray.set("", sloInfo.getString("CYCLE_UNITS"));
        paramarray.set("", sloInfo.getString("TIME_WIN"));
        paramarray.set("", sloInfo.getString("STATE"));
        paramarray.set("", sloInfo.getString("DESCRIPTION"));
        paramarray.set("", SessionManage.getSession().getStaffId());
        paramarray.set("", SessionManage.getSession().getUserId());
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO SLM_SLO_SLI" + 
                    "(RULE_ID,SC_ITEM_NO,SLO_NO,SLI_NO,SEQ,DAYPATTERN_ID,TIMEPATTERN_ID,OPERATOR," + 
                    "OBJECTIVES_VALUE,WARN_VALUE,DESCRIPTION,OPER_DATE,STAFF_ID,STAFF_JOB_ID) " + 
                    "VALUES (?,?,?,?,0,?,?,?,?,?,?,SYSDATE,?,?)";
        List<DynamicDict> ruleList = sloInfo.getList("RULE_DATA");
        for (DynamicDict ruleInfo : ruleList) {

            String ruleId = (String) ruleInfo.getValueByName("RULE_ID", SlmSeqUtil.getSlmSeq("SLI", "S", 6, "SLM_SLO_RULE_ID"));

            paramarray = new ParamArray();
            paramarray.set("", ruleId);
            paramarray.set("", ruleInfo.getString("SC_ITEM_NO"));
            paramarray.set("", sloNo);
            paramarray.set("", ruleInfo.getString("SLI_NO"));
            paramarray.set("", ruleInfo.getString("DAYPATTERN_ID"));
            paramarray.set("", ruleInfo.getString("TIMEPATTERN_ID"));
            paramarray.set("", ruleInfo.getString("OPERATOR"));
            paramarray.set("", ruleInfo.getString("OBJECTIVES_VALUE"));
            paramarray.set("", ruleInfo.getString("WARN_VALUE"));
            paramarray.set("", ruleInfo.getString("DESCRIPTION"));
            paramarray.set("", SessionManage.getSession().getStaffId());
            paramarray.set("", SessionManage.getSession().getUserId());
            executeUpdate(insertSql, paramarray);
        }

    }

    @Override
    public int update(DynamicDict sloInfo) throws BaseAppException {
        delete(sloInfo);
        insert(sloInfo);
        return 0;
    }

    @Override
    public int delete(DynamicDict sloInfo) throws BaseAppException {
        String sloNo = sloInfo.getString("SLO_NO");
        updateSloSeqById(sloNo, selectMaxSloSeqById(sloNo));
        updateSloSliSeqById(sloNo, selectMaxSloSliSeqById(sloNo));
        return 0;
    }

    /**
     * 
     * 根据SLO_NO， SEQ = 0 更新SLM_SLO_INFO表SEQ为最大序列 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloNo <br>
     * @param seq <br>
     * @return int <br>
     * @throws BaseAppException <br>
     */
    private int updateSloSeqById(String sloNo, int seq) throws BaseAppException {
        if (seq < 0) {
            return 0;
        }
        String updateSql = "UPDATE SLM_SLO_INFO SET SEQ = ?,OPER_DATE = SYSDATE,STAFF_ID = ?, STAFF_JOB_ID = ? " + "WHERE SLO_NO = ? AND SEQ = 0";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", seq + 1);
        paramarray.set("", SessionManage.getSession().getStaffId());
        paramarray.set("", SessionManage.getSession().getUserId());
        paramarray.set("", sloNo);
        return executeUpdate(updateSql, paramarray);
    }

    /**
     * 
     * 根据SLO_NO， SEQ = 0 更新SLM_SLO_SLI表SEQ为最大序列 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloNo <br>
     * @param seq <br>
     * @return int <br>
     * @throws BaseAppException <br>
     */
    private int updateSloSliSeqById(String sloNo, int seq) throws BaseAppException {
        if (seq < 0) {
            return 0;
        }
        String updateSql = "UPDATE SLM_SLO_SLI SET SEQ = ?,OPER_DATE = SYSDATE,STAFF_ID = ?, STAFF_JOB_ID = ? " + "WHERE SLO_NO = ? AND SEQ = 0";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", seq + 1);
        paramarray.set("", SessionManage.getSession().getStaffId());
        paramarray.set("", SessionManage.getSession().getUserId());
        paramarray.set("", sloNo);
        return executeUpdate(updateSql, paramarray);
    }

    /**
     * 
     * 根据SLO_NO 查询SLM_SLO_INFO 表最大的SEQ序列值 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloNo <br>
     * @return int <br>
     * @throws BaseAppException <br>
     */
    private int selectMaxSloSeqById(String sloNo) throws BaseAppException {
        String selectSql = "SELECT MAX(SEQ) FROM SLM_SLO_INFO WHERE SLO_NO = ?";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sloNo);
        String seq = queryString(selectSql, paramarray);
        if (StringUtil.isEmpty(seq)) {
            return -1;
        }
        return Integer.parseInt(seq);
    }

    /**
     * 
     * 根据SLI_NO 查询SLM_SLO_SLI 表最大的SEQ序列值 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sloNo <br>
     * @return int <br>
     * @throws BaseAppException <br>
     */
    private int selectMaxSloSliSeqById(String sloNo) throws BaseAppException {
        String selectSql = "SELECT MAX(SEQ) FROM SLM_SLO_SLI WHERE SLO_NO = ?";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sloNo);
        String seq = queryString(selectSql, paramarray);
        if (StringUtil.isEmpty(seq)) {
            return -1;
        }
        return Integer.parseInt(seq);
    }

    @Override
    public List<HashMap<String, String>> selectSlaBySlo(String sloNo) throws BaseAppException {
        String selectSql = "SELECT DISTINCT B.SLA_NAME  " 
                         + "FROM SLM_SLA_SLO A, SLM_SLA_INFO B " 
                         + "WHERE A.SEQ = 0 " 
                         + "AND B.SEQ = 0 " 
                         + "AND A.SLA_NO = B.SLA_NO " 
                         + "AND A.SLO_NO = ? ";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sloNo);
        return queryList(selectSql, paramarray);
    }

}
