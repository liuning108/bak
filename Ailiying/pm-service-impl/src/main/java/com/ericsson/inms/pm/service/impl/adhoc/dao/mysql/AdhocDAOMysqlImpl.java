/**************************************************************************************** 
 Copyright © 2003-2012 ZTEsoft Corporation. All rights reserved. Reproduction or       <br>
 transmission in whole or in part, in any form or by any means, electronic, mechanical <br>
 or otherwise, is prohibited without the prior written consent of the copyright owner. <br>
 ****************************************************************************************/

package com.ericsson.inms.pm.service.impl.adhoc.dao.mysql;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.log.ZSmartLogger;
import com.ztesoft.zsmart.core.spring.SpringContext;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;
import com.ericsson.inms.pm.api.service.meta.dim.DimService;
import com.ericsson.inms.pm.api.service.meta.model.busi.ModelBusiService;
import com.ericsson.inms.pm.service.impl.adhoc.dao.AdhocDAO;
import com.ericsson.inms.pm.service.impl.adhoc.util.AdhocSeqUtil;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ztesoft.zsmart.pot.session.PrincipalUtil;

/** 
 * [描述] <br> 
 *  
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2018年4月16日 <br>
 * @since V7.0<br>
 * @see com.ericsson.itnms.templatemgr.dao.mysql <br>
 */
public class AdhocDAOMysqlImpl extends AdhocDAO {

    /**
     * logger <br>
     */
    private static final ZSmartLogger LOG = ZSmartLogger.getLogger(AdhocDAOMysqlImpl.class);
    
    @Override
    public String addTopicClass(Map<String, Object> params) throws BaseAppException {
        String classNo = "" + params.get("classNo");
        String className = "" + params.get("className");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        if (null == classNo || "".equals(classNo) || "null".equals(classNo)) {
            classNo = this.qryClassNo();
        }
        String sql = "INSERT INTO PM_TOPIC_CLASS("
            + "CLASS_NO,"
            + "CLASS_NAME,"
            + "SEQ,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID"
            + ")VALUES (?,?,0,?,now(),null)";
        update(sql, new Object[] {classNo, className, operUser});
        return classNo;
    }
    
    @Override
    public String saveSharedTopic(Map<String, Object> params) throws BaseAppException {
        String saveType = "" + params.get("saveType");
        if ("0".equals(saveType)) {
            saveSharedTopicAsLink(params);
        }
        else if ("1".equals(saveType)) {
            String classNo = "" + params.get("classNo");
            Long operUser = PrincipalUtil.getPrincipal().getUserId();
            List<Map<String, Object>> selectedTopics = (List<Map<String, Object>>) params.get("selectedTopics");
            for (int i = 0; i < selectedTopics.size(); i++) {
                Map<String, Object> topicDict = selectedTopics.get(i);
                String topicNo = "" + topicDict.get("id");
                saveSharedTopicAsTopic(topicNo, classNo, operUser);
            }
        }
        return "1";
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param classNo 
     * @param operUser 
     * @throws BaseAppException <br>
     */ 
    public void saveSharedTopicAsTopic(String  topicNo, String classNo, long operUser) throws BaseAppException {
        String newTopicNo = qryTopicNo();
        saveAsPmTopicList(topicNo, newTopicNo, classNo, operUser);
        //PM_TOPIC_GCOL维度指标概况
        saveAsPmTopicGcol(topicNo, newTopicNo);
        // PM_TOPIC_GCOL_ATTR维度指标属性
        saveAsPmTopicGcolAttr(topicNo, newTopicNo);
        // PM_TOPIC_FILTER主题筛选器
        saveAsPmTopicFilter(topicNo, newTopicNo);
        // PM_TOPIC_FILTER_OPER筛选器筛选方式
        saveAsPmTopicFilterOper(topicNo, newTopicNo);
        // PM_TOPIC_ECHART主题图表概况
        saveAsPmTopicChart(topicNo, newTopicNo);
        // PM_TOPIC_ECHART_ATTR主题图表属性
        saveAsPmTopicChartAttr(topicNo, newTopicNo);
        // PM_TOPIC_GCOL_ATTR_PARAM虚拟维度属性
        saveAsPmTopicGcolAttrParam(topicNo, newTopicNo);
        // PM_TOPIC_LAYOUT主题图表布局
        saveAsPmTopicLayout(topicNo, newTopicNo);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @param newTopicNo 
     * @param classNo  
     * @param operUser 
     * @throws BaseAppException <br>
     */ 
    public void saveAsPmTopicList(String topicNo, String newTopicNo, String classNo, long operUser) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_LIST("
            + "CLASS_NO,"
            + "TOPIC_NO,"
            + "TOPIC_NAME,"
            + "SEQ,"
            + "MODEL_CODE,"
            + "DATE_GRAN,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID,"
            + "LAYOUT_TYPE,"
            + "MODEL_PHY_CODE,"
            + "PRELINE_ECHARTS"
            + ") SELECT "
            + "'" + classNo + "' AS CLASS_NO,"
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "TOPIC_NAME,"
            + "SEQ,"
            + "MODEL_CODE,"
            + "DATE_GRAN,"
            + "STATE,"
            + operUser + " AS OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID,"
            + "LAYOUT_TYPE,"
            + "MODEL_PHY_CODE,"
            + "PRELINE_ECHARTS"
            + " FROM PM_TOPIC_LIST WHERE TOPIC_NO=? AND SEQ=0 AND STATE=1";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        int insertNum = executeUpdate(sql, pa);
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
    public void saveAsPmTopicGcol(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_GCOL("
            + "TOPIC_NO,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "SEQ,"
            + "GL_DIMKPI"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "SEQ,"
            + "GL_DIMKPI"
            + " FROM PM_TOPIC_GCOL WHERE TOPIC_NO=? AND SEQ=0";        
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
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
    public void  saveAsPmTopicGcolAttr(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_GCOL_ATTR("
            + "TOPIC_NO,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "COL_TYPE,"
            + "SEQ,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "COL_TYPE,"
            + "SEQ,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ "
            + "FROM PM_TOPIC_GCOL_ATTR WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
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
     * @param topicNo 
     * @param newTopicNo 
     * @throws BaseAppException <br>
     */ 
    public void saveAsPmTopicGcolAttrParam(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_GCOL_ATTR_PARAM("
            + "TOPIC_NO,"
            + "COL_TYPE,"
            + "COL_SEQ,"
            + "COL_NO,"
            + "ATTR_CODE,"
            + "ATTR_SEQ,"
            + "SEQ,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "COL_TYPE,"
            + "COL_SEQ,"
            + "COL_NO,"
            + "ATTR_CODE,"
            + "ATTR_SEQ,"
            + "SEQ,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ "
            + "FROM PM_TOPIC_GCOL_ATTR_PARAM WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
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
    public void saveAsPmTopicLayout(String topicNo, String newTopicNo) throws BaseAppException {
        String sql = "INSERT INTO PM_TOPIC_LAYOUT("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "DISPLAY_SEQ,"
            + "SEQ"
            + ") SELECT "
            + "'" + newTopicNo + "' AS TOPIC_NO,"
            + "ECHART_NO,"
            + "DISPLAY_SEQ,"
            + "SEQ "
            + "FROM PM_TOPIC_LAYOUT WHERE TOPIC_NO=? AND SEQ=0";
        ParamArray pa = new ParamArray();
        pa.set("", topicNo);
        executeUpdate(sql, pa);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void saveSharedTopicAsLink(Map<String, Object> params) throws BaseAppException {
        String classNo = "" + params.get("classNo");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        List<Map<String, Object>> selectedTopics = (List<Map<String, Object>>) params.get("selectedTopics");
        //
        String sql = "INSERT INTO PM_MY_SHARETOPIC("
            + "CLASS_NO,"
            + "TOPIC_NO,"
            + "SEQ,"
            + "SHARE_USER,"
            + "SHARE_DATE"
            + ")VALUES (?,?,0,?,now())";
        for (int i = 0; i < selectedTopics.size(); i++) {
            Map<String, Object> topicDict = selectedTopics.get(i);
            String topicNo = "" + topicDict.get("id");
            update(sql, new Object[] {classNo, topicNo, operUser});
        }
    }
    
    @Override
    public String saveTopic(Map<String, Object> params) throws BaseAppException {
        String topicNo = "" + params.get("topicNo");
        // PM_TOPIC_LIST主题列表
        if (null == topicNo || "".equals(topicNo)) {
            // 新建主题
            topicNo = insertIntoPmTopicList(params);
            params.put("topicNo", topicNo);
        } 
        else {
            // 修改主题
            delTopic(topicNo);
            insertIntoPmTopicList(params);
        }
        // PM_TOPIC_GCOL维度指标概况
        insertIntoPmTopicGcol(params);
        // PM_TOPIC_GCOL_ATTR维度指标属性
        insertIntoPmTopicGcolAttr(params);
        // PM_TOPIC_FILTER主题筛选器
        insertIntoPmTopicFilter(params);
        // PM_TOPIC_FILTER主题筛选器插件
        insertIntoPmTopicFilterPlugin(params);
        // PM_TOPIC_FILTER_OPER筛选器筛选方式
        insertIntoPmTopicFilterOper(params);
        // PM_TOPIC_ECHART主题图表概况
        insertIntoPmTopicChart(params);
        // PM_TOPIC_ECHART_ATTR主题图表属性
        insertIntoPmTopicChartAttr(params);
        // PM_TOPIC_GCOL_ATTR_PARAM虚拟维度属性
        insertIntoPmTopicGcolAttrParam(params);
        // PM_TOPIC_LAYOUT主题图表布局
        insertIntoPmTopicLayout(params);
        return topicNo;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmTopicGcol(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> dimIndiList =  (ArrayList<HashMap>) params.get("dimIndiList");
        String topicNo = "" + params.get("topicNo");
        //
        String sql = "INSERT INTO PM_TOPIC_GCOL("
            + "TOPIC_NO,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "SEQ,"
            + "GL_DIMKPI"
            + ")VALUES (?,?,?,?,0,?)";
        for (int i = 0; i < dimIndiList.size(); i++) {
            HashMap dimIndiDict = dimIndiList.get(i);
            String colType = "" + dimIndiDict.get("COL_TYPE");
            String colNo = "" + dimIndiDict.get("COL_NO");
            String colSeq = "" + dimIndiDict.get("COL_SEQ");
            String gl_dimkpi = "" + dimIndiDict.get("GL_DIMKPI");
            update(sql, new Object[] {topicNo, colType, colNo, colSeq, gl_dimkpi});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmTopicGcolAttrParam(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> vdimGroupAttrList =  (ArrayList<HashMap>) params.get("vdimGroupAttrList");
        String topicNo = "" + params.get("topicNo");
        //
        String sql = "INSERT INTO PM_TOPIC_GCOL_ATTR_PARAM("
            + "TOPIC_NO,"
            + "COL_TYPE,"
            + "COL_SEQ,"
            + "COL_NO,"
            + "ATTR_CODE,"
            + "ATTR_SEQ,"
            + "SEQ,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ"
            + ")VALUES (?,?,?,?,?,?,0,?,?)";
        for (int i = 0; i < vdimGroupAttrList.size(); i++) {
            HashMap groupDict = vdimGroupAttrList.get(i);
            String paramValue = "" + groupDict.get("PARAM_VALUE");
            if ("".equals(paramValue)) {
                continue;
            }
            String paramSeq = "" + groupDict.get("PARAM_SEQ");
            String colNo = "" + groupDict.get("COL_NO");
            String colSeq = "" + groupDict.get("COL_SEQ");
            String colType = "" + groupDict.get("COL_TYPE");
            String attrCode = "" + groupDict.get("ATTR_CODE");
            String attrSeq = "" + groupDict.get("ATTR_SEQ");
            update(sql, new Object[] {topicNo, colType, colSeq, colNo, attrCode, attrSeq, paramValue, paramSeq});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmTopicLayout(Map<String, Object> params) throws BaseAppException {
        String topicNo = "" + params.get("topicNo");
        String[] chartOrder = ("" + params.get("chartOrder")).split(",");
        String sql = "INSERT INTO PM_TOPIC_LAYOUT("
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "DISPLAY_SEQ,"
            + "SEQ"
            + ")VALUES (?,?,?,0)";
        for (int i = 0; i < chartOrder.length; i++) {
            String echartNo = chartOrder[i];
            String displaySeq = i + "";
            update(sql, new Object[] {topicNo, echartNo, displaySeq});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicChartAttr(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> topicChartAttrList =  (ArrayList<HashMap>) params.get("topicChartAttrList");
        String topicNo = "" + params.get("topicNo");
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
            HashMap attrDict = topicChartAttrList.get(i);
            String attrCode = "" + attrDict.get("ATTR_CODE");
            String attrValue = "" + attrDict.get("ATTR_VALUE");
            if ((null == attrValue || "".equals(attrValue)) && !"drillColList".equals(attrCode)) {
                continue;
            }
            String attrNo = "" + attrDict.get("ATTR_NO");
            if ("groupList".equals(attrCode)) {
                insertIntoPmTopicChartAxis(params, attrDict);
            }
            else {
                String echartNo = "" + attrDict.get("ECHART_NO");
                String attrSeq = "" + attrDict.get("ATTR_SEQ");
                update(sql, new Object[] {topicNo, echartNo, attrNo, attrCode, attrValue, attrSeq});
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params  
     * @param attrDict 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicChartAxis(Map<String, Object> params, HashMap attrDict) throws BaseAppException {
        String topicNo = "" + params.get("topicNo");
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
        ArrayList<HashMap> groupList = (ArrayList<HashMap>) attrDict.get("ATTR_VALUE");
        String attrNo = "" + attrDict.get("ATTR_NO");
        String attrCode = "" + attrDict.get("ATTR_CODE");
        String echartNo = "" + attrDict.get("ECHART_NO");
        String attrSeq = "" + attrDict.get("ATTR_SEQ");
        for (int i = 0; i < groupList.size(); i++) {
            // GROUP_NO GROUP_TITLE DIM_NO KPI_NO
            HashMap group = groupList.get(i);
            String GROUP_NO = "" + group.get("GROUP_NO");
            String GROUP_TITLE = "" + group.get("GROUP_TITLE");
            String DIM_NO = "" + group.get("DIM_NO");
            String KPI_NO = "" + group.get("KPI_NO");
            //
            if (null != DIM_NO && !"".equals(DIM_NO)) {
                update(sql, new Object[] {topicNo, echartNo, GROUP_NO, GROUP_TITLE, 0, DIM_NO});
            }
            //
            update(sql, new Object[] {topicNo, echartNo, GROUP_NO, GROUP_TITLE, 1, KPI_NO});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicChart(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> topicChartList =  (ArrayList<HashMap>) params.get("topicChartList");
        String topicNo = "" + params.get("topicNo");
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
            HashMap chartDict = topicChartList.get(i);
            String echartNo = "" + chartDict.get("ECHART_NO");
            String echartName = "" + chartDict.get("ECHART_NAME");
            String topicSubName = "" + chartDict.get("TOPIC_SUB_NAME");
            String echartType = "" + chartDict.get("ECHART_TYPE");
            String echartSeq = "" + chartDict.get("ECHART_SEQ");
            update(sql, new Object[] {topicNo, echartNo, echartName, topicSubName, echartType, echartSeq});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicFilterOper(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> topicFilterOperList =  (ArrayList<HashMap>) params.get("topicFilterOperList");
        String topicNo = "" + params.get("topicNo");
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
            HashMap operDict = topicFilterOperList.get(i);
            String fieldNo = "" + operDict.get("FIELD_NO");
            String operNo = qryOperNo();
            String paramValue = "" + operDict.get("PARAM_VALUE");
            String operType = "" + operDict.get("OPER_TYPE");
            String operOrder = "" + operDict.get("OPER_ORDER");
            String filterValue = "" + operDict.get("FILTER_VALUE");
            if ((null != filterValue && !"".equals(filterValue)) || (null != paramValue && !"".equals(paramValue))) {
                update(sql, new Object[] {topicNo, fieldNo, operNo, operType, operOrder, filterValue});
                update(filterValueSql, new Object[] {operNo, paramValue, i});
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicGcolAttr(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> dimIndiAttrList =  (ArrayList<HashMap>) params.get("dimIndiAttrList");
        ArrayList<HashMap> vdimAttrList =  (ArrayList<HashMap>) params.get("vdimAttrList");
        String topicNo = "" + params.get("topicNo");
        //
        String sql = "INSERT INTO PM_TOPIC_GCOL_ATTR("
            + "TOPIC_NO,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "COL_TYPE,"
            + "SEQ,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ"
            + ")VALUES (?,?,?,?,0,?,?,?)";
        for (int i = 0; i < dimIndiAttrList.size(); i++) {
            HashMap attrDict = dimIndiAttrList.get(i);
            String attrValue = "" + attrDict.get("ATTR_VALUE");
            if (null == attrValue || "".equals(attrValue)) {
                continue;
            }
            String colNo = "" + attrDict.get("COL_NO");
            String colSeq = "" + attrDict.get("COL_SEQ");
            String colType = "" + attrDict.get("COL_TYPE");
            String attrCode = "" + attrDict.get("ATTR_CODE");
            String attrSeq = "" + attrDict.get("ATTR_SEQ");
            update(sql, new Object[] {topicNo, colNo, colSeq, colType, attrCode, attrValue, attrSeq});
        }
        //
        for (int i = 0; i < vdimAttrList.size(); i++) {
            HashMap vdimAttrDict = vdimAttrList.get(i);
            String attrValue = "" + vdimAttrDict.get("ATTR_VALUE");
            String colNo = "" + vdimAttrDict.get("COL_NO");
            String colSeq = "" + vdimAttrDict.get("COL_SEQ");
            String colType = "" + vdimAttrDict.get("COL_TYPE");
            String attrCode = "" + vdimAttrDict.get("ATTR_CODE");
            String attrSeq = "" + vdimAttrDict.get("ATTR_SEQ");
            update(sql, new Object[] {topicNo, colNo, colSeq, colType, attrCode, attrValue, attrSeq});
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  insertIntoPmTopicFilter(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> topicFilterList =  (ArrayList<HashMap>) params.get("topicFilterList");
        String topicNo = "" + params.get("topicNo");
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
            HashMap filterDict = topicFilterList.get(i);
            String filterType = "" + filterDict.get("FILTER_TYPE");
            String objNo = "" + filterDict.get("FILTER_OBJ_NO");
            String fieldNo = "" + filterDict.get("FIELD_NO");
            String fieldType = "" + filterDict.get("FIELD_TYPE");
            String fieldFilterType = "" + filterDict.get("FIELD_FILTER_TYPE");
            String viewType = "" + filterDict.get("VIEW_TYPE");
            update(sql, new Object[] {topicNo, filterType, objNo, fieldNo, fieldType, fieldFilterType, viewType});
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void insertIntoPmTopicFilterPlugin(Map<String, Object> params) throws BaseAppException {
        ArrayList<HashMap> topicFilterPluginList =  (ArrayList<HashMap>) params.get("topicFilterPluginList");
        String topicNo = "" + params.get("topicNo");
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
        for (int i = 0; i < topicFilterPluginList.size(); i++) {
            HashMap filterPluginDict = topicFilterPluginList.get(i);
            String filterType = "" + filterPluginDict.get("FILTER_TYPE");
            String objNo = "" + filterPluginDict.get("FILTER_NAME");
            String fieldNo = "" + filterPluginDict.get("FIELD_NO");
            String fieldType = "" + filterPluginDict.get("FIELD_TYPE");
            String fieldFilterType = "0";
            String viewType = "-1"; //1-普通条件 2-高级条件 -1为插件
            update(sql, new Object[] {topicNo, filterType, objNo, fieldNo, fieldType, fieldFilterType, viewType});
        }
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
        // 筛选器筛选值表
        String filterValueSql = "INSERT INTO PM_TOPIC_FIILTER_VALUE("
            + "OPER_NO,"
            + "PARAM_VALUE,"
            + "PARAM_SEQ"
            + ")VALUES (?,?,?)";
        for (int i = 0; i < topicFilterPluginList.size(); i++) {
            HashMap topicFilterPluginDict = topicFilterPluginList.get(i);
            String fieldNo = "" + topicFilterPluginDict.get("FIELD_NO");
            String operNo = qryOperNo();
            String paramValue = "" + topicFilterPluginDict.get("PLUGIN_PARAM");
            String operType = "PLUGIN";
            String operOrder = "0";
            String filterValue = "";
            if ((null != filterValue && !"".equals(filterValue)) || (null != paramValue && !"".equals(paramValue))) {
                update(sql, new Object[] {topicNo, fieldNo, operNo, operType, operOrder, filterValue});
                update(filterValueSql, new Object[] {operNo, paramValue, i});
            }
        }
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String insertIntoPmTopicList(Map<String, Object> params) throws BaseAppException {
        String classNo = "" + params.get("classNo");
        String topicName = "" + params.get("topicName");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        String modelCode = "" + params.get("modelCode");
        String modelPhyCode = "" + params.get("modelPhyCode");
        String dateGran = "" + params.get("dateGran");
        String topicNo = "" + params.get("topicNo");
        String numperrow =  "" + params.get("numperrow");
        String layout_type =  "" + params.get("layout_type");
        if (null == topicNo || "".equals(topicNo)) {
            topicNo = qryTopicNo();
        }
        //
        String sql = "INSERT INTO PM_TOPIC_LIST("
            + "CLASS_NO,"
            + "TOPIC_NO,"
            + "TOPIC_NAME,"
            + "SEQ,"
            + "MODEL_CODE,"
            + "DATE_GRAN,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID,"
            + "LAYOUT_TYPE,"
            + "MODEL_PHY_CODE,"
            + "PRELINE_ECHARTS"
            + ")VALUES (?,?,?,0,?,?,1,?,now(),null,?,?,?)";
        update(sql, new Object[] {classNo, topicNo, topicName, modelCode, dateGran, operUser, layout_type, modelPhyCode, numperrow});
        return topicNo;
    }
    
    @Override
    public List<Map<String, Object>> cacheOperUser() throws BaseAppException {
        List<Map<String, Object>> userList = queryForMapList("SELECT USER_ID,USER_NAME FROM BFM_USER", new Object[] {});
        return userList;
    }
    
    @Override
    public List<Map<String, Object>> qryPluginList() throws BaseAppException {
        String pluginSql = "SELECT PLUGIN_SPEC_NO AS PLUGIN_NO, PLUGIN_CLASSPATH, PLUGIN_NAME, PLUGIN_URL"
            + " FROM PM_SPEC_PLUGINSERV WHERE PLUGIN_TYPE='11' AND SEQ=0";
        List<Map<String, Object>> pluginList = queryForMapList(pluginSql, new Object[] {});
        return pluginList;
    }
    
    @Override
    public List<Map<String, Object>> cacheMapType() throws BaseAppException {
        String mapTypeSql = "SELECT AREAMAP_NO,AREAMAP_NAME,AREAMAP_URL FROM PM_AREAMAP_SPEC "
            + "WHERE IS_DISPLAY ='1' AND SCOPE_MODEL IN ('0','1') ORDER BY DISPLAY";
        List<Map<String, Object>> mapTypeList = queryForMapList(mapTypeSql, new Object[] {});
        return mapTypeList;
    }
    
    @Override
    public List<Map<String, Object>> loadSharedTopicList() throws BaseAppException {
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        //
        String sql = "SELECT "
            + "PTL.TOPIC_NO,"
            + "PTL.TOPIC_NAME "
            + "FROM "
            + "(SELECT * FROM PM_TOPIC_LIST WHERE STATE=1 AND SEQ=0 AND OPER_USER!=?) PTL,"
            + "(SELECT * FROM PM_TOPIC_SHARE WHERE SEQ=0 AND "
            + "(SHARE_TYPE='01' OR (SHARE_TYPE='02' AND (SHARE_OBJ=? OR SHARE_OBJ LIKE ? OR SHARE_OBJ LIKE ? OR SHARE_OBJ LIKE ?)))) PTS "
            + "WHERE PTL.TOPIC_NO=PTS.TOPIC_NO";
        List<Map<String, Object>> sharedTopicList = queryForMapList(sql, new Object[] {
            operUser, operUser, operUser + ",%", "%," + operUser + ",%", "%," + operUser});
        return sharedTopicList;
    }
    
    @Override
    public void delLinkedTopic(String topicNo, String operUser) throws BaseAppException {
        // PM_TOPIC_LIST主题列表
        String sql = "DELETE FROM PM_MY_SHARETOPIC WHERE TOPIC_NO=? AND SHARE_USER=?";
        update(sql, new Object[] {topicNo, operUser});
        sql = "DELETE FROM PM_TOPIC_SYSCLASS WHERE TOPIC_NO=? AND OPER_USER=?";
        update(sql, new Object[] {topicNo, operUser});
    }
    
    @Override
    public void delTopicFromTopicSysclass(String topicNo) throws BaseAppException {
        String seq = qryTopicSysclassMaxSeqWithoutUser(topicNo);
        String sql = "UPDATE PM_TOPIC_SYSCLASS SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
    }
    
    @Override
    public Map<String, Object> qryCatalogAndTopic(Map<String, Object> params) throws BaseAppException {
        Map<String, Object> retData = new HashMap<String, Object>();
        // qryTopicClass
        Long oper_user = PrincipalUtil.getPrincipal().getUserId();
        String sql = "SELECT "
            + "CLASS_NO,"
            + "CLASS_NAME,"
            + "OPER_USER,"
            + "OPER_DATE "
            + "FROM PM_TOPIC_CLASS WHERE SEQ=0 AND OPER_USER=? ORDER BY CLASS_NAME";
        List<Map<String, Object>> topicClassList = queryForMapList(sql, new Object[] {oper_user});
        retData.put("topicClassList", topicClassList);
        // qryTopic
        sql = "SELECT "
               + "PTL.CLASS_NO,"
               + "PTL.TOPIC_NO,"
               + "PTL.TOPIC_NAME,"
               + "PTL.MODEL_CODE,"
               + "PTL.DATE_GRAN,"
               + "PTL.OPER_USER,"
               + "PTL.SAVE_TYPE,"
               + "IFNULL(PTS.SHARE_TYPE, '00') AS SHARE_TYPE,"
               + "PTS.SHARE_OBJ "
               + "FROM "
               + "((SELECT CLASS_NO,TOPIC_NO,TOPIC_NAME,MODEL_CODE,DATE_GRAN,OPER_USER,1 AS SAVE_TYPE FROM PM_TOPIC_LIST "
               + "WHERE STATE=1 AND SEQ=0 AND CLASS_NO!='-1' AND OPER_USER=?) UNION "
               + "(SELECT PMS.CLASS_NO,PMS.TOPIC_NO,PTL_TMP.TOPIC_NAME,PTL_TMP.MODEL_CODE,PTL_TMP.DATE_GRAN,PTL_TMP.OPER_USER,0 AS SAVE_TYPE "
               + "FROM PM_TOPIC_LIST PTL_TMP, PM_MY_SHARETOPIC PMS WHERE PTL_TMP.TOPIC_NO=PMS.TOPIC_NO AND PTL_TMP.SEQ=0 AND "
               + "PTL_TMP.STATE=1 AND PMS.SEQ=0 AND PMS.SHARE_USER=?)) PTL "
               + "LEFT OUTER JOIN "
               + "(SELECT * FROM PM_TOPIC_SHARE WHERE SEQ=0) PTS "
               + "ON PTL.TOPIC_NO=PTS.TOPIC_NO ORDER BY TOPIC_NAME";
        List<Map<String, Object>> topicList = queryForMapList(sql, new Object[] {oper_user, oper_user});
        retData.put("topicList", topicList);
        //
        String dimAndIndiSql = "SELECT "
            + "PTL.TOPIC_NO,"
            + "PTG.COL_TYPE,"
            + "PTG.GL_DIMKPI,"
            + "PTG.COL_NO "
            + "FROM PM_TOPIC_LIST PTL,PM_TOPIC_GCOL PTG "
            + "WHERE PTL.TOPIC_NO=PTG.TOPIC_NO AND PTL.STATE=1 AND PTL.SEQ=0 AND PTG.SEQ=0 "
            + "ORDER BY PTG.TOPIC_NO,PTG.COL_SEQ";
        List<Map<String, Object>> dimAndIndiList = queryForMapList(dimAndIndiSql, new Object[] {});
        retData.put("dimAndIndiList", dimAndIndiList);
        // 查询当前用户收藏主题及最近浏览主题
        sql = "SELECT "
            + "CLASS_TYPE,"
            + "TOPIC_NO "
            + "FROM PM_TOPIC_SYSCLASS WHERE OPER_USER=? AND SEQ=0 ORDER BY OPER_DATE DESC";
        List<Map<String, Object>> favAndViewedList = queryForMapList(sql, new Object[] {oper_user});
        retData.put("favAndViewedList", favAndViewedList);
        // qryTopicVdimAttr
        sql = "SELECT "
            + "COL_NO,"
            + "ATTR_VALUE "
            + "FROM PM_TOPIC_GCOL_ATTR "
            + "WHERE ATTR_CODE='VDIM_NAME' AND SEQ=0";
        List<Map<String, Object>> vdimAttrList = queryForMapList(sql, new Object[] {});
        retData.put("vdimAttrList", vdimAttrList);
        return retData;
    }
    
    @Override
    public String delCatalog(Map<String, Object> params) throws BaseAppException {
        String classNo = "" + params.get("classNo");
        String seq = qryClassNoMaxSeq(classNo);
        String sql = "UPDATE PM_TOPIC_CLASS SET SEQ=? WHERE CLASS_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, classNo});
        return classNo;
    }
    
    @Override
    public String expressionCheck(Map<String, Object> params) throws BaseAppException {
        String isValid = "0";
        try {
            String expression = "" + params.get("expression");
            ArrayList<String> expressionList =  (ArrayList<String>) params.get("expressionList");
            if (expression != null) {
                queryForMapList(expression, new Object[] {});
            }
            if (expressionList.size() > 0) {
                for (int i = 0; i < expressionList.size(); i++) {
                    String expressionTmp = expressionList.get(i);
                    queryForMapList(expressionTmp, new Object[] {});
                }
            }
            isValid = "1";
        } 
        finally {
            return isValid;
        }
    }
    
    @Override
    public void delTopic(String topicNo) throws BaseAppException {
        String seq = qryTopicMaxSeq(topicNo);
        // PM_TOPIC_LIST主题列表
        String sql = "UPDATE PM_TOPIC_LIST SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_GCOL维度指标概况
        sql = "UPDATE PM_TOPIC_GCOL SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_GCOL_ATTR维度指标属性
        sql = "UPDATE PM_TOPIC_GCOL_ATTR SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_FILTER主题筛选器
        sql = "UPDATE PM_TOPIC_FILTER SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_FILTER_OPER筛选器筛选方式
        sql = "UPDATE PM_TOPIC_FILTER_OPER SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_ECHART主题图表概况
        sql = "UPDATE PM_TOPIC_ECHART SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_ECHART_ATTR主题图表属性
        sql = "UPDATE PM_TOPIC_ECHART_ATTR SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_ECHART_ATTR主题图表属性
        sql = "UPDATE PM_TOPIC_ECHART_AXIS SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_GCOL_ATTR_PARAM虚拟维度属性表
        sql = "UPDATE PM_TOPIC_GCOL_ATTR_PARAM SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_LAYOUT图表布局
        sql = "UPDATE PM_TOPIC_LAYOUT SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
    }
    
    @Override
    public String favTopic(Map<String, Object> params) throws BaseAppException {
        String topicNo = "" + params.get("TOPIC_NO");
        String classType = "" + params.get("CLASS_TYPE");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        String fav = "" + params.get("FAV");  
        //
        String seq = qryTopicSysclassMaxSeq(topicNo, classType, operUser);
        String sql = "UPDATE PM_TOPIC_SYSCLASS SET SEQ=? WHERE TOPIC_NO=? AND CLASS_TYPE=? AND OPER_USER=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo, classType, operUser});
        // 1-收藏主题 0-取消收藏
        if ("1".equals(fav)) {
            sql = "INSERT INTO PM_TOPIC_SYSCLASS(CLASS_TYPE,TOPIC_NO,SEQ,OPER_USER,OPER_DATE) VALUES(?,?,?,?,now())";
            update(sql, new Object[] {classType, topicNo, 0, operUser});
        } 
        return topicNo;
    }
    
    @Override
    public String moveTopic(Map<String, Object> params) throws BaseAppException {
        String classNo = "" + params.get("classNo");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        ArrayList<HashMap> selectedTopics =  (ArrayList<HashMap>) params.get("selectedTopics");
        // 另存为模式
        String sql = "UPDATE PM_TOPIC_LIST SET CLASS_NO=? WHERE SEQ=0 AND TOPIC_NO IN (";
        for (int i = 0; i < selectedTopics.size(); i++) {
            HashMap topic = selectedTopics.get(i);
            String saveType = "" + topic.get("SAVE_TYPE");
            if ("1".equals(saveType)) {
                sql += "'" + "" + topic.get("id") + "',";
            }
        }
        if (sql.endsWith(",")) {
            sql = sql.substring(0, sql.length() - 1);
            sql += ")";
            update(sql, new Object[] {classNo});
        }
        // 链接模式
        sql = "UPDATE PM_MY_SHARETOPIC SET CLASS_NO=? WHERE SEQ=0 AND SHARE_USER=? AND TOPIC_NO IN (";
        for (int i = 0; i < selectedTopics.size(); i++) {
            HashMap topic = selectedTopics.get(i);
            String saveType = "" + topic.get("SAVE_TYPE");
            if ("0".equals(saveType)) {
                sql += "'" + "" + topic.get("id") + "',";
            }
        }
        if (sql.endsWith(",")) {
            sql = sql.substring(0, sql.length() - 1);
            sql += ")";
            update(sql, new Object[] {classNo, operUser});
        }
        return classNo;
    }
    
    @Override
    public void shareTopic(Map<String, Object> params) throws BaseAppException {
        String topicNo = "" + params.get("topicNo");
        String seq = qryTopicShareMaxSeq(topicNo);
        String shareType = "" + params.get("shareType");
        String selectedUsers =  "" + params.get("selectedUsers");
        Long operUser = PrincipalUtil.getPrincipal().getUserId();
        // PM_TOPIC_SHARE主题共享表 更新操作
        String sql = "UPDATE PM_TOPIC_SHARE SET SEQ=? WHERE TOPIC_NO=? AND SEQ=0";
        update(sql, new Object[] {seq, topicNo});
        // PM_TOPIC_SHARE主题共享表 插入操作
        if (!"00".equals(shareType)) {
            sql = "INSERT INTO PM_TOPIC_SHARE("
                + "TOPIC_NO,"
                + "SEQ,"
                + "SHARE_TYPE,"
                + "SHARE_OBJ,"
                + "OPER_USER,"
                + "OPER_DATE"
                + ")VALUES (?,0,?,?,?,now())";
            update(sql, new Object[] {topicNo, shareType, selectedUsers, operUser});
        }
    }
    
    @Override
    public Map<String, Object> loadData(Map<String, Object> params) throws BaseAppException {
        //TopicDAO topicDao = (TopicDAO) GeneralDAOFactory.create(TopicDAO.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        //topicDao.dataExport(dict);
        params.put("exceptionFlag", 1);
        String etime;
        String btime;
        String topic_no = "" + params.get("topic_no");
        String modelCode = "" + params.get("modelCode");
        String dateGranu = "" + params.get("dateGranu");
        String dateGranuType = "" + params.get("dateGranuType");
        String axisCfgSeries = "" + params.get("axisCfgSeries");
        String axisCfgXaxis = "" + params.get("axisCfgXaxis");
        String chart_type = "" + params.get("chart_type");
        // 二次过滤
        String chartFilterStr = "" + params.get("chartFilterStr");  
        //
        String tableName = modelCode + dateGranu;
        if ("custom".equals(dateGranuType)) {
            etime = "" + params.get("etime");
            btime = "" + params.get("btime");
        }
        else {
            String[] btimeAndEtime = getBtimeAndEtime(dateGranu, dateGranuType);
            btime = btimeAndEtime[0];
            etime = btimeAndEtime[1];
        }
        params.put("btime", btime);
        params.put("etime", etime);  
        generateLoaddataInnerSql(params, btime, etime, tableName);
        return params;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @param btime 
     * @param etime 
     * @param tableName 
     * @throws BaseAppException <br>
     */ 
    private void generateLoaddataInnerSql(Map<String, Object> params, String btime, String etime, String tableName) throws BaseAppException {
        String topic_no = "" + params.get("topic_no");
        Boolean hasVdim = false;
        ArrayList<String> vdimColNoList = new ArrayList<String>();
        ArrayList<String> vdimColIndexList = new ArrayList<String>();
        ArrayList<Map<String, Object>> allDimIndiList =  (ArrayList<Map<String, Object>>) params.get("allDimIndiList");
        ArrayList<String> hideColList =  (ArrayList<String>) params.get("hideColList");
        ArrayList<Map<String, Object>> vdimList =  (ArrayList<Map<String, Object>>) params.get("vdimList");
        // 主题的过滤器
        ArrayList<Map<String, Object>> topicFilterList =  (ArrayList<Map<String, Object>>) params.get("topicFilterList");      
        // COL_TYPE=00, COL_NAME=Cell, COL_NO=CELL_ID
        String selectSql = "SELECT ";
        String innerSelectSql = "" + params.get("innerSelectSql");
        String aggregationSql = "SELECT ";
        String groupSql = "GROUP BY ";
        String innerGroupSql = "" + params.get("innerGroupSql");
        String aggregationGroupSql = "GROUP BY ";
        boolean hasAggregation = false;
        String orderSql = "ORDER BY ";
        String defaultOrderSql = "ORDER BY ";
        for (int i = 0; i < allDimIndiList.size(); i++) {
            Map<String, Object> dimIndiDict = allDimIndiList.get(i);
            String metaDimCode = "" + dimIndiDict.get("META_DIM_CODE");
            String colNo = "" + dimIndiDict.get("COL_NO");
            String colIndex = "" + dimIndiDict.get("COL_INDEX");
            String colName = "" + dimIndiDict.get("COL_NAME");
            String gl_dimkpi = "" + dimIndiDict.get("GL_DIMKPI");
            boolean isHide = false;
            for (int j = 0; j < hideColList.size() && !isHide; j++) {
                String hideCol = hideColList.get(j);
                if (hideCol.equals(colIndex)) {
                    isHide = true;
                }
            }
            if (!isHide || "1".equals(gl_dimkpi)) {
                if ("00".equals("" + dimIndiDict.get("COL_TYPE"))) {
                    HashMap col = new HashMap();
                    col.put("col_name", colIndex);
                    col.put("col_label", colName);
                    if (!isHide) {
                        selectSql += colNo + " AS " + colIndex + ", ";
                        groupSql += colNo + ", ";
                    }
                }
                else if ("02".equals("" + params.get("COL_TYPE"))) {
                    hasVdim = true;
                    if (!isHide) {
                        if ("0".equals(gl_dimkpi)) {
                            vdimColNoList.add(colNo);
                            vdimColIndexList.add(colIndex);
                        }
                        else {
                            vdimColNoList.add(colNo);
                            vdimColIndexList.add(colIndex);
                            selectSql += colIndex + ", ";
                            groupSql += colIndex + ", ";
                        }
                    }
                }
                else if ("01".equals("" + dimIndiDict.get("COL_TYPE"))) {
                    if (!isHide) {
                        selectSql += "" + dimIndiDict.get("KPI_FORM") + " AS " + colIndex + ", ";
                    }
                }
                defaultOrderSql += colIndex + ", ";   
            }
        }
        selectSql = selectSql.substring(0, selectSql.length() - 2);
        groupSql = "GROUP BY ".equals(groupSql) ? "" : (groupSql.substring(0, groupSql.length() - 2));
        defaultOrderSql = defaultOrderSql.substring(0, defaultOrderSql.length() - 2);
        // 普通维度过滤 放子查询   虚拟维度放外层 指标筛选having
        String dimFilterStr = "";
        String vdimFilterStr = "";
        String kpiFilterStr = "";
        for (int i = 0; i < topicFilterList.size(); i++) {
            Map<String, Object> filterObj = topicFilterList.get(i);
            String fieldNo = CommonUtil.getStrFromMap(filterObj, "fieldNo", "");
            String filterStr = CommonUtil.getStrFromMap(filterObj, "filterStr", null);
            filterStr = filterStr.replace(fieldNo + "||''", "CONCAT(" + fieldNo + ",'')");
            String fieldType = "" + filterObj.get("fieldType");
            if (null != filterStr && !"".equals(filterStr) && "0".equals(fieldType)) {
                dimFilterStr += filterStr + " AND ";
            }
            else if (null != filterStr && !"".equals(filterStr) && "1".equals(fieldType)) {
                kpiFilterStr += filterStr + " AND ";
            }
            else if (null != filterStr && !"".equals(filterStr) && "2".equals(fieldType)) {
                //hasVdim = true;
                vdimFilterStr += filterStr + " AND ";
            }
        }
        if (!"".equals(vdimFilterStr)) {
            vdimFilterStr = " WHERE " + vdimFilterStr.substring(0, vdimFilterStr.length() - 4);
        }
        if (!"".equals(kpiFilterStr)) {
            kpiFilterStr = " HAVING " + kpiFilterStr.substring(0, kpiFilterStr.length() - 4);
        }
        // 时间过滤条件sql
        String timeWhereSql = " STTIME>=DATE_FORMAT('" + btime + "','%Y-%m-%d %H:%i:%S') AND"
                  + " STTIME<DATE_FORMAT('" + etime + "','%Y-%m-%d %H:%i:%S') ";
        // 过滤器插件
        ArrayList<Map<String, Object>> topicFilterPluginList = (ArrayList<Map<String, Object>>) params.get("topicFilterPluginList");    
        // adhoc对过滤器插件的运行时参数
        Map<String, Object> adhoc_param = new HashMap<String, Object>();
        adhoc_param.put("BTIME", btime);
        adhoc_param.put("ETIME", etime);
        adhoc_param.put("MODELCODE", "" + params.get("modelCode"));
        adhoc_param.put("DATEGRANU", "" + params.get("dateGranu"));
        for (int i = 0; i < topicFilterPluginList.size(); i++) {
            Map<String, Object> topicFilterPlugin = topicFilterPluginList.get(i);
            String plugin_no = "" + topicFilterPlugin.get("PLUGIN_NO");
            Map<String, Object> plugin_param = (Map<String, Object>) topicFilterPlugin.get("PLUGIN_PARAM");
            List<Map<String, Object>> tmpResultList = 
                queryForMapList("SELECT PLUGIN_CLASSPATH FROM PM_SPEC_PLUGINSERV WHERE SEQ=0 AND PLUGIN_SPEC_NO=?", 
                    new Object[] {plugin_no});
            String plugin_classpath = "";
            if (tmpResultList.size() > 0) {
                plugin_classpath = (String) (tmpResultList.get(0).get("PLUGIN_CLASSPATH"));
            }
            String pluginWhereSql = ""; //待补充getWhereSqlFromPlugin(plugin_classpath, plugin_param, adhoc_param);
            timeWhereSql += pluginWhereSql;
        }
        // 子查询where条件
        String subQryWhereSql = dimFilterStr + timeWhereSql;
        if (hasVdim) {
            tableName = getTableNameWithVdim(topic_no, tableName, vdimColNoList, vdimColIndexList, vdimList, subQryWhereSql);
        }
        else {
            tableName = tableName + " WHERE " + subQryWhereSql;
        }
        generateLoaddataSql(params, tableName, selectSql, vdimFilterStr, groupSql, kpiFilterStr);
    }

    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params  
     * @param tableName 
     * @param allSelectSql 
     * @param vdimFilterStr  
     * @param allGroupSql  
     * @param kpiFilterStr  
     * @throws BaseAppException <br>
     */ 
    private void generateLoaddataSql(Map<String, Object> params, String tableName, 
        String allSelectSql, String vdimFilterStr, String allGroupSql, String kpiFilterStr) throws BaseAppException {
        // 需要翻译的维度列
        ArrayList<Map<String, Object>> translateDimList = new ArrayList<Map<String, Object>>();
        // 结果集列头
        ArrayList<HashMap> colModel = new ArrayList<HashMap>();
        String axisCfgSeries = "" + params.get("axisCfgSeries");
        String axisCfgXaxis = "" + params.get("axisCfgXaxis");
        String chart_type = "" + params.get("chart_type");
        ArrayList<String> hideColList =  (ArrayList<String>) params.get("hideColList"); 
        ArrayList<Map<String, Object>> sortList =  (ArrayList<Map<String, Object>>) params.get("sortList");
        ArrayList<Map<String, Object>> selectedDimIndiList =  (ArrayList<Map<String, Object>>) params.get("selectedDimIndiList");
        ArrayList<Map<String, Object>> extendDimList =  (ArrayList<Map<String, Object>>) params.get("extendDimList");
        ArrayList<String> extendDimFilterList =  (ArrayList<String>) params.get("extendDimFilterList");
        // TOPN 排序
        String topn = "" + params.get("topn");
        // 二次过滤
        String chartFilterStr = "" + params.get("chartFilterStr");  
        String selectSql = "SELECT ";
        String selectWithNoAgSql = "SELECT ";
        String innerSelectSql = "" + params.get("innerSelectSql");
        String aggregationSql = "SELECT ";
        String groupSql = "GROUP BY ";
        String groupWithNoAgSql = "GROUP BY ";
        String innerGroupSql = "" + params.get("innerGroupSql");
        String aggregationGroupSql = "GROUP BY ";
        boolean hasAggregation = false;
        String orderSql = "ORDER BY ";
        String defaultOrderSql = "ORDER BY ";
        // 是否包含二次聚合指标
        boolean hasAgKpi = false;
        // 最终select语句中包含的列
        ArrayList<String> colInSelectSqlList = new  ArrayList<String>();
        for (int i = 0; i < selectedDimIndiList.size(); i++) {
            Map<String, Object> dimIndiDict = selectedDimIndiList.get(i);
            String metaDimCode = (dimIndiDict.get("META_DIM_CODE") == null || ("").equals(dimIndiDict.get("META_DIM_CODE"))) ? null : (dimIndiDict.get("META_DIM_CODE") + "");
            String colNo = "" + dimIndiDict.get("COL_NO");
            String colIndex = "" + dimIndiDict.get("COL_INDEX");
            String colName = "" + dimIndiDict.get("COL_NAME");
            String gl_dimkpi = "" + dimIndiDict.get("GL_DIMKPI");
            boolean isHide = false;
            for (int j = 0; j < hideColList.size() && !isHide; j++) {
                String hideCol = hideColList.get(j);
                if (hideCol.equals(colIndex)) {
                    isHide = true;
                }
            }
            if (!isHide || "1".equals(gl_dimkpi)) {
                if ("00".equals("" + dimIndiDict.get("COL_TYPE"))) {
                    if ("1".equals(gl_dimkpi)) {
                        HashMap col = new HashMap();
                        col.put("col_name", colIndex);
                        col.put("col_label", colName);
                        if (!isHide) {
                            if (!"".equals(axisCfgXaxis) && (colIndex.equals(axisCfgXaxis) 
                                || colIndex.equals(axisCfgSeries) || "grid".equals(chart_type))) {
                                selectSql += colIndex + ", ";
                                colInSelectSqlList.add(colIndex);
                                selectWithNoAgSql += colNo + " AS " + colIndex + ", ";
                                groupSql += colIndex + ", ";
                                groupWithNoAgSql += colNo + ", ";
                                if (null != metaDimCode) {
                                    col.put("col_name", colIndex + "_NAME");
                                    translateDimList.add(dimIndiDict);
                                }
                            }
                            else if ("".equals(axisCfgXaxis)) {
                                selectSql += colIndex + ", ";
                                colInSelectSqlList.add(colIndex);
                                selectWithNoAgSql += colNo + " AS " + colIndex + ", ";
                                groupSql += colIndex + ", ";
                                groupWithNoAgSql += colNo + ", ";
                                if (null != metaDimCode) {
                                    col.put("col_name", colIndex + "_NAME");
                                    translateDimList.add(dimIndiDict);
                                }
                            }                        
                            colModel.add(col);
                        }
                    }
                }
                else if ("02".equals("" + dimIndiDict.get("COL_TYPE"))) {
                    if ("1".equals(gl_dimkpi)) {
                        HashMap col = new HashMap();
                        col.put("col_name", colIndex);
                        col.put("col_label", colName);
                        if (!isHide) {
                            if (!"".equals(axisCfgXaxis) && (colIndex.equals(axisCfgXaxis) 
                                || colIndex.equals(axisCfgSeries) || "grid".equals(chart_type))) {
                                selectSql += colIndex + ", ";
                                colInSelectSqlList.add(colIndex);
                                selectWithNoAgSql += colIndex + ", ";
                                groupSql += colIndex + ", ";
                                groupWithNoAgSql += colIndex + ", ";
                                if (null != metaDimCode) {
                                    col.put("col_name", colIndex + "_NAME");
                                    translateDimList.add(dimIndiDict);
                                }
                            }
                            else if ("".equals(axisCfgXaxis)) {
                                selectSql += colIndex + ", ";
                                colInSelectSqlList.add(colIndex);
                                selectWithNoAgSql += colIndex + ", ";
                                groupSql += colIndex + ", ";
                                groupWithNoAgSql += colIndex + ", ";
                                if (null != metaDimCode) {
                                    col.put("col_name", colIndex + "_NAME");
                                    translateDimList.add(dimIndiDict);
                                }
                            }
                            colModel.add(col);
                        }
                    }
                }
                else if ("01".equals("" + dimIndiDict.get("COL_TYPE"))) {
                    if (!isHide) {
                        Object agType = dimIndiDict.get("agType");
                        if (null != agType && !"".equals(agType)) {
                            hasAgKpi = true;
                            selectSql += agType.toString().toUpperCase() + "(" + colIndex + ") AS " + colIndex + ", ";
                            colInSelectSqlList.add(colIndex);
                        }
                        else {
                            selectSql += "AVG(" + colIndex + ") AS " + colIndex + ", ";
                            colInSelectSqlList.add(colIndex);
                        }
                        selectWithNoAgSql += dimIndiDict.get("KPI_FORM") + " AS " + colIndex + ", ";
                        HashMap col = new HashMap();
                        col.put("col_name", colIndex);
                        col.put("col_label", colName);
                        colModel.add(col);
                    }
                }
                defaultOrderSql += colIndex + ", ";   
            }
        }
        // 维度扩展
        for (Map<String, Object> extendDim : extendDimList) {
            String extendDimCode = "" + extendDim.get("DIM_CODE");
            String extendDMetaDimCode = "" + extendDim.get("META_DIM_CODE");
            selectSql += extendDimCode + ", "; 
            selectWithNoAgSql += extendDimCode + ", ";
            groupSql += extendDimCode + ", ";
            groupWithNoAgSql += extendDimCode + ", ";
            if (null != extendDMetaDimCode) {
                translateDimList.add(extendDim);
            }
        }
        String mainSortSql = mainSortSqlFunction(params, colInSelectSqlList, hideColList);
        params.put("colModel", colModel);
        // 二次排序
        for (int i = 0; i < sortList.size(); i++) {
            Map<String, Object> orderDict = sortList.get(i);
            String sortType = "" + orderDict.get("sortType");
            String sortField = "" + orderDict.get("sortField");
            boolean isHide = false;
            for (int j = 0; j < hideColList.size() && !isHide; j++) {
                String hideCol = hideColList.get(j);
                if (hideCol.equals(sortField)) {
                    isHide = true;
                }
            }
            if (!isHide && !"".equals(sortType)) {
                orderSql +=  sortField + " " + sortType + ", ";
            }
        }
        orderSql = "ORDER BY ".equals(orderSql) ? "" : (" " + orderSql.substring(0, orderSql.length() - 2));
        selectSql = selectSql.substring(0, selectSql.length() - 2);
        selectWithNoAgSql = selectWithNoAgSql.substring(0, selectWithNoAgSql.length() - 2);
        groupSql = "GROUP BY ".equals(groupSql) ? "" : (groupSql.substring(0, groupSql.length() - 2));
        groupWithNoAgSql = "GROUP BY ".equals(groupWithNoAgSql) ? "" : (groupWithNoAgSql.substring(0, groupWithNoAgSql.length() - 2));
        if (!"".equals(vdimFilterStr)) {
            tableName += " " + vdimFilterStr;
        }
        if (extendDimFilterList.size() > 0) {
            // 维度扩展过滤条件
            for (String extendDimFilter : extendDimFilterList) {
                tableName += " AND " + extendDimFilter;
            }
        }
        // 针对是否有二次聚合区别处理
        if (hasAgKpi) {
            tableName = allSelectSql + " FROM " + tableName + allGroupSql + kpiFilterStr;
        }
        else {
            tableName = selectWithNoAgSql + " FROM " + tableName + groupWithNoAgSql + kpiFilterStr;
            selectSql = "SELECT * ";
            groupSql = " ";
        }
        String sql = ""; 
        if ("".equals(topn) && "".equals(mainSortSql)) {
            sql = selectSql + " FROM (" + tableName + ") TMP " + groupSql + orderSql;
        } 
        else if (!"".equals(topn)) {
            sql = "SELECT * FROM (" + selectSql + " FROM (" + tableName + ") TMP " + groupSql + mainSortSql
                + ") TMP " + orderSql + " LIMIT " + topn;
        }
        else if (!"".equals(mainSortSql)) {
            sql = "SELECT * FROM (" + selectSql + " FROM (" + tableName + ") TMP " + groupSql + mainSortSql 
                + ") TMP " + orderSql;
        }
        //
        if (!"".equals(chartFilterStr)) {
            sql = "SELECT * FROM (" + sql + ") TMP WHERE " + chartFilterStr;
        }
        queryDatalist(params, sql, mainSortSql, orderSql, translateDimList);
        params.put("exceptionFlag", 0);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @param sql 
     * @param mainSortSql 
     * @param orderSql 
     * @param translateDimList 
     * @throws BaseAppException <br>
     */ 
    private void queryDatalist(Map<String, Object> params, String sql, String mainSortSql, String orderSql, 
        ArrayList<Map<String, Object>> translateDimList) throws BaseAppException {
        sql = translateDimDataSql(sql, "" + params.get("modelBusiCode"), translateDimList);
        // 左连接会打乱内排序 所以最外层需再排一次
        // 同时存在主排序和二次排序时 以二次排序为主
        if (("".equals(mainSortSql) && !"".equals(orderSql)) || (!"".equals(mainSortSql) && !"".equals(orderSql))) {
            sql += " ORDER BY ";   
            String tmpOrderSql = orderSql.substring(10); // ORDER BY DIM_0 ASC
            String[] orderFields = tmpOrderSql.split(",");
            for (int i = 0; i < orderFields.length; i++) {
                String field = orderFields[i];
                String sortType = field.substring(field.indexOf(" "));
                field = field.substring(0, field.indexOf(" "));
                boolean isTranslatedDim = false;
                for (int j = 0; j < translateDimList.size() && !isTranslatedDim; j++) {
                    Map<String, Object> translatedDimDict = translateDimList.get(j);
                    if (field.equals("" + translatedDimDict.get("COL_INDEX"))) {
                        isTranslatedDim = true;
                        field += "_NAME";
                    }
                }
                sql += field + " " + sortType + ","; 
            }
            sql = sql.substring(0, sql.length() - 1);
        }
        else if ("".equals(orderSql) && !"".equals(mainSortSql)) {
            sql += " ORDER BY ";   
            String tmpOrderSql = mainSortSql.substring(10); // ORDER BY DIM_0 ASC
            String[] orderFields = tmpOrderSql.split(",");
            for (int i = 0; i < orderFields.length; i++) {
                String field = orderFields[i];
                String sortType = field.substring(field.indexOf(" "));
                field = field.substring(0, field.indexOf(" "));
                boolean isTranslatedDim = false;
                for (int j = 0; j < translateDimList.size() && !isTranslatedDim; j++) {
                    Map<String, Object> translatedDimDict = translateDimList.get(j);
                    if (field.equals("" + translatedDimDict.get("COL_INDEX"))) {
                        isTranslatedDim = true;
                        field += "_NAME";
                    }
                }
                sql += field + " " + sortType + ","; 
            }
            sql = sql.substring(0, sql.length() - 1);
        }
        List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
        //String countSql = "SELECT COUNT(1) FROM (" + sql + ") COUNT_T";
        try {
            int count = this.queryForCount(sql, new Object[]{});
            int rowNumOfPager = Integer.parseInt("" + params.get("rowNumOfPager"));
            int startOfPager = Integer.parseInt("" + params.get("startOfPager"));
            if (rowNumOfPager == 0 || startOfPager == 0) {
                for (int i = 0; i * 4000 <= count; i++) {
                    String pagerSql = "SELECT A.* FROM (" + sql
                        + ") A LIMIT 4000 OFFSET " + (i * 4000);
                    ArrayList<HashMap<String, Object>> tmpDataList = 
                        mapListToDynamicDictList(this.queryForMapList(pagerSql, new Object[]{}));
                    for (Map<String, Object> dataDict:tmpDataList) {   
                        dataList.add(dataDict);
                    }
                }
            }
            else {
                String pagerSql = "SELECT A.* FROM (" + sql
                    + ") A LIMIT " + rowNumOfPager + " OFFSET " + ((startOfPager - 1) * rowNumOfPager);
                ArrayList<HashMap<String, Object>> tmpDataList = mapListToDynamicDictList(this.queryForMapList(pagerSql, new Object[]{}));
                for (Map<String, Object> dataDict:tmpDataList)    {   
                    dataList.add(dataDict);  
                }
            }
            // 对翻译列进行转换，区分id与name
            convertDimCol(dataList, translateDimList);
            params.put("DR", dataList);
            params.put("dataList", dataList);
            params.put("recordCount", count);
            params.put("sql", sql);
        } 
        catch (Exception e) {
            LOG.error(e);
            throw new BaseAppException();
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param dataList 
     * @param translateDimList 
     * @throws BaseAppException <br>
     */ 
    private void convertDimCol(List<Map<String, Object>> dataList, ArrayList<Map<String, Object>> translateDimList) throws BaseAppException {
        for (int i = 0; i < dataList.size(); i++) {
            Map<String, Object> dataItem = dataList.get(i);
            for (int j = 0; j < translateDimList.size(); j++) {
                Map<String, Object> dimDict = translateDimList.get(j);
                String col_index = (String) (dimDict.get("COL_INDEX") == null ? dimDict.get("DIM_CODE") : dimDict.get("COL_INDEX"));
                String col_id_index = col_index + "_ID";
                String col_name_index = col_index + "_NAME";
                String id =  dataItem.get(col_index) + "";
                String name = dataItem.get(col_name_index) + "";
                dataItem.put(col_index, name);
                dataItem.put(col_id_index, id);
            }
        }
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param sql 
     * @param modelCode 
     * @param translateDimList 
     * @return String 
     * @throws BaseAppException <br>
     */ 
    private String translateDimDataSql(String sql, String modelCode, ArrayList<Map<String, Object>> translateDimList) throws BaseAppException {
        String outerSelect = "SELECT LEFT_SRC_T.*";
        String tableSql = "(" + sql + ") LEFT_SRC_T";
        // SELECT TMP_DIM_T_1.NAME AS DIM_2,x.* FROM (sql) x,(X1) B,(X2) C WHERE x.DIM_2=X1.ID(+) AND x.DIM_3=X2.ID(+)
        for (int i = 0; i < translateDimList.size(); i++) {
            Map<String, Object> dimDict = translateDimList.get(i);
            String colIndex = (String) (dimDict.get("COL_INDEX") == null ? dimDict.get("DIM_CODE") : dimDict.get("COL_INDEX"));
            Object metaDimCode = dimDict.get("META_DIM_CODE");
            //
            JSONObject tmpMetaDict = new JSONObject();
            tmpMetaDict.put("MODEL_BUSI_CODE", modelCode);
            tmpMetaDict = ((ModelBusiService) SpringContext.getBean("modelBusiServ")).getModelBusiField(tmpMetaDict);
            List<Map<String, Object>> modelFieldList = (List<Map<String, Object>>) tmpMetaDict.get("modelField");
            for (int j = 0; j < modelFieldList.size(); j++) {
                Map<String, Object> modelField = modelFieldList.get(j);
                if (modelField.get("FIELD_CODE").equals(colIndex)) {
                    metaDimCode = "" + modelField.get("DIM_CODE");
                }
            }
            if (metaDimCode == null) {
                continue;
            }
            JSONObject tmpDimDict = new JSONObject();
            tmpDimDict.put("DIM_CODE", metaDimCode);
            tmpDimDict = ((DimService) SpringContext.getBean("dimServ")).getDimInfo(tmpDimDict);
            List<Map<String, Object>> dimInfoList = (List<Map<String, Object>>) tmpDimDict.get("scriptList");
            String dimScript = "";
            if (dimInfoList.size() > 0) {
                dimScript =  (String) (dimInfoList.get(0).get("DIM_SCRIPT"));
            }
            //
            String dimTableName = "TMP_DIM_T_" + i;
            outerSelect += ", IFNULL(" + dimTableName + ".NAME," + colIndex + ") AS " + colIndex + "_NAME";
            tableSql += " LEFT JOIN (" + dimScript + ") " + dimTableName + " ON LEFT_SRC_T." + colIndex + "=" + dimTableName + ".ID";
        }
        sql = outerSelect + " FROM " + tableSql;
        return sql;   
    }
    
    /**
     * [非二次排序的主排序] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @param colInSelectSqlList  
     * @param hideColList 
     * @return mainSortSql
     * @throws BaseAppException <br>
     */ 
    private String mainSortSqlFunction(Map<String, Object> params, ArrayList<String> colInSelectSqlList, ArrayList<String> hideColList) 
        throws BaseAppException {
        String sortCol = "" + params.get("sortCol");
        String sortType = "" + params.get("sortType");
        List<String> mainSortColList = new ArrayList<String>(); 
        List<String> mainSortTypeList = new ArrayList<String>();  
        // 全局排序属性
        ArrayList<Map<String, Object>> dimAndIndiSortList =  (ArrayList<Map<String, Object>>) params.get("dimAndIndiSortList"); 
        if (null != sortCol && !"".equals(sortCol) && null != sortType && !"".equals(sortType)) {
            String[] mainSortCols = sortCol.split(","); 
            for (int i = 0; i < mainSortCols.length; i++) {  
                mainSortColList.add(mainSortCols[i]);  
            }
            String[] mainSortTypes = sortType.split(",");
            for (int i = 0; i < mainSortTypes.length; i++) {
                mainSortTypeList.add(mainSortTypes[i]);  
            }
        }
        else {
            for (int i = 0; i < dimAndIndiSortList.size(); i++) {  
                Map<String, Object> sortObj = dimAndIndiSortList.get(i);
                mainSortColList.add("" + sortObj.get("COL_INDEX"));  
                mainSortTypeList.add("" + sortObj.get("SORT_TYPE"));  
            }
        }
        for (int i = 0; i < hideColList.size(); i++) {
            String hideCol = hideColList.get(i);
            for (int j = 0; j < mainSortColList.size(); j++) {
                if (hideCol.equals(mainSortColList.get(j))) {
                    mainSortColList.remove(j);
                    mainSortTypeList.remove(j);
                }
            }
        }
        for (int i = 0; i < mainSortColList.size(); i++) {
            String mainSortCol = mainSortColList.get(i);
            boolean isExist = false;
            for (int j = 0; j < colInSelectSqlList.size() && !isExist; j++) {
                if (mainSortCol.equals(colInSelectSqlList.get(j))) {
                    isExist = true;
                }
            }
            if (!isExist) {
                mainSortColList.remove(i);
                mainSortTypeList.remove(i);
            }
        }
        String mainSortSql = "";
        for (int i = 0; i < mainSortColList.size(); i++) {
            String mainSortCol = mainSortColList.get(i);
            if (!"".equals(mainSortCol.trim())) {
                mainSortSql += "," + mainSortColList.get(i) + " " + mainSortTypeList.get(i);
            }
        }
        if (!"".equals(mainSortSql)) {
            mainSortSql = " ORDER BY " + mainSortSql.substring(1);
        }
        return mainSortSql;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topic_no 
     * @param tableName 
     * @param vdimColNoList 
     * @param vdimColIndexList 
     * @param vdimList 
     * @param subQryWhereSql 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String getTableNameWithVdim(String topic_no, String tableName, ArrayList<String> vdimColNoList, 
        ArrayList<String> vdimColIndexList, ArrayList<Map<String, Object>> vdimList, String subQryWhereSql) throws BaseAppException {
        String result = "(SELECT ";
        for (int i = 0; i < vdimColNoList.size(); i++) {
            String colNo = vdimColNoList.get(i);
            String colIndex = vdimColIndexList.get(i);
            for (int j = 0; j < vdimList.size(); j++) {
                Map<String, Object> vdimObj = (Map<String, Object>) vdimList.get(j);
                if (vdimObj.get("VDIM_CODE").equals(colNo)) {
                    ArrayList<Map<String, Object>> groupList = (ArrayList<Map<String, Object>>) vdimObj.get("groupList");
                    String VDIM_FIELD = "" + vdimObj.get("VDIM_FIELD");
                    String VDIM_TYPE = "" + vdimObj.get("VDIM_TYPE");
                    String NOGROUP_NAME = "" + vdimObj.get("NOGROUP_NAME");
                    for (int k = 0; k < groupList.size(); k++) {
                        Map<String, Object> groupObj = groupList.get(k);
                        String groupName = "" + groupObj.get("name");
                        String vdimValueSql = "SELECT PARAM_VALUE FROM PM_TOPIC_GCOL_ATTR_PARAM WHERE TOPIC_NO='"
                                + topic_no + "' AND SEQ=0 AND PARAM_SEQ=" + k;
                        if ("1".equals(VDIM_TYPE)) { // 按表达式
                            /*ParamArray pa = new ParamArray();
                            pa.set("", topic_no);
                            pa.set("", k);*/
                            vdimValueSql = "" + (((ArrayList<Map<String, Object>>) groupObj.get("items")).get(0)).get("id");
                        }
                        if (k == 0) {
                            result += " CASE WHEN " + VDIM_FIELD + " IN (" + vdimValueSql + ") THEN '" + groupName + "'";
                        }
                        else {
                            result += " WHEN " + VDIM_FIELD + " IN (" + vdimValueSql + ") THEN '" + groupName + "'";
                        }
                    }
                    result += " ELSE '" + NOGROUP_NAME + "' END AS " + colIndex + ","; 
                }
            }
        }
        //
        result += "A.* FROM " + tableName + " A WHERE " + subQryWhereSql + ") TMP ";
        return result;
    }
    
    @Override
    public Map<String, Object> loadTopic(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
        // PM_TOPIC_LIST主题基本信息
        loadPmTopicList(params);
        // PM_TOPIC_GCOL维度指标
        loadPmTopicGcol(params);
        // PM_TOPIC_GCOL_ATTR维度指标属性
        loadPmTopicGcolAttr(params);
        // PM_TOPIC_FILTER主题筛选器、筛选器筛选方式
        loadPmTopicFilter(params);
        // PM_TOPIC_ECHART主题图表概况
        loadPmTopicChart(params);
        // PM_TOPIC_ECHART_ATTR主题图表属性
        loadPmTopicChartAttr(params);
        // PM_TOPIC_ECHART_AXIS饼系图表的组属性
        loadPmTopicChartAxis(params);
        // PM_TOPIC_GCOL_ATTR_PARAM虚拟维度属性
        loadPmTopicGcolAttrParam(params);
        // PM_TOPIC_LAYOUT图表布局属性
        loadPmTopicLayout(params);
        return params;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicList(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
        String sql = "SELECT "
            + "CLASS_NO,"
            + "TOPIC_NO,"
            + "TOPIC_NAME,"
            + "SEQ,"
            + "MODEL_CODE,"
            + "DATE_GRAN,"
            + "STATE,"
            + "OPER_USER,"
            + "OPER_DATE,"
            + "BP_ID,"
            + "LAYOUT_TYPE,"
            + "PRELINE_ECHARTS "
            + "FROM PM_TOPIC_LIST WHERE TOPIC_NO=? AND STATE=1 AND SEQ=0";
        List<Map<String, Object>> topicList = queryForMapList(sql, new Object[] {topicNo});
        params.put("topicList", topicList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicGcol(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
        String dimAndIndiSql = "SELECT "
            + "PTL.TOPIC_NO,"
            + "PTG.COL_TYPE,"
            + "PTG.GL_DIMKPI,"
            + "PTG.COL_NO "
            + "FROM PM_TOPIC_LIST PTL,PM_TOPIC_GCOL PTG "
            + "WHERE PTL.TOPIC_NO=? AND PTL.TOPIC_NO=PTG.TOPIC_NO AND PTL.STATE=1 AND PTL.SEQ=0 AND PTG.SEQ=0 "
            + "ORDER BY PTG.TOPIC_NO,PTG.COL_SEQ";
        List<Map<String, Object>> dimAndIndiList = queryForMapList(dimAndIndiSql, new Object[] {topicNo});
        params.put("dimAndIndiList", dimAndIndiList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicGcolAttr(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "COL_NO,"
            + "COL_SEQ,"
            + "COL_TYPE,"
            + "SEQ,"
            + "ATTR_CODE,"
            + "ATTR_VALUE,"
            + "ATTR_SEQ "
            + "FROM PM_TOPIC_GCOL_ATTR "
            + "WHERE TOPIC_NO=? AND SEQ=0";
        List<Map<String, Object>> dimIndiAttrList = queryForMapList(sql, new Object[] {topicNo});
        params.put("dimIndiAttrList", dimIndiAttrList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicFilter(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
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
        List<Map<String, Object>> topicFilterList = queryForMapList(sql, new Object[] {topicNo});
        params.put("topicFilterList", topicFilterList);
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
        List<Map<String, Object>> topicEmptyFilterList = queryForMapList(sql, new Object[] {topicNo});
        params.put("topicEmptyFilterList", topicEmptyFilterList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicChart(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
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
        List<Map<String, Object>> topicChartList = queryForMapList(sql, new Object[] {topicNo});
        params.put("topicChartList", topicChartList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicChartAttr(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
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
        List<Map<String, Object>> topicChartAttrList = queryForMapList(sql, new Object[] {topicNo});
        params.put("topicChartAttrList", topicChartAttrList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void  loadPmTopicChartAxis(Map<String, Object> params) throws BaseAppException {
         
        String topicNo = (String) params.get("topicNo");
        //
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "SEQ,"
            + "GROUP_NO || '' AS GROUP_NO,"
            + "GROUP_TITLE,"
            + "COL_TYPE,"
            + "COL_NO,"
            + "COL_SEQ "
            + "FROM PM_TOPIC_ECHART_AXIS "
            + "WHERE TOPIC_NO=? AND SEQ=0 "
            + "ORDER BY ECHART_NO,GROUP_NO";
        List<Map<String, Object>> attrList = queryForMapList(sql, new Object[] {topicNo});
        List<HashMap<String, String>> groupList = new ArrayList<HashMap<String, String>>();
        String ECHART_NO = "";
        String GROUP_NO = "";
        for (int i = 0; i < attrList.size(); i++) {
            String ECHART_NO_TMP = CommonUtil.getStrFromMap(attrList.get(i), "ECHART_NO", "");
            String GROUP_NO_TMP = ((Long) attrList.get(i).get("GROUP_NO")).toString();
            String GROUP_TITLE = CommonUtil.getStrFromMap(attrList.get(i), "GROUP_TITLE", "");
            String COL_TYPE = CommonUtil.getStrFromMap(attrList.get(i), "COL_TYPE", "");
            String COL_NO = CommonUtil.getStrFromMap(attrList.get(i), "COL_NO", "");
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
        params.put("groupList", groupList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicGcolAttrParam(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
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
        List<Map<String, Object>> vdimGroupAttrList = queryForMapList(sql, new Object[] {topicNo});
        params.put("vdimGroupAttrList", vdimGroupAttrList);
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param params 
     * @throws BaseAppException <br>
     */ 
    public void loadPmTopicLayout(Map<String, Object> params) throws BaseAppException {
        String topicNo = (String) params.get("topicNo");
        //
        String sql = "SELECT "
            + "TOPIC_NO,"
            + "ECHART_NO,"
            + "DISPLAY_SEQ,"
            + "SEQ "
            + "FROM PM_TOPIC_LAYOUT "
            + "WHERE TOPIC_NO=? AND SEQ=0 ORDER BY DISPLAY_SEQ";
        List<Map<String, Object>> chartOrderList = queryForMapList(sql, new Object[] {topicNo});
        params.put("chartOrderList", chartOrderList);
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
        String classNo = AdhocSeqUtil.getAdhocSeq("PMS", "TC", 8, "PM_ADHOC_SEQ");
        return classNo;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param classNo 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryClassNoMaxSeq(String classNo) throws BaseAppException {
        String sql = "SELECT IFNULL(MAX(SEQ),0)+1 AS MAX_SEQ FROM PM_TOPIC_CLASS WHERE CLASS_NO=?";
        String seq = this.queryForLong(sql, "MAX_SEQ", new Object[] {classNo}) + "";
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
    public String qryTopicSysclassMaxSeq(String topicNo, String classType, Long operUser) throws BaseAppException {
        String sql = "SELECT IFNULL(MAX(SEQ),0)+1 AS MAX_SEQ FROM PM_TOPIC_SYSCLASS WHERE TOPIC_NO=? AND CLASS_TYPE=? AND OPER_USER=?";
        String seq = this.queryForLong(sql, "MAX_SEQ", new Object[] {topicNo, classType, operUser}) + "";
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
        String sql = "SELECT IFNULL(MAX(SEQ),0)+1 AS MAX_SEQ FROM PM_TOPIC_SHARE WHERE TOPIC_NO=?";
        String seq = this.queryForLong(sql, "MAX_SEQ", new Object[] {topicNo}) + "";
        return seq;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @param topicNo 
     * @return String
     * @throws BaseAppException <br>
     */ 
    public String qryTopicMaxSeq(String topicNo) throws BaseAppException {
        String sql = "SELECT IFNULL(MAX(SEQ),0)+1 AS MAX_SEQ FROM PM_TOPIC_LIST WHERE TOPIC_NO=?";
        String seq = this.queryForLong(sql, "MAX_SEQ", new Object[] {topicNo}) + "";
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
        String sql = "SELECT IFNULL(MAX(SEQ),0)+1 AS MAX_SEQ FROM PM_TOPIC_SYSCLASS WHERE TOPIC_NO=?";
        String seq = this.queryForLong(sql, "MAX_SEQ", new Object[] {topicNo}) + "";
        return seq;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author tianzhen <br>
     * @taskId <br>
     * @return topicNo 
     * @throws BaseAppException <br>
     */ 
    public String qryTopicNo() throws BaseAppException {
        String topicNo = AdhocSeqUtil.getAdhocSeq("PMS", "TP", 8, "PM_ADHOC_SEQ");
        return topicNo;
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
        String operNo = AdhocSeqUtil.getAdhocSeq("PMS", "OP", 8, "PM_ADHOC_SEQ");
        return operNo;
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
            else if ("_H".equals(dateGranu) || "_15".equals(dateGranu)) {
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
            else if ("_H".equals(dateGranu) || "_15".equals(dateGranu)) {
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
            else if ("_H".equals(dateGranu)  || "_15".equals(dateGranu)) {
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
     * @param mapDataList 
     * @return <br>
     * @throws BaseAppException 
     */ 
    private ArrayList<HashMap<String, Object>> mapListToDynamicDictList(List<Map<String, Object>> mapDataList) throws BaseAppException {
        ArrayList<HashMap<String, Object>> dataList = new ArrayList<HashMap<String, Object>>();
        for (int i = 0; i < mapDataList.size(); i++) {
            HashMap<String, Object> dataDict = new HashMap<String, Object>();
            Map<String, Object> dataMap = mapDataList.get(i);
            for (Map.Entry<String, Object> entry : dataMap.entrySet()) {
                dataDict.put(entry.getKey(), entry.getValue());
            }
            dataList.add(dataDict);
        }
        return dataList;
    }
        
}