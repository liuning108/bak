package com.ericsson.inms.pm.service.impl.taskprocess.dao;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;
import com.ztesoft.zsmart.oss.opb.base.jdbc.GeneralDAO;
import com.ztesoft.zsmart.oss.opb.base.jdbc.ParamArray;

public abstract class TaskProcessDAO extends GeneralDAO {
	private static final long serialVersionUID = 1L;
	public abstract String exportExcel(List<Map<String, Object>> colModel, String runSql, ParamArray params) throws BaseAppException ;
}
