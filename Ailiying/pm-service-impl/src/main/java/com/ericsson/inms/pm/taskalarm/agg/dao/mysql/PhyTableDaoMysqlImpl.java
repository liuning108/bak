package com.ericsson.inms.pm.taskalarm.agg.dao.mysql;

import com.ericsson.inms.pm.taskalarm.agg.dao.PhyTableConstants;
import com.ericsson.inms.pm.taskalarm.agg.dao.PhyTableDao;
import com.ztesoft.zsmart.core.jdbc.util.SqlUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class PhyTableDaoMysqlImpl extends PhyTableDao {
    private Logger logger = LoggerFactory.getLogger(PhyTableDaoMysqlImpl.class);

    @Override
    public List<Map<String,Object>> selectPhyTable() {
        String sql = "select TASK_NO,TASK_STEP_ID ,PARAM_VALUE from pm_task_step_param" +
                " where TASK_NO in (select task_no from pm_task_info where task_type = '02' )" +
                "and param_code='MODEL_CODE'";

        return this.queryForMapList(sql);
    }

    @Override
    public List<Map<String,Object>> selectWholeKpi() {
        String sql = "select KPI_CODE from PM_KPI_FORM";
        try {
            SqlUtil.unlimitResutlSet();
            return this.queryForMapList(sql);
        } catch (Exception e){
            return new ArrayList<>();
        } finally {
            SqlUtil.limitResutlSet();
        }

    }

    @Override
   public  List<Map<String,Object>> selectInputData(String table, List<String> realCols, int lastN)
       throws Exception{
        //拼时间
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        long nowTimestamp = System.currentTimeMillis();
        String nowTimeStr = format.format(new Date(nowTimestamp));

        long lastTimestamp = nowTimestamp - (lastN * 86400000L);
        String lastStr = format.format(new Date(lastTimestamp));

        //拼columns
        StringBuilder sb = new StringBuilder();
        for (String col : realCols){
            sb.append(col).append(",");
        }
        //TODO 注意检查
        String colsStr = sb.substring(0, sb.length()-1);
        String sql = "select " + PhyTableConstants.GID + "," + colsStr +
                " from " + table +
                " where sttime between '" + lastStr + "' and '" + nowTimeStr + "'";
        return this.queryForMapList(sql);
    }
}
