package com.ztesoft.zsmart.oss.kdo.itnms.host.service;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.core.exception.BaseAppException;

public interface HostService {

	public  List<Map<String,Object>> getCategoryTree()   throws BaseAppException;

	public List<Map<String,Object>> getGroupidsBySubNo(String id)  throws BaseAppException;

}