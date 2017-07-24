	package test.com.test;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.core.service.DynamicDict;
import com.ztesoft.zsmart.core.service.IAction;
import com.ztesoft.zsmart.oss.core.pm.bscreen.dao.BScreenMgrDao;
import com.ztesoft.zsmart.oss.core.pm.bscreen.domain.AbstractBScreenMgr;
import com.ztesoft.zsmart.oss.core.pm.bscreen.service.BScreenService;
import com.ztesoft.zsmart.oss.opb.util.GeneralDAOFactory;
import com.ztesoft.zsmart.oss.opb.util.GeneralDMOFactory;
import com.ztesoft.zsmart.oss.opb.util.JdbcUtil;

public class SourceServiceDaoText  {
	
	@org.junit.Test
	public void delSourceServiceById() throws BaseAppException{
		BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class,JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
		HashMap<String,String> param = new HashMap<String, String>();
		param.put("Id", "PMS_20170724111357_10116961");
		dao.delSourceServiceById(param);
		
		 try {
			 dao.getConnection().commit();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
	}

	
	@org.junit.Test
	public void testGetFields() throws BaseAppException{
	 AbstractBScreenMgr bsm = (AbstractBScreenMgr) GeneralDMOFactory.create(AbstractBScreenMgr.class);
	 HashMap<String,String> param = new HashMap<String, String>();
	 param.put("source", "1000000");
	 param.put("sql", "select * from dual");
	 System.out.println(bsm.getFields(param));
	 
	}
	
	@org.junit.Test
	public void testSaveOrUpdateSourceService() throws BaseAppException{
		BScreenMgrDao dao = (BScreenMgrDao) GeneralDAOFactory.create(BScreenMgrDao.class,JdbcUtil.getDbIdentifier(JdbcUtil.OSS_PM));
		 Map<String,String> map = new HashMap<String, String>();
		 map.put("no","0");
		 map.put("name", "PMP_TEST");
		 map.put("type", "1");
		 map.put("source", "1000000");
		 map.put("userId", "1");

String value = ""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\""
+ "select 1 from dual\",\"colModels\":[{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"},{\"name\":\"a1\",\"as\":\"a\"},{\"name\":\"b1\",\"as\":\"b\"}]}}\"";


      map.put("attrs", value);
		 
		System.out.println(dao.saveOrUpdateSourceService(map)); 
		 try {
			dao.getConnection().commit();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
		 
	}
}
