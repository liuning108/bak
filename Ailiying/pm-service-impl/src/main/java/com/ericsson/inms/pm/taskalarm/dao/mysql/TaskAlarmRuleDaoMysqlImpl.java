package com.ericsson.inms.pm.taskalarm.dao.mysql;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


import com.ericsson.inms.pm.taskalarm.dao.TaskAlarmRuleDao;
import com.ztesoft.zsmart.oss.opb.log.OpbLogger;

public class TaskAlarmRuleDaoMysqlImpl extends TaskAlarmRuleDao {

	/**
	 * serialVersionUID <br>
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * logger <br>
	 */
	public OpbLogger logger = OpbLogger.getLogger(TaskAlarmRuleDaoMysqlImpl.class, "PM");

	@Override
	public Map<String, Map<String, Object>> selectTemplateRule(String phytable) {
		Map<String, Map<String, Object>> rulemap = new HashMap<String, Map<String, Object>>();
		String sql = "select a.RULE_ID,a.ALARM_TITLE,a.ALARM_BODY,a.ENABLE_ACTION,a.TRIGGER_DATE, "
				+ "a.TRIGGER_TIME,a.PLUGIN_TYPE,a.PLUGIN_NO,a.ALARM_CODE,a.rule_name, "
				+ "b.NE_TYPE,b.STATE,b.OPER_USER,date_format(b.OPER_DATE,'%Y-%m-%d %H:%i:%s') AS OPER_DATE,b.MODEL_PHY_CODE,b.template_id,c.para_name "
				+ "from PM_NE_TEMPLATE_ALARM a,PM_NE_TEMPLATE b,pm_paravalue c "
				+ "where a.TEMPLATE_ID=b.TEMPLATE_ID and b.STATE=1 and c.para_id ='TEMPLATE_CATAGORY' and c.para_value=b.ne_type and b.MODEL_PHY_CODE in (?) "
				+ "order by a.RULE_ID";
		List<Map<String, Object>> list = this.queryForMapList(sql, new Object[] { phytable });
		for (Map<String, Object> rule : list) {
			rulemap.put((String) rule.get("RULE_ID"), rule);
		}
		return rulemap;
	}
	
	@Override
	public List<Map<String, Object>> selectAllTemplateRule(){
		String sql = "select a.RULE_ID,a.ALARM_TITLE,a.ALARM_BODY,a.ENABLE_ACTION,a.TRIGGER_DATE, "
				+ "a.TRIGGER_TIME,a.PLUGIN_TYPE,a.PLUGIN_NO,a.ALARM_CODE,a.rule_name, "
				+ "b.NE_TYPE,b.STATE,b.OPER_USER,date_format(b.OPER_DATE,'%Y-%m-%d %H:%i:%s') AS OPER_DATE,b.MODEL_PHY_CODE,b.template_id,c.para_name "
				+ "from PM_NE_TEMPLATE_ALARM a,PM_NE_TEMPLATE b,pm_paravalue c "
				+ "where a.TEMPLATE_ID=b.TEMPLATE_ID and b.STATE=1 and c.para_id ='TEMPLATE_CATAGORY' and c.para_value=b.ne_type "
				+ "order by a.RULE_ID";
		return this.queryForMapList(sql);
	}

	@Override
	public List<Map<String, Object>> selectRuleLevel(String ruleid) {
		String sql = "select RULE_ID,RULE_TYPE,ALARM_LEVEL,CONDI_TYPE,TIME_WINDOW,TIME_WINDOW_VALUE"
				+ "			from PM_NE_TEMPLATE_ALARM_RULE" + "			where rule_id=?";

		return this.queryForMapList(sql, new Object[] { ruleid });
	}

	@Override
	public List<Map<String, Object>> selectRuleLevelConds(String ruleid, String level) {
		String sql = "select A.RULE_ID,A.RULE_TYPE,A.ALARM_LEVEL,A.KPI_CODE,B.KPI_NAME,A.KPI_MATH,A.OPER_TYPE,A.THRESHOLD_TYPE,A.THRESHOLD_VALUE,"
				+ "	A.THRESHOLD_VALUE2,A.THRESHOLD_VALUE3,A.THRESHOLD_VALUE4,A.THRESHOLD_VALUE5"
				+ "	from PM_NE_TEMPLATE_WARN_DETIAL A ,PM_KPI B WHERE A.KPI_CODE = B.KPI_CODE AND rule_id=? and alarm_level=?";

		return this.queryForMapList(sql, new Object[] { ruleid, level });
	}

}
