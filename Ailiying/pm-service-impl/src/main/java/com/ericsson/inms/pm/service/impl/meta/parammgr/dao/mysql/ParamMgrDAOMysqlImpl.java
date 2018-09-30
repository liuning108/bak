package com.ericsson.inms.pm.service.impl.meta.parammgr.dao.mysql;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ericsson.inms.pm.service.impl.meta.parammgr.dao.ParamMgrDAO;
import com.ztesoft.zsmart.core.exception.BaseAppException;

/**
 * Description: <br>
 * 
 * @author XXX<br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao.mysql <br>
 */
public class ParamMgrDAOMysqlImpl extends ParamMgrDAO {

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @return List<Map<String, Object>>
     * @throws BaseAppException <br>
     */
    public List<Map<String, Object>> loadParam() throws BaseAppException {
        String sql = "SELECT PARA_ID,PARA_VALUE,PARA_NAME,PARA_DESC FROM PM_PARAMETER";

        List<Map<String, Object>> paramList = this.queryForList(sql);
        return paramList;
    }

    /**
     * Description: <br>
     * 
     * @author XXX<br>
     * @taskId <br>
     * @param paramList paramList
     * @throws BaseAppException <br>
     */
    @SuppressWarnings("unchecked")
    @Override
    public void updateParams(List<Map<String, String>> paramList) throws BaseAppException {
        String sql = "UPDATE PM_PARAMETER SET PARA_VALUE=? WHERE PARA_ID=?";

        List<Object[]> batchArgs = new ArrayList<Object[]>();

        for (Map<String, String> param : paramList) {
            List<Object> objList = new ArrayList<Object>();
            objList.add(param.get("PARA_VALUE"));
            objList.add(param.get("PARA_ID"));

            batchArgs.add(objList.toArray());
        }

        this.batchUpdate(sql, batchArgs);
    }

}