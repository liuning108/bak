package com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic.domain.SlaTpl;

/** 
 * [描述] 评估结果所有配置表<br> 
 *  
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年10月8日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.datastatistic <br>
 */
public class CreateTableSql {
    
    /**
     * slm_sla_eval_inst_yyyymm SLA/OLA评估实例（计算实例） <br>
     */
    private String slaEvalInst = "";
    
    /**
     * slm_slo_eval_inst SLO评估实例（计算实例） <br>
     */
    private String sloEvalInst = "";
    
    /**
     * slm_sli_eval_inst SLI计算实例（计算实例） <br>
     */
    private String sliEvalInst = "";
    
    /**
     * slm_sla_eval_win_inst SLA/OLA评估实例（窗口实例） <br>
     */
    private String slaEvalWinInst = "";

    /**
     * slm_slo_eval_win_inst SLO评估实例（窗口实例） <br>
     */
    private String sloEvalWinInst = "";
    
    /**
     * slm_sli_eval_win_inst SLI计算实例（窗口实例） <br>
     */
    private String sliEvalWinInst = "";

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time 
     * @return <br>
     */ 
    public String getSlaEvalInst(Calendar time) {
        slaEvalInst = "CREATE TABLE SLM_SLA_EVAL_INST_" + new SimpleDateFormat("yyyyMM").format(time.getTime()) + "(\n" 
                + "TASK_ID VARCHAR(32) NOT NULL,\n"
                + "BTIME DATE NOT NULL,\n"
                + "ETIME DATE,\n"
                + "SLA_EVALUATE_CYCLE VARCHAR2(2),\n"
                + "YEAR INT,\n"
                + "MON INT,\n"
                + "QUARTER INT,\n"
                + "SLA_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLO_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLI_INSTID VARCHAR2(26),\n"
                + "INST_STATE INT\n"
                    + ")";
        return slaEvalInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time 
     * @return <br>
     */ 
    public String getSloEvalInst(Calendar time) {
        sloEvalInst = "CREATE TABLE SLM_SLO_EVAL_INST_" + new SimpleDateFormat("yyyyMM").format(time.getTime()) + "(\n"
                + "TASK_ID VARCHAR(32) NOT NULL,\n"
                + "BTIME DATE NOT NULL,\n"
                + "ETIME DATE,\n"
                + "SLA_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLO_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLI_INSTID VARCHAR2(26),\n"
                + "INST_STATE INT\n"
                    + ")";
        return sloEvalInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time 
     * @return <br>
     */ 
    public String getSliEvalInst(Calendar time) {
        sliEvalInst = "CREATE TABLE SLM_SLI_EVAL_INST_" + new SimpleDateFormat("yyyyMM").format(time.getTime()) + "(\n"
                + "TASK_ID VARCHAR(32) NOT NULL,\n"
                + "BTIME DATE NOT NULL,\n"
                + "ETIME DATE,\n"
                + "OBJECTIVES_VALUE NUMBER(15,6),\n"
                + "WARN_VALUE NUMBER(15,6),\n"
                + "SLA_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLO_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLI_INSTID VARCHAR2(26),\n"
                + "SLI_VALUE NUMBER(15,6),\n"
                + "SC_ITEM_INST_TYPE INT DEFAULT 1 NOT NULL,\n"
                + "SC_ITEM_INST_ID VARCHAR2(32),\n"
                + "INST_STATE INT\n"
                + ")";
        return sliEvalInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time 
     * @return <br>
     */ 
    public String getSlaEvalWinInst(Calendar time) {
        slaEvalWinInst = "CREATE TABLE SLM_SLA_EVAL_WIN_INST_" + new SimpleDateFormat("yyyyMM").format(time.getTime()) + "(\n"
                + "TASK_ID VARCHAR(32) NOT NULL,\n"
                + "BTIME DATE NOT NULL,\n"
                + "ETIME DATE,\n"
                + "SLA_EVALUATE_CYCLE VARCHAR2(2),\n"
                + "YEAR INT,\n"
                + "MON INT,\n"
                + "QUARTER INT,\n"
                + "SLA_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLO_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLI_INSTID VARCHAR2(26),\n"
                + "INST_STATE INT\n"
                + ")";
        return slaEvalWinInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time 
     * @return <br>
     */ 
    public String getSloEvalWinInst(Calendar time) {
        sloEvalWinInst = "CREATE TABLE SLM_SLO_EVAL_WIN_INST_" + new SimpleDateFormat("yyyyMM").format(time.getTime()) + "(\n"
                + "TASK_ID VARCHAR(32) NOT NULL,\n"
                + "BTIME DATE NOT NULL,\n"
                + "ETIME DATE,\n"
                + "SLA_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLO_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLI_INSTID VARCHAR2(26),\n"
                + "INST_STATE INT\n"
                + ")";
        return sloEvalWinInst;
    }

    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param time 
     * @return <br>
     */ 
    public String getSliEvalWinInst(Calendar time) {
        sliEvalWinInst = "CREATE TABLE SLM_SLI_EVAL_WIN_INST_" + new SimpleDateFormat("yyyyMM").format(time.getTime()) + "(\n"
                + "TASK_ID VARCHAR(32) NOT NULL,\n"
                + "BTIME DATE NOT NULL,\n"
                + "ETIME DATE,\n"
                + "OBJECTIVES_VALUE NUMBER(15,6),\n"
                + "WARN_VALUE NUMBER(15,6),\n"
                + "SLA_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLO_INSTID VARCHAR2(26) NOT NULL,\n"
                + "SLI_INSTID VARCHAR2(26),\n"
                + "SLI_VALUE NUMBER(15,6),\n"
                + "SC_ITEM_INST_TYPE INT DEFAULT 1 NOT NULL,\n"
                + "SC_ITEM_INST_ID VARCHAR2(32),\n"
                + "INST_STATE INT\n"
                + ")";
        return sliEvalWinInst;
    }
    
    /**
     * [方法描述] <br> 
     *  
     * @author [作者名]<br>
     * @taskId <br>
     * @param st 
     * @param btime 
     * @param etime 
     * @throws BaseAppException  <br>
     */ 
    public void initEvalTable(SlaTpl st, Calendar btime, Calendar etime) throws BaseAppException {
        while (-1 == btime.compareTo(etime)) {
            if (!st.isExistTable("SLM_SLA_EVAL_INST_" + new SimpleDateFormat("yyyyMM").format(btime.getTime()))) {
                st.executeSql(getSlaEvalInst(btime));
            }
            if (!st.isExistTable("SLM_SLO_EVAL_INST_" + new SimpleDateFormat("yyyyMM").format(btime.getTime()))) {
                st.executeSql(getSloEvalInst(btime));
            }
            if (!st.isExistTable("SLM_SLI_EVAL_INST_" + new SimpleDateFormat("yyyyMM").format(btime.getTime()))) {
                st.executeSql(getSliEvalInst(btime));
            }
            if (!st.isExistTable("SLM_SLA_EVAL_WIN_INST_" + new SimpleDateFormat("yyyyMM").format(btime.getTime()))) {
                st.executeSql(getSlaEvalWinInst(btime));
            }
            if (!st.isExistTable("SLM_SLO_EVAL_WIN_INST_" + new SimpleDateFormat("yyyyMM").format(btime.getTime()))) {
                st.executeSql(getSloEvalWinInst(btime));
            }
            if (!st.isExistTable("SLM_SLI_EVAL_WIN_INST_" + new SimpleDateFormat("yyyyMM").format(btime.getTime()))) {
                st.executeSql(getSliEvalWinInst(btime));
            }
            btime.add(Calendar.MONTH, 1);
        }
    }
}
