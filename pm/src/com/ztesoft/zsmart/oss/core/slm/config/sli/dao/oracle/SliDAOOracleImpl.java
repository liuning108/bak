package com.ztesoft.zsmart.oss.core.slm.config.sli.dao.oracle;

import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.StringUtil;
import com.ztesoft.zsmart.oss.core.slm.config.sli.dao.SliDAO;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/**
 * 
 * SLI管理相关的Oracle DAO操作实现类 <br> 
 *  
 * @author lwch <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-9-18 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.config.sli.dao.oracle <br>
 */
public class SliDAOOracleImpl extends SliDAO {

    @Override
    /**
     * 
     * 通过更新SEQ的方式（SEQ=0为有效配置），删除SLI，删除SLI-SC关联关系 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliInfo
     * @return
     * @throws BaseAppException <br>
     */
    public int delete(DynamicDict sliInfo) throws BaseAppException {
        String sliNo = sliInfo.getString("SLI_NO");
        String scNo = sliInfo.getString("SC_ITEM_NO");
        updateSliSeqById(sliNo, selectMaxSliSeqById(sliNo));
        updateSliScSeqById(scNo, sliNo, selectMaxSliScSeqById(scNo, sliNo));
        return 0;
    }

    @Override
    /**
     * 
     * 新增SLI，新增SLI-SC的关联关系 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliInfo
     * @throws BaseAppException <br>
     */
    public void insert(DynamicDict sliInfo) throws BaseAppException {

        String insertSql = "INSERT INTO SLM_SLI_INFO" + 
                           "(SLI_NO,SLI_NAME,SEQ,UNITS,DIRECTION,IS_ATOM,SLI_FORMULA,STATE,DESCRIPTION,OPER_DATE,STAFF_ID,STAFF_JOB_ID)" + 
                           " VALUES " +
                           "(?,?,0,?,?,?,?,?,?,SYSDATE,?,?)";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("SLI_NO"));
        paramarray.set("", sliInfo.getString("SLI_NAME"));
        paramarray.set("", sliInfo.getString("UNITS"));
        paramarray.set("", sliInfo.getString("DIRECTION"));
        paramarray.set("", sliInfo.getString("IS_ATOM"));
        paramarray.set("", sliInfo.getString("SLI_FORMULA"));
        paramarray.set("", sliInfo.getString("STATE"));
        paramarray.set("", sliInfo.getString("DESCRIPTION"));
        paramarray.set("", SessionManage.getSession().getStaffId());
        paramarray.set("", SessionManage.getSession().getUserId());
        executeUpdate(insertSql, paramarray);

        insertSql = "INSERT INTO SLM_SLI_SC_ITEM(SC_ITEM_NO,SLI_NO,SEQ)VALUES(?,?,0)";
        paramarray = new ParamArray();
        paramarray.set("", sliInfo.getString("SC_ITEM_NO"));
        paramarray.set("", sliInfo.getString("SLI_NO"));
        executeUpdate(insertSql, paramarray);
    }

    @Override
    /**
     * 
     * 更新SLI,SLI-SC信息。 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliInfo
     * @return
     * @throws BaseAppException <br>
     */
    public int update(DynamicDict sliInfo) throws BaseAppException {
        delete(sliInfo);
        insert(sliInfo);
        return 0;
    }

    /**
     * 
     * 根据SLI_NO， SEQ = 0 更新SLM_SLI_INFO表SEQ为最大序列 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliNo <br>
     * @param seq <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private int updateSliSeqById(String sliNo, int seq) throws BaseAppException {

        if (seq < 0) {
            return 0;
        }

        String updateSql = "UPDATE SLM_SLI_INFO SET SEQ = ?,OPER_DATE = SYSDATE,STAFF_ID = ?, STAFF_JOB_ID = ? WHERE SLI_NO = ? AND SEQ = 0";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", seq + 1);
        paramarray.set("", SessionManage.getSession().getStaffId());
        paramarray.set("", SessionManage.getSession().getUserId());
        paramarray.set("", sliNo);
        return executeUpdate(updateSql, paramarray);
    }

    /**
     * 
     * 根据SC_ITEM_NO，SLI_NO， SEQ = 0 更新SLM_SLI_SC_ITEM表的SEQ为最大序列 <br> 
     * 
     * @author lwch <br>
     * @taskId <br>
     * @param scNo <br> 
     * @param sliNo <br> 
     * @param seq <br> 
     * @return <br> 
     * @throws BaseAppException <br>
     */
    private int updateSliScSeqById(String scNo, String sliNo, int seq) throws BaseAppException {

        if (seq < 0) {
            return 0;
        }

        String updateSql = "UPDATE SLM_SLI_SC_ITEM SET SEQ = ? WHERE SC_ITEM_NO = ? AND SLI_NO = ? AND SEQ = 0";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", seq + 1);
        paramarray.set("", scNo);
        paramarray.set("", sliNo);
        return executeUpdate(updateSql, paramarray);
    }

    /**
     * 
     * 根据SLI_NO 查询 SLM_SLI_INFO 表最大的SEQ序列值 <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param sliNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private int selectMaxSliSeqById(String sliNo) throws BaseAppException {
        String selectSql = "SELECT MAX(SEQ) FROM SLM_SLI_INFO WHERE SLI_NO = ?";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliNo);
        String seq = queryString(selectSql, paramarray);
        if (StringUtil.isEmpty(seq)) {
            return -1;
        }
        return Integer.parseInt(seq);
    }

    /**
     * 
     * 根据SC_ITEM_NO，SLI_NO 查询SLM_SLI_SC_ITEM 表最大的SEQ序列值  <br> 
     *  
     * @author lwch <br>
     * @taskId <br>
     * @param scNo <br>
     * @param sliNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    private int selectMaxSliScSeqById(String scNo, String sliNo) throws BaseAppException {
        String selectSql = "SELECT MAX(SEQ) FROM SLM_SLI_SC_ITEM WHERE SC_ITEM_NO = ? AND SLI_NO = ?";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", scNo);
        paramarray.set("", sliNo);
        String seq = queryString(selectSql, paramarray);
        if (StringUtil.isEmpty(seq)) {
            return -1;
        }
        return Integer.parseInt(seq);
    }

    @Override
    public HashMap<String, String> selectById(String sliNo) throws BaseAppException {
        String selectSql = "SELECT COUNT(1) COUNT " 
                         + "FROM SLM_SLI_INFO A " 
                         + "WHERE A.SEQ = 0 " 
                         + "AND A.SLI_NO = ? ";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliNo);
        return query(selectSql, paramarray);
    }

    @Override
    public List<HashMap<String, String>> selectSloBySli(String sliNo) throws BaseAppException {
        String selectSql = "SELECT DISTINCT B.SLO_NAME  " 
                         + "FROM SLM_SLO_SLI A, SLM_SLO_INFO B " 
                         + "WHERE A.SEQ = 0 " 
                         + "AND B.SEQ = 0 "
                         + "AND A.SLO_NO = B.SLO_NO " 
                         + "AND A.SLI_NO = ? ";
        ParamArray paramarray = new ParamArray();
        paramarray.set("", sliNo);
        return queryList(selectSql, paramarray);
    }
}
