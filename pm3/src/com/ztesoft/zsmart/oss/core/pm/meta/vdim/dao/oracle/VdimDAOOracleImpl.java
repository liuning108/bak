package com.ztesoft.zsmart.oss.core.pm.meta.vdim.dao.oracle;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.vdim.dao.VdimDAO;
import com.ztesoft.zsmart.oss.core.pm.meta.vdim.util.VdimSeqUtil;
import com.ztesoft.zsmart.oss.opb.util.SessionManage;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.vdim.dao.oracle <br>
 */
public class VdimDAOOracleImpl extends VdimDAO {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict  
     * @throws BaseAppException <br>
     */ 
    public void saveVdim(DynamicDict dict) throws BaseAppException {
        String vdim_code = dict.getString("VDIM_CODE");    
        if (null == vdim_code || "".equals(vdim_code)) {
            // 新建虚拟维度
            insertIntoPmVdim(dict);
            insertIntoPmVdimGroup(dict);
        } 
        else {
            // 修改虚拟维度
            deleteVdim(dict);
            insertIntoPmVdim(dict);
            insertIntoPmVdimGroup(dict);
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @return topicNo
     * @throws BaseAppException <br>
     */ 
    public String insertIntoPmVdim(DynamicDict dict) throws BaseAppException {
        String vdim_name = dict.getString("VDIM_NAME");
        String vdim_field = dict.getString("VDIM_FIELD");
        String vdim_type = dict.getString("VDIM_TYPE");
        String dim_code = dict.getString("DIM_CODE");
        String oper_user = SessionManage.getSession().getUserId();
        String vdim_code = dict.getString("VDIM_CODE");
        if ("".equals(vdim_code)) {
            vdim_code = qryVdimCode(vdim_field);
        }
        //
        String sql = "INSERT INTO PM_VDIM("
            + "VDIM_NAME,"
            + "VDIM_CODE,"
            + "FIELD_CODE,"
            + "GROUP_TYPE,"
            + "DIM_CODE,"
            + "OPER_DATE,"
            + "OPER_USER"
            + ")VALUES (?,?,?,?,?,sysdate,?)";
        ParamArray pa = new ParamArray();
        pa.set("", vdim_name);
        pa.set("", vdim_code);
        pa.set("", vdim_field);
        pa.set("", vdim_type);
        pa.set("", dim_code);
        pa.set("", oper_user);
        int insertNum = executeUpdate(sql, pa);
        if (insertNum == 0) {
            logger.error("Insert PM_VDIM fail\n  insertSQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Insert PM_VDIM fail ", ExceptionHandler.BUSS_ERROR);
        }      
        dict.set("VDIM_CODE", vdim_code);
        return vdim_code;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmVdimGroup(DynamicDict dict) throws BaseAppException {
        String vdim_code = dict.getString("VDIM_CODE");
        String vdim_type = dict.getString("VDIM_TYPE");
        String otherGroupName = dict.getString("NOGROUP_NAME");
        ArrayList<DynamicDict> groupList =  (ArrayList<DynamicDict>) dict.getList("groupList");   
        //
        String sql = "INSERT INTO PM_VDIM_GROUP("
            + "VDIM_CODE,"
            + "GROUP_NO,"
            + "GROUP_NAME,"
            + "GROUP_SEQ"
            + ")VALUES (?,?,?,?)";
        // 保存Other Group固定group_no为0
        ParamArray otherGroupPa = new ParamArray();
        otherGroupPa.set("", vdim_code);
        otherGroupPa.set("", "0");
        otherGroupPa.set("", otherGroupName);
        otherGroupPa.set("", 0);
        executeUpdate(sql, otherGroupPa);
        //
        for (int i = 0; i < groupList.size(); i++) {
            DynamicDict groupDict = groupList.get(i);
            String group_no = groupDict.getString("id");
            String group_name = groupDict.getString("name");
            String group_seq = (i + 1) + "";
            if ("0".equals(vdim_type)) {
                ArrayList<DynamicDict> itemList =  (ArrayList<DynamicDict>) groupDict.getList("items");   
                for (int j = 0; j < itemList.size(); j++) {
                    DynamicDict itemDict = itemList.get(j);
                    String itemId = itemDict.getString("id");
                    String detailSql = "INSERT INTO PM_VDIM_GROUP_DETAIL("
                        + "VDIM_CODE,"
                        + "GROUP_NO,"
                        + "GROUP_SEQ,"
                        + "GROUP_ATTR,"
                        + "GROUP_ATTR_SEQ"
                        + ")VALUES (?,?,?,?,?)";
                    ParamArray detailPa = new ParamArray();
                    detailPa.set("", vdim_code);
                    detailPa.set("", group_no);
                    detailPa.set("", group_seq);
                    detailPa.set("", itemId);
                    detailPa.set("", j);
                    executeUpdate(detailSql, detailPa);
                }
            } 
            else if ("1".equals(vdim_type)) { 
                String expression = groupDict.getString("expression");   
                String detailSql = "INSERT INTO PM_VDIM_GROUP_DETAIL("
                    + "VDIM_CODE,"
                    + "GROUP_NO,"
                    + "GROUP_SEQ,"
                    + "GROUP_ATTR,"
                    + "GROUP_ATTR_SEQ"
                    + ")VALUES (?,?,?,?,?)";
                ParamArray detailPa = new ParamArray();
                detailPa.set("", vdim_code);
                detailPa.set("", group_no);
                detailPa.set("", group_seq);
                detailPa.set("", expression);
                detailPa.set("", 0);
                executeUpdate(detailSql, detailPa);
            }
            ParamArray pa = new ParamArray();
            pa.set("", vdim_code);
            pa.set("", group_no);
            pa.set("", group_name);
            pa.set("", group_seq);
            executeUpdate(sql, pa);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void loadVdimList(DynamicDict dict) throws BaseAppException {
        String sql = "SELECT "
            + "VDIM_NAME,"
            + "VDIM_CODE,"
            + "FIELD_CODE,"
            + "GROUP_TYPE,"
            + "DIM_CODE,"
            + "OPER_DATE,"
            + "OPER_USER "
            + "FROM PM_VDIM ORDER BY VDIM_NAME,OPER_DATE DESC";
        ParamArray pa = new ParamArray();
        List<HashMap<String, String>> vdimList = this.queryList(sql, pa);
        dict.set("vdimList", vdimList);
        //
        String groupSql = "SELECT "
            + "VDIM_CODE,"
            + "GROUP_NO,"
            + "GROUP_NAME,"
            + "GROUP_SEQ "
            + "FROM PM_VDIM_GROUP";
        List<HashMap<String, String>> vdimGroupList = this.queryList(groupSql, pa);
        dict.set("vdimGroupList", vdimGroupList);
        //
        String detailSql = "SELECT "
            + "VDIM_CODE,"
            + "GROUP_NO,"
            + "GROUP_SEQ,"
            + "GROUP_ATTR,"
            + "GROUP_ATTR_SEQ "
            + "FROM PM_VDIM_GROUP_DETAIL";
        List<HashMap<String, String>> vdimGroupDetailList = this.queryList(detailSql, pa);
        dict.set("vdimGroupDetailList", vdimGroupDetailList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void deleteVdim(DynamicDict dict) throws BaseAppException {
        String vdim_code = dict.getString("VDIM_CODE");
        String sql = "DELETE FROM PM_VDIM_GROUP_DETAIL WHERE VDIM_CODE=?";
        ParamArray pa = new ParamArray();
        pa.set("", vdim_code);
        executeUpdate(sql, pa);
        //
        sql = "DELETE FROM PM_VDIM_GROUP WHERE VDIM_CODE=?";
        executeUpdate(sql, pa);
        //
        sql = "DELETE FROM PM_VDIM WHERE VDIM_CODE=?";
        executeUpdate(sql, pa);     
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qryTopicMaxSeq(String topicNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_LIST WHERE TOPIC_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        String seq = queryString(sql, pa);
        return seq;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qryTopicShareMaxSeq(String topicNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_SHARE WHERE TOPIC_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        String seq = queryString(sql, pa);
        return seq;
    }
    
    /**
     * [预加载虚拟维度名称] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br> 
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  qryTopicVdimAttr(DynamicDict dict) throws BaseAppException {       
        String sql = "SELECT "
            + "COL_NO,"
            + "ATTR_VALUE "
            + "FROM PM_TOPIC_GCOL_ATTR "
            + "WHERE ATTR_CODE='VDIM_NAME' AND SEQ=0";
        ParamArray pa = new ParamArray();
        List<HashMap<String, String>> vdimAttrList = this.queryList(sql, pa);
        dict.set("vdimAttrList", vdimAttrList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicGcolAttrParam(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        //
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "COL_TYPE,"
            + "SEQ,"
            + "ATTR_CODE,"
            + "ATTR_SEQ,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ "
            + "FROM PM_TOPIC_GCOL_ATTR_PARAM "
            + "WHERE TOPIC_NO=? AND SEQ=0 ORDER BY COL_NO,ATTR_SEQ, PARAM_SEQ";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> vdimGroupAttrList = this.queryList(sql, pa);
        dict.set("vdimGroupAttrList", vdimGroupAttrList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicLayout(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        //
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "DISPLAY_SEQ,"
            + "SEQ "
            + "FROM PM_TOPIC_LAYOUT "
            + "WHERE TOPIC_NO=? AND SEQ=0 ORDER BY DISPLAY_SEQ";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> chartOrderList = this.queryList(sql, pa);
        dict.set("chartOrderList", chartOrderList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicChartAttr(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        //
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "ATTR_NO,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ "
            + "FROM PM_TOPIC_ECHART_ATTR "
            + "WHERE TOPIC_NO=? AND SEQ=0 "
            + "ORDER BY ECHART_NO,ATTR_SEQ";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> topicChartAttrList = this.queryList(sql, pa);
        dict.set("topicChartAttrList", topicChartAttrList);
    }
    
    /**
     * [加载主题饼系图表的组属性] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicChartAxis(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        //
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "GROUP_NO,"
            + "GROUP_TITLE,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ "
            + "FROM PM_TOPIC_ECHART_AXIS "
            + "WHERE TOPIC_NO=? AND SEQ=0 "
            + "ORDER BY ECHART_NO,GROUP_NO";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> attrList = this.queryList(sql, pa);
        List<HashMap<String, String>> groupList = new ArrayList<HashMap<String, String>>();
        String ECHART_NO = ""; 
        String GROUP_NO = "";
        for (int i = 0; i < attrList.size(); i++) {
            HashMap<String, String> attrMap = attrList.get(i);
            String ECHART_NO_TMP = attrMap.get("ECHART_NO");
            String GROUP_NO_TMP = attrMap.get("GROUP_NO");
            String GROUP_TITLE = attrMap.get("GROUP_TITLE");
            String COL_TYPE = attrMap.get("COL_TYPE");
            String COL_NO = attrMap.get("COL_NO");
            if (!ECHART_NO.equals(ECHART_NO_TMP)) {
                ECHART_NO = ECHART_NO_TMP;
                GROUP_NO = GROUP_NO_TMP;
                HashMap<String, String> groupMap = new HashMap<String, String>();
                groupMap.put("ECHART_NO", ECHART_NO);
                groupMap.put("GROUP_NO", GROUP_NO);
                groupMap.put("GROUP_TITLE", GROUP_TITLE);
                if ("0".equals(COL_TYPE)) {
                    groupMap.put("DIM_NO", COL_NO);
                }
                else {
                    groupMap.put("KPI_NO", COL_NO);
                }
                groupList.add(groupMap);
            }
            else if (!GROUP_NO.equals(GROUP_NO_TMP)) {
                GROUP_NO = GROUP_NO_TMP;
                HashMap<String, String> groupMap = new HashMap<String, String>();
                groupMap.put("ECHART_NO", ECHART_NO);
                groupMap.put("GROUP_NO", GROUP_NO);
                groupMap.put("GROUP_TITLE", GROUP_TITLE);
                if ("0".equals(COL_TYPE)) {
                    groupMap.put("DIM_NO", COL_NO);
                }
                else {
                    groupMap.put("KPI_NO", COL_NO);
                }
                groupList.add(groupMap);
            }
            else {
                HashMap<String, String> groupMap = groupList.get(groupList.size() - 1);
                if ("0".equals(COL_TYPE)) {
                    groupMap.put("DIM_NO", COL_NO);
                }
                else {
                    groupMap.put("KPI_NO", COL_NO);
                }
            }
        }
        dict.set("groupList", groupList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicChartAttr(DynamicDict dict) throws BaseAppException {
        ArrayList<DynamicDict> topicChartAttrList =  (ArrayList<DynamicDict>) dict.getList("topicChartAttrList");
        String topicNo = dict.getString("topicNo");
        //
        String sql = "INSERT INTO PM_TOPIC_ECHART_ATTR("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "ATTR_NO,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ"
            + ")VALUES (?,?,0,?,?,?,?)";
        for (int i = 0; i < topicChartAttrList.size(); i++) {
            DynamicDict attrDict = topicChartAttrList.get(i);
            String attrCode = attrDict.getString("ATTR_CODE");
            String attrValue = attrDict.getString("ATTR_VALUE");
            if ((null == attrValue || "".equals(attrValue)) && !"drillColList".equals(attrCode)) {
                continue;
            }
            String attrNo = attrDict.getString("ATTR_NO");
            if ("groupList".equals(attrCode)) {
                insertIntoPmTopicChartAxis(dict, attrDict);
            }
            else {
                String echartNo = attrDict.getString("ECHART_NO");
                String attrSeq = attrDict.getString("ATTR_SEQ");
                ParamArray pa = new ParamArray();
                pa.set("", topicNo);
                pa.set("", echartNo);
                pa.set("", attrNo);
                pa.set("", attrCode);
                pa.set("", attrValue);
                pa.set("", attrSeq);
                executeUpdate(sql, pa);
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param newTopicNo 
     * @throws BaseAppException <br>
     */ 
    public void saveAsPmTopicChartAttr(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_ECHART_ATTR("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "ATTR_NO,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "ATTR_NO,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ "
            + "FROM PM_TOPIC_ECHART_ATTR WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
        saveAsPmTopicChartAxis(topicNo, newTopicNo);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @param attrDict 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicChartAxis(DynamicDict dict, DynamicDict attrDict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        //
        String sql = "INSERT INTO PM_TOPIC_ECHART_AXIS("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "GROUP_NO,"
            + "GROUP_TITLE,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ"
            + ")VALUES (?,?,0,?,?,?,?,0)";
        ArrayList<DynamicDict> groupList = (ArrayList<DynamicDict>) attrDict.getList("ATTR_VALUE");
        String attrNo = attrDict.getString("ATTR_NO");
        String attrCode = attrDict.getString("ATTR_CODE");
        String echartNo = attrDict.getString("ECHART_NO");
        String attrSeq = attrDict.getString("ATTR_SEQ");
        for (int i = 0; i < groupList.size(); i++) {
            // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
            DynamicDict group = groupList.get(i);
            String GROUP_NO = group.getString("GROUP_NO");
            String GROUP_TITLE = group.getString("GROUP_TITLE");
            String DIM_NO = group.getString("DIM_NO");
            String KPI_NO = group.getString("KPI_NO");
            //
            if (null != DIM_NO && !"".equals(DIM_NO)) {
                ParamArray dimPa = new ParamArray();
                dimPa.set("", topicNo);
                dimPa.set("", echartNo);
                dimPa.set("", GROUP_NO);
                dimPa.set("", GROUP_TITLE);
                dimPa.set("", 0);
                dimPa.set("", DIM_NO);
                executeUpdate(sql, dimPa);
            }
            //
            ParamArray kpiPa = new ParamArray();
            kpiPa.set("", topicNo);
            kpiPa.set("", echartNo);
            kpiPa.set("", GROUP_NO);
            kpiPa.set("", GROUP_TITLE);
            kpiPa.set("", 1);
            kpiPa.set("", KPI_NO);
            executeUpdate(sql, kpiPa);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br> 
     * @param topicNo 
     * @param newTopicNo 
     * @throws BaseAppException <br>
     */ 
    public void saveAsPmTopicChartAxis(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_ECHART_AXIS("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "GROUP_NO,"
            + "GROUP_TITLE,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "GROUP_NO,"
            + "GROUP_TITLE,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ "
            + "FROM PM_TOPIC_ECHART_AXIS WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicFilter(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        //
        String sql = "SELECT "
            + "PTF.TOPIC_NO,"
            + "PTF.FILTER_TYPE,"
            + "PTF.FILTER_OBJ_NO,"
            + "PTF.FIELD_NO,"
            + "PTF.FIELD_TYPE,"
            + "PTF.FIELD_FILTER_TYPE,"
            + "PTF.VIEW_TYPE,"
            + "PTF.SEQ," 
            + "PTFO.OPER_TYPE,"
            + "PTFV.PARAM_VALUE "
            + "FROM PM_TOPIC_FILTER PTF,PM_TOPIC_FILTER_OPER PTFO,PM_TOPIC_FIILTER_VALUE PTFV "
            + "WHERE PTF.TOPIC_NO=? AND PTF.TOPIC_NO=PTFO.TOPIC_NO AND PTF.FIELD_NO=PTFO.FIELD_NO "
            + "AND PTFO.OPER_NO=PTFV.OPER_NO AND PTF.SEQ=0 AND PTFO.SEQ=0 "
            + "ORDER BY PTFO.OPER_ORDER,PTFV.PARAM_SEQ";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> topicFilterList = this.queryList(sql, pa);
        dict.set("topicFilterList", topicFilterList);
        //
        sql = "SELECT "
            + "TOPIC_NO,"
            + "FILTER_TYPE,"
            + "FILTER_OBJ_NO,"
            + "FIELD_NO,"
            + "FIELD_TYPE,"
            + "FIELD_FILTER_TYPE,"
            + "VIEW_TYPE,"
            + "SEQ "
            + "FROM PM_TOPIC_FILTER "
            + "WHERE TOPIC_NO=? AND FIELD_FILTER_TYPE='2' AND SEQ=0";
        List<HashMap<String, String>> topicEmptyFilterList = this.queryList(sql, pa);
        dict.set("topicEmptyFilterList", topicEmptyFilterList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicFilter(DynamicDict dict) throws BaseAppException {
        ArrayList<DynamicDict> topicFilterList =  (ArrayList<DynamicDict>) dict.getList("topicFilterList");
        String topicNo = dict.getString("topicNo");
        //
        String sql = "INSERT INTO PM_TOPIC_FILTER("
            + "TOPIC_NO,"
            + "FILTER_TYPE,"
            + "FILTER_OBJ_NO,"
            + "FIELD_NO,"
            + "FIELD_TYPE,"
            + "FIELD_FILTER_TYPE,"
            + "VIEW_TYPE,"
            + "SEQ"
            + ")VALUES (?,?,?,?,?,?,?,0)";
        for (int i = 0; i < topicFilterList.size(); i++) {
            DynamicDict filterDict = topicFilterList.get(i);
            String filterType = filterDict.getString("FILTER_TYPE");
            String objNo = filterDict.getString("FILTER_OBJ_NO");
            String fieldNo = filterDict.getString("FIELD_NO");
            String fieldType = filterDict.getString("FIELD_TYPE");
            String fieldFilterType = filterDict.getString("FIELD_FILTER_TYPE");
            String viewType = filterDict.getString("VIEW_TYPE");
            ParamArray pa = new ParamArray();
            pa.set("", topicNo);
            pa.set("", filterType);
            pa.set("", objNo);
            pa.set("", fieldNo);
            pa.set("", fieldType);
            pa.set("", fieldFilterType);
            pa.set("", viewType);
            executeUpdate(sql, pa);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param newTopicNo 
     * @throws BaseAppException <br>
     */ 
    public void  saveAsPmTopicFilter(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_FILTER("
            + "TOPIC_NO,"
            + "FILTER_TYPE,"
            + "FILTER_OBJ_NO,"
            + "FIELD_NO,"
            + "FIELD_TYPE,"
            + "FIELD_FILTER_TYPE,"
            + "VIEW_TYPE,"
            + "SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "FILTER_TYPE,"
            + "FILTER_OBJ_NO,"
            + "FIELD_NO,"
            + "FIELD_TYPE,"
            + "FIELD_FILTER_TYPE,"
            + "VIEW_TYPE,"
            + "SEQ "
            + "FROM PM_TOPIC_FILTER WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicFilterOper(DynamicDict dict) throws BaseAppException {
        ArrayList<DynamicDict> topicFilterOperList =  (ArrayList<DynamicDict>) dict.getList("topicFilterOperList");
        String topicNo = dict.getString("topicNo");
        // 筛选器筛选方式表
        String sql = "INSERT INTO PM_TOPIC_FILTER_OPER("
            + "TOPIC_NO,"
            + "FIELD_NO,"
            + "SEQ,"
            + "OPER_NO,"
            + "OPER_TYPE,"
            + "OPER_ORDER,"
            + "FILTER_VALUE"
            + ")VALUES (?,?,0,?,?,?,?)";
        // 筛选器筛选值表
        String filterValueSql = "INSERT INTO PM_TOPIC_FIILTER_VALUE("
            + "OPER_NO,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ"
            + ")VALUES (?,?,?)";
        for (int i = 0; i < topicFilterOperList.size(); i++) {
            DynamicDict operDict = topicFilterOperList.get(i);
            String fieldNo = operDict.getString("FIELD_NO");
            String operNo = qryOperNo();
            String paramValue = operDict.getString("PARAM_VALUE");
            String operType = operDict.getString("OPER_TYPE");
            String operOrder = operDict.getString("OPER_ORDER");
            String filterValue = operDict.getString("FILTER_VALUE");
            if ((null != filterValue && !"".equals(filterValue)) || (null != paramValue && !"".equals(paramValue))) {
                ParamArray pa = new ParamArray();
                pa.set("", topicNo);
                pa.set("", fieldNo);
                pa.set("", operNo);
                pa.set("", operType);
                pa.set("", operOrder);
                pa.set("", filterValue);
                executeUpdate(sql, pa);
                ParamArray filterValuePa = new ParamArray();
                filterValuePa.set("", operNo);
                filterValuePa.set("", paramValue);
                filterValuePa.set("", i);
                executeUpdate(filterValueSql, filterValuePa);
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param newTopicNo 
     * @throws BaseAppException <br>
     */ 
    public void  saveAsPmTopicFilterOper(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "SELECT "
            + "A.TOPIC_NO,"
            + "A.FIELD_NO,"
            + "A.SEQ,"
            + "A.OPER_NO,"
            + "A.OPER_TYPE,"
            + "A.OPER_ORDER,"
            + "A.FILTER_VALUE,"
            + "B.PARAM_VALUE "
            + "FROM PM_TOPIC_FILTER_OPER A,PM_TOPIC_FIILTER_VALUE B WHERE TOPIC_NO=? AND A.OPER_NO=B.OPER_NO AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> dataList = this.queryList(sql, pa);
        //
        sql = "INSERT INTO PM_TOPIC_FILTER_OPER("
            + "TOPIC_NO,"
            + "FIELD_NO,"
            + "SEQ,"
            + "OPER_NO,"
            + "OPER_TYPE,"
            + "OPER_ORDER,"
            + "FILTER_VALUE"
            + ")VALUES (?,?,0,?,?,?,?)";
        String filterValueSql = "INSERT INTO PM_TOPIC_FIILTER_VALUE("
            + "OPER_NO,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ"
            + ")VALUES (?,?,?)";
        for (int i = 0; i < dataList.size(); i++) {
            HashMap<String, String> dataMap = dataList.get(i);
            String fieldNo = dataMap.get("FIELD_NO");
            String operNo = qryOperNo();
            String paramValue = dataMap.get("PARAM_VALUE");
            String operType = dataMap.get("OPER_TYPE");
            String operOrder = dataMap.get("OPER_ORDER");
            String filterValue = dataMap.get("FILTER_VALUE");
            ParamArray innerPa = new ParamArray();
            innerPa.set("", newTopicNo);
            innerPa.set("", fieldNo);
            innerPa.set("", operNo);
            innerPa.set("", operType);
            innerPa.set("", operOrder);
            innerPa.set("", filterValue);
            executeUpdate(sql, innerPa);
            //
            ParamArray filterValuePa = new ParamArray();
            filterValuePa.set("", operNo);
            filterValuePa.set("", paramValue);
            filterValuePa.set("", i);
            executeUpdate(filterValueSql, filterValuePa);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicChart(DynamicDict dict) throws BaseAppException {
        String topicNo = dict.getString("topicNo");
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "ECHART_NAME,"
            + "TOPIC_SUB_NAME,"
            + "ECHART_TYPE,"
            + "ECHART_SEQ,"
            + "SEQ "
            + "FROM PM_TOPIC_ECHART "
            + "WHERE TOPIC_NO=? AND SEQ=0 "
            + "ORDER BY ECHART_SEQ";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        List<HashMap<String, String>> topicChartList = this.queryList(sql, pa);
        dict.set("topicChartList", topicChartList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicChart(DynamicDict dict) throws BaseAppException {
        ArrayList<DynamicDict> topicChartList =  (ArrayList<DynamicDict>) dict.getList("topicChartList");
        String topicNo = dict.getString("topicNo");
        // 筛选器筛选方式表
        String sql = "INSERT INTO PM_TOPIC_ECHART("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "ECHART_NAME,"
            + "TOPIC_SUB_NAME,"
            + "ECHART_TYPE,"
            + "ECHART_SEQ,"
            + "SEQ"
            + ")VALUES (?,?,?,?,?,?,0)";
        for (int i = 0; i < topicChartList.size(); i++) {
            DynamicDict chartDict = topicChartList.get(i);
            String echartNo = chartDict.getString("ECHART_NO");
            String echartName = chartDict.getString("ECHART_NAME");
            String topicSubName = chartDict.getString("TOPIC_SUB_NAME");
            String echartType = chartDict.getString("ECHART_TYPE");
            String echartSeq = chartDict.getString("ECHART_SEQ");
            ParamArray pa = new ParamArray();
            pa.set("", topicNo);
            pa.set("", echartNo);
            pa.set("", echartName);
            pa.set("", topicSubName);
            pa.set("", echartType);
            pa.set("", echartSeq);
            executeUpdate(sql, pa);
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param newTopicNo 
     * @throws BaseAppException <br>
     */ 
    public void  saveAsPmTopicChart(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_ECHART("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "ECHART_NAME,"
            + "TOPIC_SUB_NAME,"
            + "ECHART_TYPE,"
            + "ECHART_SEQ,"
            + "SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "ECHART_NO,"
            + "ECHART_NAME,"
            + "TOPIC_SUB_NAME,"
            + "ECHART_TYPE,"
            + "ECHART_SEQ,"
            + "SEQ "
            + "FROM PM_TOPIC_ECHART WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
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
        return 0;
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
        return null;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryClassNo() throws BaseAppException {
        String classNo = VdimSeqUtil.getAdhocSeq("PMS", "TC", 8, "PM_ADHOC_SEQ");
        return classNo;
    }
    
    /**
     * [分组字段物理编码_YYMMDDHH24MISS] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param vdim_field 
     * @return vdimCode
     * @throws BaseAppException <br>
     */ 
    public String qryVdimCode(String vdim_field) throws BaseAppException {
        Date nowTime = new Date(); 
        SimpleDateFormat time = new SimpleDateFormat("yyyyMMddHHmmss"); 
        String vdimCode = vdim_field + "_" + time.format(nowTime);
        return vdimCode;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return operNo
     * @throws BaseAppException <br>
     */ 
    public String qryOperNo() throws BaseAppException {
        String operNo = VdimSeqUtil.getAdhocSeq("PMS", "OP", 8, "PM_ADHOC_SEQ");
        return operNo;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param classNo 
     * @return seq
     * @throws BaseAppException <br>
     */ 
    public String qryClassNoMaxSeq(String classNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_CLASS WHERE CLASS_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", classNo);
        String seq = queryString(sql, pa);
        return seq;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param classType 
     * @param operUser 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryTopicSysclassMaxSeq(String topicNo, String classType, String operUser) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_SYSCLASS WHERE TOPIC_NO=? AND CLASS_TYPE=? AND OPER_USER=?";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        pa.set("", classType);
        pa.set("", operUser);
        String seq = queryString(sql, pa);
        return seq;
    }
    
    /**
     * [不带用户信息的最大序列 用于删除主题时 级联删除所有收藏夹和最近浏览记录] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryTopicSysclassMaxSeqWithoutUser(String topicNo) throws BaseAppException {
        String sql = "SELECT MAX(SEQ)+1 FROM PM_TOPIC_SYSCLASS WHERE TOPIC_NO=?";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        String seq = queryString(sql, pa);
        return seq;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dateGranu _H _D _W _M 
     * @param dateGranuType 
     * @return btime
     * @throws BaseAppException <br>
     */ 
    public String[] getBtimeAndEtime(String dateGranu, String dateGranuType) throws BaseAppException {
        Date nowDate = new Date(); 
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
        String nowTime = sdf.format(nowDate);
        String btime = "";
        String etime = "";
        //
        if ("1".equals(dateGranuType)) {
            // 本月
            if ("_D".equals(dateGranu) || "_W".equals(dateGranu)) {
                btime = sdf.format(getTimesMonthmorning());
                etime = sdf.format(getTimesMonthnight());
            }
            // 今天
            else if ("_H".equals(dateGranu)) {
                btime = sdf.format(getTimesmorning());
                etime = sdf.format(getTimesnight());
            }
            // 今年
            else if ("_M".equals(dateGranu)) {
                btime = sdf.format(getTimesYearmorning());
                etime = sdf.format(getTimesYearnight());
            }
        }
        else if ("-1".equals(dateGranuType)) {
            // 上月
            if ("_D".equals(dateGranu) || "_W".equals(dateGranu)) {
                btime = sdf.format(getLastMonthmorning(-1));
                etime = sdf.format(getLastMonthnight());
            }
            // 昨天
            else if ("_H".equals(dateGranu)) {
                btime = sdf.format(getLastmorning(-1));
                etime = sdf.format(getLastnight());
            }
            // 去年
            else if ("_M".equals(dateGranu)) {
                btime = sdf.format(getLastYearmorning());
                etime = sdf.format(getLastYearnight());
            }
        }
        else {
            int dateGranuTypeValue = Integer.parseInt(dateGranuType);
            // 最近N天
            if ("_D".equals(dateGranu)) {
                btime = sdf.format(getLastmorning(-dateGranuTypeValue));
                etime = sdf.format(getTimesnight());
            }
            // 最近N小时
            else if ("_H".equals(dateGranu)) {
                btime = sdf.format(getLastHour(-dateGranuTypeValue));
                etime = nowTime;
            }
            // 最近N月
            else if ("_M".equals(dateGranu)) {
                btime = sdf.format(getLastMonthmorning(-dateGranuTypeValue));
                etime = sdf.format(getTimesMonthnight());
            }
            // 最近N周
            else if ("_W".equals(dateGranu)) {
                btime = sdf.format(getLastWeekmorning(-dateGranuTypeValue * 7));
                etime = sdf.format(getTimesWeeknight());
            }
        }
        String[] ret = new String[2];
        ret[0] = btime;
        ret[1] = etime;
        return ret;
    }
    
    /**
     * [获得本月第一天0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesMonthmorning() {
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return cal.getTime();
    }
    
    /**
     * [获得本月最后一天24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesMonthnight() {
        Calendar cal = Calendar.getInstance();  
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);  
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));  
        cal.set(Calendar.HOUR_OF_DAY, 24);  
        return cal.getTime();  
    }
    
    /**
     * [获得当天0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesmorning() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    /**
     * [获得当天24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesnight() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 24);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return  cal.getTime();
    }
    
    /**
     * [前N小时] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param value 
     * @return <br>
     */ 
    public Date getLastHour(int value) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR_OF_DAY, value);  
        return  cal.getTime();
    }
    
    /**
     * [获得本年第一天0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesYearmorning() {
        Calendar cal = Calendar.getInstance();  
        cal.set(cal.get(Calendar.YEAR), 0, cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);  
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.YEAR));  
        return cal.getTime();  
    }
    
    /**
     * [获得本年最后一天24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesYearnight() {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesYearmorning());  
        cal.add(Calendar.YEAR, 1);  
        return cal.getTime();  
    }
    
    /////////////////////////////////
    /**
     * [获得上月第一天0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param value 
     * @return <br>
     */ 
    public Date getLastMonthmorning(int value) {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesMonthmorning());  
        cal.add(Calendar.MONTH, value);  
        return cal.getTime();  
    }
    
    /**
     * [获得上月最后一天24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getLastMonthnight() {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesMonthnight());  
        cal.add(Calendar.MONTH, -1);  
        return cal.getTime();  
    }
    
    /**
     * [获得昨天0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param value 
     * @return <br>
     */ 
    public Date getLastmorning(int value) {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesmorning());  
        cal.add(Calendar.DAY_OF_MONTH, value);  
        return cal.getTime();  
    }

    /**
     * [获得昨天24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getLastnight() {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesnight());  
        cal.add(Calendar.DAY_OF_MONTH, -1);  
        return cal.getTime();  
    }
        
    /**
     * [获得去年第一天0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getLastYearmorning() {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesYearmorning());  
        cal.add(Calendar.YEAR, -1);  
        return cal.getTime();  
    }
    
    /**
     * [获得去年最后一天24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getLastYearnight() {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesYearnight());  
        cal.add(Calendar.YEAR, -1);  
        return cal.getTime();  
    }
    
    /**
     * [获得本周一0点时间 ] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesWeekmorning() {  
        Calendar cal = Calendar.getInstance();  
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);  
        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);  
        return cal.getTime();  
    }  
    
    /**
     * [获取上周一0点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param value 
     * @return <br>
     */ 
    public Date getLastWeekmorning(int value) {
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesWeekmorning());  
        cal.add(Calendar.DAY_OF_WEEK, value);  
        return cal.getTime();  
    } 
    
    /**
     * [获得本周日24点时间] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return <br>
     */ 
    public Date getTimesWeeknight() {  
        Calendar cal = Calendar.getInstance();  
        cal.setTime(getTimesWeekmorning());  
        cal.add(Calendar.DAY_OF_WEEK, 7);  
        return cal.getTime();  
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return 0
     * @throws BaseAppException <br>
     */ 
    @Override
    public int delete(Object arg0) throws BaseAppException {
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
    @Override
    public void insert(Object arg0) throws BaseAppException {
        
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 
     * @return 0
     * @throws BaseAppException <br>
     */
    @Override
    public int update(Object arg0) throws BaseAppException {
        return 0;
    }
}