package com.ericsson.inms.pm.taskalarm.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;

/*
 * 
 * get alarm rule info
 * 
 * 
 * 
 * */
public abstract class TaskAlarmRuleDao extends GeneralDAO<Map<String, String>>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public abstract Map<String, Map<String, Object>> selectTemplateRule(String phytable);

	public abstract List<Map<String, Object>> selectRuleLevel(String ruleid);
	
	public abstract List<Map<String, Object>> selectRuleLevelConds(String ruleid, String level);

	public abstract List<Map<String, Object>> selectAllTemplateRule();
}
