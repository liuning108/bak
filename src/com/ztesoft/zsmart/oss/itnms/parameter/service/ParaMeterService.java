package com.ztesoft.zsmart.oss.itnms.parameter.service;

import java.util.Map;

import com.ztesoft.zsmart.oss.itnms.parameter.dto.ParaMeterDto;

public interface ParaMeterService {
    Map<String, ParaMeterDto> selectParaMetersByIds(String paraIds);
}
