package com.ericsson.inms.pm.taskalarm.data;

import com.alibaba.fastjson.annotation.JSONField;

//WARN_INSTID,TASK_ID,TASK_NO,BTIME,ETIME,EMS_CODE,EMS_TYPE_REL_ID,
//EMS_VER_CODE,ALARMOBJ_TYPE,ALARMOBJ_TYPE_NAME,ALARMOBJ_INST_NO,
//ALARMOBJ_INST_NAME,WARN_LEVEL,WARN_CODE,WARN_DESC,WARN_KPIVALUE,CREATE_DATE
public class AlarmData {

	@JSONField(name="ALARM_ID")
	public String getALARM_ID() {
		return ALARM_ID;
	}
	public void setALARM_ID(String aLARM_ID) {
		ALARM_ID = aLARM_ID;
	}

	@JSONField(name="TASK_ID")
	public String getTASK_ID() {
		return TASK_ID;
	}
	public void setTASK_ID(String tASK_ID) {
		TASK_ID = tASK_ID;
	}

	@JSONField(name="TASK_NO")
	public String getTASK_NO() {
		return TASK_NO;
	}
	public void setTASK_NO(String tASK_NO) {
		TASK_NO = tASK_NO;
	}

	@JSONField(name="BTIME")
	public String getBTIME() {
		return BTIME;
	}
	public void setBTIME(String bTIME) {
		BTIME = bTIME;
	}

	@JSONField(name="ETIME")
	public String getETIME() {
		return ETIME;
	}
	public void setETIME(String eTIME) {
		ETIME = eTIME;
	}

	@JSONField(name="EMS_CODE")
	public String getEMS_CODE() {
		return EMS_CODE;
	}
	public void setEMS_CODE(String eMS_CODE) {
		EMS_CODE = eMS_CODE;
	}

	@JSONField(name="EMS_TYPE_REL_ID")
	public String getEMS_TYPE_REL_ID() {
		return EMS_TYPE_REL_ID;
	}
	public void setEMS_TYPE_REL_ID(String eMS_TYPE_REL_ID) {
		EMS_TYPE_REL_ID = eMS_TYPE_REL_ID;
	}

	@JSONField(name="EMS_VER_CODE")
	public String getEMS_VER_CODE() {
		return EMS_VER_CODE;
	}
	public void setEMS_VER_CODE(String eMS_VER_CODE) {
		EMS_VER_CODE = eMS_VER_CODE;
	}

	@JSONField(name="EMS_TYPE")
	public String getEMS_TYPE() {
		return EMS_TYPE;
	}
	public void setEMS_TYPE(String eMS_TYPE) {
		EMS_TYPE = eMS_TYPE;
	}

	@JSONField(name="MO_GID")
	public String getMO_GID() {
		return MO_GID;
	}
	public void setMO_GID(String mO_GID) {
		MO_GID = mO_GID;
	}

	@JSONField(name="ALARM_LEVEL")
	public String getALARM_LEVEL() {
		return ALARM_LEVEL;
	}
	public void setALARM_LEVEL(String wARN_LEVEL) {
		ALARM_LEVEL = wARN_LEVEL;
	}

	@JSONField(name="ALARM_CODE")
	public String getALARM_CODE() {
		return ALARM_CODE;
	}
	public void setALARM_CODE(String wARN_CODE) {
		ALARM_CODE = wARN_CODE;
	}

	@JSONField(name="ALARM_TITLE")
	public String getALARM_TITLE() {
		return ALARM_TITLE;
	}
	public void setALARM_TITLE(String aLARM_TITLE) {
		ALARM_TITLE = aLARM_TITLE;
	}

	@JSONField(name="ALARM_BODY")
	public String getALARM_BODY() {
		return ALARM_BODY;
	}
	public void setALARM_BODY(String aLARM_BODY) {
		ALARM_BODY = aLARM_BODY;
	}

	@JSONField(name="ALARM_STATUS")
	public String getALARM_STATUS() {
		return ALARM_STATUS;
	}
	public void setALARM_STATUS(String aLARM_STATUS) {
		ALARM_STATUS = aLARM_STATUS;
	}

	@JSONField(name="CREATE_DATE")
	public String getCREATE_DATE() {
		return CREATE_DATE;
	}
	public void setCREATE_DATE(String cREATE_DATE) {
		CREATE_DATE = cREATE_DATE;
	}

	@JSONField(name="MESSAGE_TYPE")
	public String getMESSAGE_TYPE() {
		return MESSAGE_TYPE;
	}
	public void setMESSAGE_TYPE(String mESSAGE_TYPE) {
		MESSAGE_TYPE = mESSAGE_TYPE;
	}
	

	public String ALARM_ID;
	public String TASK_ID;
	public String TASK_NO;
	public String BTIME;
	public String ETIME;
	public String EMS_CODE;
	public String EMS_TYPE_REL_ID;
	public String EMS_VER_CODE;
	public String EMS_TYPE;
	public String MO_GID;
	public String ALARM_LEVEL;
	public String ALARM_CODE;
	public String ALARM_TITLE;
	public String ALARM_BODY;
	public String ALARM_STATUS;
	public String CREATE_DATE;
	public String MESSAGE_TYPE;
}
