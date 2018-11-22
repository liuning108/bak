package com.ericsson.inms.pm.taskalarm.meta;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class AlarmLevel implements Serializable {

	/**
	 * serialVersionUID <br>
	 */
	private static final long serialVersionUID = 1L;

	public AlarmLevel() {
		alkpilist = new HashSet<String>();
		aldynamiclist = new HashSet<String>();
		kpinamelist = new HashMap<String, String>();
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getCondtype() {
		return condtype;
	}

	public void setCondtype(String condtype) {
		this.condtype = condtype;
	}

	public String getTimewindowvalue() {
		return timewindowvalue;
	}

	public void setTimewindowvalue(String timewindowvalue) {
		this.timewindowvalue = timewindowvalue;
	}

	public String getStaticcond() {
		return staticcond;
	}

	public void setStaticcond(String staticcond) {
		this.staticcond = staticcond;
	}

	public String getDynamiccond() {
		return dynamiccond;
	}

	public void setDynamiccond(String dynamiccond) {
		this.dynamiccond = dynamiccond;
	}

	public Set<String> getAlkpilist() {
		return alkpilist;
	}

	public void setAlkpilist(Set<String> alkpilist) {
		this.alkpilist.addAll(alkpilist);
	}

	public Set<String> getAldynamiclist() {
		return aldynamiclist;
	}

	public void setAldynamiclist(Set<String> aldynamiclist) {
		this.aldynamiclist.addAll(aldynamiclist);
	}

	public Map<String, String> getKpinamelist() {
		return kpinamelist;
	}

	public void setKpinamelist(Map<String, String> kpinamelist) {
		this.kpinamelist.putAll(kpinamelist);
	}

	public String level;
	public String condtype;
	public String timewindowvalue;
	// 需要条件填值
	public String staticcond;
	public String dynamiccond;
	public Set<String> alkpilist;
	public Map<String, String> kpinamelist;

	public Set<String> aldynamiclist;
}
