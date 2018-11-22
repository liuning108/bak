package com.ericsson.inms.pm.taskalarm.agg.dao;

import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

import java.util.List;
import java.util.Map;

public abstract class PhyTableDao extends GeneralDAO<Map<String, String>> {
    /**
     * serialVersionUID <br>
     */
    private static final long serialVersionUID = 1L;

    /**
     * [方法描述] <br>
     *
     * @author [作者名]<br>
     * @return  <br>
     */
    public abstract List<Map<String, Object>> selectPhyTable();

    public abstract List<Map<String,Object>> selectWholeKpi();

    public abstract List<Map<String,Object>> selectInputData(
            String table, List<String> realCols, int lastN) throws Exception;
}
