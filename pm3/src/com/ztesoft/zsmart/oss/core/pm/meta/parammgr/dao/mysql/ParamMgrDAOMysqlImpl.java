package com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao.mysql;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.exception.ExceptionHandler;
import com.ztesoft.zsmart.core.jdbc.ParamArray;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.utils.ZSmartLogger;
import com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao.ParamMgrDAO;
import com.ztesoft.zsmart.oss.core.pm.meta.vdim.util.VdimSeqUtil;

/**
 * [描述] <br>
 * 
 * @author tianzhen <br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2016-8-8 <br>
 * @since V7.0<br>
 * @see com.ztesoft.zsmart.oss.core.pm.meta.parammgr.dao.mysql <br>
 */
public class ParamMgrDAOMysqlImpl extends ParamMgrDAO {

    /**
     * logger <br>
     */
    ZSmartLogger logger = ZSmartLogger.getLogger(this.getClass());

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void saveParam(DynamicDict dict) throws BaseAppException {
        ArrayList<DynamicDict> paramList = (ArrayList<DynamicDict>) dict.getList("paramList");
        for (DynamicDict param : paramList) {
            insertIntoPmParameter(param);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void insertIntoPmParameter(DynamicDict dict) throws BaseAppException {
        String para_id = dict.getString("PARA_ID");
        String para_value = dict.getString("PARA_VALUE");
        String sql = "UPDATE PM_PARAMETER SET PARA_VALUE=? WHERE PARA_ID=?";
        ParamArray pa = new ParamArray();
        pa.set("", para_value);
        pa.set("", para_id);
        int operateNum = executeUpdate(sql, pa);
        if (operateNum == 0) {
            logger.error("Insert PM_PARAMETER fail\n  insertSQL IS " + sql + " ParamList is " + pa);
            ExceptionHandler.publish("Insert PM_PARAMETER fail ", ExceptionHandler.BUSS_ERROR);
        }
    }

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param dict <br>
     * @throws BaseAppException <br>
     */
    public void loadParam(DynamicDict dict) throws BaseAppException {
        String sql = "SELECT PARA_ID,PARA_VALUE,PARA_NAME,PARA_DESC FROM PM_PARAMETER";
        ParamArray pa = new ParamArray();
        List<HashMap<String, String>> paramList = this.queryList(sql, pa);
        dict.set("paramList", paramList);
    }

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 <br>
     * @return int <br>
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
     * @param arg0 <br>
     * @return HashMap <br>
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
     * @return String <br>
     * @throws BaseAppException <br>
     */
    public String qryClassNo() throws BaseAppException {
        String classNo = VdimSeqUtil.getAdhocSeq("PMS", "TC", 8, "PM_ADHOC_SEQ");
        return classNo;
    }

    /**
     * [方法描述] <br>
     * 
     * @author tianzhen <br>
     * @taskId <br>
     * @param arg0 <br>
     * @return 0 <br>
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
     * @param arg0 <br>
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
     * @param arg0 <br>
     * @return 0 <br>
     * @throws BaseAppException <br>
     */
    @Override
    public int update(Object arg0) throws BaseAppException {
        return 0;
    }
}