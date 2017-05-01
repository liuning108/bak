package com.liuning.web;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONObject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DashboardDao {
	JdbcTemplate jdbcTemplate;
	@Resource(name = "jdbcTemplate")
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	public void save(String id, String name, JSONObject json) {
		String sql = "insert into t_dashboard(id,name,json,create_date) values(?,?,?,now())";
		jdbcTemplate.update(sql, new Object[] { id, name, json.toJSONString() });
	}

	public int isExists(String id) {
		String sql = "select count(*) from t_dashboard t where t.id=?";
		int count = jdbcTemplate.queryForObject(sql, new Object[] { id }, Integer.class);
		return count;
	}

	public void update(String id, String name, JSONObject json) {
		String sql = "update t_dashboard t set t.name=? ,t.json=? where t.id=?";
		jdbcTemplate.update(sql, new Object[] { name, json.toJSONString(), id });
	}

	public void saveOrUpdate(String id, String name, JSONObject json) {
		if (isExists(id) > 0) {
			update(id, name, json);
		} else {
			save(id, name, json);
		}
	}

	public List<Map<String, Object>> getAllDashBoard() {
		String sql = "select id,name from t_dashboard t where t.isDelete=0 order by t.create_date desc";
		return jdbcTemplate.queryForList(sql);
	}

	public Map<String, Object> getDashBoardById(String id) {
		String sql = "select id,name,json from t_dashboard t where t.id=?";
		try {
			return jdbcTemplate.queryForMap(sql, new Object[] { id });
		} catch (Exception ex) {
			return null;
		}

	}
}
