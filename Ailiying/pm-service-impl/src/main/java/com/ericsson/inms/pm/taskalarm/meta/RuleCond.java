package com.ericsson.inms.pm.taskalarm.meta;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

public class RuleCond {

	private Logger logger = LoggerFactory.getLogger(AlarmLevel.class.getName());

	public RuleCond() {
		kpidynamiclist = new ArrayList<String>();
	}

	
	public List<String> getKpidynamiclist() {
		return kpidynamiclist;
	}

	public void setKpidynamiclist(String kpi) {
		this.kpidynamiclist.add(kpi);
	}

	public List<String> getCondkpilist() {
		return condkpilist;
	}

	public void setCondkpilist(String kpi) {
		this.condkpilist.add(kpi);
	}

	public String alarmlevel;
	public String ruletype;
	public String staticcond;
	public String dynamicond;

	public List<String> condkpilist;
	public List<String> kpidynamiclist;
}
