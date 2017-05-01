package com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.SlaScItemTableDAO;

/**
 * [服务实例表访问] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016年8月17日 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.slm.statisticeval.slmtask.dao.oracle <br>
 */
public class SlaScItemTableDAOOracleImpl extends SlaScItemTableDAO {

    /**
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @param slaNo <br>
     * @return <br>
     * @throws BaseAppException <br>
     */
    @Override
    public int selectDataBySlaNo(String slaNo) throws BaseAppException {
        String selectsql = "select count(1) from slm_sla_sc_item_inst_list where sla_instid = ?";
        ParamArray paramArr = new ParamArray();
        paramArr.set("", slaNo);
        return this.queryInt(selectsql, paramArr);
    }

}
