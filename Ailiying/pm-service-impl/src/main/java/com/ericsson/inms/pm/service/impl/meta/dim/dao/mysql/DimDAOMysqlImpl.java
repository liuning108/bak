package com.ericsson.inms.pm.service.impl.meta.dim.dao.mysql;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.ericsson.inms.pm.api.dto.meta.dim.DimDto;
import com.ericsson.inms.pm.api.dto.meta.dim.DimScriptDto;
import com.ericsson.inms.pm.service.impl.exception.ExceptionConstants;
import com.ericsson.inms.pm.service.impl.meta.dim.dao.DimDAO;
import com.ericsson.inms.pm.service.impl.util.tool.CommonUtil;
import com.ericsson.inms.pm.service.impl.util.tool.PMTool;
import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;

/**
 * Description: <br>
 * 
 * @author <br>
 * @version 8.0<br>
 * @taskId <br>
 * @CreateDate 2018年6月12日 <br>
 * @since V8<br>
 * @see com.ericsson.zsmart.oss.core.pm.meta.dim.dao.mysql <br>
 */
public class DimDAOMysqlImpl extends DimDAO {

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dict dict
     * @return JSONObject
     * @throws BaseAppException <br>
     */
    @Override
    public JSONObject getDimInfo(JSONObject dict) throws BaseAppException {
        String dimCode = CommonUtil.getStrFromMap(dict, "DIM_CODE", "");
        String dimCodes = CommonUtil.getStrFromMap(dict, "DIM_CODE_S", "");
        if (StringUtils.isNotEmpty(dimCodes)) {
            dimCodes = "'" + dimCodes.replaceAll("[',']", "','") + "'";
        }

        String sql = "SELECT DIM.DIM_NAME,    \n" + "       DIM.DIM_CODE,    \n" + "       DIM.DIM_DESC,    \n"
            + "       DIM.BP_ID    \n" + "  FROM PM_DIM DIM    \n" + " WHERE 1 = 1    \n"
            + PMTool.ternaryExpression("".equals(dimCode), "", " AND DIM.DIM_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(dimCodes), "", " AND DIM.DIM_CODE in (" + dimCodes + ")   \n")
            + " ORDER BY DIM.DIM_NAME ASC,DIM.DIM_CODE ASC    \n";

        List<Object> paramList = new ArrayList<Object>();

        if (StringUtils.isNotEmpty(dimCode)) {
            paramList.add(dimCode);
        }

        List dimList = queryForMapList(sql, paramList.toArray());

        sql = "SELECT DIM_S.DIM_CODE, DIM_S.SCRIPT_TYPE, DIM_S.DIM_SCRIPT, DIM_S.DIM_SCRIPT_NO, DIM_S.BP_ID    \n"
            + "  FROM PM_DIM_SCRIPT DIM_S    \n"
            + " WHERE EXISTS (SELECT 1 FROM PM_DIM DIM WHERE DIM_S.DIM_CODE = DIM.DIM_CODE)    \n"
            + PMTool.ternaryExpression("".equals(dimCode), "", " AND DIM_S.DIM_CODE = ?   \n")
            + PMTool.ternaryExpression("".equals(dimCodes), "", " AND DIM_S.DIM_CODE IN (" + dimCodes + ")   \n")
            + " ORDER BY DIM_S.DIM_CODE, DIM_S.SCRIPT_TYPE, DIM_S.DIM_SCRIPT_NO ASC    \n";
        List scriptList = queryForMapList(sql, paramList.toArray());
        JSONObject result = new JSONObject();
        result.put("dimList", dimList);
        result.put("scriptList", scriptList);
        return result;
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    @Override
    public void addDimInfo(DimDto dim) throws BaseAppException {

        String countSql = "select * from pm_dim where dim_code = ?";

        int count = queryForCount(countSql, new Object[] {
            dim.getDimCode()
        });

        if (count > 0) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_PARAM_REQUIRED, "CODE已经存在.", dim.getDimCode());
        }

        String insertSql = "insert into pm_dim \n" + " (dim_name, dim_code, dim_desc, bp_id) \n" + "values \n"
            + " (?, ?, ?, ?) \n";

        List<Object> argsList = new ArrayList<Object>();
        argsList.add(dim.getDimName());
        argsList.add(dim.getDimCode());
        argsList.add(dim.getDimDesc());
        argsList.add(dim.getBpId());

        update(insertSql, argsList.toArray());

        this.batchAddScript(dim);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    @Override
    public void editDimInfo(DimDto dim) throws BaseAppException {
        String updateSql = "update pm_dim set dim_name = ?, dim_desc = ?, bp_id = ? where dim_code = ? \n";

        List<Object> argsList = new ArrayList<Object>();
        argsList.add(dim.getDimName());
        argsList.add(dim.getDimDesc());
        argsList.add(dim.getBpId());
        argsList.add(dim.getDimCode());
        int count = update(updateSql, argsList.toArray());
        if (count == 0) {
            ExceptionHandler.publish(ExceptionConstants.PM_COMMON_CODE_NOT_EXISTS, "CODE不存在.", dim.getDimCode());
        }

        this.batchAddScript(dim);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dimCode dimCode
     * @throws BaseAppException <br>
     */
    @Override
    public void delDimInfo(String dimCode) throws BaseAppException {
        String sql = "delete from pm_dim_script where dim_code = ? \n";
        update(sql, dimCode);
        sql = "delete from pm_dim where dim_code = ? \n";
        update(sql, dimCode);
    }

    /**
     * Description: <br>
     * 
     * @author 0027010454<br>
     * @taskId <br>
     * @param dim dim
     * @throws BaseAppException <br>
     */
    private void batchAddScript(DimDto dim) throws BaseAppException {

        String dimCode = dim.getDimCode();
        String deleteSql = "delete from pm_dim_script where dim_code = ? \n";

        List<Object> delArgsList = new ArrayList<Object>();
        delArgsList.add(dimCode);

        this.update(deleteSql, delArgsList.toArray());

        String insertSql = "insert into pm_dim_script \n"
            + " (dim_code, script_type, dim_script, dim_script_no, bp_id) \n" + "values \n" + " (?, ?, ?, ?, ?) \n";

        List<DimScriptDto> scriptDtoList = dim.getScriptList();

        if (CollectionUtils.isNotEmpty(scriptDtoList)) {
            int count = scriptDtoList.size();
            int split = 1000;
            for (int i = 0; i < count; i++) {
                DimScriptDto curScript = scriptDtoList.get(i);
                String script = curScript.getDimScript();
                int sl = script.length();
                int no = (int) Math.ceil((sl * 100) / (split * 100.0));
                for (int k = 0; k < no; k++) {
                    List<Object> insertArgsList = new ArrayList<Object>();
                    insertArgsList.add(curScript.getDimCode());
                    insertArgsList.add(curScript.getScriptType());
                    insertArgsList.add(script.substring(k * split,
                        PMTool.ternaryExpression((sl > (k + 1) * split), (k + 1) * split, sl)));
                    insertArgsList.add(k);
                    insertArgsList.add(curScript.getBpId());
                    this.update(insertSql, insertArgsList.toArray());
                }
            }
        }

    }

}
