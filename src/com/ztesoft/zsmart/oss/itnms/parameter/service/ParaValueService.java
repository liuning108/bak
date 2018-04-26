package com.ztesoft.zsmart.oss.itnms.parameter.service;

import java.util.List;
import java.util.Map;

import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaValueDto;

public interface ParaValueService {
    Map<String, List<ParaValueDto>> selectParamValuesByIds(String paraIds);
}
