package com.ericsson.inms.pm.taskalarm.meta;

import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

//rule obj
public class AlarmMeta implements Serializable {

	/**
	 * serialVersionUID <br>
	 */
	private static final long serialVersionUID = 1L;

	public AlarmMeta() {
		ruleid = null;
		netype = null;
		operuser = null;
		opertime = null;
		alarmtitle = null;
		alarmbody = null;
		plugionno = null;
		plugintype = null;
		alarmcode = null;
		phytable = null;
		alarmobjtype = null;
		levels = new HashMap<String, AlarmLevel>();
		alkpilist = new HashSet<String>();
		aldynamiclist = new HashSet<String>();
	}

	public String getRuleid() {
		return ruleid;
	}

	public void setRuleid(String ruleid) {
		this.ruleid = ruleid;
	}

	public String getNetype() {
		return netype;
	}

	public void setNetype(String netype) {
		this.netype = netype;
	}

	public String getOperuser() {
		return operuser;
	}

	public void setOperuser(String operuser) {
		this.operuser = operuser;
	}

	public String getOpertime() {
		return opertime;
	}

	public void setOpertime(String opertime) {
		this.opertime = opertime;
	}

	public String getAlarmtitle() {
		return alarmtitle;
	}

	public void setAlarmtitle(String alarmtitle) {
		this.alarmtitle = alarmtitle;
	}

	public String getAlarmbody() {
		return alarmbody;
	}

	public void setAlarmbody(String alarmbody) {
		this.alarmbody = alarmbody;
	}

	public String getPlugionno() {
		return plugionno;
	}

	public void setPlugionno(String plugionno) {
		this.plugionno = plugionno;
	}

	public String getPlugintype() {
		return plugintype;
	}

	public void setPlugintype(String plugintype) {
		this.plugintype = plugintype;
	}

	public String getAlarmcode() {
		return alarmcode;
	}

	public void setAlarmcode(String alarmcode) {
		this.alarmcode = alarmcode;
	}

	public String getPhytable() {
		return phytable;
	}

	public void setPhytable(String phytable) {
		this.phytable = phytable;
	}

	public Map<String, AlarmLevel> getLevels() {
		return levels;
	}

	public void setLevels(String level, AlarmLevel al) {
		this.levels.put(level, al);
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

	public String getTemplateid() {
		return templateid;
	}

	public void setTemplateid(String templateid) {
		this.templateid = templateid;
	}

	public String getAlarmobjtype() {
		return alarmobjtype;
	}

	public void setAlarmobjtype(String alarmobjtype) {
		this.alarmobjtype = alarmobjtype;
	}

	public String ruleid;
	public String netype;
	public String alarmobjtype;

	public String operuser;
	public String opertime;
	public String alarmtitle;
	public String alarmbody;
	public String plugionno;
	public String plugintype;
	public String alarmcode;
	public String phytable;
	public String templateid;

	public Map<String, AlarmLevel> levels;
	public Set<String> alkpilist;
	public Set<String> aldynamiclist;
}
