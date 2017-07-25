package test.com.test;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;


import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

/**
 * 
 * [描述] <br>
 * 
 * @author [作者名]<br>
 * @version 1.0<br>
 * @taskId <br>
 * @CreateDate 2017年7月25日 <br>
 * @since V7.0<br>
 * @see test.com.test <br>
 */
public class SourceServiceDaoText {
    /**
     * 
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @throws BaseAppException
     *             <br>
     */
    @org.junit.Test
    public void delSourceServiceById() throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        HashMap<String, String> param = new HashMap<String, String>();
        param.put("Id", "PMS_20170724111357_10116961");
        dao.delSourceServiceById(param);

        try {
            dao.getConnection().commit();
        }
        catch (SQLException e) {
            e.getMessage();
        }

    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @throws BaseAppException
     *             <br>
     */
    @org.junit.Test
    public void testGetFields() throws BaseAppException {
        AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
        HashMap<String, String> param = new HashMap<String, String>();
        param.put("source", "1000000");
        param.put("sql", "select * from dual");

    }

    /**
     * 
     * [方法描述] <br>
     * 
     * @author [作者名]<br>
     * @taskId <br>
     * @throws BaseAppException
     *             <br>
     */
    @org.junit.Test
    public void testSaveOrUpdateSourceService() throws BaseAppException {
        BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class, JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
        Map<String, String> map = new HashMap<String, String>();
        map.put("no", "0");
        map.put("name", "PMP_TEST");
        map.put("type", "1");
        map.put("source", "1000000");
        map.put("userId", "1");

        String value = "";
        map.put("attrs", value);

        try {
            dao.getConnection().commit();
        }
        catch (SQLException e) {
            // TODO Auto-generated catch block
            e.getMessage();
        }

    }
}
